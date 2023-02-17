const router = require("express").Router()
const userCtrl = require('./../controllers/userController');

router.get("/find_user_email/:email", userCtrl.findUserByEmail)

module.exports = router