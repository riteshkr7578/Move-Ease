const express = require("express");
const router = express.Router();
const axios = require("axios");

console.log("Loaded API Key?", process.env.GOOGLE_MAPS_API_KEY ? "YES" : "NO");

router.get("/distance", async (req, res) => {
  try {
    const { origins, destinations } = req.query;

    const googleRes = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins,
          destinations,
          key: process.env.GOOGLE_MAPS_API_KEY,
          units: "metric"
        }
      }
    );

    res.json(googleRes.data);
  } catch (err) {
    res.status(500).json({ msg: "Google API failed", error: err.message });
  }
});
router.get("/autocomplete", async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res.json({ predictions: [] });
    }

    const googleRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          key: process.env.GOOGLE_MAPS_API_KEY,
          types: "geocode", // optional: restrict suggestions to addresses/regions
        },
      }
    );

    res.json(googleRes.data);
  } catch (err) {
    res.status(500).json({ msg: "Google API failed", error: err.message });
  }
});

module.exports = router;
