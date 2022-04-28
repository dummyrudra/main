const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


/*
validate organization format before create organization
*/
module.exports.validateOrganization = async (req, res, next) => {
  try{
    const schema = Joi.object({
      tenant: Joi.objectId().required(),
      organizationName: Joi.string().required(),
      organizationType: Joi.string().required(),
      organizationUrl: Joi.string().required(),
    });
    schema.validate(req.body);
    next();
  }catch(err){
    return res.status(400).send(error.details[0].message);
  }
  
};
