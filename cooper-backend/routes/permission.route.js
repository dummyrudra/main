const express = require("express");
const router = express.Router();

const {
  getPermissions,
  getPermissionsByTenantId,
  addPermission,
  // deletePermission,
} = require("../controllers/permission.controller");
const { validatePermission } = require("../validations/permission.validate");
const { validateObjectId } = require("../middlewares/validateObjectID");

//get all permissions
router.get("/", getPermissions);
//get permissions of tenant through user ID
router.get("/tenant/:id", validateObjectId, getPermissionsByTenantId);
//add permission in permissions
router.post("/", validatePermission, addPermission);

// router.delete("/:id", deletePermission);

module.exports = router;
