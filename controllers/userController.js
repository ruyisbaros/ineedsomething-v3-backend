const User = require("../models/userModel")
const Post = require("../models/postModel")

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
            const { url } = req.body
            console.log(url)
            await User.findByIdAndUpdate(req.user._id, { picture: url }, { new: true }).select("-password")

            res.status(200).json({ url, message: "Profile picture updated successfully" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = userCtrl