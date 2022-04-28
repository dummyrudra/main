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

// Roles......
router.get("/", getDefaultRoles);
router.get("/organization/:id", validateObjectId, getRolesByOrganizationId);
router.get("/tenant/:id", validateObjectId, getRolesByTenantId);

router.post("/", validateRole, validateToken, getPermissions, createRole);

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
