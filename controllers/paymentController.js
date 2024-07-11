const { ObjectId } = require('mongodb');

const addPaymentProof = async (req, res) => {
  try {
    const { tanggal_pembayaran } = req.body;
    const { buktiPembayaranCollection } = req.collections;

    if (!tanggal_pembayaran) {
      return res.status(400).json({ message: "tanggal_pembayaran is required" });
    }

    const result = await buktiPembayaranCollection.insertOne({ tanggal_pembayaran, details: [] });
    res.status(201).json({ message: "Payment proof added successfully", result });
  } catch (error) {
    console.error("Error adding payment proof:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addPaymentDetail = async (req, res) => {
  try {
    const buktiId = req.params.buktiId;
    const { detail } = req.body;
    const { buktiPembayaranCollection } = req.collections;

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
};

const getAllPaymentProofs = async (req, res) => {
  try {
    const { buktiPembayaranCollection } = req.collections;
    const paymentProofs = await buktiPembayaranCollection.find().toArray();
    res.status(200).json(paymentProofs);
  } catch (error) {
    console.error("Error fetching payment proofs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPaymentProofDetails = async (req, res) => {
  try {
    const buktiId = req.params.buktiId;
    const { buktiPembayaranCollection } = req.collections;

    const paymentProof = await buktiPembayaranCollection.findOne({ _id: new ObjectId(buktiId) });
    if (!paymentProof) {
      return res.status(404).json({ message: "Payment proof not found" });
    }
    res.status(200).json(paymentProof.details);
  } catch (error) {
    console.error("Error fetching payment proof details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addPaymentProof, addPaymentDetail, getAllPaymentProofs, getPaymentProofDetails };
