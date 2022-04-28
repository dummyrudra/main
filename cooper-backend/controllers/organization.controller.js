const { OrganizationModel } = require("../models/organization.model");
const User = require("../models/user.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const { RoleModel } = require("../models/role.model");
const msg = require("../services/auth.error.json");

//create new organization
module.exports.createOrganization = async (permissions, req, res, next) => {
  try {
    // if (!permissions.organization.create)
    //   return res.status(401).send(msg.UNAUTHORIZED);

    //check user is exist and their organization
    const findUser = await User.findOne({ _id: req.params.tenant });
    if (!findUser)
      return res.status(400).send(msg.Authapi.notFound.userNotFoun);

    if (findUser.organization)
      return res.status(400).send(msg.organizationApi.badRequest.alreadyExist);

    //convert organization name to uppercase
    // req.body.organizationName = req.body.organizationName.toUpperCase();
    findOrg = await OrganizationModel.findOne({
      $or: [
        { organizationName: req.body.organizationName.toUpperCase() },
        { organizationUrl: req.body.organizationUrl.toLowerCase() },
      ],
    });

    if (
      findOrg &&
      findOrg.organizationName === req.body.organizationName.toUpperCase()
    )
      return res
        .status(400)
        .send(msg.organizationApi.badRequest.ORGANIZATION_NAME_ALREADY_EXISTS);

    if (
      findOrg &&
      findOrg.organizationUrl === req.body.organizationUrl.toLowerCase()
    )
      return res
        .status(400)
        .send(msg.organizationApi.badRequest.ORGANIZATION_URL_ALREADY_EXISTS);

    //set organization to another ID
    // if (findOrg != null) {
    //   const role = await RoleModel.findOne({ roleName: "member" });
    //   await User.updateOne(
    //     { _id: req.body.tenant },
    //     { $set: { organization: findOrg._id } }
    //   );
    //   const orgStatus = await RolePermissionModel.updateOne(
    //     { user: req.body.tenant },
    //     { $set: { organization: findOrg._id, role: role._id } }
    //   );
    //   return res.send(msg.organizationApi.ok.success);
    // }
    let org = new OrganizationModel({
      organizationName: req.body.organizationName.toUpperCase(),
      organizationType: req.body.organizationType.toUpperCase(),
      organizationUrl: req.body.organizationUrl.toLowerCase(),
      tenant: req.params.tenant,
    });

    org = await org.save();

    const defaultRoles = await RoleModel.find({
      organization: null,
      tenant: null,
    });

    defaultRoles.forEach(async (role) => {
      let r = await new RoleModel({
        roleName: role.roleName,
        organization: org._id.toString(),
        tenant: req.params.tenant,
      }).save();

      if (r.roleName === "admin") {
        await User.updateOne(
          { _id: req.params.tenant },
          { $set: { organization: org._id, role: r._id.toString() } }
        );

        await RolePermissionModel.updateOne(
          { user: req.params.tenant },
          {
            $set: { organization: org._id.toString(), role: r._id.toString() },
          },
          { upsert: true }
        );
      }
    });

    return res.send(org);
  } catch (err) {
    next(err);
  }
};

module.exports.joinOrganization = async (permissions, req, res, next) => {
  try {
    const org = await OrganizationModel.findOne({ _id: req.params.id });
    if (!org)
      return res
        .status(400)
        .send(msg.organizationApi.badRequest.ORGANIZATION_NOT_FOUND);

    const user = await User.findOne({ _id: req.body.user });
    if (!user) return res.status(400).send(msg.Authapi.notFound.userNotFound);

    if (user?.organization?.toString() === org._id.toString())
      return res
        .status(400)
        .send(
          msg.organizationApi.badRequest.ORGANIZATION_MEMBER_ALREADY_EXISTS
        );
    let member = await RoleModel.findOne({
      organization: org._id.toString(),
      roleName: "member",
    });
    await User.findOneAndUpdate(
      { _id: user._id.toString() },
      {
        $set: {
          organization: org._id.toString(),
          role: member?._id?.toString(),
          tenant: org.tenant.toString(),
        },
      }
    );
    await RolePermissionModel.updateOne(
      { user: req.params.tenant },
      {
        $set: {
          organization: org._id.toString(),
          role: member?._id?.toString(),
        },
      },
      { upsert: true }
    );
    res.status(200).send(msg.organizationApi.ok.MEMBER_ADDED_TO_ORGANIZATION);
  } catch (ex) {
    next(ex);
  }
};

//get all organization by query of organization Name
module.exports.getAllOrganization = async (req, res, next) => {
  try {
    let limit;
    if (req.query.limit) {
      limit = Number(req.query.limit);
    }
    const org = await OrganizationModel.find({}).limit(limit);
    //check query name is not empty
    res.send(org);
  } catch (err) {
    next(err);
  }
};

module.exports.getOrganization = async (req, res, next) => {
  try {
    const org = await OrganizationModel.find({ _id: req.params.id });
    if (!org)
      return res.status(msg.organizationApi.badRequest.ORGANIZATION_NOT_FOUND);
    //check query name is not empty
    res.send(org);
  } catch (err) {
    next(err);
  }
};
