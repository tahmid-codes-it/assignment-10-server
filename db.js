// db.js
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

async function connectDB() {
    if (db) return db; // reuse connection

    await client.connect();
    console.log("🔥 MongoDB Connected");

    db = client.db(process.env.DB_NAME);
    return db;
}

module.exports = connectDB;
