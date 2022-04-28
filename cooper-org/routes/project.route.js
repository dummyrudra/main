const {
  createProject,
  getProjectsByProjectLeadId,
  getProjectsByOwnerId,
  updateProject,
  getProjectById,
  deleteProject,
  getProjectByOrg,
  addMember,
  removeMember,
} = require("../controllers/project.controllers");
// const upload = require('../middlewares/uploadAvatar')
const router = require("express").Router();
const {
  projectValidate,
  validateRemoveMember,
  validateAddMember,
} = require("../validations/project.validate");
const { validateObjectId } = require("../middlewares/validateObjectID");
const auth = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");
const multer = require("multer");
const { addDefaultList } = require("../controllers/list.controller");
const { addDefaultSprint } = require("../controllers/sprint.controller");

//create disk storage on directory url/upload/projectAvatar/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/projectAvatar/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

//create a new project after project create two things create lists,sprint
router.post(
  "/",
  upload.single("avatar"),
  projectValidate,
  auth,
  getPermissions,
  createProject,
  addDefaultList,
  addDefaultSprint
);

//get project through projectLead ID
router.get(
  "/projectlead/:id",
  validateObjectId,
  auth,
  getPermissions,
  getProjectsByProjectLeadId
);
//get project through owner ID
router.get("/owner", auth, getPermissions, getProjectsByOwnerId);
//get project through organization ID
router.get(
  "/organization/:id",
  validateObjectId,
  auth,
  getPermissions,
  getProjectByOrg
); //get all public projects in existing organization
router.get("/:id", auth, getPermissions, getProjectById);
//update project data through this route
router.put(
  "/:id",
  upload.single("avatar"),
  projectValidate,
  auth,
  getPermissions,
  updateProject
);

//invite users to join project
router.patch(
  "/add-members/:id",
  validateObjectId,
  validateAddMember,
  auth,
  getPermissions,
  addMember
);
//remove user from project
router.patch(
  "/remove-member/:id",
  validateObjectId,
  validateRemoveMember,
  auth,
  getPermissions,
  removeMember
);
//delete project through project ID
router.delete("/:id", auth, getPermissions, deleteProject);
module.exports = router;
