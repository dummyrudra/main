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
const Notification = require("../models/notification.model");
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
//create new task and validate mandatory fields
module.exports.createTask = async (permissions, req, res, next) => {
  try {
    //check permission to delete task
    if (!permissions.task.create)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    if (!(await isProjectMember(req.body.projectID, req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const {
      projectID,
      issueType,
      sprint,
      summary,
      description,
      assigneeID,
      labels,
      storyPointEstimate,
    } = req.body;
    const validateProjectID = await ProjectModel.findOne({
      _id: projectID,
      isTrashed: false,
    });
    const validateSprintID = await SprintModel.findOne({
      $and: [
        { _id: sprint },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });

    if (!validateProjectID) {
      deleteAttachment(req);
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }
    if (!validateSprintID) {
      deleteAttachment(req);
      return res.status(404).send(messages.CommonAPI.SPRINT_NOT_FOUND);
    }
    if (assigneeID) {
      const assignee = await User.exists({ _id: assigneeID, isDeleted: false });
      if (!assignee) {
        deleteAttachment(req);
        return res.status(404).send(messages.TaskAPI.TASK_ASSIGNEE_NOT_EXIST);
      }
    }

    let doc = {
      projectID,
      sprint,
      issueType,
      summary,
      description,
      assigneeID,
      storyPointEstimate,
      labels,
    };
    //set default list ID to task if listID is not selected
    let list = await ListModel.findOne({ projectID, listName: "todo" });
    if (!list) {
      list = await ListModel.findOne({ projectID });
    }
    if (!list) {
      deleteAttachment(req);
      return res.status(404).send(messages.TaskAPI.LIST_NOT_FOUND);
    }

    let data;
    if (req.body.listID) {
      data = { ...doc, reporter: req.params.tenant };
    } else {
      data = { ...doc, reporter: req.params.tenant, listID: list._id };
    }

    const task = new TaskModel(data);
    //set activity
    task.activity.push({
      message: "created the",
      activityField: "Issue",
      user: req.params.tenant,
    });

    if (req.files) {
      req.files.forEach((file) => {
        task.attachment.push(file.filename);
      });
    }
    //extract files from description
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
              task.attachment.push(fileName);
              console.log("success");
            }
          );
        });
      }
    }

    //generate serial number (SN)
    let SN = (await TaskModel.countDocuments({ projectID: projectID })) + 1;

    task.SN = SN < 10 ? "0" + SN : SN;

    let result = await task.save();

    result = await result.populate("listID");

    // let members = [req.params.tenant];
    // if(assigneeID){
    //   members.push(assigneeID);
    // }

    // await ProjectModel.findOneAndUpdate(
    //   { _id: result.projectID.toString() ,isTrashed: false},
    //   { $addToSet: { members:members} }
    // );
    if (labels?.length > 0) {
      await ProjectModel.findOneAndUpdate(
        { _id: projectID },
        { $addToSet: { labels: labels } }
      );
    }
    if (result) {
      //send notification
      // const notification= new Notification({sender:req.params.tenant,message:"Issue Created",subMessage:"created the task"});
      // validateProjectID.members.forEach(member=>{
      //   if(!validateProjectID.members.includes(req.params.tenant)){
      //     notification.recipients.push({user:member});
      //   }
      // })
      // await notification.save();
      return next(result);
      // return res.status(200).send(result);
    } else {
      return res.status(400).send(messages.TaskAPI.CREATE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

//create sub task of task
module.exports.createSubTask = async (permissions, req, res, next) => {
  try {
    //check permission to create task
    if (!permissions.task.create)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    if (!(await isProjectMember(req.body.projectID, req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const TaskID = req.params.id;
    const {
      projectID,
      issueType,
      sprint,
      summary,
      description,
      assigneeID,
      labels,
      storyPointEstimate,
    } = req.body;
    const validateProjectID = await ProjectModel.findOne({
      _id: projectID,
      isTrashed: false,
    });
    const validateSprintID = await SprintModel.findOne({
      $and: [
        { _id: sprint },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    // const validateListID = await ListModel.exists({ _id: listID });
    if (!validateProjectID) {
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }
    if (!validateSprintID) {
      return res.status(404).send(messages.CommonAPI.SPRINT_NOT_FOUND);
    }
    // if (!validateListID) {
    //   return res.status(404).send(messages.CommonAPI.LIST_NOT_FOUND);
    // }
    const list = await ListModel.findOne({
      $and: [{ projectID }, { listName: "todo" }],
    });
    if (!list) {
      deleteAttachment(req);
      return res.status(404).send(messages.TaskAPI.LIST_NOT_FOUND);
    }
    let doc = {
      projectID,
      sprint,
      issueType,
      summary,
      description,
      assigneeID,
      storyPointEstimate,
    };
    const data = {
      ...doc,
      subTask: TaskID,
      reporter: req.params.tenant,
      listID: list._id,
    };
    const subtask = new TaskModel(data).populate("listID");

    const result = await subtask.save();
    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(400).send(messages.TaskAPI.CREATE_SUB_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};
// add watched user in task
module.exports.addWatch = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.update)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const { userID } = req.body;
    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
    const watch = await TaskModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { watched: userID } },
      { new: true }
    );
    if (watch) {
      return res.status(200).send(watch);
    }
  } catch (err) {
    next(err);
  }
};
//user vote to task
module.exports.addVote = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.update)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const { userID } = req.body;

    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
    const vote = await TaskModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { voted: userID } },
      { new: true }
    );
    if (vote) {
      return res.status(200).send(vote);
    }
  } catch (err) {
    next(err);
  }
};
//get all tasks by project ID with populated
module.exports.getAllTaskByProjectID = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.read)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const tasks = await TaskModel.find({
      projectID: req.params.id,
      isTrashed: false,
    })
      .populate({
        path: "projectID",
        populate: [{ path: "members", select: "_id fullName avatar email" }],
      })
      .populate("assigneeID", "fullName avatar email")
      .populate("reporter", "fullName avatar email");

    if (tasks) {
      return res.send(tasks);
    } else {
      return res.status(400).send(messages.CommonAPI.TASK_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};
//get task by task ID with populated all fields
module.exports.getTaskByID = async (permissions, req, res, next) => {
  try {
    //check permission to read task
    if (!permissions.task.read)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const task = await TaskModel.find({ _id: req.params.id, isTrashed: false })
      .populate({
        path: "projectID",
        populate: [{ path: "members", select: "_id fullName avatar email" }],
      })
      .populate("assigneeID", "fullName avatar email")
      .populate("reporter", "fullName avatar email")
      .populate("listID", "listName")
      .populate("sprint", "sprintName")
      .populate("activity.user", "fullName avatar email");
    task[0].activity = task[0].activity.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    if (task) {
      return res.send(task);
    } else {
      return res.status(400).send(messages.CommonAPI.TASK_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};
//get task by assignee ID
module.exports.getTasksByAssigeeId = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.read)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const task = await TaskModel.find({
      assigneeID: req.params.id,
      isTrashed: false,
    });
    if (task) {
      return res.send(task);
    } else {
      return res.status(400).send(messages.CommonAPI.TASK_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};
//get task by reporter Id
module.exports.getTasksByRepoterId = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.read)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const task = await TaskModel.find({ reporter: req.params.tenant });
    if (task) {
      return res.send(task);
    } else {
      return res.status(400).send(messages.CommonAPI.TASK_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};
//update task
module.exports.updateTask = async (permissions, req, res, next) => {
  try {
    //check permission to update task
    if (!permissions.task.update)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const preTask = await TaskModel.findOne({
      _id: req.params.id,
      isTrashed: false,
    });

    if (
      !(await isProjectMember(
        preTask?.projectID?.toString(),
        req.params.tenant
      ))
    )
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const {
      issueType,
      listID,
      sprint,
      summary,
      description,
      assigneeID,
      storyPointEstimate,
      message,
      labels,
      flag,
    } = req.body;
    //set task details
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, isTrashed: false },
      {
        $set: {
          issueType,
          listID,
          sprint,
          summary,
          description,
          assigneeID,
          storyPointEstimate,
          labels,
          flag,
        },
      },
      { new: true }
    ).populate("sprint");
    if (assigneeID) {
      const notification = new Notification({
        sender: req.params.tenant,
        message: "Issue Update",
        subMessage: "you have assign the task",
        recipients: { user: assigneeID },
      });
      await notification.save();
    }
    if (labels?.length > 0) {
      await ProjectModel.findOneAndUpdate(
        { _id: task.projectID.toString() },
        { $addToSet: { labels: labels } }
      );
    }
    //  if(assigneeID){
    //    await ProjectModel.findOneAndUpdate(
    //      { _id: task.projectID.toString(),isTrashed: false},
    //      { $addToSet: { members: assigneeID } }
    //    );

    //   //  let haveTask = await TaskModel.findOne({
    //   //    $and: [
    //   //      { projectID: preTask.projectID.toString() },
    //   //      {isTrashed: false},
    //   //      {
    //   //        $or: [
    //   //          { assigneeID: preTask.assigneeID.toString() },
    //   //          { reporter: preTask.assigneeID.toString() },
    //   //        ],
    //   //      },
    //   //    ],
    //   //  });
    //   //  if (!haveTask) {
    //   //    await ProjectModel.findOneAndUpdate(
    //   //      {
    //   //        _id: preTask.projectID.toString(),
    //   //        isTrashed: false,
    //   //        owner: { $ne: preTask.assigneeID.toString() },
    //   //        projectLead: { $ne: preTask.assigneeID.toString() },
    //   //      },
    //   //      {
    //   //        $pull: {
    //   //          members: preTask.assigneeID.toString(),
    //   //        },
    //   //      }
    //   //    );
    //   //  }
    //  }

    //set activity message
    let activityFieldMessage;
    if (req.files) {
      activityFieldMessage = "Attachment";
    } else {
      activityFieldMessage = Object.keys(req.body)[0]
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase();
    }
    if (!req.body.message) {
      if (req.body.listID) activityFieldMessage = "List";
      if (req.body.assigneeID) activityFieldMessage = "Assignee";
      task.activity.push({
        message: `Updated the`,
        activityField: activityFieldMessage,
        user: req.params.tenant,
      });
    }

    if (message) {
      task.activity.push({
        message,
        user: req.params.tenant,
        activityType: "comment",
      });
    }

    // if (labels && labels.length > 0) {
    //   labels.forEach((label) => {
    //     if (!task.labels.includes(label)) {
    //       task.labels.push(label);
    //     }
    //   });
    // }

    if (req.files) {
      req.files.forEach((file) => {
        task.attachment.push(file.filename);
      });
    }
    //check if previous description files update then add to attachment
    if (description) {
      const string1Arr = description.split(" ");
      const string2Arr = task.description.split(" ");

      const diffDescription = string1Arr
        .filter((word) => {
          return !string2Arr.includes(word);
        })
        .join(" ");
      let images = diffDescription.match(/[data:image]\/[^;]+;base64[^"]+/g);
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
              task.attachment.push(fileName);
              console.log("success");
            }
          );
        });
      }
    }

    await task.save();
    //if list ID change task move to another list tasks
    if (listID && task.sprint.sprintStatus == "complete") {
      const newList = await ListModel.findOne({ _id: listID });
      let previousList = await ListModel.findOne({
        _id: preTask.listID.toString(),
      });

      previousList.tasks = previousList.tasks.filter(
        (t) => t.toString() !== req.params.id
      );

      await previousList.save();

      if (!newList.tasks.includes(task._id)) {
        newList.tasks.push(task._id);
        await newList.save();
      }
    }
    //if sprint ID change task move to another sprint tasks
    if (sprint) {
      const newSprint = await SprintModel.findOne({ _id: sprint });
      let previousSprint = await SprintModel.findOne({
        _id: preTask.sprint.toString(),
      });

      previousSprint.tasks = previousSprint.tasks.filter(
        (t) => t.toString() !== req.params.id
      );

      await previousSprint.save();

      if (!newSprint.tasks.includes(task._id)) {
        newSprint.tasks.push(task._id);
        await newSprint.save();
      }
    }

    if (task) {
      // let project = await ProjectModel.findOne({
      //   _id: task.projectID.toString(),
      // });
      // io.to(project.key).emit("refreshProjectPages", {message:"Task updated.",data:task});

      return res.status(200).send(task);
    } else {
      return res.status(400).send(messages.TaskAPI.UPDATE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};
//delete task by task ID
module.exports.deleteTask = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.delete)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    let task = await TaskModel.findOne({ _id: req.params.id });

    if (!(await isProjectMember(task?.projectID.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, isTrashed: false },
      { $set: { isTrashed: true } }
    ).populate("sprint");

    if (task.sprint.sprintStatus == "complete") {
      let list = await ListModel.findOne({
        _id: task.listID.toString(),
        isTrashed: false,
      });
      list.tasks = list.tasks.filter(
        (t) => t.toString() !== task._id.toString()
      );
      await list.save();
    }

    let sprint = await SprintModel.findOne({ _id: task.sprint._id.toString() });
    sprint.tasks = sprint.tasks.filter(
      (t) => t.toString() !== task._id.toString()
    );
    await sprint.save();

    if (task) {
      // let haveTaskAssignee = await TaskModel.findOne({
      //   $and: [
      //     { projectID: task.projectID.toString() },
      //     { isTrashed: false },
      //     {
      //       $or: [
      //         { assigneeID: task.assigneeID?.toString() },
      //         { reporter: task.assigneeID?.toString() },
      //       ],
      //     },
      //   ],
      // });
      // if (!haveTaskAssignee) {
      //   await ProjectModel.findOneAndUpdate(
      //     {
      //       _id: task.projectID.toString(),
      //       isTrashed: false,
      //       projectLead: { $ne: task.assigneeID?.toString() },
      //       owner: { $ne: task.assigneeID?.toString() },
      //     },
      //     {
      //       $pull: {
      //         members: task.assigneeID,
      //       },
      //     }
      //   );
      // }

      // let haveTaskReporter = await TaskModel.findOne({
      //   $and: [
      //     { projectID: task.projectID.toString() },
      //     { isTrashed: false },
      //     {
      //       $or: [
      //         { assigneeID: task.reporter?.toString() },
      //         { reporter: task.reporter?.toString() },
      //       ],
      //     },
      //   ],
      // });
      // if (!haveTaskReporter) {
      //   await ProjectModel.findOneAndUpdate(
      //     {
      //       _id: task.projectID.toString(),
      //       isTrashed: false,
      //       projectLead: { $ne: task.reporter?.toString() },
      //       owner: { $ne: task.reporter?.toString() },
      //     },
      //     {
      //       $pull: {
      //         members: task.reporter,
      //       },
      //     }
      //   );
      // }

      // let project = await ProjectModel.findOne({
      //   _id: task.projectID.toString(),
      // });
      // io.to(project.key).emit("refreshProjectPages",{message:"Task deleted.",data:task});
      return res.send(messages.TaskAPI.DELETE_TASK_SUCCESS);
    } else {
      return res.status(400).send(messages.TaskAPI.DELETE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};
