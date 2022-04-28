const express = require("express");
const router = express.Router();
const {
  getAllOrganization,
  getOrganization,
  createOrganization,
  joinOrganization,
  leaveOrganization,
  updateOrganization,
} = require("../controllers/organization.controller");
const auth = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");
const { validateObjectId } = require("../middlewares/validateObjectID");

const {
  validateOrganization,
  validateJoinOrg,
  validateUpdateOrganization,
} = require("../validations/organization.validate");

//get all organization through this route
router.get("/", getAllOrganization);
router.get("/:id", validateObjectId, getOrganization);
//create organization through token to use as tenant of organization
router.post("/", validateOrganization, auth, createOrganization);

router.put(
  "/:id",
  validateObjectId,
  validateUpdateOrganization,
  auth,
  updateOrganization
);

router.patch(
  "/join/:id",
  validateObjectId,
  validateJoinOrg,
  auth,
  joinOrganization
);
router.patch(
  "/leave/:id",
  validateObjectId,
  validateJoinOrg,
  auth,
  getPermissions,
  leaveOrganization
);
module.exports = router;
