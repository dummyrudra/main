const { TaskModel } = require("../models/task.model");
const messages=require('../messages.json');

module.exports.validateTaskID=async (req,res,next)=>{

    try{
        const validateTaskID=await TaskModel.exists({_id:req.params.id})
    
        if(!validateTaskID){
             return res.status(404).send(messages.CommonAPI.TASK_NOT_FOUND)
        }
        next()
    }catch(error){
        next(error)
    }
}