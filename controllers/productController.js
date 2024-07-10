// const { ObjectId } = require('mongodb');
// const { productCollections } = require('../models/x');

// async function addProduct(req, res) {
//   try {
//     const data = req.body;
//     const collection = await productCollections();
//     const result = await collection.insertOne(data);
//     res.status(201).json({ message: "Product added successfully", result });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// async function getAllProducts(req, res) {
//   try {
//     const collection = await productCollections();
//     const products = await collection.find().toArray();
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// async function getProductById(req, res) {
//   try {
//     const id = req.params.id;
//     const collection = await productCollections();
//     const product = await collection.findOne({ _id: new ObjectId(id) });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// async function updateProduct(req, res) {
//   try {
//     const id = req.params.id;
//     const updateProductData = req.body;
//     const collection = await productCollections();
//     const filter = { _id: new ObjectId(id) };
//     const options = { upsert: true };

//     const updateDoc = {
//       $set: { ...updateProductData }
//     };

//     const result = await collection.updateOne(filter, updateDoc, options);
//     res.status(200).json({ message: "Product updated successfully", result });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// async function deleteProduct(req, res) {
//   try {
//     const id = req.params.id;
//     const collection = await productCollections();
//     const filter = { _id: new ObjectId(id) };
//     const result = await collection.deleteOne(filter);
//     res.status(200).json({ message: "Product deleted successfully", result });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// } 

// module.exports = { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
