const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const commentSchema = new mongoose.Schema({
    comment: String,
    image: {
        type: String,
        default: "",
    },
    commentBy: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: ObjectId,
            ref: "User",
        },
    ], 
    reply: {
        type: ObjectId,
        ref: "User",
    },
    commentPost: {
        type: ObjectId,
        ref: "Post",
    },

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment