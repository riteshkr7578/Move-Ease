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

    const { moverId, pickupLocation, dropLocation, moveType, bookingDate, distance, paymentStatus } = req.body;

    if (!moverId || !pickupLocation || !dropLocation || !distance) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const mover = await Mover.findById(moverId);
    if (!mover) {
      return res.status(404).json({ msg: "Mover not found" });
    }

    // cost estimation (Total price the customer pays)
    const estimatedCost = mover.basePrice + distance * mover.pricePerKm;
    
    // Platform fee deduction (Mover pays 10% fee from their earnings)
    const platformFee = Math.round(estimatedCost * 0.10);
    const moverEarnings = estimatedCost - platformFee;

    const booking = await Booking.create({
      customer: req.user._id,
      mover: moverId,
      pickupLocation,
      dropLocation,
      moveType,
      bookingDate,
      distance,
      estimatedCost,
      platformFee,
      moverEarnings,
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

// GET bookings for a mover (Mover only)
router.get("/mover", auth, async (req, res) => {
  try {
    const mover = await Mover.findOne({ owner: req.user._id });
    if (!mover) {
      return res.status(404).json({ msg: "Mover profile not found" });
    }

    // Use a more flexible query to ensure the ID match is found
    const bookings = await Booking.find({ 
      mover: { $in: [mover._id, mover._id.toString()] } 
    })
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch mover bookings error:", err);
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
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
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

    if (status === "completed" && booking.status !== "completed") {
      const mover = await Mover.findById(booking.mover._id);
      if (mover) {
        // Ensure values exist (Fallback if fee calc wasn't in booking schema originally)
        const total = booking.estimatedCost || 0;
        const earning = booking.moverEarnings || (total * 0.9);
        const fee = booking.platformFee || (total * 0.1);

        if (booking.paymentStatus === "paid") {
          // ONLINE: Add 90% share to the withdrawable balance
          mover.wallet.balance += earning;
          mover.ledger.push({
            booking: booking._id,
            amount: earning,
            type: "earning",
            paymentStatus: "completed",
            paymentMethod: "online",
            description: `Online Earning from #${booking._id.toString().slice(-6)} (90%)`
          });
        } else {
          // CASH: Customer pays Mover directly.
          // Mover keeps 100% physically, but only 90% is "Earning".
          // The 10% is platform revenue they owe.
          mover.ledger.push({
            booking: booking._id,
            amount: earning,
            type: "earning",
            paymentMethod: "cash",
            description: `Cash Earning from #${booking._id.toString().slice(-6)} (90%)`
          });
          mover.wallet.commissionOwed += fee; // Platform tracks what it needs to collect
        }
        await mover.save();
      }
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
