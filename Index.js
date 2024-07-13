const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

// Additional routes and middleware can be added here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
