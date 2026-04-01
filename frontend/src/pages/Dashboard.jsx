import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return;

  if (role) {
    setUserRole(role.toLowerCase()); // ensure lowercase
  }

  axios
    .get("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setBookings(res.data))
    .catch((err) => console.error("Bookings fetch failed:", err));
}, []);

  const token = localStorage.getItem("token");

  // Cancel Booking (Customer Only)
  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking Cancelled!");
      window.location.reload();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  // Update Status (Mover Only)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Booking ${status}!`);
      window.location.reload();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
  
    <div className="max-w-4xl mx-auto mt-20 min-h-screen transition-colors duration-300">
      
      <h2 className="text-2xl font-bold mb-6 dark:text-white">My Bookings</h2>
      






      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No bookings yet!</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="border p-5 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
            >
              <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                {b.mover?.name}
              </p>

              <p className="text-gray-700 dark:text-gray-300">Pickup: {b.pickupLocation}</p>
              <p className="text-gray-700 dark:text-gray-300">Drop: {b.dropLocation}</p>

              <p className="mt-2 font-semibold dark:text-gray-100">
                🚚 {b.distance} km | 💰 ₹{b.estimatedCost}
              </p>

              {/* Status Badge */}
              <p
                className={`mt-2 px-3 py-1 w-fit rounded text-white text-sm ${
                  b.status === "pending"
                    ? "bg-yellow-500"
                    : b.status === "accepted"
                    ? "bg-green-600"
                    : b.status === "rejected"
                    ? "bg-red-600"
                    : "bg-gray-500"
                }`}
              >
                Status: {b.status.toUpperCase()}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                📅 {new Date(b.createdAt).toLocaleString()}
              </p>

           {/* ACTION BUTTONS */}
<div className="mt-3 flex gap-3">
  {/* For Customer - Only Pending & Owned Booking */}
  {userRole === "customer" &&
    b.status === "pending" &&
    b.customer?._id === localStorage.getItem("userId") && (
      <button
        onClick={() => cancelBooking(b._id)}
        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Cancel Booking
      </button>
    )}

                {/* For Mover */}
                {userRole === "mover" && b.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(b._id, "accepted")}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(b._id, "rejected")}
                      className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
