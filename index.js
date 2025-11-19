const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://yumNetUser:QUUh3Kkqh9pHXzdW@cluster0.h83f0sw.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db("yumNet-db");
        const yumNetCollection = db.collection("Reviewer");

        console.log("MongoDB Connected Successfully!");

        // ================================
        // GET ALL REVIEWS
        // ================================
        app.get('/Reviewer', async (req, res) => {
            const result = await yumNetCollection.find().toArray();
            res.send(result);
        });

        // ================================
        // GET SINGLE REVIEW
        // ================================
        app.get('/review/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const review = await yumNetCollection.findOne({ _id: new ObjectId(id) });

                if (!review) {
                    return res.status(404).send({ message: "Review not found" });
                }

                res.send(review);
            } catch (error) {
                res.status(500).send({ message: "Error fetching review", error: error.message });
            }
        });

        // ================================
        // POST — ADD REVIEW
        // ================================
        app.post('/reviews', async (req, res) => {
            try {
                const newReview = req.body;
                const result = await yumNetCollection.insertOne(newReview);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to add review", error: error.message });
            }
        });

        // ================================
        // GET — MY REVIEWS (filter by email)
        // ================================
        app.get('/my-reviews', async (req, res) => {
            try {
                const email = req.query.email;

                const result = await yumNetCollection.find({ user_email: email }).toArray();
                res.send(result);

            } catch (error) {
                res.status(500).send({ message: "Error loading user reviews", error: error.message });
            }
        });

        // ================================
        // DELETE REVIEW
        // ================================
        app.delete('/review/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await yumNetCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to delete review", error: error.message });
            }
        });

        // ================================
        // UPDATE REVIEW (EDIT)
        // ================================
        app.put('/review/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;

                const result = await yumNetCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to update review", error: error.message });
            }
        });

    } finally {}
}

run().catch(console.error);

// Root
app.get('/', (req, res) => {
    res.send("YumNet API is running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
