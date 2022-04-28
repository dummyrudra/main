const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/*
validate organization format before create organization
*/
module.exports.validateOrganization = async (req, res, next) => {
  const schema = Joi.object({
    organizationName: Joi.string().required(),
    organizationType: Joi.string().required(),
    organizationUrl: Joi.string().required(),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports.validateJoinOrg = async (req, res, next) => {
  const schema = Joi.object({
    user: Joi.objectId().required(),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};
