const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

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
      // Create full URL (assuming your backend runs on same domain or we just save path)
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
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

module.exports = router;
