const express = require('express');
const router = express.Router();
const userControllerFunction = require('../controller/user.controller');
const multer = require('multer');
const appError = require('../utils/appError');
const verifyToken = require('../middleware/verifyToken');
const diskStorage = multer.diskStorage({
 destination : (req , file , cb)=>{
  console.log(file);
  return cb(null , "uploads/profile")
 },
 filename : (req , file , cb)=>{
  const ext = file.mimetype.split('/')[1];
  const filename = `user-profile-${Date.now()}.${ext}`;
  cb(null , filename);
 }
})
// check file image 
const fileFilter = (req , file , cb)=>{
  const typeOfImage = file.mimetype.split('/')[0];
if (typeOfImage ==="image") {
 cb(null , true)
}else{
 cb(appError.create("file must be an image" , 400 , "fail") , false)
}
}
const upload = multer({storage : diskStorage , fileFilter})
// const verifyToken = require('../middleware/verify');

router.route('/')
.get(verifyToken,userControllerFunction.getAllUser);

router.route('/register')
.post(upload.single('profile') , userControllerFunction.register);

router.route('/login')
.post(userControllerFunction.login);

router.route('/profile/:id')
.get(userControllerFunction.profile);

router.route('/update/:id')
.patch(userControllerFunction.updateUser);

router.route('/delete/:id')
.delete(verifyToken,userControllerFunction.deleteUser);

router.route('/deleteAll')
.delete(userControllerFunction.deleteAll);


module.exports = router;
