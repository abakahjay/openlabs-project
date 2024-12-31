const express = require('express');
const router = express.Router();


const {
    getAllProducts,
    getAllProductsStatic,
} = require('../controllers/products')
const {login} = require('../controllers/auth.js')



router.route('/static').get(getAllProductsStatic)
router.route('/').get(getAllProducts).post(login, getAllProducts)

module.exports = router;
