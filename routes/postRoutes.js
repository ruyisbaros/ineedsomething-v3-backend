const router = require("express").Router()
const { postCtrl } = require("../controllers/postController")
const { protect } = require("../middleware/protect")

router.post("/create", protect, postCtrl.createPost)
router.delete("/delete_post/:postId/:email", protect, postCtrl.deleteAPost)
router.get("/save_post/:postId", protect, postCtrl.saveAPost)
router.get("/getAllPosts", protect, postCtrl.getAllPosts)


module.exports = router