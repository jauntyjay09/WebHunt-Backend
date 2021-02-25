//Required packages
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app =  express();
var jwt = require('jsonwebtoken');

//const sign=require("./sample");
const authRoutes = require("./routes/auth");
const leader = require("./routes/leaderboard");
//Middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//cookies
app.use(cookieParser('null_chapter_is_the_best'));

//db connection
const db = async()=> {mongoose.connect(process.env.DATABASE,
 {useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED")
})
};
db();


//My Routes
app.use("/api", authRoutes);
app.use("/api/leader",leader);
//app.use("/sign",sign);
//PORT
const PORT = process.env.PORT || 3000;

//Starting a server
 app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`);
})

app.get('/', function(request, response) {
    return response.sendFile(__dirname + '/welcome.html');
});
 
const maxAge = 3*24*60*60;
const createToken = (id,answered) => {
    return jwt.sign({ id, answered}, process.env.SECRET1, {
      expiresIn: maxAge
    });
  };

app.get('/question/:id',(req,res)=>{
    const token=req.cookies.jwt;
    if(req.params.id==1){

      const token1= createToken(req.params.id,0);
      res.cookie('jwt',token1,{maxAge:maxAge*1000});
      return res.sendFile(__dirname+'/question1.html');
    }
    if(req.params.id==2){
      if (token) {
        jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            res.redirect('/');
          } else if(((req.params.id-1)==decodedToken.id) && (decodedToken.answered==1)){
            console.log(decodedToken);
            const token1= createToken(req.params.id);
            res.cookie('jwt',token1,{maxAge:maxAge*1000});
            return res.sendFile(__dirname+'/question2.html');
          }
        });
      } else {
        res.redirect('/');
      }
     
      //return res.sendFile(__dirname+'/question2.html');
    }
    /*else if(req.params.id==2){
    if (token) {
        jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            res.redirect('/');
          } else if((req.params.id-1)==decodedToken.id){
            console.log(decodedToken);
            return res.sendFile(__dirname+'/question2.html');
          }
        });
      } else {
        res.redirect('/');
      }
    
    }  
    else if(req.params.id==3){
        if (token) {
            jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
              if (err) {
                console.log(err.message);
                res.redirect('/');
              } else if((req.params.id-1)==decodedToken.id){
                console.log(decodedToken);
                return res.sendFile(__dirname+'/question3.html');
              }
            });
          } else {
            res.redirect('/');
          }
        
        }  
        */
})


module.exports = app;