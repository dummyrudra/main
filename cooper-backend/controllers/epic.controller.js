const { EpicModel } = require("../models/epic.modal");
const { TaskModel } = require("../models/task.model");
const messages = require("../messages.json");
const User = require("../models/user.model");
const { ProjectModel } = require("../models/project.model");
const { SprintModel } = require("../models/sprint.model");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const ListModel = require("../models/list.model");
const isProjectMember = require("../services/isProjectMember");
const msg = require("../services/role.message");
// const {io} = require("../app");

//delete attachment
function deleteAttachment(req) {
  if (req.files) {
    req.files.forEach((file) => {
      fs.unlink(
        path.join(__dirname, "../public/upload/attachment/" + file.filename),
        (err) => {
          if (err) {
          }
        }
      );
    });
  }
}
//create new epic
const createEpic = async (permissions, req, res, next) => {
  try {
    //check permission to create epic
    if (!permissions.task.create)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    if (!(await isProjectMember(req.body.projectID, req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    let {
      projectID,
      epicColor,
      summary,
      description,
      listID,
      assigneeID,
      labels,
      startDate,
      dueDate,
    } = req.body;

    const project = await ProjectModel.findOne({
      _id: projectID,
      isTrashed: false,
    });

    if (!project) {
      deleteAttachment(req);
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }

    if (assigneeID) {
      const assignee = await User.exists({ _id: assigneeID });
      if (!assignee) {
        deleteAttachment(req);
        return res.status(404).send(messages.EPIC_API.ASSIGNEE_NOT_FOUND);
      }
    }

    //set default list ID to task if listID is not selected
    if (!listID) {
      listID = await ListModel.findOne({ projectID, listName: "todo" });
      if (!listID) {
        listID = await ListModel.findOne({ projectID });
      }
      if (!listID) {
        deleteAttachment(req);
        return res.status(404).send(messages.TaskAPI.LIST_NOT_FOUND);
      }
    } else {
      let list = await ListModel.findOne({ _id: listID });
      if (!list) return res.status(400).send(messages.TaskAPI.LIST_NOT_FOUND);
    }

    let activity = {
      message: "created the",
      activityField: "Epic",
      user: req.params.tenant,
    };

    let attachment;
    if (req.files) {
      req.files.forEach((file, index) => {
        attachment[index] = file.filename;
      });
    }
    //extract
    if (description) {
      let images = description.match(/[data:image]\/[^;]+;base64[^"]+/g);
      if (images && images.length > 0) {
        images.forEach((img) => {
          let base64Image = img.split(";base64,").pop();
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const extension = img.split(";")[0].split("/")[1];
          const fileName = uniqueSuffix + "-base64." + extension;
          fs.writeFile(
            path.join(__dirname, "../public/upload/attachment/") + fileName,
            base64Image,
            { encoding: "base64" },
            function (err) {
              attachment.push(fileName);
              console.log("success");
            }
          );
        });
      }
    }
    let totalEpic =
      (await EpicModel.countDocuments({ projectID: projectID })) + 1;

    let SN = totalEpic < 10 ? "0" + totalEpic : totalEpic;

    const epic = new EpicModel({
      SN,
      projectID,
      epicColor,
      summary,
      description,
      listID,
      assigneeID,
      labels,
      startDate,
      dueDate,
      reporter: req.params.tenant,
      attachment,
      activity,
    });

    let result = await epic.save();
    result = await result.populate("listID");

    if (labels?.length > 0) {
      await ProjectModel.findOneAndUpdate(
        { _id: projectID },
        { $addToSet: { labels: labels } }
      );
    }
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

// let {
//   projectID,
//   epicColor,
//   summary,
//   description,
//   tasks,
//   listID,
//   assigneeID,
//   labels,
//   startDate,
//   dueDate,
//   reporter,
//   watched,
//   voted,
//   flag,
// } = req.body;

module.exports = {
  createEpic,
};
