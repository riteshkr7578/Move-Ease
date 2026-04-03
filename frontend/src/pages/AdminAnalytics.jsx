import React, { useState, useEffect } from 'react';
import { BarChart3, ArrowLeft, TrendingUp, Users, DollarSign, Package, PieChart, Activity, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from "../api";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const performanceMetrics = [
    { label: "User Acquisition", value: "+24%", color: "text-green-500" },
    { label: "Booking Conv.", value: "18.5%", color: "text-blue-500" },
    { label: "Churn Rate", value: "2.1%", color: "text-red-500" },
    { label: "Avg Ticket", value: "₹8.4k", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">
              Advanced <span className="text-blue-600">Analytics</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time platform performance and business intelligence</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
              <Download size={16} /> Export Report
            </button>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </Link>
          </div>
        </div>

        {/* Quick Performance Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((m, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{m.label}</p>
              <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <TrendingUp className="text-blue-600" /> Revenue Forecast
              </h3>
              <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold px-3 py-1 outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            
            <div className="h-72 flex items-end justify-between gap-4 px-4 border-b border-l border-gray-100 dark:border-gray-800">
              {[30, 45, 25, 60, 85, 40, 75, 90, 55, 70, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    style={{ height: `${h}%` }} 
                    className={`w-full rounded-t-lg transition-all duration-700 group-hover:brightness-110 ${i > 8 ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-gray-200 dark:bg-gray-800'}`} 
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(h * 10).toLocaleString()}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Side Module: Distributions */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 italic">
                <PieChart className="text-purple-600" /> Service Mix
              </h3>
              <div className="space-y-5">
                {[
                  { label: "Home Shifting", val: 64, color: "bg-blue-500" },
                  { label: "Office Relocation", val: 18, color: "bg-purple-500" },
                  { label: "Vehicle Trans.", val: 12, color: "bg-orange-500" },
                  { label: "Others", val: 6, color: "bg-gray-400" },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-gray-500">{s.label}</span>
                      <span className="dark:text-white">{s.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div style={{ width: `${s.val}%` }} className={`h-full ${s.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/30 relative overflow-hidden group">
              <Activity className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-black uppercase italic mb-2 tracking-tight">System Node</h3>
              <p className="text-xs text-blue-100 font-medium mb-6">AWS Region: ap-south-1 (Mumbai)</p>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase">Active</div>
                <div className="text-xs font-bold">Lat: 24ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel Placeholder */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
             <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              Beta Feature
            </div>
          </div>
          <h3 className="text-xl font-bold mb-10 italic">Customer Journey Funnel</h3>
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-2">
            <div className="w-full h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">100% VISITS (24,802)</div>
            <div className="w-[85%] h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">85% SEARCHED MOVERS</div>
            <div className="w-[45%] h-12 bg-blue-400 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">45% CALCULATED QUOTE</div>
            <div className="w-[18%] h-12 bg-blue-300 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">18% BOOKED MOVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
