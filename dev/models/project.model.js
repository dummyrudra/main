const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required:true
    },
    key: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    projectType: {
      type: String
    },
    projectPrivacy:{
      type: String,
      enum:['public','private'],    //only admin can read this project
      default:'public'
    },
    projectLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avatar: {
      type: String,
      default: "default_avatar.png",
    },
    description: {
      type: String,
    },
    members:[
      {
        user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'user'
        },
        isAccepted:{
          type:Boolean,
          default:true
        }
      }
    ],
    isTrashed:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports.ProjectModel = mongoose.model("projects", projectSchema);

module.exports.projectSchema = projectSchema;
