const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "tenant",
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "avatar.png", //default image of user
    },
    otp: {
      type: String,
      maxlength: 4,
      minlength: 4,
    },
    password: [
      {
        type: String,
        required: true,
        minlength: 7,
      },
    ],
    jobTitle: {
      type: String,
      minlength: 3,
      maxlength: 60,
      default: null,
    },
    department: {
      type: String,
      minlength: 3,
      maxlength: 60,
      default: null,
    },
    organization: {
      type: mongoose.Types.ObjectId,
      ref: "organization",
      default: null,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "role",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

//check some fields are unique like email
userSchema.plugin(uniqueValidator);

const User = model("user", userSchema);

module.exports = User;
