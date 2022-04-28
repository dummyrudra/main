const { RoleModel } = require("../models/role.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const { OrganizationModel } = require("../models/organization.model");
const UserModel = require("../models/user.model");
const msg = require("../services/role.message");

module.exports.addDefaultAdminRole = async (req, res, next) => {
  try {
    const admin = await RoleModel.findOne({ roleName: "admin" });
    let rp = new RolePermissionModel({
      user: req.body._id,
      role: admin._id,
    });
    rp = await rp.save();
    await UserModel.updateOne(
      { _id: req.body._id },
      { $set: { role: admin._id } }
    );
    return res.status(201).json(req.body);
  } catch (err) {
    next(err);
  }
};

module.exports.addDefaultMemberRole = async (req, res, next) => {
  try {
    const member = await RoleModel.findOne({ roleName: "member" });
    const rp = new RolePermissionModel({
      user: req.body.user._id,
      role: member._id,
    });
    await rp.save();
    await UserModel.updateOne(
      { _id: req.body._id },
      { $set: { role: member._id } }
    );
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.getRolePermissionsByUserId = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      _id: req.params.id,
    });
    if (!user) return res.status(400).send(msg.USER_NOT_FOUND);

    const rolePermissions = await RolePermissionModel.findOne({
      user: user._id,
    }).populate("role");
    if (!rolePermissions) return res.status(400).send(msg.NO_ROLE_PERMISSIONS);
    res.status(200).send(rolePermissions);
  } catch (ex) {
    next(err);
  }
};

module.exports.assignRolePermission = async (permissions, req, res, next) => {
  try {
    if (!permissions.assignRole) return res.status(401).send(msg.UNAUTHORIZED);

    const organization = await OrganizationModel.findOne({
      _id: req.body.organization,
    });
    if (!organization) return res.status(400).send(msg.NO_ORGANIZATION_ID);

    const role = await RoleModel.findOne({
      $and: [
        { _id: req.body.role },
        {
          $or: [
            { organization: req.body.organization },
            { organization: null },
          ],
        },
      ],
    });
    if (!role) return res.status(404).send(msg.NO_ROLE_OF_ROLEID);

    const tenant = await UserModel.findOne({ _id: req.params.tenant });

    if (
      !tenant ||
      tenant.organization.toString() !== organization._id.toString()
    )
      return res.status(400).send(msg.TENANT_NOT_FOUND);

    const user = await UserModel.findOne({ _id: req.body.user });
    if (!user) return res.status(400).send(msg.USER_NOT_FOUND);

    if (
      !user.organization ||
      user.organization.toString() !== organization._id.toString()
    )
      return res.status(400).send(msg.ORGANIZATION_MEMBER_NOT_FOUND);

    const rolePermission = await RolePermissionModel.findOne({
      $and: [
        {
          organization: req.body.organization,
        },
        { user: req.body.user },
      ],
    }).populate("role");

    if (rolePermission && rolePermission.role._id.toString() === req.body.role)
      return res.status(400).send(msg.ROLE_PERMISSIONS_ALREADY_ASSIGNED);

    if (rolePermission && rolePermission.role.roleName === "admin")
      return res
        .status(401)
        .send(msg.UNAUTHORIZED_CHANGE_ADMIN_ROLE_PERMISSION);

    await UserModel.updateOne(
      { _id: req.body.user },
      {
        $set: {
          role: req.body.role,
        },
      }
    );
    if (rolePermission) {
      rolePermission.role = role._id;
      rolePermission.tenant = tenant._id;
      await rolePermission.save();
      return res.status(200).send(rolePermission);
    }
    const rolePermissions = await new RolePermissionModel({
      role: req.body.role,
      organization: req.body.organization,
      tenant: req.params.tenant,
      user: req.body.user,
    }).save();

    return res.status(200).send(rolePermissions);
  } catch (ex) {
    next(ex);
  }
};

module.exports.revokeRolePermission = async (permissions, req, res, next) => {
  try {
    if (!permissions.revokeRole) return res.status(401).send(msg.UNAUTHORIZED);

    const organization = await OrganizationModel.findOne({
      _id: req.body.organization,
    });
    if (!organization) return res.status(400).send(msg.NO_ORGANIZATION_ID);

    const role = await RoleModel.findOne({
      $and: [
        { _id: req.body.role },
        {
          $or: [
            { organization: req.body.organization },
            { organization: null },
          ],
        },
      ],
    });
    if (!role) return res.status(404).send(msg.NO_ROLE_OF_ROLEID);

    const tenant = await UserModel.findOne({ _id: req.params.tenant });

    if (
      !tenant ||
      tenant.organization.toString() !== organization._id.toString()
    )
      return res.status(400).send(msg.TENANT_NOT_FOUND);

    // const tenantRolePermission = await RolePermissionModel.findOne({
    //   $and: [
    //     {
    //       organization: req.body.organization,
    //     },
    //     { user: req.body.tenant },
    //   ],
    // }).populate("role");
    // if (tenantRolePermission.role.roleName !== "admin")
    //   return res.status(401).send(msg.TENANT_NOT_ALLOWED);

    const user = await UserModel.findOne({ _id: req.body.user });
    if (!user) return res.status(400).send(msg.USER_NOT_FOUND);

    if (
      !user.organization ||
      user.organization.toString() !== organization._id.toString()
    )
      return res.status(400).send(msg.ORGANIZATION_MEMBER_NOT_FOUND);

    const rolePermission = await RolePermissionModel.findOne({
      $and: [
        {
          organization: req.body.organization,
        },
        { user: req.body.user },
      ],
    }).populate("role");

    if (!rolePermission) return res.status(400).send(msg.NO_ROLE_PERMISSIONS);
    if (
      rolePermission.role.roleName === "admin" ||
      rolePermission.role.roleName === "member"
    )
      return res
        .status(401)
        .send(msg.UNAUTHORIZED_REVOKE_DEFAULT_ROLE_PERMISSION);

    const memberRole = await RoleModel.findOne({ roleName: "member" });
    const response = await RolePermissionModel.updateOne(
      { _id: rolePermission._id },
      { $set: { role: memberRole._id } },
      { new: true }
    );
    if (response.modifiedCount > 0) {
      await UserModel.updateOne(
        { _id: req.body.user },
        {
          $set: {
            role: memberRole._id,
          },
        }
      );
      return res.status(200).send(msg.SUCCESSFULLY_ROLE_PERMISSION_REVOKED);
    } else throw new Error(msg.NO_ROLE_PERMISSIONS);
  } catch (ex) {
    next(ex);
  }
};
