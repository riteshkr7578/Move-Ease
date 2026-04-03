const mongoose = require("mongoose");

const MoverSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: { type: String, required: true }, // Mover company name
  city: { type: String, default: "Not specified" }, // Main city / base location

  basePrice: { type: Number, default: 0 }, // optional for initial creation
  pricePerKm: { type: Number, default: 0 }, // optional for initial creation

  rating: { type: Number, default: 4.5 },
  totalReviews: { type: Number, default: 0 },
  serviceAreas: { type: [String], default: [] }, // Array of cities served
  services: { 
    type: [String], 
    default: ["Home Shifting", "Office Shifting", "Vehicle Transport"] 
  }, // Types of services offered

  wallet: {
    balance: { type: Number, default: 0 }, // Ready for payout (Online payments)
    pending: { type: Number, default: 0 }, // Upcoming or in-progress
    commissionOwed: { type: Number, default: 0 } // For cash transactions (10% of total)
  },

  ledger: [{
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    amount: { type: Number },
    type: { type: String, enum: ["earning", "commission", "payout", "deduction"] },
    paymentMethod: { type: String, enum: ["online", "cash"] },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mover", MoverSchema);
