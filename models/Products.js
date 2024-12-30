const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please Add your Image'],
    },
    name: {
        type: String,
        required: [true, 'Please Enter your name'],
    },
    rating: {
        type: Object,
        stars: {type:Number},
        count: {type:Number}
    },
    priceCents: {
        type: Number
    },
    keywords: [{
        type: String
    }],
    type: {
        type: String
    },
    sizeChartLink: {
        type: String
    }
})



const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
