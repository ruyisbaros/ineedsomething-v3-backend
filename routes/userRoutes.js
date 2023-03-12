const router = require("express").Router()
const userCtrl = require('./../controllers/userController');
const { protect } = require("../middleware/protect")

router.get("/find_user_email/:email", userCtrl.findUserByEmail)
router.get("/get_profile/:username", protect, userCtrl.getProfile)
router.get("/follow_offers", protect, userCtrl.followOffers)
router.get("/user_friends_info", protect, userCtrl.getFriendsInfo)
router.get("/search_users/:search", protect, userCtrl.searchUsers)
router.get("/get_search_history", protect, userCtrl.getSearchHistory)
router.patch("/add_search_history/:id", protect, userCtrl.createSearchHistory)
router.patch("/delete_search_history/:id", protect, userCtrl.deleteFromSearchHistory)
router.patch("/update_profile_pic", protect, userCtrl.updateProfilePicture)
router.patch("/update_cover_pic", protect, userCtrl.updateCoverPicture)
router.patch("/update_user_details", protect, userCtrl.updateUserDetails)
router.patch("/send_friend_request/:id", protect, userCtrl.sendFriendRequest)
router.patch("/cancel_friend_request/:id", protect, userCtrl.cancelFriendRequest)
router.patch("/accept_friend_request/:id", protect, userCtrl.acceptFriendRequest)
router.patch("/follow_un_follow/:id", protect, userCtrl.followUnFollow)
router.patch("/un_friend/:id", protect, userCtrl.unFriend)
router.patch("/delete_friend_request/:id", protect, userCtrl.ignoreFriendRequest)

module.exports = router