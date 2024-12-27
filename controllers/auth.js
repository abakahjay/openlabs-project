const jwt = require('jsonwebtoken');
const User = require("../models/User");
const {UnauthenticatedError,BadRequestError}= require('../errors')
const {StatusCodes}=require('http-status-codes')


// Generate a JWT
//When generating the token always the first parameter is the id(how to access the user) in an object
//And the second parameter is is the secret key
//The third parameter is the expiring time
//We created a function to handle the generating of the tokens
// const generateToken = (userId,username) => {
//     return jwt.sign({ id: userId ,username:username}, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// Signup Route
const signUp = async (req, res) => {
    //Destructure the req.body
    const { firstName, lastName, username, email, password } = req.body;
    console.log(req.body);


    // Create a new user
    const newUser =await User.create({ firstName, lastName, username, email, password });
    const UserId =JSON.stringify(newUser._id);
    console.log(UserId.split('"')[1]);

    const token = newUser.createJWT();
    newUser.tokens.push(token); // Add token to the tokens array
    await newUser.save(); // Save the user with the new token
    res.cookie("authToken", token, {
        httpOnly: true, // Secure cookie, inaccessible to JavaScript
        sameSite: "Lax", // Restrict cookie sharing for cross-site requests
        maxAge: 24 * 60 * 60 * 1000, // Expiry time (optional)
    });

    res.status(StatusCodes.CREATED).json({ message: "User registered successfully!",token,userId: UserId.split('"')[1]});
};

// Login Route
const login =async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if(!email||!password){
        throw new BadRequestError('PLease Provide Email and Password')
    }

    // Find user by email
    const user = await User.findOne({ email})//.select('-password');

    if (!user) {
        throw new UnauthenticatedError("Invalid email.");
    }
    //Check if password is correct
    const isPasswordCorrect = await user.comparePasswords(password)
    console.warn("Password Correct:", isPasswordCorrect);  // Log result of password check
      //If not throw an error
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Password');
    }

    const token = user.createJWT();
    user.tokens.push(token); // Add token to the tokens array
    await user.save(); // Save the user with the new token
    res.cookie("authToken", token, {
        httpOnly: true, // Secure cookie, inaccessible to JavaScript
        sameSite: "Lax", // Restrict cookie sharing for cross-site requests
        maxAge: 24 * 60 * 60 * 1000, // Expiry time (optional)
    });
    res.status(StatusCodes.OK).json({ message: "Login successful!", user,token,userId: user._id});
};




//Dashboard route
//THis is for the jwt verification process
// Add a route to fetch user details after login
const dashboard = async (req, res) => {
    // //We get the token from the headers of there request
    // // console.log(req.headers.authorization);
    // const token = req.headers.authorization?.split(" ")[1];


    // //We check if there is a token
    // if (!token) return res.status(401).json({ error: "No token provided" });

    // try {
    //     //When verifying always the first parameter is the token and the second parameter is the secret key
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     // console.log(decoded);
        const user = await User.findById(req.user.userId).select('-password');//Select will omit that parameter
        if(!user){
            throw new  BadRequestError('Invalid token provided');
        }
        console.log(req.user);
        const token = req.user.token;
        res.status(StatusCodes.OK).json({user,token});
    // } catch (error) {
    //     res.status(401).json({ error: "Invalid or expired token" });
    // }
};


//Export the controllers
module.exports={
        signUp,
        login,
        dashboard
};