// const { logsCollection } = require('../models/x');

// async function addLogs(req, res) {
//   try {
//     const logs = req.body;
//     const result = await logsCollection.insertMany(logs);
//     res.status(201).json({ message: "Logs saved successfully", result });
//   } catch (error) {
//     console.error("Error saving logs:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// async function getAllLogs(req, res) {
//   try {
//     const logs = await logsCollection.find().toArray();
//     res.status(200).json(logs);
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// module.exports = { addLogs, getAllLogs };
