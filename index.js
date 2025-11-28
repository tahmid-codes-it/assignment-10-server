// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, closeDB } = require("./db");

const reviewRoutes = require("./routes/reviews");
const favoriteRoutes = require("./routes/favorites");

const app = express();

// Get values from env
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "";

// Build allowed origins array (support comma-separated env var)
const allowedOrigins = FRONTEND_URL
  ? FRONTEND_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: origin not allowed"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/reviews", reviewRoutes);
app.use("/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("🔥 YumNet API Running!");
});


async function start() {
  try {
    await connectDB(); 
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // graceful shutdown on SIGINT/SIGTERM
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Closing server...`);
      server.close(async (err) => {
        if (err) {
          console.error("Error closing HTTP server:", err);
          process.exit(1);
        }
        await closeDB();
        console.log("Shutdown complete.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("Failed to start server:", err);
    // Exit with non-zero so Render shows failure and does not keep returning 502
    process.exit(1);
  }
}

start();
