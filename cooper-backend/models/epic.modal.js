const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const epicSchema = new Schema(
  {
    SN: {
      type: String,
      default: "01",
    },
    projectID: {
      type: mongoose.Types.ObjectId,
      ref: "projects", //reference of project model
      required: true,
    },
    epicColor: {
      type: String,
      default: "grey",
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    attachments: {
      type: Array,
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task", //reference of task model
      },
    ],
    activity: [
      {
        message: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "user", //reference of user model
          required: true,
        },
        activityField: {
          type: String,
          default: null,
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
    listID: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },

    assigneeID: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    labels: {
      type: Array,
    },
    startDate: {
      type: Date,
      // required: true,
    },
    dueDate: {
      type: Date,
      // required: true,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "user",
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

const EpicModel = model("epic", epicSchema);

module.exports = { EpicModel, epicSchema };
