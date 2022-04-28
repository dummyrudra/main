const express = require("express");
const router = express.Router();
const {
  createOrg,
  getAllOrg,
} = require("../controllers/organization.controller");
const auth = require("../middlewares/auth");
const getPermission = require("../middlewares/getPermission");

const {
  validateOrganization,
} = require("../validations/organization.validate");

router.get("/", auth, getAllOrg);
router.post("/", auth, validateOrganization, createOrg);
module.exports = router;
