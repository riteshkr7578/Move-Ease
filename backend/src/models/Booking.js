const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mover",
    required: true
  },

  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  moveType: { type: String },
  bookingDate: { type: Date },

  distance: { type: Number, required: true },  // in km
  estimatedCost: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  moverEarnings: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "pay_later"],
    default: "pending"
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
