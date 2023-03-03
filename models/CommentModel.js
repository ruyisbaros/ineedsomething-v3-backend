const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const commentSchema = new mongoose.Schema({
    comment: String,
    image: {
        type: ObjectId,
        ref: "CommentImage",
    },
    commentBy: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    reply: {
        type: ObjectId,
        ref: "User",
    },
    post: {
        type: ObjectId,
        ref: "Post",
    },

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment