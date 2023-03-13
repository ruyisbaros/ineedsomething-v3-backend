const { uploadToCloudinary, deleteImage } = require("../helpers/imageService")
const mongoose = require("mongoose")
const Post = require("../models/postModel")
const User = require("../models/userModel")
const PostImages = require("../models/postImagesModel")

/* ------------------Helpers---------------------------- */
const createPostImage = async (image, post, user) => {
    await PostImages.create({ owner: user, type: "post", post: post._id, url: image.url, public_id: image.public_id.split("postImages/")[1] })
}
const operations = async (img, path, post, user) => {
    const image = await uploadToCloudinary(img, path)
    //console.log(image)
    await createPostImage(image, post, user)
    return image.url
}
const uploadPostImages = async (imgs, path, post, user) => {
    const urls = imgs.map(async (img) => (
        await operations(img, path, post, user)
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
            await newPost.populate("user", "first_name last_name email picture username gender")
            if (images) {
                const urls = await uploadPostImages(images, path, newPost, user)
                const updatedPost = await Post.findByIdAndUpdate(newPost._id, { images: urls }, { new: true }).populate("user", "first_name last_name email picture username gender")
                return res.status(201).json(updatedPost)
            }
            res.status(201).json(newPost)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const followingTemp = await User.findById(req.user.id);
            const following = followingTemp.following;
            const friends = followingTemp.friends;
            //console.log(following)
            const followingPosts = await Post.find({ $or: [{ user: { $in: following } }, { user: { $in: friends } }, { user: { $eq: mongoose.Types.ObjectId(req.user._id) } }] })
                .populate("user", "first_name last_name email picture username gender")
                .sort({ createdAt: -1 })
                .exec()
            res.status(200).json(followingPosts)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteAPost: async (req, res) => {
        try {
            const { postId, email } = req.params
            //1.) Delete post images from cloud
            const postImages = await PostImages.find({ post: mongoose.Types.ObjectId(postId) })
            const promises = postImages.map(async img => (
                await deleteImage(`iNeedSomething/${email}/postImages/${img.public_id}`)
            ))
            await Promise.all(promises)
            //2.) Delete post images from db
            await PostImages.deleteMany({ post: postId })
            //3.) Delete post from DB
            await Post.findByIdAndDelete(postId)
            res.status(200).json({ message: "Post has been deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    saveAPost: async (req, res) => {
        try {
            const { postId } = req.params
            const user = await User.findById(req.user._id)
            const check = user.savedPosts.find(item => item.post.toString() === postId)
            if (check) {
                await User.findByIdAndUpdate(req.user._id, {
                    $pull: {
                        savedPosts: {
                            post: postId,
                        }
                    }
                })
                res.status(200).json({ message: "Post has been removed successfully" })
            } else {
                await User.findByIdAndUpdate(req.user._id, {
                    $push: {
                        savedPosts: {
                            post: postId,
                            savedAt: new Date()
                        }
                    }
                })
                res.status(200).json({ message: "Post has been saved successfully" })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}



