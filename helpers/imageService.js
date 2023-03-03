const cloudinary = require("cloudinary")
const fs = require("fs")

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

exports.uploadToCloudinary = (file, path) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(
            file,
            {
                folder: path,
            },
            (err, res) => {
                if (err) {
                    console.log(err)
                    throw err
                } else {

                    resolve({
                        url: res.url,
                        public_id: res.public_id,
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