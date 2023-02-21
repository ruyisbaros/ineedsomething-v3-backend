const router = require("express").Router()
const { postCtrl } = require("../controllers/postController")
const { protect } = require("../middleware/protect")

router.post("/create", protect, postCtrl.createPost)
router.get("/getAllPosts", protect, postCtrl.getAllPosts)


module.exports = router