const Joi = require("joi");
const fs = require("fs");
const path = require("path");
Joi.objectId = require("joi-objectid")(Joi);

//validate task format before create task

module.exports = (req, res, next) => {
  try {
    const taskJoiSchema = Joi.object({
      projectID: Joi.string().required().label("Project ID"),
      issueType: Joi.string()
        .valid("epic", "story", "task", "bug")
        .required()
        .label("Issue Type"),
      summary: Joi.string().trim().label("Summary"),
      description: Joi.string().trim().label("Description"),
      assigneeID: Joi.string().label("Assinee"),
      labels: Joi.array().label("Labels"),
      storyPointEstimate: Joi.number().label("Story Point Estimate"),
      listID: Joi.string(),
      comments: Joi.array(),
      sprint: Joi.string().required(),
      watched: Joi.array(),
      voted: Joi.array(),
      flag: Joi.string(),
    });

    const { error } = taskJoiSchema.validate(req.body);
    if (error) {
      if (req.file) {
        fs.unlink(
          path.join(
            __dirname,
            "../public/upload/attachment/" + req.file.filename
          ),
          (err) => {
            if (err) throw err;
          }
        );
      }
      return res.status(400).send({ message: error.details[0].message });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
