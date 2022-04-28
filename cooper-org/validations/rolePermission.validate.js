const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// validate rolePermission format of roleID,organization ID, user ID

module.exports.validateRolePermission = async (req, res, next) => {
  const schema = Joi.object({
    role: Joi.objectId().required().label("Role Id"),
    organization: Joi.objectId().required().label("Organization Id"),
    user: Joi.objectId().required().label("User Id"),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};
