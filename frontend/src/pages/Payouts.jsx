import React, { useState, useEffect } from "react";
import { Wallet, ArrowLeft, ArrowUpRight, CheckCircle, Clock, ShieldAlert, Package, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Payouts() {
  const [moverData, setMoverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/api/movers/me");
      setMoverData(res.data);
    } catch (err) {
      console.error("Failed to fetch mover data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCashout = async () => {
    try {
      const res = await api.post("/api/movers/cashout");
      setMessage(res.data.msg);
      fetchData();
    } catch (err) {
      setMessage("Cashout failed. Please try again.");
    }
  };

  const handlePayCommission = async () => {
    try {
      const res = await api.post("/api/movers/pay-commission");
      setMessage(res.data.msg);
      fetchData();
    } catch (err) {
      setMessage("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
              Payout <span className="text-blue-600">Command Center</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your earnings, commissions, and bank transfers</p>
          </div>
          <Link to="/mover-panel" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
            <ArrowLeft size={16} /> BACK TO DASHBOARD
          </Link>
        </header>

        {message && (
          <div className="p-4 mb-8 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-blue-500/20">
            <CheckCircle size={18} /> {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Wallet Balance Card - NOW FULL WIDTH FOR CLEANER UI */}
          <div className="md:col-span-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full">
              <div className="text-center md:text-left">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">Available for Withdrawal (Online Earnings Only)</p>
                <h2 className="text-7xl font-black italic tracking-tighter">₹{(moverData?.wallet?.balance || 0).toLocaleString()}</h2>
                
                <div className="mt-8 flex items-center gap-6 justify-center md:justify-start">
                  <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                     <p className="text-[10px] uppercase font-bold opacity-60">Verified Jobs</p>
                     <p className="text-xl font-black">{(moverData?.ledger?.filter(l => l.type === 'earning' && l.paymentMethod === 'online').length || 0)}</p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                     <p className="text-[10px] uppercase font-bold opacity-60">Success Rate</p>
                     <p className="text-xl font-black">98.2%</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 md:mt-0 flex flex-col gap-4 items-center md:items-end">
                <button 
                  onClick={handleCashout}
                  disabled={!moverData?.wallet?.balance}
                  className="w-full md:w-auto px-12 py-6 bg-white text-blue-600 rounded-3xl font-black text-lg uppercase tracking-widest shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Withdraw to Bank
                </button>
                <div className="flex items-center gap-2 text-[10px] font-bold opacity-80 uppercase tracking-widest">
                  <ShieldAlert size={14} className="text-yellow-400" /> Auto-settlement active
                </div>
              </div>
            </div>
            <Wallet size={300} className="absolute right-[-60px] top-[-60px] opacity-10 rotate-12 pointer-events-none" />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-20">
          <div className="p-8 border-b dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-black uppercase italic text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={24} /> Financial Ledger
            </h3>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border px-3 py-1 rounded-full">
              Verified Entries
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[400px]">
            {moverData?.ledger && moverData.ledger.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Info</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Method</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {moverData.ledger.slice().reverse().map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-6">
                        <p className="text-xs font-black dark:text-white uppercase tracking-tighter">{new Date(entry.date).toLocaleDateString()}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold dark:text-gray-200">{entry.description}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                          entry.type === 'earning' ? 'text-green-600' : 'text-red-500'
                        }`}>{entry.type}</p>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {entry.paymentMethod || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <p className={`text-lg font-black ${
                          entry.type === 'earning' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {entry.type === 'earning' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50/20">
                <Package size={48} className="text-gray-300 mb-4 opacity-20" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">No transactions detected yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
