const express = require("express");
const router = express.Router();

const {
  createSprint,
  getSprintsByProjectId,
  deleteSprint,
  updateSprint,
  dragTask,
  completeSprint,
} = require("../controllers/sprint.controller");
const {
  addTasksToListOnStartSprint,
  deleteTaskToListByProjectID,
} = require("../controllers/list.controller");
const {
  validateSprint,
  validateUpdateSprint,
  validateDragTask,
} = require("../validations/sprint.validate");

const { validateObjectId } = require("../middlewares/validateObjectID");
const validateToken = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");

router.get(
  "/project/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  getSprintsByProjectId
);

router.post("/", validateSprint, validateToken, getPermissions, createSprint);

router.put(
  "/:id",
  validateObjectId,
  validateUpdateSprint,
  validateToken,
  getPermissions,
  updateSprint,
  addTasksToListOnStartSprint
);
router.patch(
  "/drag-task/:id",
  validateObjectId,
  validateDragTask,
  validateToken,
  getPermissions,
  dragTask,
  addTasksToListOnStartSprint
);

router.delete(
  "/complete-sprint/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  completeSprint,
  deleteTaskToListByProjectID
);

router.delete(
  "/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  deleteSprint,
  deleteTaskToListByProjectID
);

module.exports = router;
