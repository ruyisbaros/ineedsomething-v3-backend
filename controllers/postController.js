const Post = require("../models/postModel")

exports.postCtrl = {
    createPost: async (req, res) => {
        try {

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}