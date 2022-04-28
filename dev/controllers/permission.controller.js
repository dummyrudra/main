const { PermissionModel } = require("../models/permission.model");
const UserModel = require("../models/user.model");
const msg = require("../services/role.message");

const getPermissions = async (req, res, next) => {
  try {
    const permissions = await PermissionModel.find({
      $and: [
        {
          tenant: null,
        },
        { isDeleted: false },
      ],
    }).select("-__v -isDeleted");
    if (permissions.length === 0)
      return res.status(404).send(msg.NO_DEFAULT_PERMISSIONS);
    res.status(200).send(permissions);
  } catch (ex) {
    next(ex);
  }
};

const getPermissionsByTenantId = async (req, res, next) => {
  try {
    const tenant = await UserModel.findOne({
      $and: [{ _id: req.params.id }, { isDeleted: false }],
    });

    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);

    const permission = await PermissionModel.find({
      $and: [
        {
          $or: [
            {
              tenant: req.params.id,
            },
            { tenant: null },
          ],
        },
        { isDeleted: false },
      ],
    }).select("-__v -isDeleted");
    if (permission.length === 0)
      return res.status(404).send(msg.NO_PERMISSION_OF_TENANTID);
    return res.status(200).send(permission);
  } catch (ex) {
    next(ex);
  }
};

const addPermission = async (req, res, next) => {
  try {
    const tenant = await UserModel.findOne({
      $and: [{ _id: req.body.tenant }, { isDeleted: false }],
    });

    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);

    const permissionName = await PermissionModel.findOne({
      permissionName: req.body.permissionName,
    });

    if (permissionName)
      return res.status(400).send(msg.PERMISSION_NAME_ALREADY_EXISTS);

    let permission = new PermissionModel({
      permissionName: req.body.permissionName,
      action: req.body.action,
      tenant: req.body.tenant,
    });
    permission = await permission.save();
    res.status(200).send(permission);
  } catch (ex) {
    next(ex);
  }
};

const deletePermission = async (req, res, next) => {
  res.status(200).send("Under development");
  // try {
  //   const permission = await PermissionModel.findOne({
  //     $and: [{ _id: req.params.id }, { isDeleted: false }],
  //   });
  //   if (!permission.organization)
  //     return res
  //       .status(403)
  //       .send(msg.UNAUTHORIZED_DELETE_DEFAULT_PERMISSION);
  //   permission.isDeleted = true;
  //   await permission.save();
  //   return res.status(200).send(msg.SUCCESSFULLY_PERMISSION_DELETED);
  // } catch (ex) {
  //   res.status(404).send(msg.NO_PERMISSION_OF_PERMISSIONID);
  // }
};

module.exports = {
  getPermissions,
  getPermissionsByTenantId,
  addPermission,
  deletePermission,
};
