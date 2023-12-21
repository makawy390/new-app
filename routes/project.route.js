const express = require('express');
const router = express.Router();
const projectControllerFunc   = require('../controller/project.controller')
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const diskStorage = multer.diskStorage({
 destination : function (req , file , cb) {
  console.log("File" , file);
  cb(null , 'uploads/projects')
 },
 filename : function(req , file , cb){
  const ext = file.mimetype.split('/')[1];
  const fileName = `${file.originalname.split('.')[0]}-${Date.now()}.${ext}`;
  cb(null , fileName);
 }
});
const fileFilter = (req , file , cb)=>{
 const imageType = file.mimetype.split('/')[0];
if (imageType === 'image') {
 return cb(null , true)
}else {
 return cb("file must be  image" , false)
}
}
const upload = multer({storage : diskStorage , fileFilter })
// router to get all project
router.route('/')
.get(projectControllerFunc.getAllProject);

router.route('/view/:id')
.get(projectControllerFunc.getSingleProject);

router.route('/add_project')
.post(verifyToken , allowedTo("admin" , "manager") , upload.single('image') ,  projectControllerFunc.addNewProject);
router.route('/edit/:id')
.patch(verifyToken,allowedTo("admin" , "manager") , projectControllerFunc.updataProject);

router.route('/edit-image/:id')
.patch(verifyToken,allowedTo("admin" , "manager") , projectControllerFunc.update_image);

router.route('/delete/:id')
.delete(projectControllerFunc.deleteProject);

router.route('/deleteAll')
.delete(projectControllerFunc.deleteAll);

module.exports = router;
