const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')
const organizationSchema = new Schema(
  {
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "tenant",  //reference of user model
    },
    organizationName: {
      type: String,
      required: true,
      unique: true,
    },
    organizationType: {
      type: String,
      required: true,
    },
    organizationUrl: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//check some fields are unique
organizationSchema.plugin(uniqueValidator)

const OrganizationModel = model("organization", organizationSchema);

module.exports = { OrganizationModel, organizationSchema };
