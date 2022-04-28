const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')
const organizationSchema = new Schema(
  {
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "tenant",
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

organizationSchema.plugin(uniqueValidator)
const OrganizationModel = model("organization", organizationSchema);

module.exports = { OrganizationModel, organizationSchema };
