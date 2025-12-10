const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be required"],
      unique:true
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
  },
  { timestamps: true }
);

module.exports=mongoose.model("User",userSchema)