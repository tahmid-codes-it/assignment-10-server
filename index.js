// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const reviewRoutes = require("./routes/reviews");
const favoriteRoutes = require("./routes/favorites");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure DB connection works once on startup
connectDB().then(() => console.log("DB Ready"));

// API Routes
app.use("/reviews", reviewRoutes);
app.use("/favorites", favoriteRoutes);

// Base route
app.get("/", (req, res) => {
    res.send("🔥 YumNet API Running!");
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
