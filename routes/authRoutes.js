const router = require("express").Router()
const authCtrl = require("../controllers/authController")
const { isUserExist } = require("../middleware/isUserExist")
const { validateRegister } = require("../middleware/validChecks")
router.post("/register", validateRegister, isUserExist, authCtrl.register)
router.post("/activate_account", authCtrl.activateAccount)
router.post("/login", authCtrl.login)

module.exports = router