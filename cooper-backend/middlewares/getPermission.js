const { RoleModel } = require("../models/role.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const msg = require('../services/auth.error.json')

//check user permissions
module.exports = async (payload, req, res, next) => {
  try {
    const rolePermission = await RolePermissionModel.findOne({
      user: payload._id,
    });
    if(!rolePermission) return res.status(401).send(msg.unAuthorized.unAuthorized)
    const role = await RoleModel.findById({ _id: rolePermission.role });
    if(!role) return res.status(401).send(msg.unAuthorized.unAuthorized)
    return next(role.permissions);
  } 
  catch (err) {
    next(err);
  }
};
