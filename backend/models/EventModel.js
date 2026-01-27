import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      default: null,
    },
    secure_url: {
      type: String,
      default: null,
    },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Event", EventSchema);
