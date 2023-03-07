const router = require("express").Router()
const commentCtrl = require('./../controllers/commentController');
const { protect } = require("../middleware/protect")

router.post("/add_comment", protect, commentCtrl.addComment)
router.get("/get_post_comments/:postId", protect, commentCtrl.getComment)

module.exports = router