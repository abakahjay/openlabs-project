const express = require('express');
const {upload}= require('../utils/storageMulter.js')
const { followUser, unfollowUser, getUser,getUserByName,editUser,editUserProfilePic } = require('../controllers/userController');

const router = express.Router();

router.patch('/:id/follow', followUser);
router.patch('/:id/unfollow', unfollowUser);
router.get('/:id', getUser);
router.patch('/:username', getUserByName);
router.patch('/:username/editUser',editUser);

module.exports = router;
