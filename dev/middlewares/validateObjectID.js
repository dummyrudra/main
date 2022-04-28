const mongoose = require("mongoose");
const messages=require('../messages.json');

module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send(messages.CommonAPI.INVALID_ID_REQUEST);
  }
  next();
};
