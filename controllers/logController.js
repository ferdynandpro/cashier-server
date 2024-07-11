const saveLogs = async (req, res) => {
    try {
      const logs = req.body;
      const { logsCollection } = req.collections;
      const result = await logsCollection.insertMany(logs);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error saving logs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const getAllLogs = async (req, res) => {
    try {
      const { logsCollection } = req.collections;
      const logs = await logsCollection.find().toArray();
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { saveLogs, getAllLogs };
  