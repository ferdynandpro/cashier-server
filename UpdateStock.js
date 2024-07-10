const express = require('express');
const router = express.Router();
const Product = require('./models/Product'); // Pastikan path ke model Product benar

// Reduce product stock based on transaction
router.post("/update-stock", async (req, res) => {
    const { selectedProducts } = req.body;

    try {
        const updatePromises = selectedProducts.map(async (product) => {
            const filter = { productName: product.productName };
            const updateDoc = {
                $inc: { productStock: -product.quantity },
            };

            const result = await Product.findOneAndUpdate(filter, updateDoc, { new: true });
            return result;
        });

        const updateResults = await Promise.all(updatePromises);

        // Check if any products failed to update
        const failedUpdates = updateResults.filter(result => !result);
        if (failedUpdates.length > 0) {
            return res.status(400).json({ message: "Some products were not found or failed to update" });
        }

        res.status(200).json({ message: "Stock updated successfully" });
    } catch (err) {
        console.error("Error updating stock:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
