const Post = require("../models/post.model");
const ImageKit = require("../service/storage.service");

const createPost = async (req, res) => {
  try {
    console.log("BODY", req.body);
    console.log("FILE", req.file);

    const text = req.body.text || "";
    let imageUrl = "";

    if (req.file) {
      const uploadResponse = await ImageKit.upload({
        file: req.file.buffer,
        fileName: `post_${Date.now()}`,
        folder: "/social-posts"
      });

      imageUrl = uploadResponse.url;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Post.create({
      userId: req.user.id,
      username: req.user.username,
      text,
      imageUrl
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("CREATE POST ERROR", error);
    res.status(500).json({ message: "Post creation failed" });
  }
};


 const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

 const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    const username = req.user.username;

    if (post.likes.includes(username)) {
      post.likes = post.likes.filter(u => u !== username); // unlike
    } else {
      post.likes.push(username); // like
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
  }
};

 const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Comment required" });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      username: req.user.username,
      text
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Comment failed" });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment
};