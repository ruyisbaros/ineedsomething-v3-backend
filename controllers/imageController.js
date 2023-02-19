const fs = require("fs")
const { uploadImage } = require("../helpers/imageService")
const Post = require("../models/postModel")
const User = require("../models/userModel")



exports.imageCtrl = {
    upload: async (req, res) => {
        try {
            const { path } = req.body
            const files = Object.values(req.files).flat()
            let images = []
            for (const file of files) {
                const url = await uploadImage(file, path)
                images.push(url)
                removeTmp(file.tempFilePath)
            }
            res.json(images)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

/* -------------------HELPERS----------------- */

function removeTmp(url) {
    fs.unlink(url, (err) => {
        if (err) throw err
    })
}