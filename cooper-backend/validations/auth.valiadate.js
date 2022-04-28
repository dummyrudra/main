const messages = require("../messages.json");
const Joi = require("joi");
const msg = require("../services/auth.error.json");

//password pattern must include 1 uppercase,1 lowercase,1 special symbol,1 number.
const pattern =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/;

/*
validte user before login to check email & password format example:{email:"user@gmail.com",password:"User@123"}
*/

module.exports.userValidateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email Address"),
    password: Joi.string().min(7).regex(pattern).required().label("Password"),
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    if (
      error.message.indexOf(
        "fails to match the required pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/"
      ) > -1
    ) {
      return res.status(400).send(messages.UserAPI.PASSWORD_FORMAT_MISMATCH);
    }
    return res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};
//validte user password format example:{password:"Pass@123"}

exports.userValidatePassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().regex(pattern).required().label("Password"),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    if (
      error.message.indexOf(
        "fails to match the required pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/"
      ) > -1
    ) {
      return res.status(400).send(msg.badRequest.passwordNotSatisfied);
    }
    return res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

/*validte user to check format of current password & new password example:{currentPassword:"Pass@123",newPassword:"Pass@123"}
*/
exports.userValidateChangePassword = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .regex(pattern)
      .required()
      .label("Current Password"),
    newPassword: Joi.string().regex(pattern).required().label("New Password"),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    if (
      error.message.indexOf(
        "fails to match the required pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/"
      ) > -1
    ) {
      return res.status(400).send(msg.badRequest.passwordNotSatisfied);
    }
    return res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};
