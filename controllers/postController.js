const mongoose = require('mongoose');
const Post = require('../models/Posts');
const { ObjectId } = require("mongodb");
const { UnauthenticatedError, BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes');


exports.createPost = async (req, res) => {
  const { caption, comments } = req.body;
  const {userId} = req.query;
    // console.log(req.file)
    if(!userId) {
      throw new BadRequestError('You must provide a user Id ')
    }
    if(!req.file){
      throw new BadRequestError('Please No file has been Detected')
    }
    const newPost = new Post({
      caption,
      postId: req.file.id, // Save GridFS file ID
      createdBy: userId,
      comments :[comments]
    });

    await newPost.save();
    res.status(201).json(newPost);
  
};

exports.getPosts = async (req, res) => {
  // console.warn('Get Posts')
    const posts = await Post.find().populate('user').populate('comments');
    res.status(200).json({nbHits:posts.length,posts});
};

exports.getImage = async (req, res) => {
    const { id } = req.params;//ImageId

    if(!id){
      throw new BadRequestError('Please provide the image id')
    }

    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    const file = await gfs.find({ _id: new ObjectId(id) }).toArray();
  
    if (file.length === 0) {
      throw new NotFoundError(`No Image found with id: ${id}`)
    }

    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

    await gfs.openDownloadStream(new ObjectId(id)).pipe(res);
};

exports.deletePost = async (req, res) => {
    
        const { fileId } = req.params;
        if (!fileId){
          throw new BadRequestError('Please provide a file id');
        }
        const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        
        const file = await gfs.find({ _id: new ObjectId(fileId) }).toArray();
  
        if (file.length === 0) {
          throw new NotFoundError(`No Image found with id: ${fileId}`)
        }

        await  gfs.delete(new ObjectId(fileId));
        res.status(StatusCodes.OK).json({ text: "File deleted successfully!" });
};
