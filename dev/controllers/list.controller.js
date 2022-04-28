const messages = require("../messages.json");
const ListModel = require("../models/list.model");
const { ProjectModel } = require("../models/project.model");
const { TaskModel } = require("../models/task.model");
const msg = require("../services/role.message");
const {io} = require("../app");

module.exports.getListNameByProjectID = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.read)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }
    const lists = await ListModel.find({ projectID: req.params.id })
      .populate({
        path: "tasks",
        populate: {
          path: "sprint",
          select: "sprintName",
        },
      })
      .populate({
        path: "tasks",
        populate: {
          path: "assigneeID",
          select: "-password -__v",
        },
      })
      .populate({
        path: "tasks",
        populate: {
          path: "reporter",
          select: "-password -__v",
        },
      })
      .select("-createdAt -updatedAt -__v");
      

    if (lists) {
      return res.status(200).send(lists);
    } else {
      return res.status(404).send(messages.CommonAPI.LIST_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addListName = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.create)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const { listName } = req.body;
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }
    const oldList = await ListModel.findOne({
      listName: { $regex: new RegExp(listName, "i") },
      projectID: req.params.id,
    });
    if (oldList) {
      return res.status(409).send(messages.ListAPI.LIST_ALREADY_EXIST);
    }
    const list = new ListModel({
      listName: listName.toLowerCase(),
      projectID: req.params.id,
    });
    const result = await list.save();
    if (result) {
      
        io.to(project.key).emit("refreshProjectPages", {
          message: messages.ListAPI.LIST_ADDED_SUCCESS,
          data: result,
        });
      return res.status(201).send(messages.ListAPI.LIST_ADDED_SUCCESS);
    } else {
      return res.status(404).send(messages.ListAPI.LIST_ADDED_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addDefaultList = async (payload, req, res, next) => {
  try {
    const list1 = new ListModel({ projectID: payload._id, listName: "todo" });
    const list2 = new ListModel({
      projectID: payload._id,
      listName: "to design",
    });
    const list3 = new ListModel({
      projectID: payload._id,
      listName: "in progress",
    });
    const list4 = new ListModel({
      projectID: payload._id,
      listName: "testing",
    });
    const list5 = new ListModel({ projectID: payload._id, listName: "done" });
    await list1.save();
    await list2.save();
    await list3.save();
    await list4.save();
    await list5.save();
    next(payload);
  } catch (err) {
    next(err);
  }
};

module.exports.updateListName = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const { listName } = req.body;
    const oldList = await ListModel.findOne({
      listName: listName.toLowerCase(),
    });
    if (oldList) {
      return res.status(409).send(messages.ListAPI.LIST_ALREADY_EXIST);
    }
    const list = await ListModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { listName } },{new: true}
    );
    if (list) {
        let project = await ProjectModel.findOne({
          _id: list.projectID.toString(),
        });
        io.to(project.key).emit("refreshProjectPages", {
          message: messages.ListAPI.LIST_UPDATE_SUCCESS,
          data: list,
        });
      return res.status(200).send(messages.ListAPI.LIST_UPDATE_SUCCESS);
    } else {
      return res.status(404).send(messages.ListAPI.LIST_UPDATE_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteListName = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);

    const list = await ListModel.findOneAndDelete({ _id: req.params.id },{new: true});
    if (list) {
        let project = await ProjectModel.findOne({
          _id: list.projectID.toString(),
        });
        io.to(project.key).emit("refreshProjectPages", {
          message: messages.ListAPI.LIST_DELETE_SUCCESS,
          data: list,
        });
      return res.status(200).send(messages.ListAPI.LIST_DELETE_SUCCESS);
    } else {
      return res.status(404).send(messages.ListAPI.LIST_DELETE_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addTasksToListOnStartSprint = async (sprint, req, res, next) => {
  try {
    const { tasks } = sprint;

    await ListModel.updateMany(
      { projectID: sprint.project.toString() },
      { $set: { tasks: [] } }
    );

    tasks.forEach(async (task) => {
      const list = await ListModel.findOne({ _id: task.listID });

      if (task.listID.toString() == list._id.toString()) {
        list.tasks.push(task._id);
        await list.save();
      }
    });

    let project = await ProjectModel.findOne({
      _id: sprint.project.toString(),
    });

    if (req.body.sprint) {
      let task = await TaskModel.findOne({
        _id: tasks[tasks.length - 1]._id.toString(),
      });

    io.to(project.key).emit("refreshProjectPages", {message:"Task created.",data:task});
    // io.to(task.projectID.toString()).emit("taskCreated",task);
      return res.status(200).send(task);
    }

    if (req.body.previousSprint){
    io.to(project.key).emit("refreshProjectPages", {message:msg.TASK_SUCCESSFULLY_DRAGGED,data:{newSprint:sprint}});
      return res.status(200).send(msg.TASK_SUCCESSFULLY_DRAGGED);
    }

     io.to(project.key).emit("refreshProjectPages", {
       message: msg.SPRINT_UPDATED,
       data: sprint,
     });
    return res.status(200).send(msg.SPRINT_UPDATED);
  } catch (err) {
    next(err);
  }
};

module.exports.DragTaskToListByListID = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);

    const task = await TaskModel.findOne({
      $and: [{ _id: req.body.task, isTrashed: false }],
    });
    if (!task) return res.status(400).send(msg.TASK_NOT_FOUND);

    const newList = await ListModel.findOne({ _id: req.params.id });
    if (!newList)
      return res.status(400).send(messages.CommonAPI.LIST_NOT_FOUND);

    const previousList = await ListModel.findOne({
      _id: req.body.previousList,
    });
    if (!previousList)
      return res
        .status(400)
        .send(messages.ListAPI.LIST_NOT_FOUND_PREVIOUS_LIST);

    if (
      req.body.position !== 0 &&
      (!req.body.position ||
        req.body.position < 0 ||
        req.body.position > newList.tasks.length)
    )
      req.body.position = newList.tasks.length;

    if (req.params.id !== req.body.previousList) {
      let updatedTasks = previousList.tasks.filter(
        (task) => task.toString() !== req.body.task
      );

      if (updatedTasks.length === previousList.tasks.length)
        return res
          .status(400)
          .send(messages.ListAPI.LIST_NOT_FOUND_PREVIOUS_LIST);

      previousList.tasks = updatedTasks;
      await previousList.save();

      await TaskModel.updateOne(
        { _id: req.body.task },
        { $set: { listID: newList._id } }
      );
    }
    newList.tasks = newList.tasks.filter(
      (task) => task.toString() !== req.body.task
    );
    await newList.save();

    console.log(req.body.position)
    await ListModel.findOneAndUpdate(
      { _id: newList._id },
      {
        $push: {
          tasks: {
            $each: [req.body.task],
            $position: req.body.position,
          },
        },
      },
      { new: true }
    );
      let project = await ProjectModel.findOne({
        _id: previousList.projectID.toString(),
      });
      io.to(project.key).emit("refreshProjectPages", {
        message: messages.ListAPI.LIST_UPDATE_SUCCESS,
        data: {previousList,newList},
      });
    res.status(200).send(messages.ListAPI.LIST_UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTaskToListByProjectID = async (sprint, req, res, next) => {
  try {
    const lists = await ListModel.find({ projectID: sprint.project.toString() });
    if(lists.length > 0) {
      lists.forEach(async (list) => {
        list.tasks = [];
        await list.save();
      });
    }
    
    return next();
    // res.status(200).send(msg.SPRINT_COMPLETED_SUCCESSFULLY);
  } catch (err) {
    next(err);
  }
};
