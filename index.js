// 1) require dotenv
require('dotenv').config();
// 2) import express js
const express = require('express');
// 3) import httpStatus
const httpStatus = require('./utils/httpStatus');
// 4) app to express
const app = express();
// 5) import cors
const cors = require('cors');
// 6) app to express json
const path = require('path');
// routes with uploads
app.use('/uploads/' , express.static(path.join(__dirname,'uploads')));
app.use(express.json());
// 7) import db
require('./db/connent.db');
app.use(cors());
// 8) import Router Projects Api
const projectRouter = require('./routes/project.route');
app.use('api/projects' , projectRouter);
// 9) import Router User Api
const userRouter = require('./routes/user.route');
app.use('api/users' , userRouter );
// 10) import any Api Error
app.all('*', (req, res, next) => {
   return res.status(404).json({status : httpStatus.ERROR , message : httpStatus.MESSAGE });
   next();
});
// 11) middel ware error
app.use((error , req , res , next)=>{
  return res.status(error.statusCode || 500).json({status : error.statusText , message : error.message 
        , code:  error.statusCode });
});
// db();
const port = process.env.PORT;
app.listen(port , ()=>{
 console.log("=================================================");
 console.log(`server is connect in port :${port}`);
  console.log("=================================================");
});