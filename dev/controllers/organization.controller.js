const { OrganizationModel } = require("../models/organization.model");
const User = require("../models/user.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const { RoleModel } = require("../models/role.model");
const msg = require("../services/auth.error.json");

module.exports.createOrg = async (permissions, req, res, next) => {
  try {
    const findUser = await User.findById(req.body.tenant);
    if (findUser) {
      if (findUser.organization)
        return res
          .status(400)
          .send(msg.organizationApi.badRequest.alreadyExist);
    }
    req.body.organizationName = req.body.organizationName.toUpperCase();
    findOrg = await OrganizationModel.findOne({
      organizationName: req.body.organizationName,
    });
    if (findOrg != null) {
      const role = await RoleModel.findOne({ roleName: "member" });
      await User.updateOne(
        { _id: req.body.tenant },
        { $set: { organization: findOrg._id } }
      );
      const orgStatus = await RolePermissionModel.updateOne(
        { user: req.body.tenant },
        { $set: { organization: findOrg._id, role: role._id } }
      );
      return res.send(msg.organizationApi.ok.success);
    }
    const org = new OrganizationModel(req.body);
    await org.save();
    const status = await User.updateOne(
      { _id: req.body.tenant },
      { $set: { organization: org._id } }
    );
    const orgStatus = await RolePermissionModel.updateOne(
      { user: req.body.tenant },
      { $set: { organization: org._id } }
    );
    return res.send(org);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllOrg = async (permissions, req, res, next) => {
  try {
    req.query.name = req.query.name.toUpperCase();
    const org = await OrganizationModel.find({}).populate();
    if (!req.query.name) return res.send(org);
    const organization = [];
    for (let i of org) {
      if (i.organizationName.indexOf(req.query.name) > -1) {
        organization.push(i);
      }
    }
    res.send(organization);
  } catch (err) {
    next(err);
  }
};
