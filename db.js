// db.js
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}
if (!dbName) {
  throw new Error("DB_NAME is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

});

let db = null;
let connecting = null;

async function connectDB({ retries = 5, backoffMs = 2000 } = {}) {
  // reuse existing db
  if (db) return db;
  if (connecting) return connecting; // wait for ongoing connection attempt

  connecting = (async () => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        attempt += 1;
        await client.connect();
        db = client.db(dbName);
        console.log("🔥 MongoDB connected (attempt", attempt, ")");
        return db;
      } catch (err) {
        console.error(`MongoDB connect attempt ${attempt} failed:`, err.message || err);
        if (attempt >= retries) {
          console.error("Exceeded MongoDB connection attempts — throwing.");
          throw err;
        }
        // exponential backoff
        const delay = backoffMs * attempt;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  })();

  try {
    return await connecting;
  } finally {
    connecting = null;
  }
}

async function closeDB() {
  try {
    await client.close();
    db = null;
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  }
}

module.exports = { connectDB, closeDB };
