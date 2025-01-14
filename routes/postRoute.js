const express = require('express');
const { createPost, getPosts, getImage } = require('../controllers/postController');
const {upload} = require('../utils/storageMulter');

const router = express.Router();

router.post('/', upload().single('image'), createPost);
router.get('/', getPosts);
router.get('/image/:id', getImage);

module.exports = router;
