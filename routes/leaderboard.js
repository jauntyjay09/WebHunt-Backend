var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt=require('express-jwt');
//var popup=require('popups');

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

//token creation method
const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET1, {
      expiresIn: maxAge
    });
  };



//for validating answer
router.post("/validate/:id", async(req, res)=>{
    try {
        var team = await User.findOne({ teamID: req.cookies['teamID']}).exec();
        
        //checking if team exists
        
        if(team){
            console.log(req.params.id);
            var question = await Questions.findOne({ questionId: req.params.id }).exec();
           
      
      if(!question) {
          return res.status(400).json({message:"Question does not exist"});
      }
     question.compareAnswer(req.body.answer, (err, match) => {
          try{
          if(!match) {
            return res.json({
                message:'wrong answer'
            })
             /*return res.send(popup.alert({
                 content:'Wrong Answer :( Hunter. Try Again'
             }));
             */
              }
            }catch (err) {
          res.status(501).json({error:'internal server error'});
      }
     
      if(match && question){
      User.findOne({teamID: req.cookies['teamID']}, function(err, user){
          if(err) return ("err");
     
          
          //user.Score=user.Score+1;
          user.save(function(err){
             if(err) return ("err");
           });

           //creating token
           const token1 = createToken(req.params.id);
              res.cookie('jwt',token1,{maxAge: maxAge * 1000});
           
          const token=req.cookies.jwt;

           // check json web token exists & is verified
           if(req.params.id==1){
           res.redirect('/question2');

        }  else if(req.params.id==2){
           res.redirect('/question3');
 
         }
          else if(req.params.id==3){
            if (token) {
              jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
                if (err) {
                  console.log(err.message);
                  res.redirect('/');
                } else {
                  console.log(decodedToken);
                  res.sendFile(__dirname + '/question4.html');
                }
              });
            } else {
              res.redirect('/');
            }
 
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