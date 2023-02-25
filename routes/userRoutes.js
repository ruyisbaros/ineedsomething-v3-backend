const router = require("express").Router()
const userCtrl = require('./../controllers/userController');
const { protect } = require("../middleware/protect")

router.get("/find_user_email/:email", userCtrl.findUserByEmail)
router.get("/get_profile/:username", protect, userCtrl.getProfile)
router.patch("/update_profile_pic", protect, userCtrl.updateProfilePicture)
router.patch("/update_cover_pic", protect, userCtrl.updateCoverPicture)
router.patch("/update_user_details", protect, userCtrl.updateUserDetails)

module.exports = router