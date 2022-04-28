const { PermissionModel } = require("../models/permission.model");
const UserModel = require("../models/user.model");
const msg = require("../services/role.message");

//check user permissions is accessibility to use

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
    //check if permissions null
    if (permissions.length === 0)
      return res.status(404).send(msg.NO_DEFAULT_PERMISSIONS);
    res.status(200).send(permissions);
  } catch (ex) {
    next(ex);
  }
};
//get permissions by tenant ID
const getPermissionsByTenantId = async (req, res, next) => {
  try {
    const tenant = await UserModel.findOne({
      $and: [{ _id: req.params.id }, { isDeleted: false }],
    });
    //check tenant is exist in user model or not
    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);
    //extract permissions of user
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
    //check if permissions null
    if (permission.length === 0)
      return res.status(404).send(msg.NO_PERMISSION_OF_TENANTID);
    return res.status(200).send(permission);
  } catch (ex) {
    next(ex);
  }
};
//add permissions after user signup
const addPermission = async (req, res, next) => {
  try {
    const tenant = await UserModel.findOne({
      $and: [{ _id: req.body.tenant }, { isDeleted: false }],
    });
    //check user existence in user model
    if (!tenant) return res.status(400).send(msg.NO_TENANT_ID);
    //find permission name
    const permissionName = await PermissionModel.findOne({
      permissionName: req.body.permissionName,
    });
    //check permission name already in database
    if (permissionName)
      return res.status(400).send(msg.PERMISSION_NAME_ALREADY_EXISTS);
    //create permission
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
