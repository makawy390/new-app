const Project = require('../model/projrect.model');
const middleWareAsync = require('../middleware/middlewareAsync');
const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary.app');
/* ============================================================================== */
// Get All Projects
const getAllProject = middleWareAsync(
 async(req , res) =>{
  const query = req.query;
  const limit = query.limit || 25;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const all = await Project.find({},{"__v" : false}).limit(limit).skip(skip);
  return res.status(201).json({status : httpStatus.OK , data : all});
 } 
)
/* ============================================================================== */
// Get Single Project From id
const getSingleProject = middleWareAsync(
 async (req , res ,next)=>{
  const {id} = req.params;
  const findProject = await Project.findById({_id : id });
  if (!findProject) {
     const error = appError.create("project not found", 400 , httpStatus.FAIL);
    return next(error);
  }
   return res.status(201).json({status : httpStatus.SUCCESS , data : findProject})
 }
)
/* ============================================================================== */
// Add New Project
const addNewProject = middleWareAsync(
 async (req, res , next )=>{
  const {title , repo_link , demo_link , technolgies} = req.body;
  const result = await cloudinary.uploader.upload(req.file.path , {
    folder : 'portfolio'
  });
  const newProject = await new Project({
    title,
    repo_link,
    demo_link,
    technolgies,
    image : result.secure_url
  });
    await newProject.save();
  if (!newProject) {
  const error = appError.create("feild is required", 400 , httpStatus.FAIL);
    return next(error);
  }
   return res.status(201).json({status : httpStatus.SUCCESS , data : newProject});
 }
);
/* ============================================================================== */
// Update Project
const updataProject = middleWareAsync(
  async(req,res,next)=>{
    const {id} = req.params;
    const {title , repo_link , demo_link , technolgies} = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const updata = await Project.findByIdAndUpdate({_id :id} , {$set:{...req.body}});
    if (!updata) {
    const error = appError.create("project not found", 400 , httpStatus.FAIL);
    return next(error);
    }
   return res.status(201).json({status : httpStatus.SUCCESS , message : "update is successed"})
  }
)
/* ============================================================================== */
// Delete one Project 
const deleteProject = middleWareAsync(
  async(req,res,next)=>{
     const {id} = req.params;
     const del = await Project.findByIdAndDelete({_id : id});
    if (!del) {
    const error = appError.create("project not found", 400 , httpStatus.FAIL);
    return next(error);
    }
   return res.status(200).json({status : httpStatus.OK , data : null})
  }
)
const deleteAll = middleWareAsync(
  async(req , res ,next)=>{
    const delAll = await Project.deleteMany();
   return res.status(200).json({status : httpStatus.OK , data : null})
  }
)
/* ============================================================================== */
module.exports = {
 getAllProject ,
 getSingleProject,
 addNewProject,
 updataProject,
 deleteProject,
 deleteAll
}
