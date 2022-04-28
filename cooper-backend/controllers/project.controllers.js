const jwt = require("jsonwebtoken");
const { ProjectModel } = require("../models/project.model");
const config = require("config");
const msg = require("../services/auth.error.json");
const User = require("../models/user.model");
const { TaskModel } = require("../models/task.model");
const { RoleModel } = require("../models/role.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const { sendMail } = require("../services/mailService");
const isProjectMember = require("../services/isProjectMember");
const msg2 = require("../services/role.message");
const generator = require("generate-password");
const mongoose = require("mongoose");

const authServices = require("../services/authService");
const Notification = require("../models/notification.model");
// const {io} = require("../app");

//create project
module.exports.createProject = async (permissions, req, res, next) => {
  try {
    //check permission to create project
    if (!permissions.project.create)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const projectLead = await User.exists({ _id: req.body.projectLead });
    //check project Lead
    if (!projectLead) {
      return res.status(404).send(msg.projectApi.notFound.projectLeadNotFound);
    }
    const findUser = await User.findOne({ _id: req.params.tenant });
    //check owner organization is exist
    if (!findUser.organization)
      return res.status(401).send(msg.projectApi.notFound.organizationNotFound);

    const findName = await ProjectModel.findOne({
      $and: [
        { owner: req.params.tenant },
        { projectName: req.body.projectName },
      ],
    });
    //check project name existence
    if (findName != null)
      return res.status(400).send(msg.projectApi.badRequest.badName);

    const findKey = await ProjectModel.findOne({
      $and: [{ owner: req.params.tenant }, { key: req.body.key }],
    });
    //check project key existence
    if (findKey != null)
      return res.status(400).send(msg.projectApi.badRequest.badKey);

    let url = jwt.sign(
      {
        owner: req.body.owner,
        projectKey: req.body.key,
      },
      config.get("jwt")
    );
    //set data to project model
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
    //add projectLead and owner as a  member of project
    project.members.push(req.body.projectLead);

    if (req.body.projectLead != findUser._id) {
      const ns= new Notification({sender:findUser._id,message:"Project Created",subMessage:"you have assign as project Lead ",recipients:{user:req.body.projectLead}});
      await ns.save();
      project.members.push(findUser._id);
    }
    await project.save();

    next(project);
  } catch (err) {
    next(err);
  }
};
//get project by project ID
module.exports.getProject = async (permissions, req, res, next) => {
  try {
    //check permission to read project
    if (!permissions.project.read)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const project = await ProjectModel.findOne({ _id: req.params.id }).populate(
      [
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
        {
          path: "members",
          populate: { path: "role", select: "roleName _id" },
          select: "_id fullName avatar role email",
        },
      ]
    );
    //send response of project data
    res.send(project);
  } catch (err) {
    next(err);
  }
};

//get project by organization ID
module.exports.getProjectByOrg = async (permissions, req, res, next) => {
  try {
    //check permission to read project
    if (!permissions.project.read)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    let project;
    //check project name in query
    if (req.query.projectName) {
      //extract project data from project model with populated
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
          {
            path: "members",
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
          {
            path: "members",
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
//get all projects by project lead Id
module.exports.getProjectsByProjectLeadId = async (
  permissions,
  req,
  res,
  next
) => {
  try {
    const project = await ProjectModel.find({
      $and: [{ projectLead: req.params.id }, { isTrashed: false }],
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
        {
          path: "members",
          populate: { path: "role", select: "roleName _id" },
          select: "_id fullName avatar role email",
        },
      ])
      .sort({ createdAt: -1 });
    res.send(project);
  } catch (err) {
    next(err);
  }
};
//get project by owner ID
module.exports.getProjectsByOwnerId = async (permissions, req, res, next) => {
  try {
    //get project data from project model with populated
    const project = await ProjectModel.find({
      $and: [{ owner: req.params.tenant }, { isTrashed: false }],
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
        {
          path: "members",
          populate: { path: "role", select: "roleName _id" },
          select: "_id fullName avatar role email",
        },
      ])
      .sort({ createdAt: -1 });
    res.send(project);
  } catch (err) {
    next(err);
  }
};
//get project by project ID
module.exports.getProjectById = async (permissions, req, res, next) => {
  try {
    const project = await ProjectModel.findOne({
      $and: [{ _id: req.params.id }, { isTrashed: false }],
    }).populate([
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
      {
        path: "members",
        populate: { path: "role", select: "roleName _id" },
        select: "_id fullName avatar role email",
      },
    ]);
    //if project is not exist
    if (project == null)
      return res.status(404).send(msg.projectApi.notFound.projectNotFound);
    res.send(project);
  } catch (err) {
    next(err);
  }
};

// update project details
module.exports.updateProject = async (permissions, req, res, next) => {
  try {
    //check permission to update project
    if (!permissions.project.update)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);

    const findProject = await ProjectModel.findOne({ _id: req.params.id });
    // check project ID is exist in project model or not
    if (!findProject)
      return res.status(400).send(msg.projectApi.notFound.projectNotFound);

    const findName = await ProjectModel.findOne({
      $and: [
        { owner: findProject.owner },
        { projectName: req.body.projectName },
      ],
    });
    //check project name
    if (findName != null) {
      if (findName._id != req.params.id)
        return res.status(400).send(msg.projectApi.badRequest.badName);
    }
    const findKey = await ProjectModel.findOne({
      $and: [{ owner: findProject.owner }, { key: req.body.key }],
    });
    //check project key
    if (findKey != null) {
      if (findKey._id != req.params.id)
        return res.status(400).send(msg.projectApi.badRequest.badKey);
    }

    //  if(req.body.projectLead && req.body.projectLead!==findProject.projectLead.toString()) {
    //    let newProject = await ProjectModel.findOneAndUpdate(
    //      { _id: req.params.id ,isTrashed: false},
    //      {
    //        $addToSet: {
    //          members: req.body.projectLead,
    //        },
    //      },{new:true},
    //    );

    //   //  let task = await TaskModel.findOne({
    //   //    $and: [
    //   //      { projectID: req.params.id },
    //   //      { isTrashed: false },
    //   //      {
    //   //        $or: [
    //   //          { assigneeID: findProject.projectLead.toString() },
    //   //          { reporter: findProject.projectLead.toString() },
    //   //        ],
    //   //      },
    //   //    ],
    //   //  });

    //   //  if (!task) {
    //   //      await ProjectModel.findOneAndUpdate(
    //   //        {
    //   //          _id: req.params.id,
    //   //          isTrashed: false,
    //   //          owner: { $ne: findProject.projectLead.toString() },
    //   //        },
    //   //        {
    //   //          $pull: {
    //   //            members: findProject.projectLead.toString(),
    //   //          },
    //   //        }
    //   //      );
    //   //  }
    //  }

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
      },
      { new: true }
    );
    // io.to(payload.organization.toString()).emit("projectUpdated", {
    //   message: "Project updated",
    //   data: payload,
    // });
    // if (status.modifiedCount != 1) return res.status(400).send(msg.projectApi.badRequest.sameData)
    res.send(msg.projectApi.ok.updated);
  } catch (err) {
    next(err);
  }
};

//delete project through project ID
module.exports.deleteProject = async (permissions, req, res, next) => {
  try {
    //check permission to delete project
    if (!permissions.project.delete)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    //delete project from project model
    const status = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isTrashed: true } },
      { new: true }
    );
    // if (status.modifiedCount != 1)
    //   return res.status(404).send(msg.projectApi.notFound.projectNotFound);
    // io.to(status.organization.toString()).emit("projectUpdated", {
    //   message: msg.projectApi.ok.deleted,
    //   data: status,
    // });
    res.send(msg.projectApi.ok.deleted);
  } catch (err) {
    next(err);
  }
};

