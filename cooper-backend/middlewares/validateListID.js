
const messages=require('../messages.json');
const ListModel = require('../models/list.model');

//validate list ID to our model is exist or not
module.exports.validateListID=async (req,res,next)=>{

    try{
        const validateListID=await ListModel.exists({_id:req.params.id})
    
        if(!validateListID){
             return res.status(404).send(messages.CommonAPI.LIST_NOT_FOUND)
        }
        next()
    }catch(error){
        next(error)
    }
}