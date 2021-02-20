const User = require("../models/user");
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