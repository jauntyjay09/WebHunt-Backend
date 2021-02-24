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



exports.signout = (req, res)=>{
    res.json({
        message:"User is signedout"
    });
};