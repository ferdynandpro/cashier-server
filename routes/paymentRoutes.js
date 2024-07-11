const express = require('express');
const { addPaymentProof, addPaymentDetail, getAllPaymentProofs, getPaymentProofDetails } = require('../controllers/paymentController');
const router = express.Router();

router.post("/", addPaymentProof);
router.post("/:buktiId/detail", addPaymentDetail);
router.get("/", getAllPaymentProofs);
router.get("/:buktiId/detail", getPaymentProofDetails);

module.exports = router;
