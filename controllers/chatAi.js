const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const { UnauthenticatedError, BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const Post = require('../models/Posts');
const Chat = require('../models/ChatAi');
const UserChats = require('../models/UserChatAi');
const ImageKit = require("imagekit");
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});
//These are imagekit token parameters
// const result = imagekit.getAuthenticationParameters();
// console.log(result)


//Backend with imagekit and clerk
exports.getUploadAuth = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
};


exports.createChat = async (req, res) => {//This is used to create a new chat
    const userId = req.params.userId;
    if (!userId) {
        throw new BadRequestError('You must provide a user Id ')
    }
    const { text } = req.body;
    if(!text){
        throw new BadRequestError('You must provide some text')
    }
    const newChat = new Chat({
        userId: userId,
        history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();
    // console.log(savedChat._id)

    let userChats = await UserChats.find({ userId });

    if (!userChats.length) {
        userChats = new UserChats({
            userId: userId,
            chats: [{ chatId: savedChat._id, title: text.substring(0, 40) }],
        });
        await userChats.save();
    } else {
        await UserChats.updateOne(
            { userId: userId },
            {
                $push: {
                    chats: { chatId: savedChat._id, title: text.substring(0, 40) },
                },
            }
        );
    }

    res.status(StatusCodes.CREATED).json({message:'Chat created successfully',userChats,savedChat});
};

exports.getUserChats = async (req, res) => {//This will send all userchats
    const userId = req.params.userId;
    if (!userId) {
        throw new BadRequestError('You must provide a user Id ')
    }
    const userChats = await UserChats.find({ userId });
    if(!userChats){
        throw new NotFoundError(`No user chats found with id: ${userId}`)
    }
    res.status(StatusCodes.OK).json({message:'User Chats Found',data:userChats});
};

exports.getChatById = async (req, res) => {//This will access an individual chat with chatId and userId
    const userId = req.params.userId;
    const chatId =req.params.chatId
    if (!userId) {
        throw new BadRequestError('You must provide a user Id ')
    }
    const chat = await Chat.findOne({ _id: chatId, userId });
    if(!chat){
        throw new BadRequestError(`No chat with chatId: ${chatId}`)
    }
    res.status(StatusCodes.OK).json({message:'Chat found succesfully',data:chat,nbHits: chat.length});
};

exports.deleteChat = async (req, res) => {//This will access an individual chat with chatId and userId
    const userId = req.params.userId;
    const chatId =req.params.chatId
    if (!userId) {
        throw new BadRequestError('You must provide a user Id ')
    }
    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!deletedChat) {
        throw new NotFoundError(`No chat with chatId: ${chatId}`);
    }

    // Remove from UserChats as well
    await UserChats.updateOne(
        { userId },
        { $pull: { chats: { chatId: req.params.id } } }
    );

    res.status(StatusCodes.OK).json({ message: 'Chat deleted successfully', deletedChat });

};

exports.updateChat = async (req, res) => {//This is used to update a chat with a message
    const userId = req.params.userId;
    const chatId =req.params.chatId
    if (!userId) {
        throw new BadRequestError('You must provide a user Id ')
    }
    if (!chatId) {
        throw new BadRequestError('You must provide a chat Id ')
    }
    const { question, answer, img } = req.body;
    console.log('Body:',req.body)
    if (!question) {
        throw new BadRequestError('You must provide a question from user ')
    }
    const newItems = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];
    const updatedChat = await Chat.updateOne(//This returns statistics
        { _id: chatId, userId },
        { $push: { history: { $each: newItems } } }
    );
    const chatUpdated =await Chat.findOne({ _id: chatId, userId });//This returns the data itself
    if(!chatUpdated){
        throw new NotFoundError(`No chat found with id: ${chatId}`)
    }
    res.status(StatusCodes.OK).json({message:'Updated Chat Successfully',stats:updatedChat,data:chatUpdated});
};



exports.postImage = async (req, res) => {
    // const { caption, comments } = req.body;
    const { userId} = req.params;
    const { chatId} = req.params;
    const { text } =req.body
    console.log('\x1b[32m%s\x1b[0m', 'caption:')

    if (!userId) {
        throw new BadRequestError('You must provide a user Id ')
    }
    console.log('File:',req.file)
    if (!req.file) {
        throw new BadRequestError('Please No file has been Detected')
    }
    const chat = await Chat.findOne({userId,_id:chatId})
    if (!chat) {
        // createChat()
        throw new NotFoundError(`No Chat found with id:${chatId}`)
    }
    chat.history.push({
    role: "user",
    img: req.file.id,
    parts:[{text}]
    });
    await chat.save();

    // postId: req.file.id, // Save GridFS file ID

    // chat.history.push(req.file.id);
    console.log('\x1b[34m%s\x1b[0m', `User: ${userId} made a post`)
    console.log(req.file)
    // await chat.save();
    res.status(StatusCodes.CREATED).json({message:'You posted an image',imageId:req.file.id,chat});

};


exports.getImage = async (req, res) => {//This is used to get an image from the data base with ann ImageId
    const { id } = req.params;//ImageId
    console.log('\x1b[36m%s\x1b[0m', 'User Wants to get Image')

    if (!id || id === 'null' || id === 'undefined') {
        throw new BadRequestError('Please provide the image id')
    }

    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    const file = await gfs.find({ _id: new ObjectId(id) }).toArray();

    if (!file || file.length === 0) {
        throw new NotFoundError(`No Image found with id: ${id}`)
    }

    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

    await gfs.openDownloadStream(new ObjectId(id)).pipe(res);
};

exports.deleteImage = async (req, res) => {
    const { userId } = req.query;
    const { fileId } = req.params;
    const { chatId } = req.params;
    if (!fileId) {
        throw new BadRequestError('Please provide a file id');
    }
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    const file = await gfs.find({ _id: new ObjectId(fileId) }).toArray();

    if (file.length === 0) {
        throw new NotFoundError(`No Image found with id: ${fileId}`)
    }
    const user = await User.findOne({ _id: userId })
    user.posts.forEach((post, index) => {
        const newPostId = JSON.stringify(post).split('"')[1]
        if (newPostId === fileId) {
            console.log(post, index)
            user.posts.splice(index, 1);
        }
    })


    await gfs.delete(new ObjectId(fileId));
    await user.save();
    const post = await Post.findOneAndDelete({ postId: fileId });

    if (!post) {
        throw new NotFoundError(`No post found with id: ${fileId}`)
    }
    res.status(StatusCodes.OK).json({ text: "File deleted successfully!", user, post });
};