import mongoose from "mongoose";

const confirmationTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    token: { type: String, index: true },
    confirmedAt: Date,
    confirmationSentAt: Date,
  },
  { timestamps: true }
);

const ConfirmationToken = mongoose.model(
  "ConfirmationTokens",
  confirmationTokenSchema
);
export default ConfirmationToken;