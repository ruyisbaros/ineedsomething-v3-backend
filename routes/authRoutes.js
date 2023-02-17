const router = require("express").Router()
const authCtrl = require("../controllers/authController")
const { isUserExist } = require("../middleware/isUserExist")
const { protect } = require("../middleware/protect")
const { validateRegister, validateLogin } = require("../middleware/validChecks")


router.post("/register", validateRegister, isUserExist, authCtrl.register)
router.post("/activate_account", protect, authCtrl.activateAccount)
router.post("/resend_activate_email", protect, authCtrl.reSendActivationMail)
router.post("/login", validateLogin, authCtrl.login)
router.get("/refresh_token", authCtrl.refresh_token)
router.get("/logout", authCtrl.logout)
router.get("/send_verify_code/:email", authCtrl.sendPasswordVerificationCode)
router.get("/validate_verify_code/:code/:email", authCtrl.validatePasswordVerificationCode)
router.post("/reset_password", authCtrl.resetPassword)

module.exports = router