const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const rolePermissionSchema = new Schema(
  {
    organization: {
      type: mongoose.Types.ObjectId,
      ref: "organization",
      default: null,
    },
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "role",
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
