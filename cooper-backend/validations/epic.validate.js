const Joi = require("joi");
const fs = require("fs");
const path = require("path");
Joi.objectId = require("joi-objectid")(Joi);

//validate epic format before create epic

module.exports.validateEpic = (req, res, next) => {
  try {
    const schema = Joi.object({
      projectID: Joi.string().required().label("Project ID"),
      epicColor: Joi.string().trim().label("Epic Color"),
      summary: Joi.string().trim().required().label("Summary"),
      description: Joi.string().trim().label("Description"),
      startDate: Joi.date(),
      dueDate: Joi.date().greater(Joi.ref("startDate")),
      assigneeID: Joi.string().label("Assignee"),
      labels: Joi.array().unique().label("Labels"),
      listID: Joi.string(),
    });

    const { error } = schema.validate(req.body);
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

module.exports.validateUpdateEpic = (req, res, next) => {
  try {
    const schema = Joi.object({
      epicColor: Joi.string().trim().label("Epic Color"),
      summary: Joi.string().trim().required().label("Summary"),
      description: Joi.string().trim().label("Description"),
      tasks: Joi.array()
        .items(Joi.objectId().required())
        .unique()
        .label("Task Id"),
      startDate: Joi.date(),
      dueDate: Joi.date().greater(Joi.ref("startDate")),
      assigneeID: Joi.string().label("Assignee"),
      labels: Joi.array().unique().label("Labels"),
      listID: Joi.string(),
      comments: Joi.array(),
      watched: Joi.array(),
      voted: Joi.array(),
      flag: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
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
