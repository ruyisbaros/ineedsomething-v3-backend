const { createJsonToken, createReFreshToken } = require("../helpers/createToken")
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
            const refreshToken = createReFreshToken({ id: user._id.toString() }, "15d")
            const url = `${process.env.FRONT_URL}/activate/${token}`
            await sendNotifyEmail(user.email, user.first_name, url)

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                path: "/api/v3/auth/refresh_token",
                maxAge: 15 * 24 * 60 * 60 * 1000 //15 days
            })

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
            let user = await User.findOne({ _id: id })
            //Same computer can be used by more people
            if (user.email !== req.user.email) {
                return res.status(401).json({ message: "Opppsss! 2 users on same computer case!" });
            }
            if (!user) {
                return res.status(401).json({ message: "No user found!" });
            }
            if (user.verified === true) {
                return res.status(400).json({ message: "This account already active" })
            } else {
                user = await User.findByIdAndUpdate(id, { verified: true }, { new: true })
            }

            res.status(201).json({ user, token });
        } catch (error) {
            res.status(500).json({ message: error.message })
        }

    },
    reSendActivationMail: async (req, res) => {
        try {
            const id = req.user._id
            let user = await User.findOne({ _id: id })
            if (!user) {
                return res.status(401).json({ message: "No user found!" });
            }
            if (user.verified === true) {
                return res.status(400).json({ message: "This account already active" })
            }
            const token = createJsonToken({ id: user._id.toString() }, "13d")
            const url = `${process.env.FRONT_URL}/activate/${token}`
            await sendNotifyEmail(user.email, user.first_name, url)
            res.status(200).json({ message: "Activation mail has been resent!" })
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
            const refreshToken = createReFreshToken({ id: user._id.toString() }, "15d")
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                path: "/api/v3/auth/refresh_token",
                maxAge: 15 * 24 * 60 * 60 * 1000 //15 days
            })
            res.status(200).json({ user, token })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    refresh_token: async (req, res) => {
        try {
            //const access_token = generateAccessToken({ id: loggedUser._id })
            const token = req.cookies.refresh_token
            //console.log(token)
            if (!token) return res.status(500).json({ message: "Please login again" })
            const { id } = jwt.verify(token, process.env.JWT_REFRESH_KEY)
            if (!id) return res.status(500).json({ message: "Please login again" })

            const user = await User.findOne({ _id: id }).select("-password")
            if (!user) return res.status(500).json({ message: "This account does not exist!" })
            //console.log(user)
            const access_token = createJsonToken({ id: user._id.toString() }, "13d")

            res.status(200).json({ token: access_token, user })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refresh_token", { path: "/api/v3/auth/refresh_token" })
            return res.status(200).json({ message: "You have been logged out!" })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },

}

module.exports = authCtrl