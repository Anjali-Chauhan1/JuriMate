const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPass });

   const accessToken = jwt.sign(
  { id: user._id },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
);

res.json({ message: "Signup successful", accessToken, user });


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

   const accessToken = jwt.sign(
  { id: user._id },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
);

const refreshToken = jwt.sign(
  { id: user._id },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
);
    res.json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };