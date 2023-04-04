const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'User' },
    chatMessage: String,
    images: Array,
}, { timestamps: true })

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat