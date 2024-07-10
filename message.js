const express = require('express')
const app = express()
const port = process.env.PORT || 6000
const cors = require('cors')

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//mongodb configuration
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-product:eJB8vlQTYfr35TCN@cluster0.4etduou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    //create a collections of document
    const productCollections = client.db("ProductInventoery").collection("message"); 

    //insert a book to the database: post method
    app.post("/send-message", async(req, res) => {
      const data = req.body;
      const result = await productCollections.insertOne(data);
      res.send(result);
    })

    //get all book from database
    app.get("/messages", async(req, res) =>{
      const products = productCollections.find();
      const result = await products.toArray();
      res.send(result);
    })

    //to get single data
      app.get("/product/:id", async (req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)};
        const result = await productCollections.findOne(filter);
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
//mongodb configuration





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})