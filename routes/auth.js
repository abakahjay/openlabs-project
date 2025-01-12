const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");


//Import Controllers
const {
    signUp,
    login,
    dashboard,
    userId,
    verifyEmail
} = require('../controllers/auth.js');





router.route("/signup").post(signUp)
router.route("/login").post(login);
router.route("/dashboard").get(authMiddleware,dashboard);
router.route("/userId").post(userId);
router.route('/verify-email').get(verifyEmail)

module.exports = router;
