const app = require("./index");

app.get('/sign',(req, res)=>{
   res.json({
       message:'success'
   });
});
module.exports=app;
