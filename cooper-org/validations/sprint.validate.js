const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);



// validate sprint format before create sprint 

module.exports.validateSprint = async (req, res, next) => {
  const schema = Joi.object({
    sprintName: Joi.string().min(3).required(),
    project: Joi.objectId().required().label("Project Id"),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref("startDate")),
    duration: Joi.number(),
    sprintGoal: Joi.string().allow(""),
  })
    .with("startDate", ["endDate"])
    .with("endDate", ["startDate"]);
    // .with("duration", ["startDate", "endDate"]);

  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};
// validate sprint format before update sprint

module.exports.validateUpdateSprint = async (req, res, next) => {
  const schema = Joi.object({
    sprintName: Joi.string().min(3).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    duration: Joi.number().required(),
    sprintGoal: Joi.string().allow(""),
    sprintStatus: Joi.string().valid('start','complete')
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    // if (
    //   error.details[0].message ===
    //   `"sprintName" with value "Rr#" fails to match the required pattern: /^(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.*[A-Za-z]).*$/`
    // )
    //   error.details[0].message = `"Sprint name" must have atleast one number,alphabet and special character.`;
    return res.status(400).send(error.details[0].message);
  }
  next();
};
// validate sprint format before drag sprint one to another

module.exports.validateDragTask = async (req, res, next) => {
  const schema = Joi.object({
    previousSprint: Joi.objectId().required().label("Previous Sprint Id"),
    tasks: Joi.array().items(Joi.objectId().required()).unique().required().label("Task Id"),
    position: Joi.number(),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
}