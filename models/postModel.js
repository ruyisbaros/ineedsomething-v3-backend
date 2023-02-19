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
    comments: [
        {
            comment: String,
            image: String,
            commentBy: {
                type: ObjectId,
                ref: "User",
                required: true
            },
            reply: {
                type: ObjectId,
                ref: "User",
            },
            commentAt: {
                type: Date,
                default: new Date()
            }
        }
    ]
}, { timestamps: true })


const Post = mongoose.model("Post", postSchema)

module.exports = Post