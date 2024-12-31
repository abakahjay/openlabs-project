const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Products',
            required:[true,'Please Provide a Product ID']
        },
        quantity: {
            type:Number, required:[true,'Please Provide the Product Quantity']
        },
        deliveryOptionId: {
            type:String,
            required:[true,'Please Provide the Delivery Option ID']
        },
        dateOrdered: {
            type:String,
            required:[true,'Please Provide the Date Ordered']
        },
        
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
},
{ timestamps: true })//An extra Schema parameter for timestamps(important)



const Orders = mongoose.model("Cart", CartSchema);
module.exports = Orders;
