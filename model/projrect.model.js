const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
 title : {
  type : String,
  required : true,
 },
 image : {
  type : String,
  default : 'uploads/projects/movies.png'
 },
 repo_link:{
    type : String,
  required : true,
 },
 demo_link :{
    type : String,
  required : true,
 },
 technolgies :{
    type : String,
  required : true,
 }
},{timestamps : true});

module.exports = mongoose.model("project" , projectSchema);
