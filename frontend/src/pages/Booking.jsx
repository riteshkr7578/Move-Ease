import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moverId = searchParams.get("moverId");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [mover, setMover] = useState(null);

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  // Fetch selected mover details
  useEffect(() => {
    if (!moverId) return;

    const fetchMover = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movers/${moverId}`);
        setMover(res.data);
        
      } catch (err) {
        console.error("Mover fetch error:", err);
      }
    };

    fetchMover();
  }, [moverId]);

  // Google Places Autocomplete
  useEffect(() => {
    if (!window.google) return;

    const pickupAuto = new window.google.maps.places.Autocomplete(pickupRef.current);
    const dropAuto = new window.google.maps.places.Autocomplete(dropRef.current);

    pickupAuto.addListener("place_changed", () => {
      const place = pickupAuto.getPlace();
      if (place?.formatted_address) setPickup(place.formatted_address);
    });

    dropAuto.addListener("place_changed", () => {
      const place = dropAuto.getPlace();
      if (place?.formatted_address) setDrop(place.formatted_address);
    });
  }, []);

  // Distance Calculator
 const calculateDistance = async () => {
  if (!pickup || !drop) {
    return alert("Enter pickup and drop addresses!");
  }

  try {
    const res = await axios.get("http://localhost:5000/api/google/distance", {
      params: {
        origins: pickup,
        destinations: drop,
      },
    });

    const element = res.data.rows[0].elements[0];

    if (element.status === "OK") {
      const distKM = element.distance.value / 1000;
      setDistance(distKM.toFixed(2));

      if (mover) {
        const cost = Math.round(
          Number(mover.basePrice) +
            distKM * Number(mover.pricePerKm)
        );
        setEstimatedCost(cost);
      }
    } else {
      alert("Route not found! Try different locations.");
    }
  } catch (err) {
    console.error("Distance API Error:", err);
    alert("Unable to fetch distance!");
  }
};

  // Submit Booking
  const handleBooking = async () => {
    if (!distance) return alert("Calculate distance first!");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          moverId,
          pickupLocation: pickup,
          dropLocation: drop,
          distance: Number(distance),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booking Confirmed! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed!");
    }
  };  

  return (
    <div className="max-w-3xl mx-auto mt-28 bg-white dark:bg-gray-800 shadow-lg p-8 rounded-xl transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Confirm Your Booking</h2>

      {mover ? (
        <p className="mb-4 font-semibold dark:text-gray-200">
          Selected Mover: <span className="text-blue-600 dark:text-blue-400">{mover.name}</span>
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Loading mover information...</p>
      )}

      <div className="space-y-5">
        <input
          ref={pickupRef}
          type="text"
          placeholder="Pickup Location"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <input
          ref={dropRef}
          type="text"
          placeholder="Drop Location"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          onClick={calculateDistance}
          className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          Calculate Distance
        </button>

       {distance && (
  <p className="font-semibold text-lg mt-3 dark:text-white">
    🚚 Distance: {distance} km — Estimated Cost:{" "}
    <span className="text-green-600 dark:text-green-400 font-bold">₹ :{estimatedCost}</span>
  </p>
)}

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
