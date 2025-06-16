const mongoose = require("mongoose");
const userChatsSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please Provide the User Id']
    },
    chats: [
      {
        chatId: {
          type: mongoose.Types.ObjectId,
          ref: 'Chat',
          required: [true, 'Please Provide the Chat Id']
        },
        title: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default:Date.now()
        },
        created:{
          type:Number,
          default:Date.now()
        },
      },
    ],
    created:{
      type:Number,
      default:Date.now()
    },
  },
  { timestamps: true }
);

const UserChats = mongoose.model("UserChats", userChatsSchema);
module.exports = UserChats;

// export default mongoose.models.UserChats ||
//   mongoose.model("UserChats", userChatsSchema);
