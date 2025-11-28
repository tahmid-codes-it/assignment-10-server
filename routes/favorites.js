// routes/favorites.js
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");

// ADD TO FAVORITES
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const favorites = db.collection("Favorites");
    const result = await favorites.insertOne(req.body);
    res.json(result);
  } catch (err) {
    console.error("Error POST /favorites:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE FAVORITE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const db = await connectDB();
    const favorites = db.collection("Favorites");
    const result = await favorites.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    console.error("Error DELETE /favorites/:id:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET FAVORITES BY USER (query ?email=...)
router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email query missing" });

    const db = await connectDB();
    const favorites = db.collection("Favorites");
    const result = await favorites.find({ user_email: email }).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error GET /favorites:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
