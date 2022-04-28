const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/*
validate permission format before create permissions
example:{
  permissionName:"task", 
  action:"GET",
  tenant:"D3gfjkg848trtu43jh56ft"
}
*/

module.exports.validatePermission = async (req, res, next) => {
  const schema = Joi.object({
    permissionName: Joi.string().min(3).max(255).required(),
    action: Joi.string()
      .min(3)
      .valid("GET", "POST", "PUT", "DELETE", "PATCH")
      .required(),
    tenant: Joi.objectId().required(),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};
