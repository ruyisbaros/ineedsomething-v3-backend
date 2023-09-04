const { createJsonToken, createReFreshToken } = require("../helpers/createToken")
const { createUsername } = require("../helpers/createUserName")
const { sendNotifyEmail, sendVerificationCodeMail } = require("../helpers/emailService")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const Code = require("../models/codeModel")
const Image = require("../models/userImagesModel")
const { createCode } = require("../helpers/createVerificationCode")
const { uploadToCloudinary } = require("../helpers/imageService")

const authCtrl = {
    register: async (req, res) => {
        try {
            const {
                first_name,
                last_name,
                email,
                picture,
                path,
                avatarColor,
                password,
                gender,
                bYear,
                bMonth,
                bDay
            } = req.body
            //console.log(req.body)
            //console.log(typeof picture)
            const img = await uploadToCloudinary(picture, path)
            //console.log(img.public_id.split("profileImages/")[1])
            const createdImg = await Image.create({ url: img.url, public_id: img.public_id.split("profileImages/")[1], type: "profile" })
            const user = await User.create({
                first_name,
                last_name,
                email,
                picture: img.url,
                avatarColor,
                username: await createUsername(first_name, last_name),
                password,
                gender,
                bYear: Number(bYear),
                bMonth: Number(bMonth),
                bDay: Number(bDay)
            })
            await Image.findByIdAndUpdate(createdImg._id, { owner: user._id })
            const token = createJsonToken({ id: user._id.toString() }, "13d")
            const refreshToken = createReFreshToken({ id: user._id.toString() }, "15d")
            const url = `${process.env.FRONT_URL}/activate/${token}`
            await sendNotifyEmail(user.email, user.first_name, url)

            req.session = {
                jwtR: refreshToken,
                jwt: token
            };

            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    activateAccount: async (req, res) => {
        try {
            const { token } = req.body
            //console.log(token)
            const { id } = jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`)
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

            res.status(201).json(user);
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
            const token = jwt.sign({ id: user?._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "13d" })
            const refreshToken = jwt.sign({ id: user?._id }, process.env.JWT_REFRESH_KEY, { expiresIn: "13d" })
            /* const token = createJsonToken({ id: user._id }, "13d") */
            /* const refreshToken = createReFreshToken({ id: user._id }, "15d") */
            //console.log("token", token, jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`))
            req.session = {
                jwtR: refreshToken,
                jwt: token
            };
            //console.log(req.session)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    refresh_token: async (req, res) => {
        try {
            //const access_token = generateAccessToken({ id: loggedUser._id })
            //console.log(req.session)
            const token = req.session?.jwtR
            console.log(req.session, token)
            if (!token) return res.status(500).json({ message: "Please login again" })
            const { id } = jwt.verify(token, `${process.env.JWT_REFRESH_KEY}`)
            if (!id) return res.status(500).json({ message: "Please login again" })

            const user = await User.findOne({ _id: id }).select("-password")
            //console.log(user)
            if (!user) return res.status(500).json({ message: "This account does not exist!" })
            //console.log(user)
            const access_token = createJsonToken({ id: user._id.toString() }, "13d")
            //console.log(req.session)
            req.session = {
                jwtR: token,
                jwt: access_token
            };

            res.status(200).json(user)
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            const token = req.session.jwtR
            //base64.decode(token).split()
            const { id } = jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`)

            await User.findByIdAndUpdate(id, { isOnline: false })
            req.session = {
                jwtR: null,
                jwt: null
            };

            return res.status(200).json({ message: "You have been logged out!" })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    sendPasswordVerificationCode: async (req, res) => {
        const { email } = req.params
        const user = await User.findOne({ email }).select("-password")
        await Code.findOneAndRemove({ user: user._id })
        const code = createCode() //creator helper function
        await Code.create({
            code,
            user: user._id
        })

        await sendVerificationCodeMail(user.email, user.first_name, code)
        res.status(200).json({ message: "Verification code has been sent to your mail!" })
    },
    validatePasswordVerificationCode: async (req, res) => {
        const { code, email } = req.params
        const user = await User.findOne({ email }).select("-password")
        const dbCode = await Code.findOne({ user: user._id })
        if (code !== dbCode.code) {
            return res.status(403).json({ message: "Invalid credentials" })
        }
        res.status(200).json({ message: "All right! Just define your new password" })
    },
    resetPassword: async (req, res) => {
        const { password, email } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.findOneAndUpdate({ email }, { password: hashedPassword })
        res.status(200).json({ message: "All right! You can login with your new password" })
    },
    changePassword: async (req, res) => {
        const { email, newPassword, oldPassword } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: `${email} email address not connected to an account!` });
        }
        const passwordCheck = await bcrypt.compare(oldPassword, user.password)
        if (!passwordCheck) {
            return res.status(500).json({ message: "Invalid credentials!" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await User.findOneAndUpdate({ email: user.email }, { password: hashedPassword })
        res.status(200).json({ message: "All right! Your new password is active now" })
    }

}

module.exports = authCtrl