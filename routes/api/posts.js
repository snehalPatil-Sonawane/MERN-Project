const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator/check");

// @route   GET api/posts
// @desc    get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
// @route   GET api/posts/:id
// @desc    get post by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).send("Post not found");
    }
    res.status(500).send("server error");
  }
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    delete post by id
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorised" });
    }

    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).send("Post not found");
    }
    res.status(500).send("server error");
  }
});

// @route   PUT api/posts/like/:id
// @desc    like a post
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if post already liked by the user
    if (
      post.likes.filter(like => like.user.toString() == req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    un- like a post
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if post already liked by the user
    if (
      post.likes.filter(like => like.user.toString() == req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }
    //get removeIndex
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    comment on post
// @access  Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      };
      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment on post
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //make sure commen exists
    if (!comment) {
      return res.status(404).json({ msg: "comment not found" });
    }

    //check user of comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorised" });
    }
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
