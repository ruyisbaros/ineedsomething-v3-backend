const User = require("../models/userModel")
const Post = require("../models/postModel")
const Image = require("../models/userImagesModel")
const { uploadToCloudinary } = require("../helpers/imageService")

const userCtrl = {
    findUserByEmail: async (req, res) => {
        try {
            const { email } = req.params
            const user = await User.findOne({ email }).select("-password")
            if (!user) {
                return res.status(401).json({ message: "No user found!" });
            }
            res.status(200).json({
                email: user.email,
                picture: user.picture
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    getProfile: async (req, res) => {
        try {
            const { username } = req.params
            const user = await User.findOne({ username }).select("-password")
            if (!user) {
                return res.status(401).json({ message: "No user found!" });
            }
            const posts = await Post.find({ user: user._id })
                .populate("user", "first_name last_name email picture username gender")
                .sort({ createdAt: -1 })
            res.status(200).json({ user, posts })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    updateProfilePicture: async (req, res) => {
        try {
            const { pic, path } = req.body
            const img = await uploadToCloudinary(pic, path)
            const createdImg = await Image.create({ url: img.url, public_id: img.public_id.split("profileImages/")[1], type: "profile" })
            await User.findByIdAndUpdate(req.user._id, { picture: img.url }, { new: true }).select("-password")

            res.status(200).json({ url: img.url, message: "Profile picture updated successfully" })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: error.message })
        }
    },
    updateCoverPicture: async (req, res) => {
        try {
            const { pic, path } = req.body
            const img = await uploadToCloudinary(pic, path)
            const createdImg = await Image.create({ url: img.url, public_id: img.public_id.split("profileImages/")[1], type: "cover" })
            await User.findByIdAndUpdate(req.user._id, { cover: img.url }, { new: true }).select("-password")

            res.status(200).json({ url: img.url, message: "Cover picture updated successfully" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    updateUserDetails: async (req, res) => {
        try {
            const { infos } = req.body
            //console.log(url)
            const user = await User.findByIdAndUpdate(req.user._id,
                { details: infos },
                { new: true })
                .select("-password")

            res.status(200).json({ details: user.details, message: "User detail updated successfully" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = userCtrl