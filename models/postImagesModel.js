const mongoose = require("mongoose")
const { ObjectId } = mongoose.Types

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
    },
    owner: {
        type: ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        default: "post",
    }

})

const postImages = mongoose.model("PostImages", postImagesSchema)

module.exports = postImages