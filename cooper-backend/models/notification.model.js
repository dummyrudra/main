const { array } = require("joi");
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'user',
      required: true,
    },
    message:{
      type: String,
      required: true,
    },
    subMessage: {
      type: String,
      required: true,
    },
    icon:{
       type:String,
       default:'notification.png'
    },
    notificationType: {
      type: String,
      default: "watching",
      enum: ["direct", "watching"],
    },
    recipients:[
      {
         user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"user",
         },
         isSeen:{
          type:Boolean,
          default:false
         }
      }
    ],
    url:{
      type:String,
      default:"http://192.168.1.23:4200/project-list"
    }
  },
  { timestamps: true }
);

const Notification = model("notification", notificationSchema);

module.exports = Notification;