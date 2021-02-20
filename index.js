//Required packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();


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
const db = async()=> {mongoose.connect("mongodb+srv://dbUser:barcelona12@cluster0.ifdd9.mongodb.net/webhunt?retryWrites=true&w=majority",
 {useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED")
})
};
db();
module.exports = db;

//My Routes
app.use("/api", authRoutes);
app.use("/api/leader",leader);
//PORT
const PORT = process.env.PORT || 3000;

//Starting a server
 app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`);
})

app.get('/', function(request, response) {
    return response.sendFile(__dirname + '/welcome.html');
});
 