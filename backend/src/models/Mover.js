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

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mover", MoverSchema);
