const express = require("express");
const router = express.Router();
const {
  getAllOrganization,
  getOrganization,
  createOrganization,
  joinOrganization,
} = require("../controllers/organization.controller");
const auth = require("../middlewares/auth");
const getPermissions = require("../middlewares/getPermission");
const { validateObjectId } = require("../middlewares/validateObjectID");

const {
  validateOrganization,
  validateJoinOrg,
} = require("../validations/organization.validate");

//get all organization through this route
router.get("/", getAllOrganization);
router.get("/:id", validateObjectId, getOrganization);
//create organization through token to use as tenant of organization
router.post("/", validateOrganization, auth, createOrganization);
router.patch(
  "/join/:id",
  validateObjectId,
  validateJoinOrg,
  auth,
  joinOrganization
);
module.exports = router;
