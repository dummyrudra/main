const { RolePermissionModel } = require("../models/rolePermission.model");

module.exports = async (payload, req, res, next) => {
  try {
    const rolePermission = await RolePermissionModel.findOne({
      user: payload._id,
    }).populate(["role"]);
    // console.log(rolePermission)
    if (rolePermission.role.roleName == "admin") return next();
    return res.status(401).send({ status: 401, message: "Not allowed" });
  } catch (err) {
    next(err);
  }
};
