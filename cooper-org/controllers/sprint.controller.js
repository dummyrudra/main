const { ProjectModel } = require("../models/project.model");
const { SprintModel } = require("../models/sprint.model");
const { TaskModel } = require("../models/task.model");
const UserModel = require("../models/user.model");
const msg = require("../services/role.message");
const { Notification } = require("../models/notification.model");
const isProjectMember = require("../services/isProjectMember");
// const { io } = require("../app");

//add task to sprint after task create
const addNewTaskToSprint = async (task, req, res, next) => {
  try {
    let sprint = await SprintModel.findOneAndUpdate(
      { _id: req.body.sprint },
      { $push: { tasks: task._id } },
      { new: true }
    ).populate("tasks");
    //if sprint status is complete then move to next middleware
    if (sprint.sprintStatus === "complete") {
      return next(sprint);
    }
    // let project = await ProjectModel.findOne({
    //   _id: task.projectID.toString(),
    // });
    // io.to(project.key).emit("refreshProjectPages", {
    //   message: "Task created.",
    //   data: task,
    // });
    // io.to(task.projectID.toString()).emit("taskCreated",task);
    return res.status(200).send(task);
  } catch (ex) {
    next(ex);
  }
};

//drag task one sprint to another sprint
const dragTask = async (permissions, req, res, next) => {
  try {
    //check permission to update sprint
    if (!permissions.moveTask) return res.status(401).send(msg.UNAUTHORIZED);

    let isTask;
    for (let task of req.body.tasks) {
      isTask = await TaskModel.findOne({
        $and: [{ _id: task, isTrashed: false }],
      });
      //if task is exist in task model
      if (!isTask) return res.status(400).send(msg.TASK_NOT_FOUND);
    }

    let newSprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    //if new sprint is not in sprint model
    if (!newSprint) return res.status(400).send(msg.NEW_SPRINT_NOT_FOUND);

    if (
      !(await isProjectMember(newSprint.project.toString(), req.params.tenant))
    )
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    let previousSprint = await SprintModel.findOne({
      $and: [
        { _id: req.body.previousSprint },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    //if previous sprint is not in sprint model
    if (!previousSprint)
      return res.status(400).send(msg.PREVIOUS_SPRINT_NOT_FOUND);
    //if position is wrong
    if (
      req.body.position != 0 &&
      (!req.body.position ||
        req.body.position < 0 ||
        req.body.position > newSprint.tasks.length)
    ) {
      req.body.position = newSprint.tasks.length;
    }
    console.log(req.body.position);
    //if new sprint and previous sprint is not equal
    if (req.body.newSprint !== req.body.previousSprint) {
      let updatedTasks = previousSprint.tasks.filter(
        (task) => !req.body.tasks.includes(task.toString())
      );

      if (
        updatedTasks.length !==
        previousSprint.tasks.length - req.body.tasks.length
      )
        return res.status(400).send(msg.TASK_NOT_FOUND_IN_PREVIOUS_SPRINT);
      //set filtered task to previous sprint
      previousSprint.tasks = updatedTasks;

      previousSprint = await previousSprint.save();

      for (let task of req.body.tasks) {
        await TaskModel.findOneAndUpdate(
          { _id: task },
          { $set: { sprint: newSprint._id } },
          { new: true }
        );
      }
    }
    //set task to new sprint
    newSprint = await SprintModel.findByIdAndUpdate(
      { _id: newSprint._id },
      {
        $push: {
          tasks: {
            $each: req.body.tasks,
            $position: req.body.position,
          },
        },
      },
      { new: true }
    ).populate({
      path: "tasks",
    });
    //if sprint status is complete pass to next middleware
    if (newSprint.sprintStatus === "complete") {
      return next(newSprint);
    }
    if (
      req.body.newSprint !== req.body.previousSprint &&
      previousSprint.sprintStatus === "complete"
    ) {
      return next(
        await previousSprint.populate({
          path: "tasks",
        })
      );
    }

    // let project = await ProjectModel.findOne({
    //   _id: newSprint.project.toString(),
    // });
    // io.to(project.key).emit("refreshProjectPages", {
    //   message: msg.TASK_SUCCESSFULLY_DRAGGED,
    //   data: { previousSprint, newSprint },
    // });
    res.status(200).send(msg.TASK_SUCCESSFULLY_DRAGGED);
  } catch (ex) {
    next(ex);
  }
};
//add default two sprints in project after create project sprint-1 and backlog
const addDefaultSprint = async (payload, req, res, next) => {
  try {
    await new SprintModel({
      sprintName: "sprint-1",
      project: payload._id,
      createdBy: payload.owner,
    }).save();
    await new SprintModel({
      sprintName: "backlog",
      project: payload._id,
      createdBy: payload.owner,
    }).save();

    // io.to(payload.organization.toString()).emit("projectAdded", {
    //   message: "Project created.",
    //   data: payload,
    // });
    res.status(200).send(payload);
  } catch (ex) {
    next(ex);
  }
};

//get sprints by projectID
const getSprintsByProjectId = async (permissions, req, res, next) => {
  try {
    //check permission to read sprint
    if (!permissions.sprint.read) return res.status(401).send(msg.UNAUTHORIZED);

    const project = await ProjectModel.findOne({ _id: req.params.id });
    //if project is not exist in project model
    if (!project) return res.status(400).send(msg.PROJECT_NOT_FOUND);
    //select all sprints by project ID with populated
    const sprints = await SprintModel.find({
      $and: [
        { project: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    })
      .populate({
        path: "project",
        populate: [
          { path: "members", select: "-password -otp -isDeleted -__v" },
          { path: "organization", select: "organizationName" },
        ],
        select: "_id projectName key members",
      })
      .populate({ path: "createdBy", select: "-password -otp -isDeleted -__v" })
      .populate({
        path: "tasks",
        populate: [
          { path: "listID", select: "listName" },
          { path: "assigneeID", select: "-password -otp -isDeleted -__v" },
        ],
        select: "-projectID -__v",
      })
      .select("-__v -createdAt -updatedAt -isDeleted");

    res.status(200).send(sprints);
  } catch (ex) {
    next(ex);
  }
};
// create new sprint
const createSprint = async (permissions, req, res, next) => {
  try {
    //check permissions to create sprint
    if (!permissions.sprint.create)
      return res.status(401).send(msg.UNAUTHORIZED);

    const project = await ProjectModel.findOne({ _id: req.body.project });
    //if project is not exist in project model
    if (!project) return res.status(400).send(msg.PROJECT_NOT_FOUND);

    if (!(await isProjectMember(req.body.project, req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const createdBy = await UserModel.findOne({ _id: req.params.tenant });
    //if creator of sprint is not exist in User model
    if (!createdBy) return res.status(400).send(msg.USER_NOT_FOUND);
    //check start date and end date  duration
    if (req.body.duration && req.body.startDate && req.body.endDate) {
      const duration = Math.ceil(
        (new Date(req.body.endDate).getTime() -
          new Date(req.body.startDate).getTime()) /
          (1000 * 3600 * 24 * 7)
      );
      if (Number(req.body.duration) !== duration)
        return res.status(400).send(msg.INVALID_DURATION);

      const sprintDateInBetween = await SprintModel.findOne({
        $and: [
          { project: req.body.project },
          { isDeleted: false },
          {
            $or: [
              {
                $and: [
                  { startDate: { $lte: req.body.startDate } },
                  { endDate: { $gte: req.body.startDate } },
                ],
              },
              {
                $and: [
                  { startDate: { $lte: req.body.endDate } },
                  { endDate: { $gte: req.body.endDate } },
                ],
              },
            ],
          },
        ],
      });
      if (sprintDateInBetween)
        return res.status(400).send(msg.SPRINT_BETWEEN_ANOTHER_SPRINT);
    }
    //select sprint
    const sprintName = await SprintModel.findOne({
      $and: [
        { sprintName: req.body.sprintName },
        { project: req.body.project },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    if (sprintName) return res.status(400).send(msg.SPRINT_NAME_ALREADY_EXIST);
    //set new sprint and save
    const sprint = await new SprintModel({
      sprintName: req.body.sprintName,
      project: req.body.project,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
      duration: req.body.duration || null,
      sprintGoal: req.body.sprintGoal || null,
      createdBy: req.params.tenant,
    }).save();

    // io.to(project.key).emit("refreshProjectPages", {
    //   message: "Sprint created",
    //   data: sprint,
    // });
    // let users = project.members.filter(m=>m!==req.params.tenant);

    // let members = users.map((u) => {
    //      return { user: u.toString(), isSeen: false };
    //    });

    //    await new Notification({
    //      user: req.params.tenant,
    //      url: "project/" + project.key + "/backlog",
    //      message: createdBy.fullName + " created a sprint",
    //      recipient: members,
    //    }).save();

    res.status(200).send(sprint);
  } catch (ex) {
    next(ex);
  }
};

//update sprint details through sprint ID
const updateSprint = async (permissions, req, res, next) => {
  try {
    //check permission to update sprint
    if (!permissions.sprint.update)
      return res.status(401).send(msg.UNAUTHORIZED);

    const duration = Math.ceil(
      (new Date(req.body.endDate).getTime() -
        new Date(req.body.startDate).getTime()) /
        (1000 * 3600 * 24 * 7)
    );
    //check duration
    if (Number(req.body.duration) !== duration)
      return res.status(400).send(msg.INVALID_DURATION);

    let sprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintName: { $ne: "backlog" } },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    //if sprint not exist in sprint model
    if (!sprint) return res.status(400).send(msg.SPRINT_NOT_FOUND);

    if (!(await isProjectMember(sprint.project.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    const sprintName = await SprintModel.findOne({
      $and: [
        { sprintName: req.body.sprintName },
        { project: sprint.project.toString() },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    //if sprint name already in project
    if (sprintName && sprintName._id.toString() !== req.params.id)
      return res.status(400).send(msg.SPRINT_NAME_ALREADY_EXIST);

    const sprintDateInBetween = await SprintModel.findOne({
      $and: [
        { project: sprint.project.toString() },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
        {
          $or: [
            {
              $and: [
                { startDate: { $lte: req.body.startDate } },
                { endDate: { $gte: req.body.startDate } },
              ],
            },
            {
              $and: [
                { startDate: { $lte: req.body.endDate } },
                { endDate: { $gte: req.body.endDate } },
              ],
            },
          ],
        },
      ],
    });
    //sprint start and end date already any other sprint
    if (
      sprintDateInBetween &&
      sprintDateInBetween._id.toString() !== req.params.id
    )
      return res.status(400).send(msg.SPRINT_BETWEEN_ANOTHER_SPRINT);

    if (req.body.sprintStatus === "complete") {
      const sprintAlreadyStarted = await SprintModel.findOne({
        $and: [
          { project: sprint.project.toString() },
          { isDeleted: false },
          { sprintStatus: "complete" },
        ],
      });
      //if any sprint already in start status
      if (sprintAlreadyStarted)
        return res.status(400).send(msg.ONE_SPRINT_ALREADY_RUNNING);
    }
    //set data to sprint model
    sprint = await SprintModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          sprintName: req.body.sprintName,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          duration: req.body.duration,
          sprintGoal: req.body.sprintGoal,
          sprintStatus: req.body.sprintStatus,
        },
      },
      { new: true }
    ).populate({ path: "tasks", select: "_id listID" });
    //if sprint status complete call next middleware
    if (req.body.sprintStatus === "complete") {
      return next(sprint);
    }
    // let project = await ProjectModel.findOne({
    //   _id: sprint.project.toString(),
    // });

    // io.to(project.key).emit("refreshProjectPages", {
    //   message: msg.SPRINT_UPDATED,
    //   data: sprint,
    // });
    res.status(200).send(msg.SPRINT_UPDATED);
  } catch (ex) {
    next(ex);
  }
};
//delete sprint from sprint model through sprint ID
const deleteSprint = async (permissions, req, res, next) => {
  try {
    //check permission to delete sprint
    if (!permissions.sprint.delete)
      return res.status(401).send(msg.UNAUTHORIZED);

    const sprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    if (!(await isProjectMember(sprint.project.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    //if sprint in backlog
    if (sprint.sprintName === "backlog")
      return res.status(401).send(msg.UNAUTHORIZED_DELETE_BACKLOG);

    sprint.isDeleted = true;
    await sprint.save();
    //all tasks to backlog sprint
    await SprintModel.updateOne(
      {
        $and: [{ project: sprint.project }, { sprintName: "backlog" }],
      },
      {
        $push: {
          tasks: {
            $each: sprint.tasks,
          },
        },
      }
    );
    next(sprint);

    // let project = await ProjectModel.findOne({
    //   _id: sprint.project.toString(),
    // });
    // io.to(project.key).emit("refreshProjectPages", {
    //   message: msg.SPRINT_DELETED_SUCCESS,
    //   data: sprint,
    // });
    return res.status(200).send(msg.SPRINT_DELETED_SUCCESS);
  } catch (ex) {
    res.status(400).send(msg.NO_SPRINTS_OF_SPRINTID);
  }
};
//complete sprint
const completeSprint = async (permissions, req, res, next) => {
  try {
    //check permissions to delete
    if (!permissions.sprint.delete)
      return res.status(401).send(msg.UNAUTHORIZED);
    //select sprint by ID
    let sprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });

    if (!(await isProjectMember(sprint.project.toString(), req.params.tenant)))
      return res.status(401).send(msg.NOT_A_MEMBER_OF_PROJECT);

    if (sprint.sprintName === "backlog")
      return res.status(401).send(msg.UNAUTHORIZED_UPDATE_BACKLOG);

    if (sprint.sprintStatus !== "complete")
      return res.status(400).send(msg.SPRINT_MUST_START);

    sprint.sprintStatus = "done";
    sprint = await sprint.save();
    next(sprint);

    // let project = await ProjectModel.findOne({
    //   _id: sprint.project.toString(),
    // });
    // io.to(project.key).emit("refreshProjectPages", {
    //   message: msg.SPRINT_COMPLETED_SUCCESSFULLY,
    //   data: sprint,
    // });
    res.status(200).send(msg.SPRINT_COMPLETED_SUCCESSFULLY);
  } catch (ex) {
    res.status(400).send(msg.NO_SPRINTS_OF_SPRINTID);
  }
};
//export all functions
module.exports = {
  addDefaultSprint,
  createSprint,
  getSprintsByProjectId,
  deleteSprint,
  updateSprint,
  addNewTaskToSprint,
  dragTask,
  completeSprint,
};
