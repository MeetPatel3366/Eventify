import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.connect(url).then(console.log("DB Connected...."));
};

export default connectDB;
