const mongoose = require("mongoose");

const oauthAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["google"],
      required: true,
    },
    providerAccountId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const OauthAccount = mongoose.model("OauthAccount", oauthAccountSchema);
