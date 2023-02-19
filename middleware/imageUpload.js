const fs = require("fs")

exports.validateImage = async (req, res, next) => {
    if (!req.files || Object.values(req.files).flat().length === 0) {
        return res.status(400).json({ message: "No file selected!" })
    }
    let files = Object.values(req.files).flat()
    files.forEach(file => {
        if (
            file.mimetype !== "image/jpeg" &&
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/gif" &&
            file.mimetype !== "image/webp") {
            //console.log(file)
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: "Only jpeg/png/gif files allowed" })
        }
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: "File size is too large!" })
        }

        next()
    })
}

function removeTmp(url) {
    fs.unlink(url, (err) => {
        if (err) throw err
    })
}