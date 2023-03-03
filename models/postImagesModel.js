const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const postImagesSchema = new mongoose.Schema({
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
        required: true
    },

})

const postImages = mongoose.model("PostImages", postImagesSchema)

module.exports = postImages