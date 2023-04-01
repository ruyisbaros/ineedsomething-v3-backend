const React = require("../models/reactModel")
const User = require("../models/userModel")
const mongoose = require("mongoose")


const reactCtrl = {
    addReact: async (req, res) => {
        const { react, postId } = req.body
        try {
            //User has any react on relevant post?
            const check = await React.findOne({
                postRef: postId,
                reactBy: mongoose.Types.ObjectId(req.user._id)
            })
            if (check === null) {
                await React.create({
                    react,
                    postRef: postId,
                    reactBy: req.user._id
                })
            } else {
                //users new react is same with existing?
                if (check.react === react) {
                    await React.findByIdAndDelete(check._id)
                }
                //user has react but this is different
                else {
                    await React.findByIdAndUpdate(check._id, { react })
                }
            }

            res.status(200).json({ message: "ok" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getReact: async (req, res) => {
        const { postId } = req.params
        try {
            const reacts = await React.find({ postRef: postId })
            //const check = reacts.find(rct => rct.reactBy.toString() === req.user._id)
            const groupReacts = reacts.reduce((group, item) => {
                let key = item.react
                group[key] = group[key] || []
                group[key].push(item)
                return group
            }, {})
            const returnedReacts = [
                {
                    react: "like",
                    count: groupReacts.like ? groupReacts.like.length : 0
                },
                {
                    react: "love",
                    count: groupReacts.love ? groupReacts.love.length : 0
                },
                {
                    react: "haha",
                    count: groupReacts.haha ? groupReacts.haha.length : 0
                },
                {
                    react: "sad",
                    count: groupReacts.sad ? groupReacts.sad.length : 0
                },
                {
                    react: "wow",
                    count: groupReacts.wow ? groupReacts.wow.length : 0
                },
                {
                    react: "angry",
                    count: groupReacts.angry ? groupReacts.angry.length : 0
                },
            ].sort((a, b) => b.count - a.count)
            const user = await User.findById(req.user._id)
            const checkSaved = user.savedPosts.find(item => item.post.toString() === postId)
            //console.log(checkSaved)
            const check = await React.findOne({
                postRef: postId,
                reactBy: mongoose.Types.ObjectId(req.user._id)
            })
            res.status(200).json({
                reacts: returnedReacts,
                check,
                total: reacts.length,
                checkSaved: checkSaved ? true : false
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = reactCtrl