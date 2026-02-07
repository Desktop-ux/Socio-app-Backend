const express = require("express");
const {createPost,getPosts,likePost,addComment}= require("../controllers/postController.js");
const authMiddleware = require("../midleware/authMiddleware.js");
const Upload = require("../midleware/upload.js"); 

const router = express.Router();

router.post("/", authMiddleware,Upload.single("image"), createPost);
router.get("/", getPosts);
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, addComment);

module.exports = router;
