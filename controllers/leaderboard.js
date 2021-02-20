const User = require("../models/user");
const db = require("../index");
const Mongoose = require("mongoose");
exports.leaderboard = async (req, res)=>{
    var user=Mongoose.model('User');
      await user
      .find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      })
      .limit(10).sort({ Score: -1 });

  

};

exports.updateScore=async(req, res)=>{
    let { teamID, Score } = req.body;
    
    const alreadyExisting = await db
        .collection('users')
        .findOne({ teamID: teamID });
    if (alreadyExisting) {
        
        await db
            .collection('users')
            .updateOne({ teamID }, { $set: { teamID, Score } });
        console.log(`Team ${teamID} score updated to ${Score}`);
        res.send({ status: true, msg: 'Team Score Updated' });
    } else {
        res.send({ status: false, msg: 'Team Not found' });
    }
}