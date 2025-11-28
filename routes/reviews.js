// routes/reviews.js
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");

// GET ALL REVIEWS (with optional search)
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const search = req.query.search;
    const query = search ? { food_name: { $regex: search, $options: "i" } } : {};

    const data = await reviews.find(query).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error GET /reviews:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET TOP REVIEWS (limit 6)
router.get("/top", async (req, res) => {
  try {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const data = await reviews.find().sort({ rating: -1 }).limit(6).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error GET /reviews/top:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET MY REVIEWS
router.get("/my", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email query missing" });

    const db = await connectDB();
    const reviews = db.collection("Reviewer");
    const data = await reviews.find({ user_email: email }).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error GET /reviews/my:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET SEARCH BY PATH
router.get("/search/:term", async (req, res) => {
  try {
    const term = req.params.term;
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const data = await reviews.find({ food_name: { $regex: term, $options: "i" } }).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error GET /reviews/search/:term:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET SINGLE REVIEW BY ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const db = await connectDB();
    const reviews = db.collection("Reviewer");
    const review = await reviews.findOne({ _id: new ObjectId(id) });

    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    console.error("Error GET /reviews/:id:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST ADD REVIEW
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");
    const result = await reviews.insertOne(req.body);
    res.json(result);
  } catch (err) {
    console.error("Error POST /reviews:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT UPDATE REVIEW
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const db = await connectDB();
    const reviews = db.collection("Reviewer");
    const result = await reviews.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    res.json(result);
  } catch (err) {
    console.error("Error PUT /reviews/:id:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE REVIEW
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const db = await connectDB();
    const reviews = db.collection("Reviewer");
    const result = await reviews.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    console.error("Error DELETE /reviews/:id:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
