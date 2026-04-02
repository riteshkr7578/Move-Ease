import api from "../api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

 useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return;

  if (role) {
    setUserRole(role.toLowerCase()); // ensure lowercase
  }

  api
    .get("/api/bookings")
    .then((res) => setBookings(res.data))
    .catch((err) => console.error("Bookings fetch failed:", err));
}, []);

  const token = localStorage.getItem("token");

  // Cancel Booking (Customer Only)
  const cancelBooking = async (id) => {
    try {
      const res = await api.put(`/api/bookings/${id}/cancel`);
      alert(res.data.msg || "Booking Cancelled!");
      window.location.reload();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert(err.response?.data?.msg || "Failed to cancel booking");
    }
  };

  // Update Status (Mover Only)
  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/api/bookings/${id}/status`,
        { status }
      );
      alert(`Booking ${status}!`);
      window.location.reload();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      const res = await api.post("/api/bookings/razorpay/create-order", { bookingId });
      const { order, booking } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MoveEase",
        description: `Payment for booking with ${booking.mover?.name || "Mover"}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post("/api/bookings/razorpay/verify", {
              ...response,
              bookingId: booking._id,
            });
            alert("Payment Successful!");
            window.location.reload();
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user"))?.name || "",
          email: JSON.parse(localStorage.getItem("user"))?.email || "",
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Failed to initiate payment");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const sMatch = statusFilter === "all" || b.status === statusFilter;
    const pMatch = paymentFilter === "all" || b.paymentStatus === paymentFilter;
    return sMatch && pMatch;
  });

  return (
  
    <div className="max-w-4xl mx-auto mt-20 min-h-screen transition-colors duration-300">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold dark:text-white">My Bookings</h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Payment Filter */}
          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="pay_later">Pay at Pickup</option>
          </select>
        </div>
      </div>
      






      {filteredBookings.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
           <p className="text-gray-600 dark:text-gray-400">No bookings found matching filters!</p>
           {(statusFilter !== "all" || paymentFilter !== "all") && (
             <button 
               onClick={() => { setStatusFilter("all"); setPaymentFilter("all"); }}
               className="mt-2 text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
             >
               Clear filters
             </button>
           )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="border p-5 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
            >
              <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                {b.mover?.name}
              </p>

              <p className="text-gray-700 dark:text-gray-300">Pickup: {b.pickupLocation}</p>
              <p className="text-gray-700 dark:text-gray-300">Drop: {b.dropLocation}</p>
              {b.moveType && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1 uppercase">
                  📦 {b.moveType}
                </p>
              )}

              <p className="mt-2 font-semibold dark:text-gray-100">
                🚚 {b.distance} km | 💰 ₹{b.estimatedCost}
              </p>

              {/* Status Badges */}
              <div className="flex gap-2 mt-2">
                <p
                  className={`px-3 py-1 rounded text-white text-sm font-medium ${
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

                {b.paymentStatus && (
                  <p
                    className={`px-3 py-1 rounded text-white text-sm font-medium ${
                      b.paymentStatus === "paid"
                        ? "bg-blue-600"
                        : b.paymentStatus === "pay_later"
                        ? "bg-orange-500"
                        : "bg-gray-400"
                    }`}
                  >
                    Payment: {b.paymentStatus === "pay_later" ? "PAY AT PICKUP" : b.paymentStatus.toUpperCase()}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                📅 Booked on: {new Date(b.createdAt).toLocaleDateString()}
              </p>
              {b.bookingDate && (
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                  🚛 Moving Date: {new Date(b.bookingDate).toLocaleDateString()}
                </p>
              )}

           {/* ACTION BUTTONS */}
           <div className="mt-3 flex gap-3">
             {/* For Customer - Only Pending & Owned Booking */}
             {userRole === "customer" && (
               <div className="flex gap-3">
                 {b.status === "pending" && (
                   <button
                     onClick={() => cancelBooking(b._id)}
                     className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors"
                   >
                     Cancel Booking
                   </button>
                 )}
                 {(b.paymentStatus === "pending" || b.paymentStatus === "pay_later") && b.status !== "cancelled" && b.status !== "rejected" && b.paymentStatus !== "paid" && (
                   <button
                     onClick={() => handlePayNow(b._id)}
                     className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
                   >
                     Pay Now
                   </button>
                 )}
               </div>
             )}

             {/* For Mover */}
             {userRole === "mover" && (
               <div className="flex gap-2 w-full">
                 {b.status === "pending" ? (
                   <>
                     <button
                       onClick={() => updateStatus(b._id, "accepted")}
                       className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition-colors"
                     >
                       Accept
                     </button>
                     <button
                       onClick={() => updateStatus(b._id, "rejected")}
                       className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium transition-colors"
                     >
                       Reject
                     </button>
                   </>
                 ) : (
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Update Status:</span>
                     <select
                       value={b.status}
                       onChange={(e) => updateStatus(b._id, e.target.value)}
                       className="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="accepted">Accepted</option>
                       <option value="completed">Completed</option>
                       <option value="rejected">Rejected</option>
                     </select>
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
       ))}
     </div>
      )}
    </div>
  );
}
