const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["profilePicture", "cover", null],
        default: null
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    images: {
        type: Array
    },
    background: {
        type: String
    },
    privacy: { type: String, default: "public" },
    text: { type: String, default: "" },

}, { timestamps: true })


const Post = mongoose.model("Post", postSchema)

module.exports = Post