//Must follow CRUD Create Read Update and Destroy
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);//This prevent all the errors
//This is for the internet
const connectDB  = (url) => {//This is the method we use to connect to the mongodb database
    return mongoose.connect(url,{//This setup is not compulsory if using version 6,but its just used to remove deprecation errors
            
        })
}

module.exports = connectDB;