const { TaskModel } = require("../models/task.model");
const messages = require("../messages.json");
const User = require("../models/user.model");
const { ProjectModel } = require("../models/project.model");
const { SprintModel } = require("../models/sprint.model");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const ListModel = require("../models/list.model");
const {io} = require("../app");

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

module.exports.createTask = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.create)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

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
      const assignee = await User.exists({ _id: assigneeID });
      if (!assignee) {
        deleteAttachment(req);
        return res
          .status(404)
          .send(messages.CommonAPI.TaskAPI.TASK_ASSIGNEE_NOT_EXIST);
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
    let list = await ListModel.findOne({ projectID, listName: "todo" });
    if (!list) {
      deleteAttachment(req);
      return res.status(404).send(messages.TaskAPI.LIST_NOT_FOUND);
    }
    // const oldTask = await TaskModel.findOne({
    //   labels: { $regex: new RegExp(labels, "i") },
    //   projectID,
    // });
    // if (oldTask) {
    //   deleteAttachment(req)
    //   return res.status(409).send(messages.TaskAPI.TASK_ALREADY_EXIST);
    // }

    let data;
    if (req.body.listID) {
      data = { ...doc, reporter: req.params.tenant };
    } else {
      data = { ...doc, reporter: req.params.tenant, listID: list._id };
    }

    const task = new TaskModel(data);

    task.activity.push({ message: "created the",activityField:'Issue', user: req.params.tenant });

    // labels.forEach(label=>{
    //   task.labels.push(label);
    // })

    if (req.files) {
      req.files.forEach((file) => {
        task.attachment.push(file.filename);
      });
    }
    let SN = (await TaskModel.countDocuments({ projectID: projectID })) + 1;

    task.SN = SN < 10 ? "0" + SN : SN;

    let result = await task.save();
    result = await result.populate("listID");
    if (result) {
      return next(result);
      // return res.status(200).send(result);
    } else {
      return res.status(400).send(messages.TaskAPI.CREATE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.createSubTask = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.create)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
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

module.exports.addWatch = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.update)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const { userID } = req.body;
    const user = await User.findOne({ _id: userID });
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

module.exports.addVote = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.update)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const { userID } = req.body;

    const user = await User.findOne({ _id: userID });
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

module.exports.getAllTaskByProjectID = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.read)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const tasks = await TaskModel.find({
      projectID: req.params.id,
      isTrashed: false,
    })
      .populate("projectID")
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

module.exports.getTaskByID = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.read)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const task = await TaskModel.find({ _id: req.params.id, isTrashed: false })
      .populate("projectID")
      .populate("assigneeID", "fullName avatar email")
      .populate("reporter", "fullName avatar email")
      .populate("listID", "listName")
      .populate("sprint", "sprintName")
      .populate("activity.user", "fullName avatar email");

    if (task) {
      return res.send(task);
    } else {
      return res.status(400).send(messages.CommonAPI.TASK_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

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

module.exports.updateTask = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.update)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);

    const preTask = await TaskModel.findOne({ _id: req.params.id });
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
    } = req.body;
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id },
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
        },
      },
      { new: true }
    ).populate("sprint");

    if (!req.body.message) {
      task.activity.push({
        message: `Updated the`,
        activityField:`${Object.keys(req.body)[0]
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()}`,
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

    await task.save();

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

    let project = await ProjectModel.findOne({
      _id: task.projectID.toString(),
    });
    io.to(project.key).emit("refreshProjectPages", {message:"Task updated.",data:task});

      return res.status(200).send(task);
    } else {
      return res.status(400).send(messages.TaskAPI.UPDATE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTask = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.delete)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const task = await TaskModel.updateOne(
      { _id: req.params.id },
      { $set: { isTrashed: true } }
    );
    if (task) {

    let project = await ProjectModel.findOne({
      _id: task.projectID.toString(),
    });
    io.to(project.key).emit("refreshProjectPages",{message:"Task deleted.",data:task});
      return res.send(messages.TaskAPI.DELETE_TASK_SUCCESS);
    } else {
      return res.status(400).send(messages.TaskAPI.DELETE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTaskUpdate = async (permissions, req, res, next) => {
  try {
    if (!permissions.task.delete)
      return res.status(401).send(messages.TaskAPI.UNAUTHORIZED_USER);
    const task = await TaskModel.findByIdAndDelete(
      { _id: req.params.id }
    ).populate('sprint');
    if(task.sprint.sprintStatus == "complete"){
      const list=await ListModel.findOne({_id:task.listID})
      list=list.tasks.filter(t=>t.toString()!==task._id)
      await list.save();
    }
    const sprint=await SprintModel.findOne({_id:task.sprint._id})
    sprint=sprint.tasks.filter(t=>t.toString()!==task._id)
    await sprint.save();

    if (task) {
      return res.send(messages.TaskAPI.DELETE_TASK_SUCCESS);
    } else {
      return res.status(400).send(messages.TaskAPI.DELETE_TASK_FAILED);
    }
  } catch (err) {
    next(err);
  }
};
