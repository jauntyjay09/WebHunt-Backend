var express = require('express')
var router = express.Router()

const {leaderboard,updateScore} = require("../controllers/leaderboard");



router.put("/leaderboard", updateScore);
router.get("/leaderboard", leaderboard);
module.exports = router;