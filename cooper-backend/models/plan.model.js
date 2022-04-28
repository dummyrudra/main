const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const featureSchema=new Schema({
    featureName:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    }
},{versionKey:false})


const planSchema = new Schema(
  {
    planName: {
      type: String,
      required: true
    },
    pricing:{
        planType:{
            type:String,
            enum:['month','annual'], //plan type only month or annual
            required:true
        },
        amount:{
            type:Number,
            required:true,
            min:1
        },
        features:[
            featureSchema
        ]
    },
    description: {
      type: String,
      required: true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',   //reference of user model
        required:true
    },
    isActive:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

const PlanModel = model("plan", planSchema);

module.exports = PlanModel;
