var express = require('express')
var router = express.Router()

const {leaderboard,updateScore,validate,store} = require("../controllers/leaderboard");

router.post("/store",store);
router.post("/validate",validate);
router.put("/leaderboard", updateScore);
router.get("/leaderboard", leaderboard);
module.exports = router;