const jwt = require("jsonwebtoken");
const { ProjectModel } = require("../models/project.model");
const config = require("config");
const msg = require("../services/auth.error.json");
const User = require("../models/user.model");
const { RoleModel } = require("../models/role.model");
const {io} = require("../app");

module.exports.createProject = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.create)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const projectLead=await User.exists({_id:req.body.projectLead})
    if(!projectLead){
      return res.status(404).send(msg.projectApi.notFound.projectLeadNotFound)
    }
    const findUser = await User.findOne({ _id: req.params.tenant });
    if (!findUser.organization)
      return res.status(401).send(msg.projectApi.notFound.organizationNotFound);

    const findName = await ProjectModel.findOne({
      $and: [
        { owner: req.params.tenant },
        { projectName: req.body.projectName },
      ],
    });
    if (findName != null)
      return res.status(400).send(msg.projectApi.badRequest.badName);

    const findKey = await ProjectModel.findOne({
      $and: [{ owner: req.params.tenant }, { key: req.body.key }],
    });
    if (findKey != null)
      return res.status(400).send(msg.projectApi.badRequest.badKey);

    let url = jwt.sign(
      {
        owner: req.body.owner,
        projectKey: req.body.key,
      },
      config.get("jwt")
    );

    const project = new ProjectModel({
      projectName: req.body.projectName,
      projectLead: req.body.projectLead,
      organization: findUser.organization,
      owner: findUser._id,
      avatar: req.file ? req.file.filename : "default.png",
      key: req.body.key,
      projectType: req.body.projectType,
      url: url,
      description: req.body.description,
    });
    project.members.push({user:req.body.projectLead})
    if(req.body.projectLead!=findUser._id){
      project.members.push({user:findUser._id})
    }
    await project.save();
    next(project);
  } catch (err) {
    next(err);
  }
};

module.exports.getProject = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.read)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const project = await ProjectModel.findOne({ _id: req.params.id }).populate(
      ["owner", "projectLead"]
    );
    res.send(project);
  } catch (err) {
    next(err);
  }
};

module.exports.getProjectByOrg = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.read)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    let project;
    if (req.query.projectName) {
      project = await ProjectModel.find({
        $and: [
          { projectName: req.query.projectName },
          { organization: req.params.id },
          { isTrashed: false },
          { projectPrivacy: "public" },
        ],
      })
        .populate([
          {
            path: "owner",
            populate: { path: "role", select: "roleName _id" },
            select: "_id fullName avatar role email",
          },
          {
            path: "projectLead",
            populate: { path: "role", select: "roleName _id" },
            select: "_id fullName avatar role email",
          },
        ])
        .sort({ createdAt: -1 });
    } else {
      project = await ProjectModel.find({
        $and: [
          { organization: req.params.id },
          { isTrashed: false },
          { projectPrivacy: "public" },
        ],
      })
        .populate([
          {
            path: "owner",
            populate: { path: "role", select: "roleName _id" },
            select: "_id fullName avatar role email",
          },
          {
            path: "projectLead",
            populate: { path: "role", select: "roleName _id" },
            select: "_id fullName avatar role email",
          },
        ])
        .sort({ createdAt: -1 });
    }

    res.send(project);
  } catch (err) {
    next(err);
  }
};

module.exports.getProjectsByProjectLeadId = async (
  permissions,
  req,
  res,
  next
) => {
  try {
    const project = await ProjectModel.find({
      $and: [{ projectLead: req.params.id }, { isTrashed: false }],
    }).sort({ createdAt: -1 });
    res.send(project);
  } catch (err) {
    next(err);
  }
};

module.exports.getProjectsByOwnerId = async (permissions, req, res, next) => {
  try {
    const project = await ProjectModel.find({
      $and: [{ owner: req.params.tenant }, { isTrashed: false }],
    })
      .populate(["owner", "projectLead"])
      .sort({ createdAt: -1 });
    res.send(project);
  } catch (err) {
    next(err);
  }
};

module.exports.getProjectById = async (permissions, req, res, next) => {
  try {
    const project = await ProjectModel.findOne({
      $and: [{ _id: req.params.id }, { isTrashed: false }],
    }).populate(["owner", "projectLead"]);
    if (project == null)
      return res.status(404).send(msg.projectApi.notFound.projectNotFound);
    res.send(project);
  } catch (err) {
    next(err);
  }
};
module.exports.updateProject = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.update)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const findProject = await ProjectModel.findOne({ _id: req.params.id });
    const findName = await ProjectModel.findOne({
      $and: [
        { owner: findProject.owner },
        { projectName: req.body.projectName },
      ],
    });
    if (findName != null) {
      if (findName._id != req.params.id)
        return res.status(400).send(msg.projectApi.badRequest.badName);
    }
    const findKey = await ProjectModel.findOne({
      $and: [{ owner: findProject.owner }, { key: req.body.key }],
    });
    if (findKey != null) {
      if (findKey._id != req.params.id)
        return res.status(400).send(msg.projectApi.badRequest.badKey);
    }
    const payload = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          projectName: req.body.projectName,
          projectLead: req.body.projectLead,
          avatar: req.file ? req.file.filename : findProject.avatar,
          key: req.body.key,
          projectType: req.body.projectType,
          description: req.body.description,
        },
      },{new:true}
    );
    io.to(payload.organization.toString()).emit("projectUpdated", {
      message: "Project updated",
      data: payload,
    });
    // if (status.modifiedCount != 1) return res.status(400).send(msg.projectApi.badRequest.sameData)
    res.send(msg.projectApi.ok.updated);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProject = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.delete)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const status = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isTrashed: true } },{new:true}
    );
    // if (status.modifiedCount != 1)
    //   return res.status(404).send(msg.projectApi.notFound.projectNotFound);
        io.to(status.organization.toString()).emit("projectUpdated", {
          message: msg.projectApi.ok.deleted,
          data: status,
        });
    res.send(msg.projectApi.ok.deleted);
  } catch (err) {
    next(err);
  }
};

module.exports.invitePeopleById=async (permissions,req,res,next)=>{
  try {
    if (!permissions.project.update)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const {users}=req.body

    const project = await ProjectModel.findOne(
      { _id: req.params.id }
    );
    users.forEach(user=> {
      project.members.push({user})
    });
    await project.save()
    res.status(200).send(project)
  } catch (err) {
    next(err);
  }
}