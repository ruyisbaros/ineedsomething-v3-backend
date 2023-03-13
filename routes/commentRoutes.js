const router = require("express").Router()
const commentCtrl = require('./../controllers/commentController');
const { protect } = require("../middleware/protect")

router.post("/add_comment", protect, commentCtrl.addComment)
router.get("/get_comments", protect, commentCtrl.getComments)
router.get("/like_unlike_comment/:commentId", protect, commentCtrl.likeUnlikeComment)
router.get("/get_post_comments/:commentPost", protect, commentCtrl.getPostComments)

module.exports = router