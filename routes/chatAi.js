const express = require('express');
const { ClerkExpressRequireAuth }= require("@clerk/clerk-sdk-node");
const {
    deleteChat,
    getUploadAuth,
    createChat,
    getUserChats,
    getChatById,
    updateChat,
} = require('../controllers/chatAi');
const router = express.Router();

router.post("/chats/:userId",createChat);//
router.get("/userchats/:userId", getUserChats);//
router.get("/chats/:userId/:chatId", getChatById);//
router.patch("/chats/:userId/:chatId", updateChat);
router.delete('/chats/:userId/:chatId', deleteChat);


//This is for imagekit and clerk backend
// router.get("/upload", getUploadAuth);
// router.post("/chats", ClerkExpressRequireAuth(), createChat);
// router.get("/userchats", ClerkExpressRequireAuth(), getUserChats);
// router.get("/chats/:id", ClerkExpressRequireAuth(), getChatById);
// router.put("/chats/:id", ClerkExpressRequireAuth(), updateChat);
module.exports = router;