const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgti16b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // create file to mongodb server
        const groupCollection = client.db('hobbyHubDB').collection('allgroups');
        app.get('/allgroups', async (req, res) => {
            const result = await groupCollection.find().toArray();
            res.send(result);
        })
        // allgroups data send to mongodb server
        app.post('/allgroups', async (req, res) => {
            const groupData = req.body;
            console.log(groupData);
            const result = await groupCollection.insertOne(groupData);
            res.send(result);
        })

        // allgroups data received to client side from mongodb
        app.get('/allgroups/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await groupCollection.findOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('my hobby website')
});
app.listen(port, () => {
    console.log(`my hobby server running on port ${port} `)
})