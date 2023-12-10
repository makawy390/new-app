const mongoose = require("mongoose");
const validator = require('validator');
const userSchema = new mongoose.Schema({
 username : {
  type : String,
  required : true,
 },
  email : {
  type : String,
  required : true,
  unique : true,
  validate : [validator.isEmail , "valid email"]
 },
 password :{
    type : String,
  required : true,
 },
 role : {
  type : String,
  enum : ["user" , "admin" , "manager"],
  default : "user",
 },
  profile : {
  type : String,
  default : 'uploads/profile/user.png'
 },
 token : {
  type : String,
  
 }
},{timestamps : true})

module.exports = mongoose.model("authation" , userSchema);