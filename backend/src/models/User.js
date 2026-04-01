const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false, // don't send password in queries unless requested
  },

  phone: {
    type: String,
    default: "",
  },

  profilePicture: {
    type: String, // URL of the uploaded image
    default: "",
  },

role: {
  type: String,
  enum: ["customer", "mover", "admin"],
  default: "customer"
},

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("User", UserSchema);
