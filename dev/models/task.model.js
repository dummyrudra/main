const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    SN: {
      type: String,
      default: "01",
    },
    projectID: {
      type: Schema.Types.ObjectId,
      ref: "projects",
      required: true,
    },
    issueType: {
      type: String,
      enum: ["task", "epic", "story", "bug"],
      required: true,
    },
    listID: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    sprint: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
      required: true,
    },
    summary: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    assigneeID: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    labels: {
      type: Array,
    },
    storyPointEstimate: {
      type: Number,
      default: null,
    },
    attachment: {
      type: Array,
    },
    activity: [
      {
        message: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        activityField:{
          type:String,
          default:null
        },
        activityType: {
          type: String,
          enum: ["comment", "history"],
          default: "history",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    subTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    watched: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    voted: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    flag: {
      type: String,
      default: null,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TaskModel = model("Task", taskSchema);

module.exports = { TaskModel, taskSchema };
