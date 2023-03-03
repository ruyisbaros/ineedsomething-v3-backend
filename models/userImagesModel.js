const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const userImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["profile", "cover"],
    }
})

const userImage = mongoose.model("UserImage", userImageSchema)

module.exports = userImage