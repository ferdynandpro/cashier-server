const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Ganti dengan secret key Anda yang sebenarnya

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { usersCollection } = req.collections;

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { usersCollection } = req.collections;

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };
