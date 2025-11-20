// routes/reviews.js
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const connectDB = require("../db");

// GET ALL REVIEWS
router.get("/", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const data = await reviews.find().toArray();
    res.send(data);
});

// GET TOP REVIEWS (limit 6)
router.get("/top", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const data = await reviews
        .find()
        .sort({ rating: -1 })
        .limit(6)
        .toArray();

    res.send(data);
});

// GET MY REVIEWS (must come BEFORE /:id)
router.get("/my", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const email = req.query.email;

    if (!email) {
        return res.status(400).send({ message: "Email query missing" });
    }

    const data = await reviews.find({ user_email: email }).toArray();
    res.send(data);
});

// GET SINGLE REVIEW (this must come AFTER)
router.get("/:id", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    try {
        const review = await reviews.findOne({ _id: new ObjectId(req.params.id) });
        if (!review) return res.status(404).send({ message: "Review not found" });
        res.send(review);
    } catch (error) {
        res.status(400).send({ message: "Invalid ID format" });
    }
});




// ADD REVIEW
router.post("/", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const result = await reviews.insertOne(req.body);
    res.send(result);
});

// UPDATE REVIEW
router.put("/:id", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const result = await reviews.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
    );

    res.send(result);
});

// DELETE REVIEW
router.delete("/:id", async (req, res) => {
    const db = await connectDB();
    const reviews = db.collection("Reviewer");

    const result = await reviews.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
});

module.exports = router;
