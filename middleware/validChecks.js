const { validateEmail, validateLength } = require("../helpers/validation")

exports.validateRegister = async (req, res, next) => {
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

    if (!first_name) {
        return res.status(500).json({ message: "First name is required!" })
    } else if (!validateLength(first_name, 3, 30)) {
        return res.status(500).json({ message: "First name must be between 3-30 chars!" })
    }

    if (!last_name) {
        return res.status(500).json({ message: "Last name is required" })
    } else if (!validateLength(last_name, 3, 30)) {
        return res.status(500).json({ message: "Last name must be between 3-30 chars!" })
    }

    if (!email) {
        return res.status(500).json({ message: "Email is required" })
    } else if (!validateEmail(email)) {
        return res.status(500).json({ message: "invalid email" })
    }
    if (!password) {
        return res.status(500).json({ message: "Password is required" })
    } else if (password.length < 6) {
        return res.status(500).json({ message: "Password must be minimum 6 chars!" })
    }
    if (!gender) {
        return res.status(500).json({ message: "Gender is required" })
    }
    if (!bYear) {
        return res.status(500).json({ message: "Birth of year is required" })
    }
    if (!bDay) {
        return res.status(500).json({ message: "Birth of day is required" })
    }
    if (!bMonth) {
        return res.status(500).json({ message: "Birth of moth required" })
    }

    next()
}

exports.validateLogin = async (req, res, next) => {

}