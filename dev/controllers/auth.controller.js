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

module.exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user == null)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);
    if (
      !(await bcrypt.compare(
        req.body.password,
        user.password[user.password.length - 1]
      ))
    ) {
      return res.status(400).send(msg.Authapi.badRequest.PasswordMissMatched);
    }
    const rolePermission = await RolePermissionModel.find({ user: user._id });
    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.get("jwt") + user.password[user.password.length - 1]
    );
    res.header("x-auth-token", token).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.generateOTP = async (req, res, next) => {
  try {
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
    const status = await User.updateOne(
      { email: req.body.email },
      { $set: { otp: otp } }
    );
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

module.exports.verifyOTP = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (req.body.otp != user.otp)
      return res.status(400).send(msg.Authapi.badRequest.OTPMissMatched);
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

module.exports.passwordReset = async (req, res, next) => {
  try {
    const payload = jwt.decode(req.params.token);
    if (!payload)
      return res.status(400).send(msg.Authapi.UnAuthorized.linkExpired);
    const user = await User.findOne({ email: payload.email });
    jwt.verify(req.params.token, user.password[user.password.length - 1]);

    for (let item of user.password) {
      if (await bcrypt.compare(req.body.password, item))
        return res.status(400).send(msg.Authapi.badRequest.OldPassword);
    }
    const status = await User.updateOne(
      { email: payload.email },
      {
        $push: { password: await authServices.hashPassword(req.body.password) },
        $set: { otp: config.get("jwt") },
      }
    );
    if (status.modifiedCount != 1) return res.status(500).send(msg.serverError);
    return res.send(msg.Authapi.ok.passwordChanged);
  } catch (err) {
    next(err);
  }
};

module.exports.changePassword = async (payload, req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user || user._id.toString() !== payload._id)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);

    if (
      !(await bcrypt.compare(
        req.body.currentPassword,
        user.password[user.password.length - 1]
      ))
    )
      return res
        .status(400)
        .send(msg.Authapi.badRequest.invalidCurrentPassword);

    for (let item of user.password) {
      if (await bcrypt.compare(req.body.newPassword, item))
        return res.status(400).send(msg.Authapi.badRequest.OldPassword);
    }

    const status = await User.updateOne(
      { _id: req.params.id },
      {
        $push: {
          password: await authServices.hashPassword(req.body.newPassword),
        },
      }
    );

    return res.send(msg.Authapi.ok.passwordChanged);
  } catch (err) {
    next(err);
  }
};

module.exports.sendInvitation = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.create) {
      return res.status(401).send(msg.Authapi.UnAuthorized.unAuthorizedUser);
    }
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
    if (!tenant) return res.status(404).send(msg.Authapi.notFound.userNotFound);
    const user = new User({
      fullName: "anonymous",
      organization: tenant.organization,
      email: req.body.email,
      password: await authServices.hashPassword(password),
      tenant: req.body.tenant,
    });
    await user.save();
    const role = await RoleModel.findOne({ roleName: "member" });
    const rolePermission = new RolePermissionModel({
      role: role._id,
      tenant: tenant._id,
      organization: tenant.organization,
      user: user._id,
    });
    await rolePermission.save();
    await User.updateOne({ _id: user._id }, { $set: { role: role._id } });
    req.body.user = user;
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

module.exports.googleLogin = async (req, res, next) => {
  try {
    const client = new OAuth2Client(config.get("client_id"));
    const ticket = await client.verifyIdToken({
      idToken: req.body.token_id,
      audience: config.get("client_id"),
    });
    const payload = ticket.getPayload();
    const findUser = await User.findOne({ email: payload.email });
    if (!findUser)
      return res.status(404).send(msg.Authapi.notFound.userNotFound);
    console.log(payload);
    const token = jwt.sign(
      {
        _id: findUser._id,
      },
      config.get("jwt") + findUser.password[findUser.password.length - 1]
    );
    res.header("x-auth-token", token).send({ token });
  } catch (err) {
    if (err.message.indexOf("Invalid token signature") > -1)
      return res.status(401).send(msg.Authapi.UnAuthorized.unAuthorizedUser);
    next(err);
  }
};
