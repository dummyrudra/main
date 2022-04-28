const User = require("../models/user.model");
const bcrypt = require("bcrypt");
var _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const authServices = require("../services/authService");
const generator = require("generate-password");
const msg = require("../services/auth.error.json");
const { RoleModel } = require("../models/role.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const { OAuth2Client } = require("google-auth-library");

//user login after validate
module.exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      isDeleted: false,
    });
    //check user is exist or not
    if (user == null)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);
    //check user password is valid or correct
    if (
      !(await bcrypt.compare(
        req.body.password,
        user.password[user.password.length - 1]
      ))
    ) {
      return res.status(400).send(msg.Authapi.badRequest.PasswordMissMatched);
    }
    //extract user role
    const rolePermission = await RolePermissionModel.find({ user: user._id });
    //generate token for user
    const token = jwt.sign(
      {
        _id: user._id,
        organizationId: user?.organization?.toString() || null,
      },
      config.get("jwt") + user.password[user.password.length - 1]
    );
    //send response with token
    res.header("x-auth-token", token).send({ token });
  } catch (err) {
    next(err);
  }
};

//user forget password to generate otp by system to send on email
module.exports.generateOTP = async (req, res, next) => {
  try {
    //generate otp
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
    //save otp in user model for confirmation
    const status = await User.updateOne(
      { email: req.body.email },
      { $set: { otp: otp } }
    );
    //check user is exist or not in user model
    if (status.modifiedCount == 0)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);
    req.body.email = {
      email: req.body.email,
      subject: "Cooper send you OTP",
      text: "This is auto generated one time password " + otp,
    };
    next();
  } catch (err) {
    next(err);
  }
};

//validate otp from user model otp generated
module.exports.verifyOTP = async (req, res, next) => {
  try {
    //check user is exist or not
    const user = await User.findOne({
      email: req.body.email,
      isDeleted: false,
    });
    //if otp is mismatch
    if (req.body.otp != user.otp)
      return res.status(400).send(msg.Authapi.badRequest.OTPMissMatched);
    //send response to user with url and message
    return res.send({
      message: msg.Authapi.ok.OTPMatch.message,
      url: jwt.sign(
        { email: user.email },
        user.password[user.password.length - 1]
      ),
    });
  } catch (err) {
    next(err);
  }
};

//user reset password if user invite through email
module.exports.passwordReset = async (req, res, next) => {
  try {
    const payload = jwt.decode(req.params.token);
    //check token payload is exist or not
    if (!payload)
      return res.status(400).send(msg.Authapi.UnAuthorized.linkExpired);
    const user = await User.findOne({ email: payload.email, isDeleted: false });
    //check token payload password is valid
    jwt.verify(req.params.token, user.password[user.password.length - 1]);
    //validate payload password is correct or not
    for (let item of user.password) {
      if (await bcrypt.compare(req.body.password, item))
        return res.status(400).send(msg.Authapi.badRequest.OldPassword);
    }
    //push new password to user model
    const status = await User.updateOne(
      { email: payload.email },
      {
        $push: { password: await authServices.hashPassword(req.body.password) },
        $set: { otp: config.get("jwt") },
      }
    );
    //if password not set to mongo Server
    if (status.modifiedCount != 1) return res.status(500).send(msg.serverError);
    return res.send(msg.Authapi.ok.passwordChanged);
  } catch (err) {
    next(err);
  }
};
//change password
module.exports.changePassword = async (payload, req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    //user is exist and valid header token
    if (!user || user._id.toString() !== payload._id)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);
    //confirm old password to database
    if (
      !(await bcrypt.compare(
        req.body.currentPassword,
        user.password[user.password.length - 1]
      ))
    )
      return res
        .status(400)
        .send(msg.Authapi.badRequest.invalidCurrentPassword);
    //check new password if already used or not
    for (let item of user.password) {
      if (await bcrypt.compare(req.body.newPassword, item))
        return res.status(400).send(msg.Authapi.badRequest.OldPassword);
    }
    //add password to user model
    const status = await User.updateOne(
      { _id: req.params.id },
      {
        $push: {
          password: await authServices.hashPassword(req.body.newPassword),
        },
      }
    );
    //send response to user
    return res.send(msg.Authapi.ok.passwordChanged);
  } catch (err) {
    next(err);
  }
};
//send invitation to user by email
module.exports.sendInvitation = async (permissions, req, res, next) => {
  try {
    //check user permission to create
    if (!permissions.user.create) {
      return res.status(401).send(msg.Authapi.UnAuthorized.unAuthorizedUser);
    }
    //generate 7 character password
    var password = generator.generate({
      length: 7,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      exclude: '{}()-.^,;:"[]+%=<>/|~`',
      strict: true,
    });
    const tenant = await User.findById(req.params.id);
    //check is tenant to invite or not
    if (!tenant) return res.status(404).send(msg.Authapi.notFound.userNotFound);
    //create new user
    const user = new User({
      fullName: "anonymous",
      organization: tenant.organization,
      email: req.body.email,
      password: await authServices.hashPassword(password),
      tenant: req.body.tenant,
    });
    await user.save();
    //extract member role ID
    const role = await RoleModel.findOne({
      roleName: "member",
      organization: tenant.organization.toString(),
      isDeleted: false,
    });
    //set permission to member role
    const rolePermission = new RolePermissionModel({
      role: role._id,
      tenant: tenant._id,
      organization: tenant.organization,
      user: user._id,
    });
    await rolePermission.save();
    //set user role as a member
    await User.updateOne({ _id: user._id }, { $set: { role: role._id } });
    req.body.user = user;
    //set body of email send to user
    req.body.email = {
      email: req.body.email,
      subject: `Mr. ${tenant.fullName} is invite you in some project`,
      text: `Your Login Credential are- <br>email: ${
        req.body.email
      }<br>password: ${password}<br>
            link - http://localhost:3000/auth/reset-password/${jwt.sign(
              { email: req.body.email },
              user.password[user.password.length - 1]
            )}`,
    };
    next();
  } catch (err) {
    next(err);
  }
};
//login through google
module.exports.googleLogin = async (req, res, next) => {
  try {
    //get Google OAuth Client ID
    const client = new OAuth2Client(config.get("client_id"));
    //verify token
    const ticket = await client.verifyIdToken({
      idToken: req.body.token_id,
      audience: config.get("client_id"),
    });
    //extract payload from ticket
    const payload = ticket.getPayload();
    const findUser = await User.findOne({
      email: payload.email,
      isDeleted: false,
    });
    //check user is exist in user model or not
    if (!findUser)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);
    //generate jwt token to send to client
    const token = jwt.sign(
      {
        _id: findUser._id,
      },
      config.get("jwt") + findUser.password[findUser.password.length - 1]
    );
    //send response with token
    res.header("x-auth-token", token).send({ token });
  } catch (err) {
    //send specific message for password field
    if (err.message.indexOf("Invalid token signature") > -1)
      return res.status(401).send(msg.Authapi.UnAuthorized.unAuthorizedUser);
    next(err);
  }
};
