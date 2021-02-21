const User = require("../models/user");
const express = require('express');
const app = express();

var cookieParser = require('cookie-parser');
app.use(cookieParser('null_chapter_is_the_best'));

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

exports.signin = async(req, res)=>{
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
            user.loggedin = true;
            user.save(function(err){
               if(err)return ("err");
             });
             res.cookie('teamID', req.body.teamID,{ maxAge: 900000,secure:true, httpOnly: true });
             
            return res.sendFile(__dirname + '/glitch.html');
           });
        }
    });
    } catch (error) {
        response.status(501).json({error:'internal server error'});
    }
    
}
  

exports.signout = (req, res)=>{
    res.json({
        message:"User is signedout"
    });
};