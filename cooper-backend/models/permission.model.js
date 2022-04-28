const { object } = require("joi");
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// const permissionSchema = new Schema(
//   {
//     permissionName: {
//       type: String,
//       required: true,
//       minlength: 3,
//       maxlength: 255,
//     },
//     action: {
//       type: String,
//       required: true,
//       minlength: 3,
//       enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     },
//     organization: {
//       type: mongoose.Types.ObjectId,
//       ref: "organization",
//     },
//     tenant: {
//       type: mongoose.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );


const permissionSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref:'role'  //reference of role model 
    },
    // ----- Create/Delete/Update/Export/Import Project
    project:{
      type:Object,
      default:{create:false,update:false,deleted:false,read:true}
    },
    epic:{
      type:Object,
      default:{create:false,update:false,deleted:false,read:false}
    },
    stories:{
      type:Object,
      default:{create:false,update:false,deleted:false,read:false}
    },
    task:{
      type:Object,
      default:{create:false,update:false,deleted:false,read:false}
    },
    user:{
      type:Object,
      default:{create:false,update:false,deleted:false,read:false}
    },
    assignProjectLead:{
      type:Boolean,
      default:false
    },
    assignProjectTask:{
      type:Boolean,
      default:false
    },
    projectList:{
      type:Boolean,
      default:true
    },
    revokeMember:{
      type:Boolean,
      default:true
    },
    moveTask:{
      type:Boolean,
      default:true
    },
    assignRole: {
      type: Boolean,
      default: false,
    },  
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PermissionModel = model("permission", permissionSchema);

module.exports = { PermissionModel, permissionSchema };
