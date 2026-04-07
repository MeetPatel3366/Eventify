import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "refund_pending"],
      default: "confirmed",
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    razorpayRefundId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded", "refund_pending"],
      default: "pending",
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    refundApprovedAt: {
      type: Date,
      default: null,
    },
    selectedTheme: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", BookingSchema);
