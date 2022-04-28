const PlanModel = require("../models/plan.model")
const User=require('../models/user.model')
const messages=require('../messages.json')


//create new plan
exports.createPlan=async (req,res,next)=>{
    try{

       const {planName,description,createdBy,planType,amount,features}=req.body
       const creator=await User.exists({_id:createdBy})
       //check creator is exist in user model or not
       if(!creator) return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND)
       const planCheck=await PlanModel.exists({planName,"pricing.planType":planType})
       //check plan name and plan type is already taken or not
       if(planCheck) return res.status(409).send(messages.PlanAPI.PLAN_ALREADY_EXIST);
       //set planname,description
       let plan=new PlanModel({planName,description,createdBy})
       
       plan.pricing.planType=planType
       plan.pricing.amount=amount
       //push every features
       features.forEach((feature,index) => plan.pricing.features[index]={featureName:feature.featureName,status:feature.status}
       );
       //save plan 
       const result=await plan.save()
       if(result){
           return res.status(201).send(result)
       }
    }catch(err){
        next(err)
    }
}
//get plan by plan ID
exports.getPlanById=async (req,res,next)=>{
    try{
    const plan=await PlanModel.findOne({_id:req.params.id})
    if(plan){
        //send plan information to client 
        return res.status(200).send(plan)
    }else{
        return res.status(404).send(messages.CommonAPI.PLAN_NOT_FOUND)
    }
  }catch(err){
     next(err)
   }
}

//get plan by plan type in /planType
exports.getPlanByPlanType=async (req,res,next)=>{
    try{
    const plan=await PlanModel.find({"pricing.planType":req.params.type,isActive:true})
    //check plan is exist on this plan type
    if(plan.length>0){
        return res.status(200).send(plan)
    }else{ 
        return res.status(404).send(messages.CommonAPI.PLAN_NOT_FOUND)
    }
  }catch(err){
     next(err)
   }
}
//update plan description amount and features
exports.updatePlan=async (req,res,next)=>{
    try{
       //in plan model update only description,amount,features
       const {description,createdBy,amount,features}=req.body
       const creator=await User.exists({_id:createdBy})
       //check creator exist or not
       if(!creator) return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND)
       //set plan description,amount,features
       let plan=await PlanModel.findOne({_id:req.params.id})
       plan.description=description
       plan.pricing.amount=amount
       features.forEach((feature,index) => plan.pricing.features[index]={featureName:feature.featureName,status:feature.status}
       );
       //save data
       const result=await plan.save()
       if(result){
           return res.status(200).send(result)
       }
    }catch(err){
        next(err)
    }
}
//delete plan through plan ID
exports.deletePlanById=async (req,res,next)=>{
    try{
    const plan=await PlanModel.findOneAndDelete({_id:req.params.id})
    if(plan){
        return res.status(200).send(plan)
    }else{
        return res.status(404).send(messages.CommonAPI.PLAN_NOT_FOUND)
    }
  }catch(err){
     next(err)
   }
}