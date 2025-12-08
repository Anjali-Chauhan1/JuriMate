import {User} from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const userExists = await User.findOne({ email }).lean();
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPass });
    await user.save();

   const accessToken = jwt.sign(
  { id: user._id },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
);

    const userData = { id: user._id, name: user.name, email: user.email };
    res.json({ message: "Signup successful", accessToken, user: userData });

  } catch (err) {
    console.error("Signup error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", error: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).lean();
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
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const userData = { id: user._id, name: user.name, email: user.email };
    res.json({ message: "Login successful", accessToken, refreshToken, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

