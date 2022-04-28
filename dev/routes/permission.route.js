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

router.get("/", getPermissions);
router.get("/tenant/:id", validateObjectId, getPermissionsByTenantId);

router.post("/", validatePermission, addPermission);

// router.delete("/:id", deletePermission);

module.exports = router;
