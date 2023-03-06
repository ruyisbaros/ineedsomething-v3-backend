const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const reactSchema = new mongoose.Schema({
    react: {
        type: String,
        enum: ["like", "love", "haha", "sad", "love", "angry"],
        required: true
    },
    postRef: {
        type: ObjectId,
        ref: "Post",
    },
    reactBy: {
        type: ObjectId,
        ref: "User",
    }
})

const React = mongoose.model("React", reactSchema)

module.exports = React