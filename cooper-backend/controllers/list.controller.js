const messages = require("../messages.json");
const ListModel = require("../models/list.model");
const { ProjectModel } = require("../models/project.model");
const { TaskModel } = require("../models/task.model");
const msg = require("../services/role.message");
const isProjectMember = require("../services/isProjectMember");
// const {io} = require("../app");

//get lists of a project by project ID
module.exports.getListNameByProjectID = async (permissions, req, res, next) => {
  try {
    //check user permission to read
    if (!permissions.user.read)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const project = await ProjectModel.findById(req.params.id);
    //check project is exist in project model or not
    if (!project) {
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }
    //find lists with populated
    const lists = await ListModel.find({ projectID: req.params.id })
      .populate({
        path: "tasks",
        populate: {
          path: "sprint",
          select: "sprintName",
        },
      })
      .populate({
        path: "projectID",
        populate: [{ path: "members", select: "_id fullName avatar email" }],
        select: "_id projectName key members",
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
      //send all lists
      return res.status(200).send(lists);
    } else {
      return res.status(404).send(messages.CommonAPI.LIST_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

//add new list in project by project ID
module.exports.addListName = async (permissions, req, res, next) => {
  try {
    //check user permission to create
    if (!permissions.user.create)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const { listName, listColor } = req.body;
    const project = await ProjectModel.findById(req.params.id);
    //check project exist in project model or not
    if (!project) {
      return res.status(404).send(messages.CommonAPI.PROJECT_NOT_FOUND);
    }

    if (!(await isProjectMember(project._id.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const oldList = await ListModel.findOne({
      listName: { $regex: new RegExp(listName, "i") },
      projectID: req.params.id,
    });
    //if listname already in ListModel in this project
    if (oldList) {
      return res.status(409).send(messages.ListAPI.LIST_ALREADY_EXIST);
    }
    //create new list
    const list = new ListModel({
      listName: listName.toLowerCase(),
      listColor: listColor?.toLowerCase() || "#8f4dd3",
      projectID: req.params.id,
    });
    const result = await list.save();
    if (result) {
      // io.to(project.key).emit("refreshProjectPages", {
      //   message: messages.ListAPI.LIST_ADDED_SUCCESS,
      //   data: result,
      // });
      return res.status(201).send(result);
    } else {
      return res.status(404).send(messages.ListAPI.LIST_ADDED_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

//add default lists after project creation
module.exports.addDefaultList = async (payload, req, res, next) => {
  try {
    const list1 = new ListModel({
      projectID: payload._id,
      listName: "todo",
      listColor: "#d04437",
    });
    const list2 = new ListModel({
      projectID: payload._id,
      listName: "to design",
      listColor: "#0052cc",
    });
    const list3 = new ListModel({
      projectID: payload._id,
      listName: "in progress",
      listColor: "#f5e728",
    });
    const list4 = new ListModel({
      projectID: payload._id,
      listName: "testing",
      listColor: "#ba57d1",
    });
    const list5 = new ListModel({
      projectID: payload._id,
      listName: "done",
      listColor: "#00875a",
    });
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

//change listName by list ID
module.exports.updateListName = async (permissions, req, res, next) => {
  try {
    //check user permission to update
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const { listName, listColor } = req.body;
    const oldList = await ListModel.findOne({
      _id: req.params.id,
      listName: listName.toLowerCase(),
    });
    //check already name is list model
    if (oldList) {
      return res.status(409).send(messages.ListAPI.LIST_ALREADY_EXIST);
    }

    let list = await ListModel.findOne({ _id: req.params.id });

    if (!(await isProjectMember(list.projectID.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    //set new listname
    list = await ListModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          listName: listName.toLowerCase(),
          listColor: listColor?.toLowerCase() || "#8f4dd3",
        },
      },
      { new: true }
    );
    if (list) {
      // let project = await ProjectModel.findOne({
      //   _id: list.projectID.toString(),
      // });
      // io.to(project.key).emit("refreshProjectPages", {
      //   message: messages.ListAPI.LIST_UPDATE_SUCCESS,
      //   data: list,
      // });
      return res.status(200).send(messages.ListAPI.LIST_UPDATE_SUCCESS);
    } else {
      return res.status(404).send(messages.ListAPI.LIST_UPDATE_FAILED);
    }
  } catch (err) {
    next(err);
  }
};
//delete list by list ID
module.exports.deleteListName = async (permissions, req, res, next) => {
  try {
    //check user permission to delete
    if (!permissions.user.delete)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);

    const list = await ListModel.findOne({ _id: req.params.id });

    const lists = await ListModel.find({
      projectID: list?.projectID?.toString(),
    });

    if (!list || lists.length === 0)
      return res.status(400).send(messages.CommonAPI.LIST_NOT_FOUND);

    if (!(await isProjectMember(list.projectID.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    if (lists.length === 1)
      return res.status(400).send(messages.ListAPI.MINIMUM_ONE_LIST);

    if (list.tasks.length > 0) {
      let index = lists.findIndex(
        (l) => l._id.toString() === list._id.toString()
      );

      if (index === 0) index = 2;

      list.tasks.forEach(async (task) => {
        await TaskModel.updateOne(
          { _id: task._id.toString() },
          { $set: { listID: lists[index - 1]._id.toString() } }
        );
      });

      await ListModel.updateOne(
        { _id: lists[index - 1]._id.toString() },
        {
          $addToSet: {
            tasks: list.tasks,
          },
        }
      );
    }

    const response = await ListModel.findOneAndDelete({
      _id: list._id.toString(),
    });

    if (response) {
      // let project = await ProjectModel.findOne({
      //   _id: list.projectID.toString(),
      // });
      // io.to(project.key).emit("refreshProjectPages", {
      //   message: messages.ListAPI.LIST_DELETE_SUCCESS,
      //   data: list,
      // });
      return res.status(200).send(messages.ListAPI.LIST_DELETE_SUCCESS);
    } else {
      return res.status(404).send(messages.ListAPI.LIST_DELETE_FAILED);
    }
  } catch (err) {
    next(err);
  }
};
//add tasks to list after start of sprint
module.exports.addTasksToListOnStartSprint = async (sprint, req, res, next) => {
  try {
    const { tasks } = sprint;

    await ListModel.updateMany(
      { projectID: sprint.project.toString() },
      { $set: { tasks: [] } }
    );
    //extract tasks by list ID and push in list tasks
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

      // io.to(project.key).emit("refreshProjectPages", {message:"Task created.",data:task});
      // io.to(task.projectID.toString()).emit("taskCreated",task);
      return res.status(200).send(task);
    }

    if (req.body.previousSprint) {
      // io.to(project.key).emit("refreshProjectPages", {message:msg.TASK_SUCCESSFULLY_DRAGGED,data:{newSprint:sprint}});
      return res.status(200).send(msg.TASK_SUCCESSFULLY_DRAGGED);
    }

    //  io.to(project.key).emit("refreshProjectPages", {
    //    message: msg.SPRINT_UPDATED,
    //    data: sprint,
    //  });
    return res.status(200).send(msg.SPRINT_UPDATED);
  } catch (err) {
    next(err);
  }
};

//drag task to one list to another list by list ID
module.exports.DragTaskToListByListID = async (permissions, req, res, next) => {
  try {
    //check user permission to update
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);

    const task = await TaskModel.findOne({
      $and: [{ _id: req.body.task, isTrashed: false }],
    });
    //check task is exist or not
    if (!task) return res.status(400).send(msg.TASK_NOT_FOUND);

    if (!(await isProjectMember(task.projectID.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const newList = await ListModel.findOne({ _id: req.params.id });
    //check new list is exist or not
    if (!newList)
      return res.status(400).send(messages.CommonAPI.LIST_NOT_FOUND);

    const previousList = await ListModel.findOne({
      _id: req.body.previousList,
    });
    //check previous list is exist or not
    if (!previousList)
      return res
        .status(400)
        .send(messages.ListAPI.LIST_NOT_FOUND_PREVIOUS_LIST);
    //check position of task where task draged
    if (
      req.body.position !== 0 &&
      (!req.body.position ||
        req.body.position < 0 ||
        req.body.position > newList.tasks.length)
    )
      req.body.position = newList.tasks.length;
    //check new list and previous list if match then filter on same list
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
      //set task list ID
      await TaskModel.updateOne(
        { _id: req.body.task },
        { $set: { listID: newList._id } }
      );
    }
    newList.tasks = newList.tasks.filter(
      (task) => task.toString() !== req.body.task
    );
    await newList.save();

    //push task in list of tasks a perticular position

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
    // io.to(project.key).emit("refreshProjectPages", {
    //   message: messages.ListAPI.LIST_UPDATE_SUCCESS,
    //   data: {previousList,newList},
    // });
    res.status(200).send(messages.ListAPI.LIST_UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

//delete tasks from list tasks after sprint complete
module.exports.deleteTaskToListByProjectID = async (sprint, req, res, next) => {
  try {
    const lists = await ListModel.find({
      projectID: sprint.project.toString(),
    });
    //set lists of tasks to empty
    if (lists.length > 0) {
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
