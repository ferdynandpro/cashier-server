const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = ['https://cashier-web-five.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// MongoDB configuration
const uri = "mongodb+srv://mern-product:eJB8vlQTYfr35TCN@cluster0.4etduou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const secretKey = 'your_secret_key'; // Replace with your actual secret key

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create collections
    const buktiPembayaranCollection = client.db("ProductInventoery").collection("bukti-pembayaran");
    const productCollections = client.db("ProductInventoery").collection("products");
    const usersCollection = client.db("ProductInventoery").collection("users");
    const logsCollection = client.db("ProductInventoery").collection("logs");

    // Endpoint to add new payment proof
    app.post("/bukti-pembayaran", async (req, res) => {
      try {
        const { tanggal_pembayaran } = req.body;
        if (!tanggal_pembayaran) {
          return res.status(400).json({ message: "tanggal_pembayaran is required" });
        }

        const result = await buktiPembayaranCollection.insertOne({ tanggal_pembayaran, details: [] });
        res.status(201).json({ message: "Payment proof added successfully", result });
      } catch (error) {
        console.error("Error adding payment proof:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to add new payment detail
    app.post("/bukti-pembayaran/:buktiId/detail", async (req, res) => {
      try {
        const buktiId = req.params.buktiId;
        const { detail } = req.body;
        if (!detail) {
          return res.status(400).json({ message: "Detail is required" });
        }

        const result = await buktiPembayaranCollection.updateOne(
          { _id: new ObjectId(buktiId) },
          { $push: { details: detail } }
        );

        res.status(201).json({ message: "Payment detail added successfully", result });
      } catch (error) {
        console.error("Error adding payment detail:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to get all payment proofs
    app.get("/bukti-pembayaran", async (req, res) => {
      try {
        const paymentProofs = await buktiPembayaranCollection.find().toArray();
        res.status(200).json(paymentProofs);
      } catch (error) {
        console.error("Error fetching payment proofs:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to get payment details by buktiId
    app.get("/bukti-pembayaran/:buktiId/detail", async (req, res) => {
      try {
        const buktiId = req.params.buktiId;
        const paymentProof = await buktiPembayaranCollection.findOne({ _id: new ObjectId(buktiId) });
        if (!paymentProof) {
          return res.status(404).json({ message: "Payment proof not found" });
        }
        res.status(200).json(paymentProof.details);
      } catch (error) {
        console.error("Error fetching payment proof details:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Insert a product to the database: POST method
    app.post("/upload-product", async (req, res) => {
      const data = req.body;
      const result = await productCollections.insertOne(data);
      res.send(result);
    });

    // Get all products from database
    app.get("/products", async (req, res) => {
      const products = productCollections.find();
      const result = await products.toArray();
      res.send(result);
    });

    // Update a product's data
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const updateProductData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updateProductData
        }
      };

      const result = await productCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Delete a product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await productCollections.deleteOne(filter);
      res.send(result);
    });

    // Get a single product by ID
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(filter);
      res.send(result);
    });

    // Register a new user
    app.post("/register", async (req, res) => {
      try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const newUser = {
          username,
          password: hashedPassword
        };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User registered successfully" });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Login a user
    app.post("/login", async (req, res) => {
      try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await usersCollection.findOne({ username });
        if (!user) {
          return res.status(400).json({ message: "Invalid username or password" });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Middleware to verify token
    const authenticateToken = (req, res, next) => {
      const token = req.headers['authorization'];

      if (!token) {
        return res.status(403).json({ message: 'No token provided' });
      }

      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
      });
    };

    // Example protected route
    app.get("/protected-route", authenticateToken, (req, res) => {
      res.status(200).json({ message: "This is a protected route", user: req.user });
    });

    // Add a new endpoint to save logs
    app.post("/logs", async (req, res) => {
      try {
        const logs = req.body;
        const result = await logsCollection.insertMany(logs);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error saving logs:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Add a new endpoint to get all logs
    app.get("/logs", async (req, res) => {
      try {
        const logs = await logsCollection.find().toArray();
        res.status(200).json(logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure the client closes when you're done
    await client.close();
  }
}

run().catch(console.dir);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
