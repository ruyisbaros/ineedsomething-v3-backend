const cloudinary = require("cloudinary")
const { uploadToCloudinary } = require("../helpers/imageService")
const PostImages = require("../models/postImagesModel")
const UserImages = require("../models/userImagesModel")

exports.imageCtrl = {
    upload: async (req, res) => {
        //console.log(req.files)
        try {
            const { path } = req.body;
            const { file } = req.files
            //console.log(file, path)
            const url = await uploadToCloudinary(file, path)
            //console.log(url)
            res.json(url);
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: error.message });
        }
    },
    listImages: async (req, res) => {
        try {
            const { path, sort, max } = req.body
            cloudinary.v2.search
                .expression(`${path}`)
                .sort_by("created_at", `${sort}`)
                .max_results(max)
                .execute()
                .then((result) => {
                    res.status(201).json(result)
                })
                .catch(e => {
                    res.status(500).json({ message: e.message });
                })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listImages2: async (req, res) => {
        try {
            const { max } = req.params
            const imageArr1 = await PostImages.find({ owner: req.user._id }).sort({ createdAt: -1 })
            const imageArr2 = await UserImages.find({ owner: req.user._id }).sort({ createdAt: -1 })
            const listImages = imageArr1.concat(imageArr2).slice(0, max)
            res.status(200).json(listImages)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

/* -------------------HELPERS----------------- */
