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
    }
}