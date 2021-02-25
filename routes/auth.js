var express = require('express')
var router = express.Router();
//var app = require("../index");
//var app1= express();
var cookieParser = require('cookie-parser');
//app.use(cookieParser("null_chapter_is_the_best"));
const User = require("../models/user");
var jwt = require('jsonwebtoken');

const {signout, signup} = require("../controllers/auth");




router.post("/signup", signup);
router.get("/signout",signout);

//for signing in
router.post("/signin",async(req, res)=>{
    try {
       
        var user = await User.findOne({ teamID: req.body.teamID }).exec();

        if(!user) {
            return res.status(400).json({message:"The team does not exist"});
        }
        user.comparePassword(req.body.password, (err, match) => {
            try{
            if(!match) {
                return res.status(401).json({message:"Invalid password"});
            }
        
        }catch (err) {
            res.status(501).json({error:'internal server error'});
        }
        
        if(match && user){
        User.findOne({teamID: req.body.teamID}, function(err, user){
            if(err)return ("err");
            user.loggedIn = true;
            user.save(function(err){
               if(err)return ("err");
             });
             res.cookie('teamID', req.body.teamID,{ maxAge: 900000 });
             return res.redirect('/question/1');
            
           });
        }
    });
    } catch (error) {
        res.status(501).json({error:'internal server error'});
    }
    
});

module.exports = router;