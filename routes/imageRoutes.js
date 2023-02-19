const router = require("express").Router()
const { imageCtrl } = require("../controllers/imageController")
const { validateImage } = require("../middleware/imageUpload")
const { protect } = require("../middleware/protect")

router.post("/upload", validateImage, imageCtrl.upload)


module.exports = router