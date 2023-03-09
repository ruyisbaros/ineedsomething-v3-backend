const Notification = require("../models/notificationModel")

exports.createNotify = async (from, to, content) => {

    await Notification.create({
        from, to, content
    })
}