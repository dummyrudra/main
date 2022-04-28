const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "tenant",  //reference of tenant model
      default: null,
    },
    roleName: {
      type: String,
      required: true,
    },
    organization: {
      type: mongoose.Types.ObjectId,
      ref: "organization", //reference of organization model
      default: null,
    },
    permissions: {
      type: Object,
      default: {
        project: { create: false, update: false, delete: false, read: true },

        sprint: { create: false, update: false, delete: false, read: true },

        epic: { create: false, update: false, delete: false, read: true },

        stories: { create: false, update: false, delete: false, read: true },

        task: { create: false, update: false, delete: false, read: true },

        user: { create: false, update: false, delete: false, read: true },

        role: { create: false, update: false, delete: false, read: true },

        assignProjectLead: false,
        assignProjectTask: false,
        projectList: false,
        revokeMember: false,
        moveTask: false,
        assignRole: false,
        revokeRole: false,
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RoleModel = model("role", roleSchema);
module.exports = { RoleModel, roleSchema };
