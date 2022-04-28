const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const sprintSchema = new Schema(
  {
    sprintName: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "projects",   //reference of project model
      required: true,
      index:true
    },
    duration: {
      type: Number,
      default:1
    },
    startDate: {
      type: Date,
      // required: true,
    },
    endDate: {
      type: Date,
      // required: true,
    },
    sprintGoal: {
      type: String,
      // required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", //reference of user model
      required: true,
    },
    tasks:[
      { type:mongoose.Types.ObjectId,
      ref:'Task',     //reference of task model
    }
    ]
    ,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    sprintStatus:{
      type: String,
      enum:['start','complete','done'],  //only three status of sprint start,complete,done
      default:'start'
    }
  },
  { timestamps: true }
);

const SprintModel = model("Sprint", sprintSchema);

module.exports = { SprintModel, sprintSchema };
