const express = require("express");
const router = express.Router();

const {
  getRolePermissionsByUserId,
  assignRolePermission,
  revokeRolePermission,
} = require("../controllers/rolePermission.controller");

const { validateObjectId } = require("../middlewares/validateObjectID");
const validateToken = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");

const {
  validateRolePermission,
} = require("../validations/rolePermission.validate");
//get role permissions of a user
router.get("/user/:id", validateObjectId, getRolePermissionsByUserId);
//assign new role to user
router.post(
  "/assign",
  validateRolePermission,
  validateToken,
  getPermissions,
  assignRolePermission
);
//revoke user role permissions 
router.post(
  "/revoke",
  validateRolePermission,
  validateToken,
  getPermissions,
  revokeRolePermission
);

module.exports = router;
