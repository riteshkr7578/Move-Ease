import React from 'react';
import { Wallet, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Payouts() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 text-center border border-gray-100 dark:border-gray-800">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
          <Wallet size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">
          Payouts <span className="text-blue-600">Portal</span>
        </h1>
        <div className="inline-block px-4 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
          Coming Soon
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
          We are building a secure automated payout system for our partners. Track your earnings and withdraw directly to your bank account very soon.
        </p>
        <Link 
          to="/mover-panel" 
          className="flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
