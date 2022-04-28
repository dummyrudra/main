const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const tenantSchema = new Schema(
  {
    domainName: {      //domain name of organization
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    active: {     //status of organization
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index:true
    },
  },
  { timestamps: true }
);

const TenantModel = model("tenant", tenantSchema);

module.exports = { TenantModel, tenantSchema };
