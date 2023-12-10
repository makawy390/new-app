const mongoose = require('mongoose');
const url = process.env.MONGO_DB_URL;
const connection_DB =  mongoose.connect(url).then(()=>{
  console.log("connection to data base is successed");
 console.log("=================================================");
 });

module.exports = connection_DB;