const router = require("express").Router();
const { createEpic } = require("../controllers/epic.controller");
const auth = require("../middlewares/auth");
const getPermission = require("../middlewares/getPermission");
const { validateObjectId } = require("../middlewares/validateObjectID");
const { validateEpic } = require("../validations/epic.validate");

const path = require("path");
const multer = require("multer");

//create disk storage on directory url/upload/attachment/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/upload/attachment/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//create task after create task to add in sprint tasks
router.post(
  "/",
  upload.array("attachment", 10),
  validateEpic,
  auth,
  getPermission,
  createEpic
);

module.exports = router;
