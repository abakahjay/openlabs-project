const Post = require('../models/Posts');

exports.createPost = async (req, res) => {
  const { caption, userId } = req.body;

  try {
    const newPost = new Post({
      caption,
      image: req.file.path,
      user: userId,
    });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').populate('comments');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const post = await Post.findById(id);

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(like => like.toString() !== userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
