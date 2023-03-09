const router = require("express").Router()
const notificationCtrl = require('./../controllers/notificationController');
const { protect } = require("../middleware/protect")

router.post("/create_notify", protect, notificationCtrl.createNotify)
router.get("/get_notifies", protect, notificationCtrl.getNotifies)
router.delete("/delete_notify/:notifyId", protect, notificationCtrl.deleteNotify)
router.patch("/update_notify/:notifyId", protect, notificationCtrl.updateNotify)

module.exports = router