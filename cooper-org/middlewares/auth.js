const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user.model");
const msg = require('../services/auth.error.json')


//check user is authenticated or not 
module.exports = async (req, res, next) => {
  try {
    const decoded = jwt.decode(req.header("x-auth-token"));
    if(!decoded) return res.status(401).send(msg.unAuthorized.unAuthorized)
    req.params.tenant = decoded._id
    const user = await User.findById(decoded._id);
    if(!(user.organization.toString()===decoded.organizationId)){
      return res.status(401).send(msg.organizationApi.badRequest.ORGANIZATION_NOT_FOUND)
    }
    //validate header token 
    const payload = jwt.verify(
      req.header("x-auth-token"),
      config.get("jwt") + user.password[user.password.length - 1]
    );
    next(payload);
  } catch (err) {
    //send specific message to user
    if (err.message == "invalid signature")
      return res.status(401).send(msg.unAuthorized.tokenExpired);
    if (err.message == "Cannot read properties of null (reading 'password')")
      return res.status(401).send(msg.unAuthorized.tokenExpired);
    next(err);
  }
};
