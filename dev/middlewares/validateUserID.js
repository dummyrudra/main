const messages = require("../messages.json");
const User = require("../models/user.model");

module.exports.validateUserID = async (req, res, next) => {
  try {
    const validateUserID = await User.exists({ _id: req.params.id });

    if (!validateUserID) {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
    next();
  } catch (error) {
    next(error);
  }
};
