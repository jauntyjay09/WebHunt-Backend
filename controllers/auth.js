const User = require("../models/user");
const express = require('express');
const app = express();

var cookieParser = require('cookie-parser');
//app.use(cookieParser("null_chapter_is_the_best"));

exports.signup= async(req, res)=>{
    const user = new User(req.body)
    await user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            teamID: user.teamID,
            id: user._id,
            score: user.Score
        });
        
    })
};



exports.signout = async(req, res)=>{
    try {
       
        var user = await User.findOne({ teamID: req.cookies.teamID }).exec();

        if(!user) {
            return res.status(400).json({message:"The team does not exist"});
        }
        else{
            user.loggedin=false;
            user.save(function(err){
                if(err)return ("err");
              });

            return res.redirect('/signin');
        }
    } catch(error) {
        res.status(501).json({error:'internal server error'});
    }

    
    
};