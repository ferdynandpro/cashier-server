const express = require('express');
const { uploadProduct, getAllProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
const router = express.Router();

router.post("/upload", uploadProduct);
router.get("/", getAllProducts);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);

module.exports = router;
