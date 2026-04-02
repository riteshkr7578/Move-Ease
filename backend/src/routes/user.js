const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, req.user._id + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // limit 5MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Images only! (jpeg, jpg, png, webp, avif)"));
    }
  }
});

// TEST: Get current user's profile
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/user/me - Update profile basic details and profile picture
router.put("/me", auth, upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Check if there's a new file uploaded
    if (req.file) {
      // Save absolute path directly to Render server to ensure it is always fetched from there
      const imageUrl = `https://moveease-the-smartway-to-move.onrender.com/uploads/${req.file.filename}`;
      user.profilePicture = imageUrl;
    }

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
});

// Change Password Route
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
