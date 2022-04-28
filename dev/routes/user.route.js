const express = require("express");
const userController = require("../controllers/user.controller");
const { validateObjectId } = require("../middlewares/validateObjectID");
const {validateUserID}=require('../middlewares/validateUserID')
const { userValidateSignUp } = require("../validations/user.validate");
const {addDefaultAdminRole} = require('../controllers/rolePermission.controller');
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadAvatar");
const getPermission = require("../middlewares/getPermission");

//change for prabhat
const router = express.Router();


router.get('',auth, getPermission,userController.getAllUser)

router.get("/:id",validateObjectId,validateUserID,auth, getPermission, userController.getUserById);

router.get("/organization/:id",validateObjectId,auth, getPermission, userController.getUsersByOrganizationID);

router.patch("/:id",validateObjectId,validateUserID, auth, getPermission , userController.updateUser);


router.delete("/:id",validateObjectId,validateUserID, auth, getPermission, userController.deleteUser);

router.post("/signup", userValidateSignUp,userController.signUpUser,addDefaultAdminRole);

router.patch('/avatar/:id',validateObjectId,validateUserID,upload.single('avatar'),auth, getPermission,userController.updateAvatar)

module.exports = router;


