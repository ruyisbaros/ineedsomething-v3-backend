const cloudinary = require("cloudinary")
const fs = require("fs")

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

exports.uploadImage = async (file, path) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { folder: path },
            (err, response) => {
                if (err) {
                    removeTmp(file)
                    resolve(err)
                }
                resolve({
                    url: response.secure_url
                })
            })
    })
}
exports.removeImage = async () => { }

function removeTmp(url) {
    fs.unlink(url, (err) => {
        if (err) throw err
    })
}