// routes/favorites.js
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const connectDB = require("../db");

// ADD TO FAVORITES
router.post("/", async (req, res) => {
  const db = await connectDB();
  const favorites = db.collection("Favorites");

  const result = await favorites.insertOne(req.body);
  res.send(result);
});

// DELETE FAVORITE
router.delete("/:id", async (req, res) => {
  const db = await connectDB();
  const favorites = db.collection("Favorites");

  const result = await favorites.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

// GET FAVORITES BY USER
router.get("/", async (req, res) => {   // ← FIXED
  const db = await connectDB();
  const favorites = db.collection("Favorites");

  const email = req.query.email;

  const result = await favorites.find({ user_email: email }).toArray();

  res.send(result);
});

module.exports = router;
