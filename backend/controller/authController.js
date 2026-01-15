const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const user = await User.create({ username, email, password });
    //sending user object
    res.status(200).json({
      user: { _id: user._id, username: user.username, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({
      user: { _id: user._id, username: user.username, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, profile };
