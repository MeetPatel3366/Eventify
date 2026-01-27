import mongoose from "mongoose";

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
      required: function () {
        return !this.isOAuthUser;
      },
    },
    isOAuthUser: {
      type: Boolean,
      default: false,
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
    organizerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role == "eventorganizer" ? "pending" : "approved";
      },
    },
    fullName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      trim: true,
    },
    profileImage: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    bio: {
      type: String,
      maxLength: [500, "Bio cannot exceed 500 characters"],
    },
    organizationName: {
      type: String,
      trim: true,
    },
    organizationWebsite: {
      type: String,
    },
    organizationDescription: {
      type: String,
      maxlength: [500, "Organization description cannot exceed 500 characters"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
