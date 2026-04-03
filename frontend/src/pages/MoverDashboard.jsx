import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Truck, MapPin, DollarSign, Save, ClipboardList, Package, User, CheckCircle, TrendingUp, Wallet, ArrowUpRight, Clock } from "lucide-react";

export default function MoverDashboard() {
  const [moverData, setMoverData] = useState({
    name: "",
    city: "",
    basePrice: "",
    pricePerKm: "",
    serviceAreas: "",
    services: [], // Array of service names
  });

  const availableServicesList = [
    "Home Shifting",
    "Office Shifting",
    "Vehicle Transport",
    "Fragile Shifting",
    "International Relocation",
    "Industrial Shifting",
    "Storage & Warehouse"
  ];
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "wallet"

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
          services: res.data.services || [],
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

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/bookings/${id}/status`, { status });
      setMessage(`Booking ${status} successfully!`);
      fetchBookings(); // Refresh bookings list
    } catch (err) {
      console.error("Status update failed:", err);
      setMessage("Failed to update status.");
    }
  };

  const handleChange = (e) => {
    setMoverData({ ...moverData, [e.target.name]: e.target.value });
  };

  const calculateEarnings = () => {
    // Current Withdrawable online balance
    return moverData?.wallet?.balance || 0;
  };

  const calculateTotalEarned = () => {
    // Check if we have ledger data in moverData
    if (moverData?.ledger && moverData.ledger.length > 0) {
      return moverData.ledger
        .filter(l => l.type === 'earning')
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    }
    // Fallback: Calculate from bookings directly if ledger is empty (for transition period)
    return bookings
      .filter(b => b.status === "completed")
      .reduce((acc, curr) => acc + (curr.moverEarnings || curr.estimatedCost * 0.9 || 0), 0);
  };

  const calculatePlatformFees = () => {
    return bookings
      .filter(b => b.status === "completed")
      .reduce((acc, curr) => acc + (curr.platformFee || 0), 0);
  };

  const calculateForecast = () => {
    return bookings
      .filter(b => b.status !== "completed" && b.status !== "cancelled")
      .reduce((acc, curr) => acc + (curr.moverEarnings || curr.estimatedCost || 0), 0);
  };

  const toggleService = (service) => {
    let currentServices = [...moverData.services];
    if (currentServices.includes(service)) {
      currentServices = currentServices.filter((s) => s !== service);
    } else {
      currentServices.push(service);
    }
    setMoverData({ ...moverData, services: currentServices });
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-10">
      <div className="flex flex-col items-center gap-4">
        <Truck className="animate-bounce text-blue-600" size={48} />
        <p className="text-xl font-semibold dark:text-white">Loading Mover Panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-20">
      {/* HEADER SECTION */}
      <section className="pt-4 pb-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight dark:text-white uppercase italic underline decoration-blue-600 underline-offset-8">Business Panel</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Overview of your logistics empire.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                  {bookings.length}
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Jobs</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Active Projects</p>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 rounded-2xl border border-green-100 dark:border-green-800 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-500/20">
                   <Link to="/payouts"><Wallet size={20}/></Link>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest leading-tight">Available to Redeem<br/><span className="text-[9px] opacity-70">(Paid Online)</span></p>
                  <p className="grow text-sm font-black text-green-600">₹{Math.floor(moverData?.wallet?.balance || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setActiveTab("bookings")}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              Order Management
            </button>
            <button 
              onClick={() => setActiveTab("wallet")}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all ${activeTab === 'wallet' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              Payouts & Ledger
            </button>
          </div>
        </div>
      </section>

      {/* QUICK ANALYTICS */}
      <div className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl"><TrendingUp size={24}/></div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Growth Rate</p>
                    <p className="text-xl font-black">
                      +{((bookings.filter(b => b.status === 'completed').length / (bookings.length || 1)) * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
            <ArrowUpRight className="text-green-500" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl"><Clock size={24}/></div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Avg Response</p>
                    <p className="text-xl font-black">2.4 hrs</p>
                </div>
            </div>
            <span className="text-[10px] font-bold text-blue-500 p-1 bg-blue-50 dark:bg-blue-900/20 rounded">TOP 5%</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-2xl"><User size={24}/></div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Jobs Value</p>
                    <p className="text-xl font-black">₹{calculateForecast().toLocaleString()}</p>
                </div>
            </div>
            <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <div key={s} className={`w-1 h-3 rounded-full ${bookings.length > 5 ? 'bg-green-400' : 'bg-yellow-400'}`}></div>)}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sticky top-28 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Truck className="text-blue-600" size={28} /> Business Settings
            </h2>

            {message && (
              <div className={`p-4 mb-8 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                <CheckCircle size={18} /> {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-xs font-extrabold mb-2 uppercase tracking-widest text-gray-400 dark:text-gray-500">Business Name</label>
                <input
                  name="name"
                  value={moverData.name}
                  onChange={handleChange}
                  placeholder="e.g. MoveWell Logistics"
                  className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:border-gray-700 rounded-2xl outline-none transition-all dark:text-white"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-extrabold mb-2 uppercase tracking-widest text-gray-400 dark:text-gray-500">Primary City Base</label>
                <input
                  name="city"
                  value={moverData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:border-gray-700 rounded-2xl outline-none transition-all dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-extrabold mb-2 uppercase tracking-widest text-gray-400 dark:text-gray-500">Base Fare (₹)</label>
                  <input
                    name="basePrice"
                    type="number"
                    value={moverData.basePrice}
                    onChange={handleChange}
                    className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:border-gray-700 rounded-2xl outline-none transition-all dark:text-white"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-extrabold mb-2 uppercase tracking-widest text-gray-400 dark:text-gray-500">Rate/Km (₹)</label>
                  <input
                    name="pricePerKm"
                    type="number"
                    value={moverData.pricePerKm}
                    onChange={handleChange}
                    className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:border-gray-700 rounded-2xl outline-none transition-all dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-extrabold mb-2 uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <MapPin size={14} /> Serviceable Areas
                </label>
                <textarea
                  name="serviceAreas"
                  value={moverData.serviceAreas}
                  onChange={handleChange}
                  placeholder="Delhi, Gurgaon, Noida (Comma separated)"
                  rows="2"
                  className="p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:border-gray-700 rounded-2xl outline-none transition-all dark:text-white resize-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-extrabold mb-2 uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Package size={14} /> Available Services
                </label>
                <div className="flex flex-wrap gap-2 mb-2 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  {availableServicesList.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition-all border-2 ${
                        moverData.services.includes(service)
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-transparent border-gray-200 dark:border-gray-600 text-gray-400 hover:border-blue-400"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    <span>SAVE CHANGES</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "bookings" ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3 italic">
                  <ClipboardList className="text-blue-600" size={28} /> ORDERS FEED
                </h2>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                  Live Updates
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400 bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Package size={64} className="mb-4 opacity-20" />
                  <p className="font-bold tracking-tight">No relocation requests found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-3xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300">
                      <div className="absolute -left-1 top-6 w-1 bottom-12 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100 dark:border-gray-700">
                            <User size={24} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg dark:text-white uppercase">
                              {booking.customer?.name || "Customer Request"}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {booking.customer?.phone || "No phone provided"} • {booking.customer?.email || "No email"}
                            </p>
                            <div className="flex items-center gap-4 mt-1.5">
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase">{booking.moveType}</span>
                              <span className="text-[10px] font-bold text-gray-400 italic">ID: {booking._id.slice(-8)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                             booking.status === "completed" ? "bg-green-100 text-green-700 border border-green-200" :
                             booking.status === "cancelled" ? "bg-red-100 text-red-700 border border-red-200" :
                             "bg-blue-50 text-blue-600 border border-blue-200"
                           }`}>
                             {booking.status}
                           </div>
                           <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${
                             booking.paymentStatus === 'paid' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-orange-50 border-orange-200 text-orange-700'
                           }`}>
                             {booking.paymentStatus === 'paid' ? 'Paid Online' : 'Cash Payment'}
                           </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400">PICKUP</p>
                              <p className="text-sm font-medium dark:text-gray-200">{booking.pickupLocation}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400">DROP</p>
                              <p className="text-sm font-medium dark:text-gray-200">{booking.dropLocation}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center space-y-4 border-l dark:border-gray-700 pl-6">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-400">TOTAL COST</p>
                            <p className="text-2xl font-black text-blue-600">₹{(booking.estimatedCost || booking.totalPrice || 0).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-400">YOUR EARNING (90%)</p>
                            <p className="text-sm font-black text-green-600">
                              ₹{(booking.moverEarnings || (booking.estimatedCost * 0.9) || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {booking.status === "pending" && (
                          <button
                            onClick={() => updateStatus(booking._id, "accepted")}
                            className="px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                          >
                            Accept Job
                          </button>
                        )}
                        
                        {booking.status === "accepted" && (
                          <button
                            onClick={() => updateStatus(booking._id, "completed")}
                            className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-green-500/20"
                          >
                            Deliver & Complete
                          </button>
                        )}

                        {(booking.status !== "completed" && booking.status !== "cancelled") && (
                          <button
                            onClick={() => updateStatus(booking._id, "cancelled")}
                            className="px-6 py-2.5 border-2 border-red-200 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all ml-auto"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold flex items-center gap-3 italic">
                    <Wallet className="text-blue-600" size={28} /> PAYOUTS & LEDGER
                 </h2>
                 <div className="flex gap-4">
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-gray-400 uppercase">Commission Owed</p>
                       <p className="text-lg font-black text-red-500">₹{(moverData.wallet?.commissionOwed || 0).toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                 <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800">
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-4 tracking-widest">Available Balance (Online)</p>
                    <h3 className="text-4xl font-black mb-6 dark:text-white">₹{(moverData.wallet?.balance || 0).toLocaleString()}</h3>
                    <button 
                      onClick={async () => {
                        try {
                          await api.post("/api/movers/cashout");
                          setMessage("Cashout success!");
                          fetchMoverProfile();
                        } catch (e) {
                          setMessage("Cashout failed.");
                        }
                      }}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all"
                    >Request Payout to Bank</button>
                 </div>
                 <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-800">
                    <p className="text-[10px] font-bold text-red-600 uppercase mb-4 tracking-widest">Commission Due (Cash Jobs)</p>
                    <h3 className="text-4xl font-black mb-6 dark:text-white">₹{(moverData.wallet?.commissionOwed || 0).toLocaleString()}</h3>
                    <button 
                      onClick={async () => {
                        try {
                          await api.post("/api/movers/pay-commission");
                          setMessage("Commission paid successfully!");
                          fetchMoverProfile();
                        } catch (e) {
                          setMessage("Payment failed.");
                        }
                      }}
                      className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all"
                    >Clear Outstanding Commission</button>
                 </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Transaction History</h4>
                {moverData.ledger && moverData.ledger.length > 0 ? (
                  <div className="border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden divide-y dark:divide-gray-700">
                    {moverData.ledger.slice().reverse().map((entry, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${entry.type === 'payout' || entry.type === 'commission' || entry.type === 'deduction' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             {entry.type === 'earning' ? <ArrowUpRight size={18}/> : <ArrowUpRight size={18} className="rotate-180"/>}
                          </div>
                          <div>
                            <p className="text-sm font-black dark:text-white uppercase tracking-tight">{entry.description}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(entry.date).toLocaleDateString()} • {entry.paymentMethod || 'system'}</p>
                          </div>
                        </div>
                        <p className={`text-lg font-black ${entry.type === 'payout' || entry.type === 'commission' || entry.type === 'deduction' ? 'text-red-500' : 'text-green-500'}`}>
                          {entry.type === 'payout' || entry.type === 'commission' || entry.type === 'deduction' ? '-' : '+'}₹{entry.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 bg-gray-50/50 dark:bg-gray-900/10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                    <Package size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold">No transactions found in your ledger.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}