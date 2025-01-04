const { UnauthenticatedError, BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const Cart = require('../models/Cart')
const Products = require('../models/Products')



const getAllCart = async (req, res) => {
    const carts = await Cart.find({}).sort('-createdAt');//We want to get only the carts associated with the user
    res.status(StatusCodes.OK).json({ msg: 'Get all Carts', nbHits: carts.length, carts })
}
const getCart = async (req, res) => {
    //Next level destructuring
    const {
        params: { id: cartId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    const cart = await Cart.findOne({ _id: cartId })
    if (!cart) {
        throw new NotFoundError(`No cart with id ${cartId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Cart Found', nbHits: 1, cart })
}


const createCart = async (req, res) => {
    req.body[0].totalCartCents = 5;
    let [{ products, totalCartCents }] = req.body;
    let price = 0; // Accumulator Variable

    // Use for...of loop instead of forEach for async handling
    for (const product of products) {
        const main = await Products.findById(product.productId);
        if (main) {
            price += main.priceCents * product.quantity;
            console.log(price);
        } else {
            console.error(`Product with ID ${product.productId} not found.`);
        }
    }

    console.log(`Final Price: ${price}`);
    totalCartCents = Number(price); // Ensure it’s a number
    console.log(`Total Cart Cents: ${totalCartCents}`);

    // Create new cart with updated totalCartCents
    const newCart = await Cart.create([{ products, totalCartCents }]);
    res.status(StatusCodes.CREATED).json({ msg: 'Cart Created', newCart });
};


const deleteCart = async (req, res) => {
    const {
        params: { id: cartId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    const cart = await Cart.findByIdAndRemove({ _id: cartId })
    if (!cart) {
        throw new NotFoundError(`No cart with id ${cartId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Cart Deleted' })
}


const updateCart = async (req, res) => {
    //Next level destructuring
    const {
        body: { products },
        params: { id: cartId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    if (products === undefined) {
        throw new BadRequestError('The products fields cannot be empty')
    }
    const cart = await Cart.findById({ _id: cartId })
    if (!cart) {
        throw new NotFoundError(`No cart with id ${cartId}`)
    }
    let price=0;
    for (const product of products) {
        const main = await Products.findById(product.productId);
        if (main) {
            // console.log(product.quantity*main.priceCents)
            price += main.priceCents * product.quantity;
            console.log(price);
        } else {
            console.error(`Product with ID ${product.productId} not found.`);
        }
    }

    console.log(`Final Price: ${price}`);
    cart.totalCartCents += Number(price); // Ensure it’s a number
    console.log(`Total Cart Cents: ${cart.totalCartCents}`);



    let isThere;
    products.forEach(product => {
        const newProId=JSON.stringify(product.productId).split('"')[1]//For the new products we are adding
        cart.products.forEach((carProduct)=>{
            const newProductId=JSON.stringify(carProduct.productId).split('"')[1]//For the products already in the cart
            if(newProId === newProductId) {
                isThere=true;
                carProduct.quantity+=1
            }
        })
        if(!isThere) {
            cart.products.unshift(product);
        }
    });

    cart.save();//This saves everything we have done to the data base
    res.status(StatusCodes.OK).json({ msg: 'Cart updated', nbHits: cart.products.length, cart });
}

const deleteCartProduct = async(req, res) => {
    //Next level destructuring
    const {
        params: { id: cartId, productId }//We assigned the first parameter of the params object to a new called cartId
    } = req;
    // console.log(req.params)
    const cart = await Cart.findById({ _id: cartId })

    if (!cart) {
        throw new NotFoundError(`No cart with id ${cartId}`)
    }
    if (!cart.products[0]) {
        cart.totalCartCents=0
        await cart.save()
        throw new NotFoundError(`There is no product with with ${productId}`)
    }


    let isThere;
    cart.products.forEach((product,index) => {
        const newProId=JSON.stringify(product.productId).split('"')[1]
        if(newProId===productId) {
            isThere=true;
            console.log(product,index)
            cart.products.splice(index,1);
        }
        if(index===cart.products.length-1 && !isThere) {
            throw new NotFoundError(`There is no product with with ${productId}`)
        }
    })


    let price=0;
    for (const product of cart.products) {
        const main = await Products.findById(product.productId);
        if (main) {
            // console.log(product.quantity*main.priceCents)
            price += main.priceCents * product.quantity;
            console.log(price);
        } else {
            console.error(`Product with ID ${product.productId} not found.`);
        }
    }

    console.log(`Final Price: ${price}`);
    cart.totalCartCents -= Number(price); // Ensure it’s a number
    console.log(`Total Cart Cents: ${cart.totalCartCents}`);

    await cart.save();
    res.status(StatusCodes.OK).json({ msg: 'Cart updated', nbHits: cart.products.length, cart });
}
module.exports = { getAllCart, createCart, deleteCart, updateCart, getCart, deleteCartProduct }