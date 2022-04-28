const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


/*
validate project format before create project
*/

module.exports.projectValidate = async (req, res, next) => {
  try {
    const Schema = Joi.object({
      projectName: Joi.string().required(),
      organization: Joi.string(),
      key: Joi.string().alphanum().required(),
      url: Joi.string(),
      projectType: Joi.string(),
      projectLead: Joi.objectId().required(),
      avatar: Joi.string(),
      description: Joi.string(),
    });
    const { error } = Schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.validateAddMember = async (req, res, next) => {
  try {
    const Schema = Joi.object({
      members: Joi
        .array()
        .items(Joi.string().email().required())
        .unique()
        .required()
        .label("Email"),
    });
    const { error } = Schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.validateRemoveMember = async (req, res, next) => {
  try {
    const Schema = Joi.object({
      member: Joi.objectId().required(),
    });
    const { error } = Schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    next();
  } catch (error) {
    next(error);
  }
};
