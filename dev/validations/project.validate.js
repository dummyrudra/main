const { projectSchema } = require("../models/project.model");
const joi = require("joi");


/*
validate project format before create project
*/

module.exports.projectValidate = async (req, res, next) => {
  try {
    const Schema = joi.object({
      projectName: joi.string().required(),
      organization: joi.string(),
      key: joi.string().alphanum().required(),
      url: joi.string(),
      projectType: joi.string(),
      projectLead: joi.string().required(),
      avatar: joi.string(),
      description: joi.string(),
    });
    const {error}= Schema.validate(req.body)
    if(error) return res.status(400).send({message:error.details[0].message})
    next();
  } catch (error) {
    next(error);
  }
};
