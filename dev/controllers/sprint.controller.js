const { ProjectModel } = require("../models/project.model");
const { SprintModel } = require("../models/sprint.model");
const { TaskModel } = require("../models/task.model");
const UserModel = require("../models/user.model");
const msg = require("../services/role.message");
const { io } = require("../app");

const addNewTaskToSprint = async (task, req, res, next) => {
  try {
    let sprint = await SprintModel.findOneAndUpdate(
      { _id: req.body.sprint },
      { $push: { tasks: task._id } },
      { new: true }
    ).populate("tasks");
    if (sprint.sprintStatus === "complete") {
      return next(sprint);
    }
    let project = await ProjectModel.findOne({
      _id: task.projectID.toString(),
    });
    io.to(project.key).emit("refreshProjectPages", {
      message: "Task created.",
      data: task,
    });
    // io.to(task.projectID.toString()).emit("taskCreated",task);
    return res.status(200).send(task);
  } catch (ex) {
    next(ex);
  }
};

const dragTask = async (permissions, req, res, next) => {
  try {
    if (!permissions.sprint.update)
      return res.status(401).send(msg.UNAUTHORIZED);

    let isTask;
    for (let task of req.body.tasks) {
      isTask = await TaskModel.findOne({
        $and: [{ _id: task, isTrashed: false }],
      });
      if (!isTask) return res.status(400).send(msg.TASK_NOT_FOUND);
    }

    let newSprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    if (!newSprint) return res.status(400).send(msg.NEW_SPRINT_NOT_FOUND);

    let previousSprint = await SprintModel.findOne({
      $and: [
        { _id: req.body.previousSprint },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    if (!previousSprint)
      return res.status(400).send(msg.PREVIOUS_SPRINT_NOT_FOUND);

    if (
      req.body.position != 0 &&
      (!req.body.position ||
        req.body.position < 0 ||
        req.body.position > newSprint.tasks.length)
    ) {
      req.body.position = newSprint.tasks.length;
    }
    console.log(req.body.position);

    if (req.body.newSprint !== req.body.previousSprint) {
      let updatedTasks = previousSprint.tasks.filter(
        (task) => !req.body.tasks.includes(task.toString())
      );

      if (
        updatedTasks.length !==
        previousSprint.tasks.length - req.body.tasks.length
      )
        return res.status(400).send(msg.TASK_NOT_FOUND_IN_PREVIOUS_SPRINT);

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

    let project = await ProjectModel.findOne({
      _id: newSprint.project.toString(),
    });
    io.to(project.key).emit("refreshProjectPages", {
      message: msg.TASK_SUCCESSFULLY_DRAGGED,
      data: { previousSprint, newSprint },
    });
    res.status(200).send(msg.TASK_SUCCESSFULLY_DRAGGED);
  } catch (ex) {
    next(ex);
  }
};

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

    io.to(payload.organization.toString()).emit("projectAdded", {
      message: "Project created.",
      data: payload,
    });
    res.status(200).send(payload);
  } catch (ex) {
    next(ex);
  }
};

const getSprintsByProjectId = async (permissions, req, res, next) => {
  try {
    if (!permissions.sprint.read) return res.status(401).send(msg.UNAUTHORIZED);

    const project = await ProjectModel.findOne({ _id: req.params.id });
    if (!project) return res.status(400).send(msg.PROJECT_NOT_FOUND);

    const sprints = await SprintModel.find({
      $and: [
        { project: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    })
      .populate({ path: "project", select: "_id projectName key" })
      .populate({ path: "createdBy", select: "_id name email avatar" })
      .populate({
        path: "tasks",
        populate: { path: "listID", select: "listName" },
        populate: { path: "assigneeID", select: "_id fullName email avatar" },
        select: "-projectID -__v",
      })
      .select("-__v -createdAt -updatedAt -isDeleted");

    res.status(200).send(sprints);
  } catch (ex) {
    next(ex);
  }
};

const createSprint = async (permissions, req, res, next) => {
  try {
    if (!permissions.sprint.create)
      return res.status(401).send(msg.UNAUTHORIZED);

    const project = await ProjectModel.findOne({ _id: req.body.project });
    if (!project) return res.status(400).send(msg.PROJECT_NOT_FOUND);

    const createdBy = await UserModel.findOne({ _id: req.params.tenant });
    if (!createdBy) return res.status(400).send(msg.USER_NOT_FOUND);

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

    const sprintName = await SprintModel.findOne({
      $and: [
        { sprintName: req.body.sprintName },
        { project: req.body.project },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });
    if (sprintName) return res.status(400).send(msg.SPRINT_NAME_ALREADY_EXIST);

    const sprint = await new SprintModel({
      sprintName: req.body.sprintName,
      project: req.body.project,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
      duration: req.body.duration || null,
      sprintGoal: req.body.sprintGoal || null,
      createdBy: req.params.tenant,
    }).save();

    io.to(project.key).emit("refreshProjectPages", {
      message: "Sprint created",
      data: sprint,
    });
    res.status(200).send(sprint);
  } catch (ex) {
    next(ex);
  }
};

const updateSprint = async (permissions, req, res, next) => {
  try {
    if (!permissions.sprint.update)
      return res.status(401).send(msg.UNAUTHORIZED);

    const duration = Math.ceil(
      (new Date(req.body.endDate).getTime() -
        new Date(req.body.startDate).getTime()) /
        (1000 * 3600 * 24 * 7)
    );
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
    if (!sprint) return res.status(400).send(msg.SPRINT_NOT_FOUND);

    const sprintName = await SprintModel.findOne({
      $and: [
        { sprintName: req.body.sprintName },
        { project: sprint.project.toString() },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });

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
      if (sprintAlreadyStarted)
        return res.status(400).send(msg.ONE_SPRINT_ALREADY_RUNNING);
    }

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

    if (req.body.sprintStatus === "complete") {
      return next(sprint);
    }
    let project = await ProjectModel.findOne({
      _id: sprint.project.toString(),
    });
    io.to(project.key).emit("refreshProjectPages", {
      message: msg.SPRINT_UPDATED,
      data: sprint,
    });
    res.status(200).send(msg.SPRINT_UPDATED);
  } catch (ex) {
    next(ex);
  }
};

const deleteSprint = async (permissions, req, res, next) => {
  try {
    if (!permissions.sprint.delete)
      return res.status(401).send(msg.UNAUTHORIZED);

    const sprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });

    if (sprint.sprintName === "backlog")
      return res.status(401).send(msg.UNAUTHORIZED_DELETE_BACKLOG);

    sprint.isDeleted = true;
    await sprint.save();

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

    let project = await ProjectModel.findOne({
      _id: sprint.project.toString(),
    });
    io.to(project.key).emit("refreshProjectPages", {
      message: msg.SPRINT_DELETED_SUCCESS,
      data: sprint,
    });
    return res.status(200).send(msg.SPRINT_DELETED_SUCCESS);
  } catch (ex) {
    res.status(400).send(msg.NO_SPRINTS_OF_SPRINTID);
  }
};

const completeSprint = async (permissions, req, res, next) => {
  try {
    if (!permissions.sprint.delete)
      return res.status(401).send(msg.UNAUTHORIZED);

    const sprint = await SprintModel.findOne({
      $and: [
        { _id: req.params.id },
        { isDeleted: false },
        { sprintStatus: { $ne: "done" } },
      ],
    });

    if (sprint.sprintName === "backlog")
      return res.status(401).send(msg.UNAUTHORIZED_UPDATE_BACKLOG);

    if (sprint.sprintStatus !== "complete")
      return res.status(400).send(msg.SPRINT_MUST_START);

    sprint.sprintStatus = "done";
    sprint = await sprint.save();
    next(sprint);

    let project = await ProjectModel.findOne({
      _id: sprint.project.toString(),
    });
    io.to(project.key).emit("refreshProjectPages", {
      message: msg.SPRINT_COMPLETED_SUCCESSFULLY,
      data: sprint,
    });
    res.status(200).send(msg.SPRINT_COMPLETED_SUCCESSFULLY);
  } catch (ex) {
    res.status(400).send(msg.NO_SPRINTS_OF_SPRINTID);
  }
};

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