//add users to project member
module.exports.invitePeopleById = async (permissions, req, res, next) => {
  try {
    //check permission to update project
    if (!permissions.project.update)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);
    const { users } = req.body;

    const project = await ProjectModel.findOne({ _id: req.params.id });
    //add every user to members
    users.forEach((user) => {
      project.members.push(user);
    });
    //save users to project member
    await project.save();
    res.status(200).send(project);
  } catch (err) {
    next(err);
  }
};

module.exports.addMember = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.update || !permissions.user.create)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);

    const project = await ProjectModel.findOne({
      _id: req.params.id,
      isTrashed: false,
    });
    if (!project)
      return res.status(400).send(msg.projectApi.notFound.projectNotFound);

    if (!(await isProjectMember(project._id.toString(), req.params.tenant)))
      return res.status(401).send(msg2.NOT_A_MEMBER_OF_PROJECT);

    let members = [];
    let inviteUserEmail = [];
    for (let member of req.body.members) {
      let user = await User.findOne({ email: member });
      if (user) {
        members.push(user._id.toString());
      }
      if (!user) {
        inviteUserEmail.push(member);
      }
    }
    // if (members.length !== req.body.members.length)
    //   return res.status(400).send(msg.projectApi.badRequest.MEMBER_NOT_FOUND);
    let inviteUserIDs = [];
    for (let item of inviteUserEmail) {
      let id = await sendInvitation(
        { email: item, name: item.split("@")[0] },
        req.params.tenant
      );
      if (mongoose.Types.ObjectId.isValid(id))
        inviteUserIDs.push(id.toString());
      else return res.status(500).send(msg.serverError.serverError);
    }
    if (inviteUserIDs.length > 0) members = [...members, ...inviteUserIDs];
    await ProjectModel.findOneAndUpdate(
      { _id: project._id.toString(), isTrashed: false },
      { $addToSet: { members: members } }
    );
    res.status(200).send(msg.projectApi.ok.MEMBERS_ADDED);
  } catch (ex) {
    next(ex);
  }
};

