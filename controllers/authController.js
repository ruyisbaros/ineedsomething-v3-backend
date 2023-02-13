const { createJsonToken } = require("../helpers/createToken")
const { createUsername } = require("../helpers/createUserName")
const { sendNotifyEmail } = require("../helpers/emailService")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/userModel")

const authCtrl = {
    register: async (req, res) => {
        try {
            const {
                first_name,
                last_name,
                email,
                password,
                gender,
                bYear,
                bMonth,
                bDay
            } = req.body

            const user = await User.create({
                first_name,
                last_name,
                email,
                username: await createUsername(first_name, last_name),
                password,
                gender,
                bYear: Number(bYear),
                bMonth: Number(bMonth),
                bDay: Number(bDay)
            })
            const token = createJsonToken({ id: user._id.toString() }, "13d")
            const url = `${process.env.FRONT_URL}/activate/${token}`
            await sendNotifyEmail(user.email, user.first_name, url)

            res.status(200).json({ user, token })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    activateAccount: async (req, res) => {
        try {
            const { token } = req.body
            //console.log(token)
            const { id } = jwt.verify(token, process.env.JWT_ACCESS_KEY)
            if (!id) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }
            const user = await User.findOne({ _id: id })
            if (!user) {
                return res.status(401).json({ message: "No user found!" });
            }
            if (user.verified === true) {
                return res.status(400).json({ message: "This account already active" })
            } else {
                await User.findByIdAndUpdate(id, { verified: true })
            }

            res.status(201).json({ message: "Account has been activated" });
        } catch (error) {
            res.status(500).json({ message: error.message })
        }

    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(401).json({ message: `${email} email address not connected to an account!` });
            }
            const passwordCheck = await bcrypt.compare(password, user.password)
            if (!passwordCheck) {
                return res.status(500).json({ message: "Invalid credentials!" })
            }
            const token = createJsonToken({ id: user._id.toString() }, "13d")
            res.status(200).json({ user, token })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

module.exports = authCtrl