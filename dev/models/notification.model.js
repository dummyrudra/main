const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      default: "direct",
      enum: ["direct", "watching"],
    },
  },
  { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

module.exports = Notification;

const userSchema = new Schema({
  notifications: [
    {
      notification: {
        type: mongoose.Types.ObjectId,
        ref: "notifications",
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
