const express = require("express");
const router = express.Router();

const {
  getDefaultRoles,
  getRolesByTenantId,
  getRolesByOrganizationId,
  createRole,
  deleteRole,
  updateRole,
} = require("../controllers/role.controller");
const {
  validateRole,
  validateUpdateRole,
} = require("../validations/role.validate");
const { validateObjectId } = require("../middlewares/validateObjectID");
const validateToken = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");

//get Default roles
router.get("/", getDefaultRoles);
//get all roles of organization through organization ID
router.get("/organization/:id", validateObjectId, getRolesByOrganizationId);
//get all roles of tenant
router.get("/tenant/:id", validateObjectId, getRolesByTenantId);
//create new role through token
router.post("/", validateRole, validateToken, getPermissions, createRole);
//update the role of a user
router.put(
  "/:id",
  validateUpdateRole,
  validateObjectId,
  validateToken,
  getPermissions,
  updateRole
);

router.delete(
  "/:id",
  validateObjectId,
  validateToken,
  getPermissions,
  deleteRole
);

module.exports = router;
