const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration (assuming you've already set this up)

// Create a MongoClient
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "your_mongodb_uri_here";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Secret key for JWT
const secretKey = 'your_secret_key';

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();

    // Define collections
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

    // Other endpoints...

    // Endpoint for user login
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

        // Generate token
        const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

        // Send token as response
        res.status(200).json({ message: "Login successful", token });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Middleware to verify JWT token
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

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } finally {
    // Ensuring the client closes when finished
    await client.close();
  }
}

run().catch(console.dir);
