const { OrganizationModel } = require("../models/organization.model");
const { RoleModel } = require("../models/role.model");
const { RolePermissionModel } = require("../models/rolePermission.model");
const msg = require("../services/auth.error.json");

//check user permissions
module.exports = async (payload, req, res, next) => {
  try {
    if (req.params.org) {
      const organization = await OrganizationModel.findOne({
        _id: payload.organizationId,
      });

      if (
        !organization ||
        organization.organizationName.toUpperCase().split(" ").join("") !==
          req.params.org.toUpperCase()
      )
        return res
          .status(401)
          .send(msg.unAuthorized.ORGANIZATION_MEMBER_NOT_FOUND);
    }
    const rolePermission = await RolePermissionModel.findOne({
      user: payload._id,
    });
    if (!rolePermission)
      return res.status(401).send(msg.unAuthorized.unAuthorized);
    const role = await RoleModel.findById({
      _id: rolePermission.role.toString(),
    });
    if (!role) return res.status(401).send(msg.unAuthorized.unAuthorized);
    return next(role.permissions);
  } catch (err) {
    next(err);
  }
};
