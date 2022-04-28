const { RoleModel } = require("../models/role.model");
const UserModel = require("../models/user.model");
const { OrganizationModel } = require("../models/organization.model");
const msg = require("../services/role.message");

const getDefaultRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.find({
      $and: [
        {
          organization: null,
        },
        { tenant: null },
        { isDeleted: false },
      ],
    }).select("-__v -isDeleted");
    if (roles.length === 0) return res.status(404).send(msg.NO_DEFAULT_ROLES);
    res.status(200).send(roles);
  } catch (ex) {
    next(ex);
  }
};
const getRolesByOrganizationId = async (req, res, next) => {
  try {
    const organization = await OrganizationModel.findOne({
      _id: req.params.id,
    });
    if (!organization) return res.status(400).send(msg.NO_ORGANIZATION_ID);

    const roles = await RoleModel.find({
      $and: [
        {
          $or: [
            {
              organization: req.params.id,
            },
            { organization: null },
          ],
        },
        { isDeleted: false },
      ],
    }).select("-__v -isDeleted");
    if (roles.length === 0)
      return res.status(404).send(msg.NO_ROLE_OF_ORGANIZATIONID);
    return res.status(200).send(roles);
  } catch (ex) {
    next(ex);
  }
};
const getRolesByTenantId = async (req, res, next) => {
  try {
    const tenant = await UserModel.findOne({
      $and: [{ _id: req.params.id }, { isDeleted: false }],
    });

    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);

    const role = await RoleModel.find({
      $and: [
        {
          $or: [{ tenant: req.params.id }, { tenant: null }],
        },
        { isDeleted: false },
      ],
    }).select("-__v -isDeleted");
    if (role.length === 0) return res.status(404).send(msg.NO_ROLE_OF_TENANTID);
    res.status(200).send(role);
  } catch (ex) {
    next(ex);
  }
};

const createRole = async (permissions, req, res, next) => {
  try {
    if (!permissions.role.create) return res.status(401).send(msg.UNAUTHORIZED);

    const tenant = await UserModel.findOne({
      $and: [{ _id: req.params.tenant }, { isDeleted: false }],
    });

    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);

    const organization = await OrganizationModel.findOne({
      $and: [{ _id: req.body.organization }, { isDeleted: false }],
    });

    if (!organization) return res.status(400).send(msg.NO_ORGANIZATION_ID);

    const roleName = await RoleModel.findOne({
      $and: [
        { roleName: req.body.roleName.toLowerCase() },
        { isDeleted: false },
      ],
    });
    if (roleName) return res.status(400).send(msg.ROLE_NAME_ALREADY_EXISTS);

    let role = new RoleModel({
      roleName: req.body.roleName.toLowerCase(),
      tenant: req.params.tenant,
      organization: req.body.organization,
    });
    role = await role.save();
    res.status(200).send(role);
  } catch (ex) {
    next(ex);
  }
};

const updateRole = async function (permissions, req, res, next) {
  try {
    if (!permissions.role.update) return res.status(401).send(msg.UNAUTHORIZED);

    const tenant = await UserModel.findOne({
      $and: [{ _id: req.params.tenant }, { isDeleted: false }],
    });

    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);

    const roleName = await RoleModel.findOne({
      $and: [
        { roleName: req.body.roleName.toLowerCase() },
        { isDeleted: false },
      ],
    });
    if (roleName) return res.status(400).send(msg.ROLE_NAME_ALREADY_EXISTS);

    let role = await RoleModel.findOne({
      $and: [{ _id: req.params.id }, { isDeleted: false }],
    });
    if (!role) return res.status(400).send(msg.NO_ROLE_OF_ROLEID);
    if (!role.organization || !role.tenant)
      return res.status(401).send(msg.UNAUTHORIZED_UPDATE_DEFAULT_ROLE);

    role = await RoleModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          roleName: req.body.roleName.toLowerCase(),
          tenant: req.params.tenant,
        },
      },
      { new: true }
    );
    return res.status(200).send(msg.ROLE_UPDATED);
  } catch (ex) {
    next(ex);
  }
};

const deleteRole = async (permissions, req, res, next) => {
  try {
    if (!permissions.role.delete) return res.status(401).send(msg.UNAUTHORIZED);

    let role = await RoleModel.findOne({
      $and: [{ _id: req.params.id }, { isDeleted: false }],
    });
    if (!role.organization || !role.tenant)
      return res.status(401).send(msg.UNAUTHORIZED_DELETE_DEFAULT_ROLE);

    const response = await RoleModel.updateOne(
      { _id: role._id },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (response.modifiedCount > 0)
      return res.status(200).send(msg.SUCCESSFULLY_ROLE_DELETED);
    else throw new Error(msg.NO_ROLE_OF_ROLEID);
  } catch (ex) {
    res.status(404).send(msg.NO_ROLE_OF_ROLEID);
  }
};

// To set Default Roles
(async () => {
  try {
    const findAdmin = await RoleModel.findOne({
      $and: [{ roleName: "admin" }],
    });
    if (!findAdmin) {
      const admin = new RoleModel({
        roleName: "admin",
        permissions: {
          project: { create: true, update: true, delete: true, read: true },

          sprint: { create: true, update: true, delete: true, read: true },

          epic: { create: true, update: true, delete: true, read: true },

          stories: { create: true, update: true, delete: true, read: true },

          task: { create: true, update: true, delete: true, read: true },

          user: { create: true, update: true, delete: true, read: true },

          role: { create: true, update: true, delete: true, read: true },

          assignProjectLead: true,
          assignProjectTask: true,
          projectList: true,
          revokeMember: true,
          moveTask: true,
          assignRole: true,
          revokeRole: true,
        },
      });
      await admin.save();
    }
    const findMember = await RoleModel.findOne({ roleName: "member" });
    if (findMember !== null) return;
    const member = new RoleModel({
      roleName: "member",
    });
    await member.save();
  } catch (ex) {
    console.log(ex.message);
  }
})();

module.exports = {
  getDefaultRoles,
  getRolesByTenantId,
  getRolesByOrganizationId,
  createRole,
  deleteRole,
  updateRole,
};
