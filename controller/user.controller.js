const middleware = require('../middleware/middlewareAsync');
const User = require('../model/user.model');
const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/gerateToken');
const cloudinary = require('../utils/cloudinary.app');

/* ================================================================================ */
const getAllUser = middleware(
 async(req,res)=>{
  const query = req.query;
  const limit = query.limit || 30;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const all = await User.find({},{"password" : false , "__v" : false}).limit(limit).skip(skip);
  return res.status(200).json({status : httpStatus.OK , data : all});
 }
);
/* ================================================================================ */
const profile = middleware(
  async (req , res ,next)=>{
    const profileUser = await User.findById({_id : req.params.id});
    if (!profileUser) {
      const error = appError.create("user not found" , 400 , httpStatus.FAIL);
      return next(error);
    }
  return res.status(201).json({status : httpStatus.SUCCESS , data : profileUser});
  }
)
/* ================================================================================ */
const register = middleware(
   async(req,res,next)=>{
const {username, email ,password , role , profile} = req.body;
const findCheckEmail = await User.findOne({email : email});
const findCheckUser = await User.findOne({username : username});

if (findCheckUser || findCheckEmail) {
       const error = appError.create("user or email is already exists" , 400 , httpStatus.FAIL);
      return next(error)
 }
  const result = await cloudinary.uploader.upload(req.file.path , {
    folder : 'user'
  });
 const hashedPassword  = await bcrypt.hash(password , 10);
 const newUser = new User({
  username,
  email,
  password: hashedPassword,
  role,
  // profile: req.file.filename
    profile : result.secure_url
 });
 // generate token
const token = await generateToken({email: newUser.email , id : newUser._id , role : newUser.role})
 newUser.token = token

  await newUser.save();
  return res.status(201).json({status : httpStatus.SUCCESS , data : newUser});
 });
/* ================================================================================ */
const login = middleware(
 async (req , res , next)=>{
  const {username , password} = req.body;
  if (!username && !password) {
   const error = appError.create("user and password are required" , 400 , httpStatus.ERROR);
      return next(error);
  }
  const user = await User.findOne({username : username});
  const matchedPassword = await bcrypt.compare(password , user.password);
  if (user && matchedPassword) {
const token = await generateToken({username: user.username , id : user._id , role : user.role})
return res.status(201).json({ status : httpStatus.SUCCESS , message : "logged in success" , token });   
  }
  else{
   const error = appError.create("user and password are not correct" , 400 , httpStatus.ERROR);
      return next(error);
  }
 }
);
/* ================================================================================ */
const updateUser = middleware(
 async(req,res,next)=>{
 const update = await User.findByIdAndUpdate({_id : req.params.id} , {$set:{...req.body}});
  if (!update) {
   const error = appError.create("user not found", 400 , httpStatus.FAIL);
    return next(error);
  } 
 return res.status(201).json({ status : httpStatus.SUCCESS , message : "updated is success" , update});
 }
);
/* ================================================================================================== */
const deleteUser = middleware(
 async(req,res , next)=>{
  const {id} = req.params;
  const del = await User.findByIdAndDelete({_id : id});
    if (!del) {
   const error = appError.create("profile not found" , 400 , httpStatus.ERROR);
      return next(error);
  }
 return res.status(201).json({ status : httpStatus.SUCCESS , message : "deleted is success"});
 }
)
/* ================================================================================================== */
const deleteAll = middleware(
  async(req , res ,next)=>{
    const delAll = await User.deleteMany();
   return res.status(200).json({status : httpStatus.OK , data : null})
  }
)
module.exports = {
 getAllUser,
 register,
 updateUser,
 deleteUser,
 login,
 profile,
 deleteAll
} 