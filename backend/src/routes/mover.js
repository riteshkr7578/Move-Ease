const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Mover = require("../models/Mover");
const City = require("../models/City"); // Added

// GET current mover's profile
router.get("/me", auth, async (req, res) => {
  try {
    const mover = await Mover.findOne({ owner: req.user._id });
    res.json(mover);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// only movers can create or update profile
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "mover") {
      return res.status(403).json({ msg: "Only movers can create business profile" });
    }

    const { name, city, basePrice, pricePerKm, serviceAreas, services } = req.body;

    if (!name || !city || !basePrice || !pricePerKm) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    // Upsert logic: update if exists, otherwise create
    const mover = await Mover.findOneAndUpdate(
      { owner: req.user._id },
      {
        owner: req.user._id,
        name,
        city,
        basePrice,
        pricePerKm,
        serviceAreas,
        services
      },
      { new: true, upsert: true }
    );

    res.json({ msg: "Mover business profile saved successfully", mover });

  } catch (err) {
    console.log("Mover create error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// PUBLIC: Get movers — filter by city and service areas
router.get("/", async (req, res) => {
  try {
    const { city } = req.query;

    const query = {};

    if (city) {
      // Look for a match in either the main 'city' or the 'serviceAreas' array
      query.$or = [
        { city: { $regex: city, $options: "i" } },
        { serviceAreas: { $regex: city, $options: "i" } }
      ];
    }

    const movers = await Mover.find(query).sort({ rating: -1 });

    res.json(movers);

  } catch (err) {
    console.log("List movers error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET single mover by ID
router.get("/:id", async (req, res) => {
  try {
    const mover = await Mover.findById(req.params.id);
    if (!mover) return res.status(404).json({ msg: "Mover not found" });

    res.json(mover);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// GET all unique cities where movers are available + major cities
router.get("/cities/all", async (req, res) => {
  try {
    const moverCities = await Mover.distinct("city");
    const serviceAreas = await Mover.distinct("serviceAreas");
    const predefinedCities = await City.find().distinct("name");
    
    // Combine and remove duplicates, then sort
    const allCities = [...new Set([...moverCities, ...serviceAreas, ...predefinedCities])].sort();
    
    res.json(allCities);
  } catch (err) {
    res.status(500).json({ msg: "Server error fetching cities" });
  }
});

// Cashout: Transfer wallet balance to bank (Simulation)
router.post("/cashout", auth, async (req, res) => {
  try {
    const mover = await Mover.findOne({ owner: req.user._id });
    if (!mover) return res.status(404).json({ msg: "Mover not found" });

    const cashoutAmount = mover.wallet.balance;
    if (cashoutAmount <= 0) return res.status(400).json({ msg: "No balance available for cashout" });

    // Deduct from balance
    mover.wallet.balance = 0;
    
    // Add to ledger
    mover.ledger.push({
      amount: cashoutAmount,
      type: "payout",
      description: `Cashout processed (Payout of ₹${cashoutAmount.toLocaleString()})`
    });

    await mover.save();
    res.json({ msg: "Cashout successful!", balance: 0, ledger: mover.ledger });
  } catch (err) {
    res.status(500).json({ msg: "Cashout failed" });
  }
});

// Pay Commission: Pay the platform for cash bookings (Simulation)
router.post("/pay-commission", auth, async (req, res) => {
  try {
    const mover = await Mover.findOne({ owner: req.user._id });
    if (!mover) return res.status(404).json({ msg: "Mover not found" });

    const amountToPay = mover.wallet.commissionOwed;
    if (amountToPay <= 0) return res.status(400).json({ msg: "No commission owed" });

    // Deduct from commissionOwed
    mover.wallet.commissionOwed = 0;
    
    // Add to ledger as deduction
    mover.ledger.push({
      amount: amountToPay,
      type: "deduction",
      description: `Commission paid to platform for cash bookings`
    });

    await mover.save();
    res.json({ msg: "Commission paid successfully!", commissionOwed: 0, ledger: mover.ledger });
  } catch (err) {
    res.status(500).json({ msg: "Commission payment failed" });
  }
});

module.exports = router;
