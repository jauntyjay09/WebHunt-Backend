var express = require('express')
var router = express.Router()
const {signout, signup, signin} = require("../controllers/auth");

router.post("/signin",signin);
router.post("/signup", signup);
router.get("/signout",signout);

module.exports = router;