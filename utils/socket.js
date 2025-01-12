const Message = require('../models/Message');

const users = new Map(); // Track connected users and their sockets

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Store user's ID and socket
        const userId = socket.handshake.query.userId;
        if (userId) users.set(userId, socket.id);

        // Handle direct messaging
        socket.on('sendMessage', async ({ sender, recipient, message }) => {
            try {
                const newMessage = await Message.create({ sender, recipient, message });

                const recipientSocketId = users.get(recipient);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receiveMessage', newMessage);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            users.delete(userId);
        });
    });
};

module.exports = setupSocket;
