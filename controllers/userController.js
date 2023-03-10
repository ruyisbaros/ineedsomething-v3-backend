const User = require("../models/userModel")
const { createNotify } = require('./../helpers/createNotify');
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
            console.log(user, req.user._id.toString())
            //Create notification
            if (user._id.toString() !== req.user._id.toString()) {
                await createNotify(req.user._id, user._id, `${req.user.first_name} viewed your profile`)
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
                    //Create notification
                    await createNotify(sender._id, receiver._id, `${sender.first_name} send you a friend request`)

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
                    //Create notification
                    await createNotify(receiver._id, sender._id, `${receiver.first_name} accepted your friend request`)
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
                    //Create notification
                    await createNotify(sender._id, receiver._id, `${sender.first_name} started to follow you`)
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
    },
    /* $or: [{ first_name: { $regex: regex } }, { last_name: { $regex: regex } },
         { email: { $regex: regex } }] */
    searchUsers: async (req, res) => {
        try {
            const { search } = req.params
            //let regex = new RegExp(`^[${search}0-9._-]+$`, "ig")
            const searchQuery = search.replace(/[.*+?^${}()|[]\]/g, '\$&'); // escape regexp symbols 
            const searchedUsers = await User.find({
                $or: [{ first_name: new RegExp(`${searchQuery}`, 'i') }, { last_name: new RegExp(`${searchQuery}`, 'i') },
                { email: new RegExp(`${searchQuery}`, 'i') }]
            }).limit(7);


            res.status(200).json({ searchedUsers, message: "People you searched" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    createSearchHistory: async (req, res) => {
        try {
            const { id } = req.params
            const searched = {
                user: mongoose.Types.ObjectId(id),
                createdAt: new Date()
            }
            const user = await User.findById(req.user._id)
            const check = user.search.find(x => x.user.toString() === id)
            if (check) {
                await User.updateOne({
                    _id: req.user._id,
                    "search._id": check._id
                }, {
                    $set: { "search.$.createdAt": new Date() }
                })
            } else {
                await User.findByIdAndUpdate(req.user._id, { $push: { search: searched } })
            }
            res.status(200).json({ message: "Ok" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    getSearchHistory: async (req, res) => {
        try {
            const user = await User.findById(req.user._id)
                .select("search")
                .populate("search.user", "first_name last_name picture username")
                .limit(5)
            res.status(200).json({ history: user.search, message: "Ok" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

module.exports = userCtrl