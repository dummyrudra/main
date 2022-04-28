const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const rolePermissionSchema = new Schema(
  {
    organization: {
      type: mongoose.Types.ObjectId,
      ref: "organization",    //reference of organization model
      default: null,
    },
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "user",  //reference of user model
      default: null,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",    //reference of user model
      required: true,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "role",        //reference of role model
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RolePermissionModel = model("rolePermission", rolePermissionSchema);

module.exports = { RolePermissionModel, rolePermissionSchema };
