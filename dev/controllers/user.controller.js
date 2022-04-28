const User = require("../models/user.model");
const { hashPassword } = require("../services/authService");
const _ = require("lodash");
const messages = require("../messages.json");
const fs = require("fs");
const path = require("path");
const { OrganizationModel } = require("../models/organization.model");
const client = require("../services/redis.service");

exports.getAllUser = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.read)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const users = await User.find({}).select("_id fullName email avatar");
    if (users) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.read)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const users = await User.findOne({ _id: req.params.id })
      .populate("role", "roleName permissions")
      .populate("organization", "organizationName")
      .select("-password -otp -isDeleted -__v");
    if (users) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

exports.getUsersByOrganizationID = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.read)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const users = await User.find({ organization: req.params.id })
      .populate("role", "roleName permissions")
      .populate("organization", "organizationName")
      .select("-password -otp -isDeleted -__v");
    if (users) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserByIdFromRedis = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.read)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    //start redis
    const user = await client.get(req.params.id);
    if (user !== null) {
      return res.send(JSON.parse(user));
    }
    const data = await User.findOne({ _id: req.params.id })
      .populate("role", "roleName permissions")
      .populate("organization", "organizationName")
      .select("-password -otp -isDeleted -__v");
    client.setEx(req.params.id, 100, JSON.stringify(data));
    res.send(data);
    //end redis
  } catch (err) {
    next(err);
  }
};

exports.signUpUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json(messages.SignUpAPI.USER_HAS_ALREADY_SIGNUP);
    }
    const hashPass = await hashPassword(password);
    const organization = await OrganizationModel.findOne({});
    if (!organization) {
      return res.status(401).json(messages.UserAPI.UNAUTHORIZED_USER);
    }
    const user = new User({
      fullName,
      email,
      password: hashPass,
      organization: organization._id,
    });

    const result = await user.save();
    if (result) {
      req.body = _.pick(result, [
        "fullName",
        "_id",
        "email",
        "avatar",
        "organization",
      ]);
      next();
      // return res.status(200).send(_.pick(result,['fullName','_id',"email","avatar"]))
    } else {
      return res.status(400).send(messages.SignUpAPI.USER_SIGNUP_FAILED);
    }
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const { fullName, email, jobTitle, department } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          fullName,
          email,
          jobTitle,
          department,
        },
      },
      { new: true }
    );
    if (user) {
      return res.status(200).send(user);
    } else {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

exports.updateAvatar = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.update)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const filename = req.file.filename;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          avatar: filename,
        },
      }
    );
    if (user) {
      if (user.avatar != "avatar.png") {
        fs.unlink(
          path.join(__dirname, "../public/upload/users/" + user.avatar),
          (err) => {
            if (err) {
            }
          }
        );
      }
      return res.status(200).send(messages.UserAPI.AVATAR_UPDATED_SUCCESS);
    } else {
      fs.unlink(
        path.join(__dirname, "../public/upload/users/" + filename),
        (err) => {
          if (err) {
          }
        }
      );
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (permissions, req, res, next) => {
  try {
    if (!permissions.user.delete)
      return res.status(401).send(messages.UserAPI.UNAUTHORIZED_USER);
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (user) {
      return res.status(200).send(messages.DeleteAPI.USER_DELETE_SUCCESS);
    } else {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};
