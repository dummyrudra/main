const express = require("express");
const {
  login,
  generateOTP,
  verifyOTP,
  passwordReset,
  sendInvitation,
  googleLogin,
  changePassword,
} = require("../controllers/auth.controller");
const sendEmail = require("../middlewares/sendEmail");
const { validateObjectId } = require("../middlewares/validateObjectID");
const {
  userValidateLogin,
  userValidatePassword,
  userValidateChangePassword,
} = require("../validations/auth.valiadate");
const router = express.Router();
const {
  addDefaultMemberRole,
} = require("../controllers/rolePermission.controller");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const getPermission = require("../middlewares/getPermission");

//user login through this route using email and password
router.post("/login", userValidateLogin, login);
/*
if user change password through this route using email to generate otp
and send to email
*/
router.patch("/generate-otp", generateOTP, sendEmail);
/*
if user enter otp through this route using email to verify otp 
*/
router.patch("/verify-otp", verifyOTP);
/*
admin invite user and user reset the password through token 
*/
router.patch("/reset-password/:token", userValidatePassword, passwordReset);
// For change password while login
router.patch(
  "/change-password/:id",
  validateObjectId,
  userValidateChangePassword,
  auth,
  changePassword
);
router.post(
  "/send-invite/:id",
  validateObjectId,
  auth,
  getPermission,
  sendInvitation,
  addDefaultMemberRole,
  sendEmail
);
router.post("/login-google", googleLogin);

module.exports = router;
