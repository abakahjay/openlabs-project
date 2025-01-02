const express = require('express');
const router = express.Router();

const {
    getAllCart,
    createCart,
    deleteCart,
    updateCart,
    getCart,
    deleteCartProduct
} = require('../controllers/cart.js')


router.route('/').post(createCart).get(getAllCart)

router.route('/:id').get(getCart).delete(deleteCart).patch(updateCart)

router.route('/:id/:productId').patch(deleteCartProduct)



module.exports = router;