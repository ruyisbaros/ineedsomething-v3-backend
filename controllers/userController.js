const User = require("../models/userModel")
const Post = require("../models/postModel")
const Image = require("../models/userImagesModel")
const { uploadToCloudinary } = require("../helpers/imageService")
const mongoose = require("mongoose")

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
           // const me = await User.findOne({ id: req.user._id })

            const user = await User.findOne({ username }).populate("friends", "first_name last_name username picture").select("-password")
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
            await Image.create({ owner: req.user._id, url: img.url, public_id: img.public_id.split("profileImages/")[1], type: "profile" })
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
            await Image.create({ owner: req.user._id, url: img.url, public_id: img.public_id.split("profileImages/")[1], type: "cover" })
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
    },
    sendFriendRequest: async (req, res) => {
        try {
            let { id } = req.params
            id = id.match(/^[0-9a-fA-F]{24}$/) && id
            if (req.user._id !== id) {
                const sender = await User.findById(req.user._id)
                const receiver = await User.findById(id)
                if (!receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id)) {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $push: { requests: sender._id, followers: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $push: { following: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Friend request has been sent" })
                } else {
                    return res.status(500).json({ message: "Already sent!" })
                }
            } else {
                return res.status(500).json({ message: "Invalid request!" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    cancelFriendRequest: async (req, res) => {
        try {
            let { id } = req.params
            id = id.match(/^[0-9a-fA-F]{24}$/) && id
            if (req.user._id !== id) {
                const sender = await User.findById(req.user._id)
                const receiver = await User.findById(id)
                if (receiver.requests.includes(sender._id)) {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $pull: { requests: sender._id, followers: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $pull: { following: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Friend request has been cancelled" })
                } else {
                    return res.status(500).json({ message: "No request found!" })
                }
            } else {
                return res.status(500).json({ message: "Invalid request!" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    acceptFriendRequest: async (req, res) => {
        try {
            let { id } = req.params
            id = id.match(/^[0-9a-fA-F]{24}$/) && id
            if (req.user._id !== id) {
                const receiver = await User.findById(req.user._id)
                const sender = await User.findById(id)
                if (receiver.requests.includes(sender._id) &&
                    !receiver.friends.includes(sender._id)) {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $pull: { requests: sender._id },
                        $push: { friends: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $push: { friends: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Friend request has been accepted" })
                } else {
                    return res.status(500).json({ message: "No Request found!" })
                }
            } else {
                return res.status(500).json({ message: "Invalid request!" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    followUnFollow: async (req, res) => {
        try {
            let { id } = req.params
            id = id.match(/^[0-9a-fA-F]{24}$/) && id
            const sender = await User.findById(req.user._id)
            const receiver = await User.findById(id)
            if (req.user._id !== id) {
                if (!sender.following.includes(receiver._id) &&
                    !receiver.followers.includes(sender._id)) {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $push: { followers: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $push: { following: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Started to follow" })
                } else {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $pull: { followers: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $pull: { following: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Stopped  following" })
                }
            } else {
                return res.status(500).json({ message: "Invalid request!" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    unFriend: async (req, res) => {
        try {
            let { id } = req.params
            id = id.match(/^[0-9a-fA-F]{24}$/) && id
            if (req.user._id !== id) {
                const sender = await User.findById(req.user._id)
                const receiver = await User.findById(id)
                if (sender.friends.includes(receiver._id) &&
                    receiver.friends.includes(sender._id)) {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $pull: { friends: sender._id, followers: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $pull: { friends: receiver._id, following: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Removed from friend list" })
                } else {
                    return res.status(500).json({ message: "No friend found!" })
                }
            } else {
                return res.status(500).json({ message: "Invalid request!" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    followOffers: async (req, res) => {
        try {
            const myFriends = await User.find({ followers: { $in: [req.user._id] } })
            const response = myFriends.map(async () => (
                await User.findOne({ followers: { $nin: [req.user._id] } })
            ))
            const followOffers = await Promise.all(response)
            res.status(200).json({ followOffers, message: "People you may follow" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    ignoreFriendRequest: async (req, res) => {
        try {
            let { id } = req.params
            id = id.match(/^[0-9a-fA-F]{24}$/) && id
            if (req.user._id !== id) {
                const receiver = await User.findById(req.user._id)
                const sender = await User.findById(id)
                if (receiver.requests.includes(sender._id)) {
                    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
                        $pull: { requests: sender._id, followers: sender._id }
                    }, { new: true }).select("-password")

                    const updatedSender = await User.findByIdAndUpdate(sender._id, {
                        $pull: { following: receiver._id }
                    }, { new: true }).select("-password")
                    res.status(200).json({ updatedReceiver, updatedSender, message: "Removed from request list" })
                } else {
                    return res.status(500).json({ message: "No request found!" })
                }
            } else {
                return res.status(500).json({ message: "Invalid request!" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = userCtrl