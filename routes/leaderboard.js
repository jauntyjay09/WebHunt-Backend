var express = require('express');
var router = express.Router();
var popup=require('popups');

const app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser('null_chapter_is_the_best'));
const User = require("../models/user");
const Questions = require("../models/questions");
const {leaderboard,updateScore,store} = require("../controllers/leaderboard");
//const popup=require('node-popup');
//for storing questions
router.post("/store",store);

//for updating score
router.put("/updateScore", updateScore);
//for displaying leaderboard
router.get("/leaderboard", leaderboard);


//for validating answer
router.post("/validate/:id", async(req, res)=>{
    try {
        var team = await User.findOne({ teamID: req.cookies['teamID']}).exec();
        console.log(req.cookies['teamID']);
        //checking if team exists
        console.log(team);
        if(team){
            console.log("working");
            console.log(req.params.id);
            var question = await Questions.findOne({ questionId: req.params.id }).exec();
           console.log(question);
      
      if(!question) {
          return res.status(400).json({message:"Question does not exist"});
      }
     question.compareAnswer(req.body.answer, (err, match) => {
          try{
          if(!match) {
             return res.send(popup.alert({
                 content:'Wrong Answer :( Hunter. Try Again'
             }));
              }
            }catch (err) {
          res.status(501).json({error:'internal server error'});
      }
      
      if(match && question){
      User.findOne({teamID: req.cookies['teamID']}, function(err, user){
          if(err)return ("err");
          if(user.Score<req.params.id){
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
  } 
  else{
      res.status(404).json({error:'try logging in again'});
  }
        }
        catch (error) {
            res.status(501).json({error:'internal server error'});
        }
  });
module.exports = router;