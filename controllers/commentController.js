const Comment = require('../models/Comments');
const Post = require('../models/Posts');

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { text, userId } = req.body;

  try {
    const newComment = new Comment({
      text,
      user: userId,
      post: postId,
    });

    await newComment.save();

    const post = await Post.findById(postId);
    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
