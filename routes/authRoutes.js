const router = require("express").Router()
const authCtrl = require("../controllers/authController")
const { isUserExist } = require("../middleware/isUserExist")
const { protect } = require("../middleware/protect")
const { validateRegister, validateLogin } = require("../middleware/validChecks")


router.post("/register", validateRegister, isUserExist, authCtrl.register)
router.post("/activate_account", protect, authCtrl.activateAccount)
router.post("/login", validateLogin, authCtrl.login)

module.exports = router