const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgti16b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const groupCollection = client.db("hobbyHubDB").collection("allgroups");
    const reviewCollection = client.db("hobbyHubDB").collection("reviews");

    //  GET all groups
    app.get("/allgroups", async (req, res) => {
      const email = req.query.email;
      const query = email ? { email: email } : {};
      const result = await groupCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/allgroups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groupCollection.findOne(query);
      res.send(result);
    });

    //Popular hobbies
    app.get("/popular-hobbies", async (req, res) => {
      const result = await groupCollection
        .find({})
        .sort({ member: -1 }) // Sort by max members
        .limit(8)
        .toArray();
      res.send(result);
    });
    //  POST new group
    app.post("/allgroups", async (req, res) => {
      const groupData = req.body;
      const result = await groupCollection.insertOne(groupData);
      res.send(result);
    });

    // PUT update group
    app.put("/allgroups/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedGroup = req.body;
      const updatedDoc = {
        $set: updatedGroup,
      };
      const result = await groupCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // DELETE group
    app.delete("/allgroups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groupCollection.deleteOne(query);
      res.send(result);
    });

    // Get all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // Add a review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // Update a review
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await reviewCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

    // Delete a review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const result = await reviewCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    console.log(" Connected to MongoDB");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My hobby website backend is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
