const Chat = require("../models/chatMessageModel")
const Conversation = require("../models/conversationModel")
const asyncHandler = require("express-async-handler")

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 90
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)

        return this;
    }
}

exports.createNewMessage = asyncHandler(async (req, res) => {
    const { recipient, chatMessage, images } = req.body

    if (!recipient || (!chatMessage.trim() && images.length === 0)) return;

    const newConversation = await Conversation.findOneAndUpdate(
        {
            $or: [
                { recipients: [req.user._id, recipient] },
                { recipients: [recipient, req.user._id] }
            ]
        }, { recipients: [req.user._id, recipient], chatMessage, images }, { new: true, upsert: true }
    )

    const newMessage = await Chat.create({
        sender: req.user._id,
        conversation: newConversation._id,
        recipient, chatMessage, images,
    })

    res.status(200).json(newMessage)
})

exports.getConversations = asyncHandler(async (req, res) => {

    const conversations = await Conversation.find({ recipients: req.user._id }).sort("updatedAt").populate("recipients", "-password")

    res.status(200).json(conversations)

})

exports.getChatMessages = asyncHandler(async (req, res) => {

    const chats = await Chat.find(
        {
            $or: [
                { sender: req.user._id, recipient: req.params.id },
                { sender: req.params.id, recipient: req.user._id },
            ]
        }).sort("createdAt").populate("recipient sender", "-password")

    res.status(200).json(chats)

})

exports.deleteAMessage = asyncHandler(async (req, res) => {

    await Chat.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Message deleted successfully" })
})

exports.deleteAConversation = asyncHandler(async (req, res) => {

    const _conver = await Conversation.find({
        $or: [
            { recipients: [req.user._id, req.params.id] },
            { recipients: [req.params.id, req.user._id] }
        ]
    })
    if (_conver) {
        const deletedConversation = await Conversation.findOneAndDelete({
            $or: [
                { recipients: [req.user._id, req.params.id] },
                { recipients: [req.params.id, req.user._id] }
            ]
        })

        await Chat.deleteMany({ conversation: deletedConversation._id })
        res.status(200).json({ message: "Conversation deleted successfully" })
    }
})