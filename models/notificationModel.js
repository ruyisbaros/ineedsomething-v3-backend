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
        required: true
    },
    to: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Notification = mongoose.model("Notification", notifySchema)

module.exports = Notification