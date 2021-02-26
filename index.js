//Required packages
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app =  express();
var jwt = require('jsonwebtoken');

//const auth=require("./sample");
const authRoutes = require("./routes/auth");
const leader = require("./routes/leaderboard");
//Middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(cors());
//cookies
app.use(cookieParser('null_chapter_is_the_best'));
//app.use(auth);
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


 
const maxAge = 3*24*60*60;
const createToken = (id,answered) => {
    return jwt.sign({ id, answered}, process.env.SECRET1, {
      expiresIn: maxAge
    });
  };
  
  app.get('/',function(req, res){
    res.cookie('attempt',0,{maxAge:maxAge*1000});
    return res.sendFile(__dirname + '/webhunt3.0.html');
  })

  app.get('/signin', function(req, res) {
 return res.sendFile(__dirname + '/welcome.html');

});

app.get('/question/:id',(req,res)=>{
  const token=req.cookies.jwt;
    if(req.params.id==1){

      const token1= createToken(req.params.id,0);
      res.cookie('jwt',token1,{maxAge:maxAge*1000});
      return res.sendFile(__dirname+'/question1.html');
    }
    else if(req.params.id==2){
      
      console.log("token:"+ token);
      console.log("Question 2");
      if (token) {
        jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
          if (err) {
           
            console.log(err.message);
            res.redirect('/signin');
            
          } else if(((req.params.id)>=decodedToken.id) && (decodedToken.answered==1)){
            console.log(decodedToken);
            const token1= createToken(req.params.id,1);
            res.cookie('jwt',token1,{maxAge:maxAge*1000});
            return res.sendFile(__dirname+'/question2.html');
          }
          else{
            return res.json({
              message:"Hey buddy! Not authorized"
            })
          }
        });
      } else {
        
        res.redirect('/signin');
      }
    }
    else if(req.params.id==3){
      console.log(token);
      if (token) {
        
        jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
          console.log(decodedToken);
          if (err) {
            console.log(err.message);
            res.redirect('/signin');
          } 
          
          else if(((req.params.id)>=decodedToken.id) && (decodedToken.answered==2)){
            console.log(decodedToken);
            const token1= createToken(req.params.id,2);
            res.cookie('jwt',token1,{maxAge:maxAge*1000});
            return res.sendFile(__dirname+'/question3.html');
          } 
          else{
            return res.json({
              message:"Hey buddy! Not authorized"
            })
          }
         

        });
      } else {
        res.redirect('/signin');
      }
    }
    
})


module.exports = app;