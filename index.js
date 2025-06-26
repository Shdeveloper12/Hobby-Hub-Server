const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
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

    // ---------------- ALL GROUP ROUTES ----------------

    app.get("/allgroups", async (req, res) => {
      const email = req.query.email;
      const query = email ? { email: email } : {};
      const result = await groupCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/allgroups/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }
      const result = await groupCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/popular-hobbies", async (req, res) => {
      const result = await groupCollection
        .find({})
        .sort({ member: -1 })
        .limit(8)
        .toArray();
      res.send(result);
    });

    app.post("/allgroups", async (req, res) => {
      const groupData = req.body;
      groupData.createdAt = new Date();
      const result = await groupCollection.insertOne(groupData);
      res.send(result);
    });

    app.put("/allgroups/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }
      const filter = { _id: new ObjectId(id) };
      const updatedGroup = req.body;
      const result = await groupCollection.updateOne(
        filter,
        { $set: updatedGroup },
        { upsert: true }
      );
      res.send(result);
    });

    app.delete("/allgroups/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }
      const result = await groupCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // ---------------- REVIEW ROUTES ----------------

    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const { email } = req.body;
      const exists = await reviewCollection.findOne({ email });
      if (exists) {
        return res.status(400).send({ message: "You have already reviewed." });
      }
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });

    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const{_id, ...rest} = updated;
      try {
        const result = await reviewCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: rest },
        );
        res.send(result);
      } catch (error) {
        console.error("PUT /reviews/:id error:", error.message);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid review ID" });
      }
      const result = await reviewCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    console.log("Connected to MongoDB");
  } finally {
   
  }
}

run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("HobbyHub backend is running.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
