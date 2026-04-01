const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Mover = require("../models/Mover");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get stats for admin dashboard
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalMovers = await User.countDocuments({ role: "mover" });
    const totalBookings = await Booking.countDocuments();
    const recentBookings = await Booking.find()
      .populate("customer", "name email") // Changed from "user" to "customer"
      .populate("mover", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalMovers,
      totalBookings,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Manage Users (Get all customers)
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Manage Movers (Get all movers)
router.get("/movers", auth, admin, async (req, res) => {
  try {
    const movers = await User.find({ role: "mover" }).select("-password");
    res.json(movers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a user
router.delete("/user/:id", auth, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;