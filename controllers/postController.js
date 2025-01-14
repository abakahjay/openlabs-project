const mongoose = require('mongoose');
const Post = require('../models/Posts');

exports.createPost = async (req, res) => {
  const { caption, userId } = req.body;

  try {
    const newPost = new Post({
      caption,
      postId: req.file.id, // Save GridFS file ID
      createdBy: userId,
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

exports.getImage = async (req, res) => {
  const { id } = req.params;//ImageId

  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

  gfs.find({ _id: mongoose.Types.ObjectId(id) }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    gfs.openDownloadStream(mongoose.Types.ObjectId(id)).pipe(res);
  });
};
