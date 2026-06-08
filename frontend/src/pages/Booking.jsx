import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api"; // Assuming frontend/src/api.js is here

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moverId = searchParams.get("moverId");
  const [selectedMoveType, setSelectedMoveType] = useState(searchParams.get("moveType") || "");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [distance, setDistance] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [mover, setMover] = useState(null);

  const pickupContainerRef = useRef(null);
  const dropContainerRef = useRef(null);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);

  // Fetch selected mover details
  useEffect(() => {
    if (!moverId) return;

    const fetchMover = async () => {
      try {
        const res = await api.get(`/api/movers/${moverId}`);
        setMover(res.data);
        
        // If no moveType was pre-selected, default to the first one the mover offers
        if (!selectedMoveType && res.data.services?.length > 0) {
          setSelectedMoveType(res.data.services[0]);
        }
      } catch (err) {
        console.error("Mover fetch error:", err);
      }
    };

    fetchMover();
  }, [moverId, selectedMoveType]);

  // Close suggestions dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupContainerRef.current && !pickupContainerRef.current.contains(event.target)) {
        setShowPickupDropdown(false);
      }
      if (dropContainerRef.current && !dropContainerRef.current.contains(event.target)) {
        setShowDropDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch autocomplete suggestions for Pickup Location
  useEffect(() => {
    if (!pickup || pickup.trim().length < 3) {
      setTimeout(() => setPickupSuggestions([]), 0);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await api.get("/api/google/autocomplete", {
          params: { input: pickup }
        });
        setPickupSuggestions(res.data.predictions || []);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [pickup]);

  // Fetch autocomplete suggestions for Drop Location
  useEffect(() => {
    if (!drop || drop.trim().length < 3) {
      setTimeout(() => setDropSuggestions([]), 0);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await api.get("/api/google/autocomplete", {
          params: { input: drop }
        });
        setDropSuggestions(res.data.predictions || []);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [drop]);

  const handleSelectPickup = (address) => {
    setPickup(address);
    setPickupSuggestions([]);
    setShowPickupDropdown(false);
  };

  const handleSelectDrop = (address) => {
    setDrop(address);
    setDropSuggestions([]);
    setShowDropDropdown(false);
  };

// Distance Calculator
const calculateDistance = async () => {
  if (!pickup || !drop) {
    return alert("Enter pickup and drop addresses!");
  }

  try {
    const res = await api.get("/api/google/distance", {
      params: {
        origins: pickup,
        destinations: drop,
      },
    });

    const element = res.data.rows[0]?.elements[0];

    if (element?.status === "OK") {
      const distKM = element.distance.value / 1000;
      setDistance(distKM.toFixed(2));

      if (mover) {
        const cost = Math.round(
          Number(mover.basePrice) +
          distKM * Number(mover.pricePerKm)
        );
        setEstimatedCost(cost);
      }

      console.log("Distance fetched successfully:", distKM + " km");

    } else {
      alert("Route not found! Try different locations.");
    }

  } catch (err) {
    console.error("Distance API Error:", err);
    alert("Unable to fetch distance!");
  }
};


  // Submit Booking
  const handleBooking = async (paymentOption) => {
    if (!distance) return alert("Calculate distance first!");
    if (!bookingDate) return alert("Please select a booking date!");
    if (!selectedMoveType) return alert("Please select a service type!");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // 1. Create booking in DB
      const res = await api.post(
        "/api/bookings",
        {
          moverId,
          pickupLocation: pickup,
          dropLocation: drop,
          moveType: selectedMoveType,
          bookingDate,
          distance: Number(distance),
          paymentStatus: paymentOption === "pay_later" ? "pay_later" : "pending",
        }
      );

      const bookingId = res.data.booking._id;

      // 2. Handle payment based on selection
      if (paymentOption === "pay_later") {
        alert("Booking Confirmed (Pay Later)! 🎉");
        return navigate("/dashboard");
      }

      // If "pay_now", initialize Razorpay
      handleRazorpayPayment(bookingId);

    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed!");
    }
  };

  const handleRazorpayPayment = async (bookingId) => {
    try {
      // Create Razorpay Order
      const { data } = await api.post(
        "/api/bookings/razorpay/create-order",
        { bookingId }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SYA2kB8C6pkOB3", // Frontend key test mode
        amount: data.order.amount,
        currency: "INR",
        name: "MoveEase",
        description: "Payment for Booking",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await api.post(
              "/api/bookings/razorpay/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
              }
            );
            alert("Payment Successful! Booking Accepted 🎉");
            navigate("/dashboard");
          } catch (verifyErr) {
            console.error(verifyErr);
            alert("Payment Verification Failed. Please contact support.");
            navigate("/dashboard");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        alert("Payment Failed. Reason: " + response.error.description);
      });
      razorpayInstance.open();
    } catch (err) {
      console.error("Razorpay order creation failed:", err);
      alert("Failed to initialize payment gateway!");
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
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1 italic">
            Select Type of Shifting
          </label>
          <select 
            value={selectedMoveType} 
            onChange={(e) => setSelectedMoveType(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mover?.services?.length > 0 ? (
              mover.services.map(s => <option key={s} value={s}>{s}</option>)
            ) : (
              <>
                <option value="Home Shifting">Home Shifting</option>
                <option value="Office Shifting">Office Shifting</option>
                <option value="Vehicle Transport">Vehicle Transport</option>
              </>
            )}
          </select>
        </div>

        <div ref={pickupContainerRef} className="relative">
          <input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              setShowPickupDropdown(true);
            }}
            onFocus={() => setShowPickupDropdown(true)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showPickupDropdown && pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1">
              {pickupSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSelectPickup(suggestion.description)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer dark:text-white text-sm transition-colors border-b last:border-b-0 dark:border-gray-600"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={dropContainerRef} className="relative">
          <input
            type="text"
            placeholder="Drop Location"
            value={drop}
            onChange={(e) => {
              setDrop(e.target.value);
              setShowDropDropdown(true);
            }}
            onFocus={() => setShowDropDropdown(true)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showDropDropdown && dropSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1">
              {dropSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSelectDrop(suggestion.description)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer dark:text-white text-sm transition-colors border-b last:border-b-0 dark:border-gray-600"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1 italic">
            Select Date of Move
          </label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

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

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => handleBooking("pay_later")}
            className="flex-1 bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition font-bold disabled:opacity-50"
            disabled={!distance}
          >
            Pay Later (at Pickup)
          </button>

          <button
            onClick={() => handleBooking("pay_now")}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-bold disabled:opacity-50"
            disabled={!distance}
            title="Pay securely via Razorpay"
          >
            Pay Now 💳
          </button>
        </div>
      </div>
    </div>
  );
}
