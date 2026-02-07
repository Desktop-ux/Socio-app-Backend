const express = require("express");
const { signup, login } = require("../controllers/AuthController");
const cookies = require("cookie-parser");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});


module.exports = router;
