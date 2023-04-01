const Notification = require("../models/notificationModel")

const notificationCtrl = {
    createNotify: async (req, res) => {
        const { from, to, content, url } = req.body
        try {
            const not = await Notification.create({
                from, to, content
            })
            const returnNot = await Notification.findById(not._id).populate("from", "first_name last_name email picture username")
            res.status(200).json(returnNot)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    deleteNotify: async (req, res) => {
        try {
            const { notifyId } = req.params
            await Notification.findByIdAndDelete(notifyId)
            res.status(200).json({ message: "Notification has been deleted successfully" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    viewNotify: async (req, res) => {
        try {
            const { notifyId } = req.params
            await Notification.findByIdAndUpdate(notifyId, { read: true })
            res.status(200).json({ message: "ok" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifications = await Notification.find({ to: req.user._id }).populate("from", "first_name last_name email picture username").sort({ createdAt: -1 })
            res.status(200).json(notifications)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

module.exports = notificationCtrl