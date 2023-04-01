const router = require("express").Router()
const notificationCtrl = require('./../controllers/notificationController');
const { protect } = require("../middleware/protect")

//router.post("/create_notify", protect, notificationCtrl.createNotify)
router.post("/create_notify", protect, notificationCtrl.createNotify)
router.get("/get_notifies", protect, notificationCtrl.getNotifies)
router.delete("/delete_notify/:notifyId", protect, notificationCtrl.deleteNotify)
router.patch("/view_notify/:notifyId", protect, notificationCtrl.viewNotify)

module.exports = router