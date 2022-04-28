const { ProjectModel } = require("../models/project.model");

module.exports = async (projectId, userId) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    isTrashed: false,
  });
  if (!project) return false;

  if (project.members.includes(userId)) return true;
  else return false;
};
