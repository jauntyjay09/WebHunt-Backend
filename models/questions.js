var mongoose = require("mongoose");
const crypto = reqire('crypto');
const uuidv1 = require('uuid/v1');
  var questionSchema = new mongoose.Schema({
   questionId:{
       type: Number,
       required: true,
       maxlength: 32,
       trim: true
   },
   
   answer: {
       type: String
       
   }
});
module.exports = mongoose.model("Questions",questionSchema);