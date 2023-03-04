const router = require("express").Router()
const { imageCtrl } = require("../controllers/imageController")
const { validateImage } = require("../middleware/imageUpload")
const { protect } = require("../middleware/protect")

router.post("/uploadForRegister", imageCtrl.upload)
router.post("/upload", protect, imageCtrl.upload)
router.post("/listImages", protect, imageCtrl.listImages)
router.get("/listImages2/:max", protect, imageCtrl.listImages2)



module.exports = router