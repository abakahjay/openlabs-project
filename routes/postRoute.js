const express = require('express');
const { createPost, getPosts, getImage ,deletePost} = require('../controllers/postController');
const {upload} = require('../utils/storageMulter');

const router = express.Router();

router.route('/').post( upload().single('file'), createPost);
router.get('/', getPosts);
router.get('/image/:id', getImage);
router.delete('/image/:fileId', deletePost);

module.exports = router;
