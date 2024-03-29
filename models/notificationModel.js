const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const notifySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: ObjectId,
        ref: "User",

    },
    to: {
        type: ObjectId,
        ref: "User",

    },
    read: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
    }
}, { timestamps: true })

const Notification = mongoose.model("Notification", notifySchema)

module.exports = Notification