const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const listSchema = new Schema(
  {
    projectID: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    listName:{
          type:String,
          required:true,
    },
    tasks:[
      { 
        type:mongoose.Types.ObjectId,
        ref:'Task',
        default:[]
      }
    ]
  },
  { timestamps: true }
);
const ListModel = model("List", listSchema);

module.exports = ListModel;
