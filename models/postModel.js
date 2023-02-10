const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({}, { timestamps: true })


const Post = mongoose.model("Post", postSchema)

module.exports = Post