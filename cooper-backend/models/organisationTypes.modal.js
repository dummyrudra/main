const { Schema, model } = require("mongoose");

const organizationTypesSchema = new Schema(
  {
    organizationTypeName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const OrganizationTypesModel = model(
  "organizationTypes",
  organizationTypesSchema
);

module.exports = { OrganizationTypesModel, organizationTypesSchema };
