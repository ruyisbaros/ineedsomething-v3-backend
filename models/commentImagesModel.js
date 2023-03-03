const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const commentImages = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    post: {
        type: ObjectId,
        ref: "Post",
    },
    comment: {
        type: ObjectId,
        ref: "Comment",
    },

})

const commentImage = mongoose.model("CommentImage", commentImages)

module.exports = commentImage