require('dotenv').config()
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const {StatusCodes} = require('http-status-codes');
const User= require('../models/User.js')





// MongoDB connection
const conn = mongoose.connection;

// Initialize GridFS Stream
let gfs;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
    console.log('GridFS Connected for testing');
})


// Set up storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);
                const filename = `${buf.toString('hex')}${path.extname(file.originalname)}`;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads', // Should match bucketName in GridFSBucket
                };
                resolve(fileInfo);
            });
        });
    },
});

const upload = multer({ storage });

const uploadProfilePic = async (req, res) => {
    // console.log(req.file)
    console.log('Starting update process');
    if (!req.file) {
        console.warn('Cannot Find File')
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: 'No file uploaded.' });
    }
    console.log('File has been found');
    const profilePicUrl = `../uploads/${req.file.filename}`;  // Generate URL for uploaded image

    try {
        const userId = req.user.userId; // Use the authenticated user's ID from req.user
        // Update the user's profile picture URL in the database
        const user = await User.findByIdAndUpdate(userId, { profile_picture: profilePicUrl }, { new: true });
        // console.log(user)
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, error: 'User not found.' });
        }
        res.status(StatusCodes.OK).json({ success: true, profile_picture: user.profile_picture });  // Respond with the new profile picture URL
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to update profile picture.' });
    }
};

module.exports = {
    upload,
    uploadProfilePic
};
