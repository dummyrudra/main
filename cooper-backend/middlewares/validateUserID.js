const messages = require("../messages.json");
const User = require("../models/user.model");

//validate user ID from params is exist in User model or not
module.exports.validateUserID = async (req, res, next) => {
  try {
    const validateUserID = await User.exists({ _id: req.params.id,isDeleted:false });

    if (!validateUserID) {
      return res.status(404).send(messages.CommonAPI.USER_NOT_FOUND);
    }
    next();
  } catch (error) {
    next(error);
  }
};
