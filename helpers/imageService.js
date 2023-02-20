const cloudinary = require("cloudinary")


cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

exports.uploads = async (file, path) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: path
        })
    });
}
exports.removeImage = async () => { }

function removeTmp(url) {
    fs.unlink(url, (err) => {
        if (err) throw err
    })
}