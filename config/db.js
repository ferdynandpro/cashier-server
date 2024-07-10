// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.MONGO_URI;

// let client;

// const connectDB = async () => {
//   if (!client) {
//     client = new MongoClient(uri, {
//       serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//       }
//     });

//     try {
//       await client.connect();
//       console.log("MongoDB connected successfully!");
//     } catch (err) {
//       console.error("Error connecting to MongoDB:", err);
//       process.exit(1);
//     }
//   }

//   return client;
// };

// module.exports = connectDB;
