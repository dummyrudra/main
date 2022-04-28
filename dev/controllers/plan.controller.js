const PlanModel = require("../models/plan.model")
const User=require('../models/user.model')
const messages=require('../messages.json')

exports.createPlan=async (req,res,next)=>{
    try{

       const {planName,description,createdBy,planType,amount,features}=req.body
       const creator=await User.exists({_id:createdBy})
       if(!creator) return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND)
       const planCheck=await PlanModel.exists({planName,"pricing.planType":planType})
       if(planCheck) return res.status(409).send(messages.PlanAPI.PLAN_ALREADY_EXIST);

       let plan=new PlanModel({planName,description,createdBy})
       
       plan.pricing.planType=planType
       plan.pricing.amount=amount
       features.forEach((feature,index) => plan.pricing.features[index]={featureName:feature.featureName,status:feature.status}
       );
       const result=await plan.save()
       if(result){
           return res.status(201).send(result)
       }
    }catch(err){
        next(err)
    }
}

exports.getPlanById=async (req,res,next)=>{
    try{
    const plan=await PlanModel.findOne({_id:req.params.id})
    if(plan){
        return res.status(200).send(plan)
    }else{
        return res.status(404).send(messages.CommonAPI.PLAN_NOT_FOUND)
    }
  }catch(err){
     next(err)
   }
}


exports.getPlanByPlanType=async (req,res,next)=>{
    try{
    const plan=await PlanModel.find({"pricing.planType":req.params.type,isActive:true})
    if(plan.length>0){
        return res.status(200).send(plan)
    }else{ 
        return res.status(404).send(messages.CommonAPI.PLAN_NOT_FOUND)
    }
  }catch(err){
     next(err)
   }
}

exports.updatePlan=async (req,res,next)=>{
    try{
       const {description,createdBy,amount,features}=req.body
       const creator=await User.exists({_id:createdBy})
       if(!creator) return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND)

       let plan=await PlanModel.findOne({_id:req.params.id})
       plan.description=description
       plan.pricing.amount=amount
       features.forEach((feature,index) => plan.pricing.features[index]={featureName:feature.featureName,status:feature.status}
       );
       const result=await plan.save()
       if(result){
           return res.status(200).send(result)
       }
    }catch(err){
        next(err)
    }
}

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