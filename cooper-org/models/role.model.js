const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "tenant", //reference of tenant model
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

        sprint: { create: true, update: true, delete: true, read: true },

        epic: { create: true, update: true, delete: true, read: true },

        stories: { create: false, update: false, delete: false, read: true },

        task: { create: true, update: true, delete: true, read: true },

        user: { create: false, update: true, delete: false, read: true },

        role: { create: false, update: false, delete: false, read: true },

        list: { create: true, update: true, delete: false, read: true },

        assignProjectLead: false,
        assignProjectTask: true,
        projectList: true,
        revokeMember: false,
        moveTask: true,
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
