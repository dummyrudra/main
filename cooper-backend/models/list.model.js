const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const listSchema = new Schema(
  {
    projectID: {
      type: mongoose.Types.ObjectId,
      ref: "projects", //reference of Project model
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task", //reference of Task model
        default: [],
      },
    ],
    listColor: {
      type: String,
      deafult: "#8f4dd3",
    },
  },
  { timestamps: true }
);
const ListModel = model("List", listSchema);

module.exports = ListModel;
