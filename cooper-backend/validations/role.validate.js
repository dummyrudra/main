const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/* 
 validate role format before create role of roleName & organization ID
 example : {
   roleName:'admin',
   organization:"ekjrjkeg@#$$jgjndf" //organization ID
  } 
*/
module.exports.validateRole = async (req, res, next) => {
  const schema = Joi.object({
    roleName: Joi.string().min(3).max(255).required(),
    organization: Joi.objectId().required().label("Organization Id"),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

//validate user roleName example : {roleName:'admin'} 
module.exports.validateUpdateRole = async (req, res, next) => {
  const schema = Joi.object({
    roleName: Joi.string().min(3).max(255).required(),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};
