const Orders = require('../models/Orders')
const { UnauthenticatedError, BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')




const getAllOrders = async (req, res) => {
    const orders = await Orders.find({}).sort('-createdAt');//We want to get only the carts associated with the user
    res.status(StatusCodes.OK).json({ msg: 'Get all Orders', nbHits: orders.length, orders })
}
const getOrder = async (req, res) => {
    //Next level destructuring
    const {
        params: { id: ordersId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    const order = await Orders.findOne({ _id: ordersId })
    if (!order) {
        throw new NotFoundError(`No order with id ${ordersId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Order Found', nbHits: 1, order })
}
const createOrder = async (req, res) => {
    
    const [{orderTime,totalCostCents,products }] = req.body;
    console.log(req.body);
    const newOrder = await Orders.create([{ orderTime,totalCostCents,products }])
    res.status(StatusCodes.CREATED).json({ msg: 'Order Created', newOrder })
}
const deleteOrder = async (req, res) => {
    const {
        params: { id: ordersId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    const order = await Orders.findByIdAndRemove({ _id: ordersId })
    if (!order) {
        throw new NotFoundError(`No order with id ${ordersId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Order Deleted' })
}
const updateOrder = async (req, res) => {
    //Next level destructuring
    const {
        body: { totalCostCents,products },
        params: { id: orderId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    if (products === undefined) {
        throw new BadRequestError('The products fields cannot be empty')
    }
    const order = await Orders.findById({ _id: orderId })
    if (!order) {
        throw new NotFoundError(`No cart with id ${orderId}`)
    }
    order.totalCostCents=totalCostCents;
    products.forEach(product => {
        console.log(product)
        order.products.unshift(product);
    });
    
    await order.save(function (err) {
        if (!err) {console.log('Success!')}
        else {
            console.log('Error');
        };
    });
    res.status(StatusCodes.OK).json({ msg: 'Order updated',nbHits: order.products.length , order });
}
module.exports = { getAllOrders, createOrder, deleteOrder, updateOrder, getOrder }