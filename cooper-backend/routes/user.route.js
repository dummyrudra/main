const express = require("express");
const userController = require("../controllers/user.controller");
const { validateObjectId } = require("../middlewares/validateObjectID");
const { validateUserID } = require("../middlewares/validateUserID");
const { userValidateSignUp } = require("../validations/user.validate");
// const {
//   addDefaultAdminRole,
// } = require("../controllers/rolePermission.controller");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadAvatar");
const getPermission = require("../middlewares/getPermission");

const router = express.Router();

//get all users through token
router.get("", auth, getPermission, userController.getAllUser);
//get user by user ID
router.get(
  "/:id",
  validateObjectId,
  validateUserID,
  auth,
  getPermission,
  userController.getUserById
);
//get all users by organization ID
router.get(
  "/organization/:id",
  validateObjectId,
  auth,
  getPermission,
  userController.getUsersByOrganizationID
);
//update user data through user ID
router.patch(
  "/:id",
  validateObjectId,
  validateUserID,
  auth,
  getPermission,
  userController.updateUser
);

//delete user through user ID
router.delete(
  "/:id",
  validateObjectId,
  validateUserID,
  auth,
  getPermission,
  userController.deleteUser
);
//create new user after signup user assign as a admin
router.post("/signup", userValidateSignUp, userController.signUpUser);
//update user avatar through user ID
router.patch(
  "/avatar/:id",
  validateObjectId,
  validateUserID,
  upload.single("avatar"),
  auth,
  getPermission,
  userController.updateAvatar
);

module.exports = router;
