const User = require("../models/user");
const Questions = require("../models/questions");
const db = require("../index");
const Mongoose = require("mongoose");

//for storing questions
exports.store=async(req, res)=>{
  const question = new Questions(req.body)
    await question.save((err, question) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save question in DB"
            })
        }
        res.json({
            questionID: question.questionID,
            answer: question.answer
        });
        
    })
}

//for getting leaderboard
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
      .limit(3).sort({ Score: -1 });

};

//for validating answer
exports.validate= async(req, res)=>{
  try {
    var question = await Questions.findOne({ questionId: req.body.questionID }).exec();
    console.log(req.body.questionID);
    if(!question) {
        return res.status(400).json({message:"Question does not exist"});
    }
    user.compareAnswer(req.body.answer, (err, match) => {
        try{
        if(!match) {
            return res.status(401).json({message:"Invalid answer"});
        }
    
    }catch (err) {
        res.status(501).json({error:'internal server error'});
    }
    
    if(match && question){
    User.findOne({teamID: req.body.teamID}, function(err, user){
        if(err)return ("err");
        if(user.Score<req.body.questionID){
        user.Score=user.Score+1;
        user.save(function(err){
           if(err)return ("err");
         });
         res.json({
           message: true
         })
        
        }
       });
    }
});
} catch (error) {
    res.status(501).json({error:'internal server error'});
}
}

//for updating the score
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