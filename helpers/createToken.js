const jwt = require("jsonwebtoken")

exports.createJsonToken = (payload, expired) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: expired
    })
}