const express = require('express');
const router = express.Router();

const {
    
    changeDelivery
} = require('../controllers/cart.js')


router.route('/:id/:productId/:option').patch(changeDelivery)



module.exports = router;