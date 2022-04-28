const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user.model");
const msg = require('../services/auth.error.json')

module.exports = async (req, res, next) => {
  try {
    const decoded = jwt.decode(req.header("x-auth-token"));
    if(!decoded) return res.status(401).send(msg.unAuthorized.unAuthorized)
    req.params.tenant = decoded._id
    const user = await User.findById(decoded._id);
    const payload = jwt.verify(
      req.header("x-auth-token"),
      config.get("jwt") + user.password[user.password.length - 1]
    );
    next(payload);
  } catch (err) {
    if (err.message == "invalid signature")
      return res.status(401).send(msg.unAuthorized.tokenExpired);
    if (err.message == "Cannot read properties of null (reading 'password')")
      return res.status(401).send(msg.unAuthorized.tokenExpired);
    next(err);
  }
};
