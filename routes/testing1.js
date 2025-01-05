const express = require('express');
const router = express.Router();
// const {StatusCodes}= require('http-status-codes');

const {upload,uploadProfilePic} = require('../controllers/testing1.js');
const authMiddleware = require('../middleware/auth.js');

// Upload File
router.route('/upload-profile-pic').patch(authMiddleware ,upload.single('profile_pictures'),uploadProfilePic )

module.exports=router;