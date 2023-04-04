const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    recipients: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
    ],
    chatMessage: String,
    images: Array,
}, { timestamps: true })

const Conversation = mongoose.model("Conversation", ConversationSchema)

module.exports = Conversation