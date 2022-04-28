const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const billingSchema = new Schema(
  {
    plan: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    invoiceID: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const BillingModel = model("Billing", billingSchema);

module.exports = BillingModel;
