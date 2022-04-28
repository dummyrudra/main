const {
  createProject,
  getProjectsByProjectLeadId,
  getProjectsByOwnerId,
  updateProject,
  getProjectById,
  deleteProject,
  getProjectByOrg,
  invitePeopleById,
} = require("../controllers/project.controllers");
// const upload = require('../middlewares/uploadAvatar')
const router = require("express").Router();
const { projectValidate } = require("../validations/project.validate");
const { validateObjectId } = require("../middlewares/validateObjectID");
const auth = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");
const multer = require("multer");
const { addDefaultList } = require("../controllers/list.controller");
const { addDefaultSprint } = require("../controllers/sprint.controller");
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

router.post('/invite/:id',validateObjectId, auth, getPermissions,invitePeopleById)

router.get(
  "/projectlead/:id",
  validateObjectId,
  auth,
  getPermissions,
  getProjectsByProjectLeadId
);
router.get("/owner", auth, getPermissions, getProjectsByOwnerId);
router.get(
  "/organization/:id",
  validateObjectId,
  auth,
  getPermissions,
  getProjectByOrg
); //get all public projects in existing organization
router.get("/:id", auth, getPermissions, getProjectById);
router.put(
  "/:id",
  upload.single("avatar"),
  projectValidate,
  auth,
  getPermissions,
  updateProject
);
router.delete("/:id", auth, getPermissions, deleteProject);
module.exports = router;
