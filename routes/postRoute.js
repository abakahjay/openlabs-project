const express = require('express');
const { createPost, getPosts, likePost } = require('../controllers/postController');
const {upload} = require('../utils/storageMulter'); // Multer middleware

const router = express.Router();

router.post('/', upload().single('image'), createPost);
router.get('/', getPosts);
router.post('/:id/like', likePost);

module.exports = router;
