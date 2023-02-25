const router = require("express").Router()
const { imageCtrl } = require("../controllers/imageController")
const { validateImage } = require("../middleware/imageUpload")
const { protect } = require("../middleware/protect")

router.post("/upload", protect, validateImage, imageCtrl.upload)
router.post("/listImages", protect, imageCtrl.listImages)



module.exports = router