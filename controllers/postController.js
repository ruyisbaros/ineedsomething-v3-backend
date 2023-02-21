const Post = require("../models/postModel")

exports.postCtrl = {
    createPost: async (req, res) => {
        try {
            //console.log(req.body)
            //const {}
            const newPost = await Post.create(req.body)
            res.status(201).json(newPost)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate("user", "first_name last_name email picture username gender")
                .sort({ createdAt: -1 })
            res.status(200).json(posts)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}