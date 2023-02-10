const { postCtrl } = require("../controllers/postController")

const router = require("express").Router()

router.post("/create", postCtrl.createPost)


module.exports = router