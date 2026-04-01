import { useState, useEffect } from "react";
import api from "../api";
import { Truck, MapPin, DollarSign, Save, ClipboardList, Package, User } from "lucide-react";

export default function MoverDashboard() {
  const [moverData, setMoverData] = useState({
    name: "",
    city: "",
    basePrice: "",
    pricePerKm: "",
    serviceAreas: "",
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchMoverProfile(), fetchBookings()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchMoverProfile = async () => {
    try {
      const res = await api.get("/api/movers/me");
      if (res.data) {
        setMoverData({
          ...res.data,
          serviceAreas: res.data.serviceAreas?.join(", ") || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch mover profile", err);
    }
  };

  const fetchBookings = async () => {
    try {
      console.log("Fetching bookings for mover...");
      const res = await api.get("/api/bookings/mover");
      console.log("Bookings response:", res.data);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      if (err.response) {
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
      }
    }
  };

  const handleChange = (e) => {
    setMoverData({ ...moverData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...moverData,
      serviceAreas: moverData.serviceAreas.split(",").map((s) => s.trim()).filter((s) => s !== ""),
    };

    try {
      await api.post("/api/movers", payload);
      setMessage("Business profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update business profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Mover Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-24 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Truck className="text-blue-600" /> Business Profile
            </h2>

            {message && (
              <div className={`p-4 mb-6 rounded-lg text-sm ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Business Name</label>
                <input
                  name="name"
                  value={moverData.name}
                  onChange={handleChange}
                  placeholder="e.g. MoveWell Logistics"
                  className="p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Primary City</label>
                <input
                  name="city"
                  value={moverData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className="p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Base (₹)</label>
                  <input
                    name="basePrice"
                    type="number"
                    value={moverData.basePrice}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Per Km (₹)</label>
                  <input
                    name="pricePerKm"
                    type="number"
                    value={moverData.pricePerKm}
                    onChange={handleChange}
                    className="p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <MapPin size={14} /> Service Areas
                </label>
                <textarea
                  name="serviceAreas"
                  value={moverData.serviceAreas}
                  onChange={handleChange}
                  placeholder="Delhi, Gurgaon, Noida"
                  rows="2"
                  className="p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50"
              >
                <Save size={18} /> {saving ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 min-h-[600px]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ClipboardList className="text-blue-600" /> Bookings Received
            </h2>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Package size={64} className="mb-4 opacity-20" />
                <p>No bookings received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border dark:border-gray-700 rounded-xl p-5 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <User size={18} className="text-blue-500" /> 
                          {booking.customer?.name || "Unknown Customer"}
                        </div>
                        <div className="text-sm text-gray-500 ml-7">
                          {booking.customer?.phone} | {booking.customer?.email}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">Pickup:</span>
                          <span className="text-gray-600 dark:text-gray-300">{booking.pickupLocation}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">Drop:</span>
                          <span className="text-gray-600 dark:text-gray-300">{booking.dropLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-sm">
                      <div className="flex gap-4">
                        <span className="text-gray-500">Distance: <b className="text-gray-900 dark:text-gray-100">{booking.distance} km</b></span>
                        <span className="text-gray-500">Status: <b className="text-blue-600">{booking.status}</b></span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ₹{booking.estimatedCost}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}