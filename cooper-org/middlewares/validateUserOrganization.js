const messages = require("../messages.json");
const User = require("../models/user.model");

//validate user ID from params is exist in User model or not
module.exports.validateUserOrganization = async (payload,req, res, next) => {
  try {
    const user= await User.findOne({ _id: req.params.tenant,isDeleted:false});

    if (user.organization.toString()!==req.params.id) {
      return res.status(401).send(messages.OrganizationApi.ORGANIZATION_NOT_IN_USER);
    }
    next(payload);
  } catch (error) {
    next(error);
  }
};