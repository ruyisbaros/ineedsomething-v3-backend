const cloudinary = require("cloudinary")
const fs = require("fs")

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

exports.uploadToCloudinary = async (file, path) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
                folder: path,
            },
            (err, res) => {
                if (err) {
                    removeTmp(file.tempFilePath);
                    throw err
                } else {
                    removeTmp(file.tempFilePath)
                    resolve({
                        url: res.secure_url,
                    });
                }

            }
        );
    })
};

function removeTmp(url) {
    fs.unlink(url, (err) => {
        if (err) throw err
    })
}