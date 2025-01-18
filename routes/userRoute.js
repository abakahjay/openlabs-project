const express = require('express');
const { followUser, unfollowUser, getUser,getUserByName,editUser } = require('../controllers/userController');

const router = express.Router();

router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);
router.get('/:id', getUser);
router.patch('/:username', getUserByName);
router.patch('/:username/editUser', editUser);

module.exports = router;
