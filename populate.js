require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/Products.js')

const jsonProducts = require('./mockData/products.json')


const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI).then(() =>console.log('Connected to Database'))
        await Product.deleteMany();//THis will delete all existing products in the database
        await Product.create(jsonProducts)
        console.log('Success!!!!')
        process.exit(0)//This is used to exit after the code executed
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

};
start();