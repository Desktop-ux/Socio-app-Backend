const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

const me = async (req , res)=>{
   const user = await User.findById(req.user.id).select("-password");

  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  signup,
  login,
  me
};
