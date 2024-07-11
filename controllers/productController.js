const { ObjectId } = require('mongodb');

const uploadProduct = async (req, res) => {
  const data = req.body;
  const { productCollections } = req.collections;
  const result = await productCollections.insertOne(data);
  res.send(result);
};

const getAllProducts = async (req, res) => {
  const { productCollections } = req.collections;
  const products = productCollections.find();
  const result = await products.toArray();
  res.send(result);
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateProductData = req.body;
  const { productCollections } = req.collections;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };

  const updateDoc = { $set: { ...updateProductData } };

  const result = await productCollections.updateOne(filter, updateDoc, options);
  res.send(result);
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const { productCollections } = req.collections;
  const filter = { _id: new ObjectId(id) };
  const result = await productCollections.deleteOne(filter);
  res.send(result);
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const { productCollections } = req.collections;
  const filter = { _id: new ObjectId(id) };
  const result = await productCollections.findOne(filter);
  res.send(result);
};

module.exports = { uploadProduct, getAllProducts, updateProduct, deleteProduct, getProductById };
