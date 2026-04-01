import { useState, useRef } from "react";
import axios from "axios";
import api from "../api"; // Added api instance for better management if needed, though they used axios. Let's stick to their style or just update.
import SearchMovers from "../components/SearchMovers";
import MoversList from "../components/MoversList";

export default function FindMovers() {
  const [movers, setMovers] = useState([]);
  const moversListRef = useRef(null);

  const handleSearch = async (filters) => {
    console.log("Search filters:", filters);

    if (!filters.fromCity) {
      alert("Please select a city before searching");
      return;
    }

    try {
      const res = await api.get("/api/movers", {
        params: { city: filters.fromCity }
      });

      setMovers(res.data);
      console.log("Backend movers response:", res.data);
      
      // Auto-scroll to movers list after a short delay to ensure rendering
      setTimeout(() => {
        moversListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="pt-32 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <SearchMovers onSearch={handleSearch} />

      <div className="mt-10" ref={moversListRef}>
        <MoversList movers={movers} />
      </div>
    </div>
  );
}
