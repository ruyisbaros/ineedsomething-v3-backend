const { uploadToCloudinary } = require("../helpers/imageService")
const Post = require("../models/postModel")
const PostImages = require("../models/postImagesModel")

/* ------------------Helpers---------------------------- */
const createPostImage = async (image, post) => {
    await PostImages.create({ post: post._id, url: image.url, public_id: image.public_id.split("postImages/")[1] })
}
const operations = async (img, path, post) => {
    const image = await uploadToCloudinary(img, path)
    console.log(image)
    await createPostImage(image, post)
    return image.url
}
const uploadPostImages = async (imgs, path, post) => {
    const urls = imgs.map(async (img) => (
        await operations(img, path, post)
    ))
    const res = await Promise.all(urls)
    return res
}
exports.postCtrl = {
    createPost: async (req, res) => {
        try {
            //console.log(req.body)
            const { path, user, background, text, images } = req.body
            const newPost = await Post.create({ user, background, text })
            const urls = await uploadPostImages(images, path, newPost)
            const updatedPost = await Post.findByIdAndUpdate(newPost._id, { images: urls }, { new: true })
            res.status(201).json(updatedPost)
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



