const User = require("../models/userModel")
exports.isUserExist = async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (user) {
        return res.status(500).json({ message: `${email} email address is already in used` })
    }

    next()
}