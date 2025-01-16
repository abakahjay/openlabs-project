const express = require('express');
const { followUser, unfollowUser, getUser,getUserByName } = require('../controllers/userController');

const router = express.Router();

router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);
router.get('/:id', getUser);
router.patch('/:username', getUserByName);

module.exports = router;