module.exports.removeMember = async (permissions, req, res, next) => {
  try {
    if (!permissions.project.update)
      return res.status(401).send(msg.projectApi.UnAuthorized.unauthorized);

    const project = await ProjectModel.findOne({
      _id: req.params.id,
      isTrashed: false,
    });
    if (!project)
      return res.status(400).send(msg.projectApi.notFound.projectNotFound);

    if (!(await isProjectMember(project._id.toString(), req.params.tenant)))
      return res.status(401).send(msg2.NOT_A_MEMBER_OF_PROJECT);

    let user = await User.findOne({ _id: req.body.member });
    if (!user || !project.members.some((m) => m.toString() === req.body.member))
      return res.status(400).send(msg.projectApi.badRequest.MEMBER_NOT_FOUND);

    if (req.body.member === project.owner.toString())
      return res
        .status(401)
        .send(msg.unAuthorized.UNABLE_TO_REMOVE_PROJECT_OWNER);

    let projectLead;
    if (req.body.member === project.projectLead.toString())
      projectLead = project.owner.toString();
    else projectLead = project.projectLead.toString();

    await ProjectModel.findOneAndUpdate(
      { _id: project._id.toString(), isTrashed: false },
      {
        $pull: { members: req.body.member },
        $set: { projectLead: projectLead },
      }
    );

    await TaskModel.updateMany(
      { assigneeID: req.body.member },
      {
        $set: {
          assigneeID: null,
        },
      }
    );
    await TaskModel.updateMany(
      { reporter: req.body.member },
      {
        $set: {
          reporter: null,
        },
      }
    );
    res.status(200).send(msg.projectApi.ok.MEMBERS_REMOVED);
  } catch (ex) {
    next(ex);
  }
};

const sendInvitation = async (newUser, currentUser) => {
  try {
    //generate 7 character password
    var password = generator.generate({
      length: 7,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      exclude: '{}()-.^,;:"[]+%=<>/|~`',
      strict: true,
    });

    const tenant = await User.findById(currentUser);

    //check is tenant to invite or not
    // if (!tenant) return res.status(404).send(msg.Authapi.notFound.userNotFound);
    //create new user
    let user = new User({
      fullName: newUser.name,
      organization: tenant.organization,
      email: newUser.email,
      password: await authServices.hashPassword(password),
      tenant: tenant,
    });
    user = await user.save();
    //extract member role ID
    const role = await RoleModel.findOne({
      roleName: "member",
      isDeleted: false,
    });
    //set permission to member role
    const rolePermission = new RolePermissionModel({
      role: role._id,
      tenant: tenant._id,
      organization: tenant.organization,
      user: user._id,
    });
    await rolePermission.save();
    //set user role as a member
    await User.updateOne({ _id: user._id }, { $set: { role: role._id } });

    let emailStructure = {
      email: newUser.email,
      subject: `Mr. ${tenant.fullName} is invite you in some project`,
      content: `<center>
        <div>
            <strong>Your Login Credential are</strong>
        </div>
    </center>
    <br>Email: ${newUser.email}<br>Password: ${password}<br>
    Link To Reset Password - http://localhost:3000/auth/reset-password/${jwt.sign(
      { email: newUser.email },
      user.password[user.password.length - 1]
    )}`,
    };
    await sendMail(emailStructure);
    return user._id;
  } catch (err) {
    return err;
  }
};
