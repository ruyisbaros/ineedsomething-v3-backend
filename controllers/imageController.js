const cloudinary = require("cloudinary")
const { uploadToCloudinary } = require("../helpers/imageService")
const Post = require("../models/postModel")

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
}

/* -------------------HELPERS----------------- */
