const router = require("express").Router()
const reactCtrl = require('./../controllers/reactController');
const { protect } = require("../middleware/protect")

module.exports = router