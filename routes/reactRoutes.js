const router = require("express").Router()
const reactCtrl = require('./../controllers/reactController');
const { protect } = require("../middleware/protect")

router.post("/add_react", protect, reactCtrl.addReact)
router.get("/get_post_reacts/:postId", protect, reactCtrl.getReact)

module.exports = router