const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");

//importing routes
const EventRoutes = require("./routes/EventRoutes");
const UserRoutes = require("./routes/UserRoutes");
const ContactMessageRoutes = require("./routes/ContactRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const BookingRoutes=require("./routes/BookingRoutes")

//PORT
PORT = process.env.PORT || 5000;

//Disable ETag generation
app.set('etag', false);

//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//routing middlewares
app.use("/api/auth", UserRoutes);
app.use("/api/events", EventRoutes);
app.use("/api/contact", ContactMessageRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/bookings", BookingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is connected to port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
