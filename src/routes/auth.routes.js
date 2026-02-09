const express = require("express");
const { signup, login, me } = require("../controllers/AuthController");
const authMiddleware = require("../midleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out" });
});

router.get("/me", authMiddleware, me);

module.exports = router;
