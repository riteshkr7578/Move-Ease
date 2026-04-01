// backend/src/routes/booking.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Booking = require("../models/Booking");
const Mover = require("../models/Mover");

/**
 * ----------------------------------------
 * 1) CREATE BOOKING (Customer Only)
 * ----------------------------------------
 */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ msg: "Only customers can book movers" });
    }

    const { moverId, pickupLocation, dropLocation, distance, paymentStatus } = req.body;

    if (!moverId || !pickupLocation || !dropLocation || !distance) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const mover = await Mover.findById(moverId);
    if (!mover) {
      return res.status(404).json({ msg: "Mover not found" });
    }

    // cost estimation
    const estimatedCost = mover.basePrice + distance * mover.pricePerKm;

    const booking = await Booking.create({
      customer: req.user._id,
      mover: moverId,
      pickupLocation,
      dropLocation,
      distance,
      estimatedCost,
      status: "pending",
      paymentStatus: paymentStatus || "pending"
    });

    res.json({
      msg: "Booking created",
      booking
    });

  } catch (err) {
    console.log("Booking create error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * ----------------------------------------
 * RAZORPAY INTEGRATION
 * ----------------------------------------
 */

router.post("/razorpay/create-order", auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("mover");
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SYA2kB8C6pkOB3",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "PkHHgp0TJGt8F2T8avFVcsSs",
    });

    const options = {
      amount: Math.round(booking.estimatedCost * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await instance.orders.create(options);
    
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({ order, booking });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ msg: "Failed to create razorpay order" });
  }
});

router.post("/razorpay/verify", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "PkHHgp0TJGt8F2T8avFVcsSs";

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Payment is successful
      const booking = await Booking.findById(bookingId);
      booking.paymentStatus = "paid";
      booking.status = "accepted"; // Auto-accept order when paid
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();

      return res.json({ msg: "Payment verified successfully", booking });
    } else {
      return res.status(400).json({ msg: "Invalid signature" });
    }
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({ msg: "Verification failed" });
  }
});


/**
 * ----------------------------------------
 * 2) GET ALL BOOKINGS (Customer & Mover)
 * ----------------------------------------
 */
router.get("/", auth, async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "customer") {
      // Customer sees only his own bookings
      bookings = await Booking.find({ customer: req.user._id })
        .populate("mover")
        .populate("customer", "name email");
    } else {
      // mover sees bookings for HIS business
      bookings = await Booking.find()
        .populate("mover")
        .populate("customer", "name email");

      bookings = bookings.filter(
        (b) => String(b.mover.owner) === String(req.user._id)
      );
    }

    res.json(bookings);

  } catch (err) {
    console.log("Booking list error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Cancel booking
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ msg: "Only customers can cancel bookings" });
    }

    const booking = await Booking.findById(req.params.id).populate("customer");

    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (String(booking.customer._id) !== String(req.user._id)) {
      return res.status(403).json({ msg: "You can cancel only your own bookings" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ msg: "Booking cannot be canceled now" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({ msg: "Booking cancelled successfully!", booking });

  } catch (err) {
    console.log("Booking cancel error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});


/**
 * ----------------------------------------
 * 3) GET SINGLE BOOKING BY ID
 * ----------------------------------------
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("mover")
      .populate("customer", "_id name email role");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Access control:
    const isCustomer = String(booking.customer._id) === String(req.user._id);
    const isMover = String(booking.mover.owner) === String(req.user._id);

    if (!isCustomer && !isMover) {
      return res.status(403).json({ msg: "Permission denied" });
    }

    res.json(booking);

  } catch (err) {
    console.log("Booking get error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/**
 * ----------------------------------------
 * 4) MOVER ACCEPT / REJECT BOOKING
 * ----------------------------------------
 */
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (req.user.role !== "mover") {
      return res.status(403).json({ msg: "Only movers can update booking status" });
    }

    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id).populate("mover");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // ensure logged-in mover owns this business
    if (String(booking.mover.owner) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    booking.status = status;
    await booking.save();

    res.json({ msg: "Status updated", booking });

  } catch (err) {
    console.log("Booking update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});




module.exports = router;
