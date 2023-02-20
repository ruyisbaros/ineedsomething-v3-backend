const fs = require("fs")
const cloudinary = require("cloudinary")

const { uploadImage, uploads } = require("../helpers/imageService")
const Post = require("../models/postModel")
const User = require("../models/userModel")

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})


exports.imageCtrl = {
    upload: async (req, res) => {
        try {
            const { path } = req.body;
            const { file } = req.files
            const url = await uploadToCloudinary(file, path)
            res.json(url);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

/* -------------------HELPERS----------------- */
const uploadToCloudinary = async (file, path) => {
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