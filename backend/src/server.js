require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./app.js");
const connectDB = require("./config/db");
const googleRoutes = require("./routes/google");


// Connect MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// CORS CONFIG - UPDATE VERCEL DOMAIN AFTER DEPLOY
app.use(cors({
  origin: [
    "http://localhost:5173", // Local frontend
    "https://mvease.vercel.app", // Active Vercel frontend
    "https://moveease-the-smartway-to-move.onrender.com" 
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

// To read JSON body (important!)
app.use(express.json());

// Debug: Check if Google API key loaded
console.log("Loaded Google API Key?", !!process.env.GOOGLE_MAPS_API_KEY);

// Routes
app.use("/api/google", googleRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
