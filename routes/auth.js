const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");


//Import Controllers
const {
    signUp,
    login,
    dashboard
} = require('../controllers/auth.js');





router.route("/signup").post(signUp)
router.route("/login").post(login);
router.route("/dashboard").get(authMiddleware,dashboard);

module.exports = router;
