const express = require('express');
const { followUser, unfollowUser, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);
router.get('/:id', getUser);

module.exports = router;
