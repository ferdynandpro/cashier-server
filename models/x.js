// const connectDB = require('../config/db');

// let db;
// const getDB = async () => {
//   if (!db) {
//     const client = await connectDB();
//     db = client.db('ProductInventoery');
//   }
//   return db;
// };

// const getCollection = async (collectionName) => {
//   const db = await getDB();
//   return db.collection(collectionName);
// };

// module.exports = {
//   buktiPembayaranCollection: () => getCollection('bukti-pembayaran'),
//   productCollections: () => getCollection('products'),
//   usersCollection: () => getCollection('users'),
//   logsCollection: () => getCollection('logs')
// };
