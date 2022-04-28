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

//get all sprints by project ID
router.get(
  "/project/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  getSprintsByProjectId
);
//create a new sprint 
router.post("/", validateSprint, validateToken, getPermissions, createSprint);

//if owner update start sprint then move to sprint tasks to list board tasks
router.put(
  "/:id",
  validateObjectId,
  validateUpdateSprint,
  validateToken,
  getPermissions,
  updateSprint,
  addTasksToListOnStartSprint
);
/* drag tasks one sprint to another sprint and if sprint in complete status then
 task move to list board */
router.patch(
  "/drag-task/:id",
  validateObjectId,
  validateDragTask,
  validateToken,
  getPermissions,
  dragTask,
  addTasksToListOnStartSprint
);
//delete sprint if sprint status complete then delete all task from list Board
router.delete(
  "/complete-sprint/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  completeSprint,
  deleteTaskToListByProjectID
);
//delete task to list by project ID
router.delete(
  "/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  deleteSprint,
  deleteTaskToListByProjectID
);

module.exports = router;
