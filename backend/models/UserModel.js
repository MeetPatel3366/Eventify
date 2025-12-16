const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username must be required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email must be required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password must be required"],
    },
    role: {
      type: String,
      enum: ["admin", "eventorganizer", "customer"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isApprovedByAdmin: {
      type: Boolean,
      default: function () {
        return this.role != "eventorganizer";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
