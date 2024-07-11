const express = require('express');
const { saveLogs, getAllLogs } = require('../controllers/logController');
const router = express.Router();

router.post("/", saveLogs);
router.get("/", getAllLogs);

module.exports = router;
