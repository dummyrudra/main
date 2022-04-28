const Joi =require('joi')
Joi.objectId = require("joi-objectid")(Joi);

/*
validate plan before create plan
*/

exports.planValidate=(req,res,next)=>{

    const schema=Joi.object({
        planName:Joi.string().min(3).max(80).required().label('Plan Name'),
        description:Joi.string().min(10).required().label('Description'),
        createdBy:Joi.objectId().required().label('Creater'),
        planType:Joi.string().valid('month','annual').required().label('Plan Type'),
        amount:Joi.number().min(1).required().label("Amount"),
        features:Joi.array().required().label('Features')
    })

    const {error}=schema.validate(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }else{
        next()
    }
}