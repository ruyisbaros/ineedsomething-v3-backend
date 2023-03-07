const Comment = require("../models/CommentModel")

const commentCtrl = {
    addComment: async (req, res) => {
        const { react, postId } = req.body
        try {

            res.status(200).json({ message: "ok" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getComment: async (req, res) => {
        try {

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = commentCtrl