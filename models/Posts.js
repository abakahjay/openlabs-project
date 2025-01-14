const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
        datePosted: {
            type:String,
            required:[true,'Please Provide the Date Ordered']
        },
        postId: {
                    type: mongoose.Types.ObjectId,
                    ref: 'uploads',
                    required: [true, 'Please Provide a Post ID']
                },
        likes: {
            type: Number,
            default: 0
        },
        caption: {type:String,default:''},
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Comment',
                default:null,
            }
        ],
        createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        },
        required: [true, 'Please Provide the User Id']
},{ timestamps: true })//An extra Schema parameter for timestamps(important)

const Posts = mongoose.model("Posts", PostSchema);
module.exports = Posts;
