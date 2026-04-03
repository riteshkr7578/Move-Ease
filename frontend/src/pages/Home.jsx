import SearchMovers from "../components/SearchMovers";
import MoversList from "../components/MoversList";
import SEO from "../components/SEO";
import { useState, useRef, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";


export default function Home() {
  const [movers, setMovers] = useState([]);
  const moversListRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "mover") {
      navigate("/mover-panel");
    }
  }, [navigate]);

  const handleSearch = async (filters) => {
    console.log("User search:", filters);

    try {
      const res = await api.get("/api/movers", {
        params: { city: filters.fromCity }  // 🔥 Pass city to backend
      });
      setMovers(res.data);
      console.log("Movers from backend:", res.data);
      
      // Update URL with filters so moveType is preserved when booking
      const newParams = new URLSearchParams();
      if (filters.fromCity) newParams.set("city", filters.fromCity);
      if (filters.moveType) newParams.set("moveType", filters.moveType);
      window.history.replaceState(null, "", "?" + newParams.toString());

      // Auto-scroll to movers list after a short delay to ensure rendering
      setTimeout(() => {
        if (moversListRef.current) {
          moversListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);

    } catch (err) {
      console.log("Search error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO 
        title="Home - Best Packers and Movers Near You"
        description="MoveEase helps you find the most reliable and affordable packers and movers for your next relocation. Compare and book top-rated moving services today."
        keywords="packers and movers service, local moving company, home relocation, office shifting, move ease"
      />
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="pt-10 pb-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT TEXT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Move Smart, Move Easy — <br />
              <span className="text-blue-600 dark:text-blue-400">Find & Book Trusted Movers Instantly!</span>
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
              Compare verified packers & movers across India. Transparent pricing,
              instant quotes, and no hidden charges.
            </p>

            <div className="mt-6 flex space-x-4">
             <Link
  to="/find-movers"
  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
>
  Find Movers Now
</Link>

<Link
  to="/help"
  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
>
  Talk to an Expert
</Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/5025664/pexels-photo-5025664.jpeg"
              className="rounded-xl shadow-xl"
              alt="Packers and movers loading truck"
            />

            {/* Floating label */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-4 py-2 rounded shadow-lg">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Trusted Packers & Movers</p>
            </div>
          </div>

        </div>
      </section>
      

      <SearchMovers onSearch={handleSearch} />

      <div ref={moversListRef}>
        <MoversList movers={movers} />
      </div>

{/* FEATURED MOVERS SECTION */}
<section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">
      Featured <span className="text-blue-600 dark:text-blue-400">Packers & Movers</span>
    </h2>

    {/* Cards Container */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden group hover:translate-y-[-5px] transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="h-40 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/5025667/pexels-photo-5025667.jpeg?auto=compress&cs=tinysrgb&w=300"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
             <p className="text-yellow-500 font-bold flex items-center gap-1 text-sm">⭐ 4.8</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-extrabold dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">QuickMove Packers</h3>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Route:</span> Mumbai → Bangalore
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Services:</span> Fragile Items, Vehicles
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to='/mover-profile/1' className="flex-1 text-center py-2.5 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm">
              View Profile
            </Link>
            <Link to='/find-movers' className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm">
              Get Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden group hover:translate-y-[-5px] transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="h-40 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/5025662/pexels-photo-5025662.jpeg?auto=compress&cs=tinysrgb&w=300"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
             <p className="text-yellow-500 font-bold flex items-center gap-1 text-sm">⭐ 4.7</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-extrabold dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">EasyGo Relocations</h3>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Route:</span> Delhi → Hyderabad
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Services:</span> Packing & Storage
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to='/mover-profile/2' className="flex-1 text-center py-2.5 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm">
              View Profile
            </Link>
            <Link to='/find-movers' className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm">
              Get Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden group hover:translate-y-[-5px] transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="h-40 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/5025644/pexels-photo-5025644.jpeg?auto=compress&cs=tinysrgb&w=300"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
             <p className="text-yellow-500 font-bold flex items-center gap-1 text-sm">⭐ 4.9</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-extrabold dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">MoveWell Logistics</h3>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Route:</span> Chennai → Pune
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Services:</span> Office Shifting
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to='/mover-profile/3' className="flex-1 text-center py-2.5 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm">
              View Profile
            </Link>
            <Link to='/find-movers' className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm">
              Get Quote
            </Link>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>



{/* WHY CHOOSE MOVEEASE */}
<section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">
      Why <span className="text-blue-600 dark:text-blue-400">Choose MoveEase?</span>
    </h2>

    {/* Grid of 6 Features */}
    <div className="grid md:grid-cols-3 gap-10">

      {/* Box 1 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center dark:text-white">Verified Movers</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
          We list only background-checked and trusted packers & movers.
        </p>
      </div>

      {/* Box 2 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3068/3068619.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center dark:text-white">Secure Payments</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
          Pay safely via our secure gateway with full protection.
        </p>
      </div>

      {/* Box 3 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4221/4221419.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center dark:text-white">On-Time Delivery</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
          Guaranteed pickup & delivery without delays.
        </p>
      </div>

      {/* Box 4 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7439/7439541.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center dark:text-white">Shared Truck Options</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
          Save money with shared vehicle transportation options.
        </p>
      </div>

      {/* Box 5 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        <img
          src="https://cdn-icons-png.flaticon.com/512/788/788195.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center dark:text-white">Professional Packing</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
          Expert packing for fragile items, furniture & electronics.
        </p>
      </div>

      {/* Box 6 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        <img
          src="https://cdn-icons-png.flaticon.com/512/724/724715.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center dark:text-white">24×7 Customer Support</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
          Dedicated support team ready to help anytime.
        </p>
      </div>

    </div>
  </div>
</section>


{/* ---------------------------------------------------------------------------------- */}
{/* HOW MOVEEASE WORKS */}
<section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">
      How <span className="text-blue-600 dark:text-blue-400">MoveEase</span> Works
    </h2>

    {/* 4 Step Grid */}
    <div className="grid md:grid-cols-4 gap-10">

      {/* Step 1 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
          className="w-20 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-2 dark:text-white">1. Enter Your Details</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us your moving route & requirements. Takes just 30 seconds!
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/709/709790.png"
          className="w-20 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-2 dark:text-white">2. Compare Best Movers</h3>
        <p className="text-gray-600 dark:text-gray-300">
          We show you verified packers & movers with transparent pricing.
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3593/3593816.png"
          className="w-20 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-2 dark:text-white">3. Choose & Book</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Select your mover, schedule your pickup & confirm booking.
        </p>
      </div>

      {/* Step 4 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2942/2942849.png"
          className="w-20 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-2 dark:text-white">4. Move Hassle-Free</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Track your move & enjoy a smooth, stress-free shifting experience.
        </p>
      </div>

    </div>
  </div>
</section>

{/* ------------------------------------------------------------------------------------------------------------------------ */}

{/* CUSTOMER REVIEWS */}
<section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">
      What Our <span className="text-blue-600 dark:text-blue-400">Customers</span> Say
    </h2>

    {/* Review Cards Grid */}
    <div className="grid md:grid-cols-3 gap-10">

      {/* Review 1 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-xl transition">
        <div className="flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg dark:text-white">Anjali Verma</h3>
            <p className="text-yellow-500">⭐ 4.9</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          “MoveEase helped me shift from Pune to Bangalore without stress.
          Movers were polite, fast & professional. Highly recommended!”
        </p>
      </div>

      {/* Review 2 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-xl transition">
        <div className="flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/men/46.jpg"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg dark:text-white">Rohit Sharma</h3>
            <p className="text-yellow-500">⭐ 4.8</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          “Very smooth experience! Got multiple quotes instantly and booked the best mover.
          The packing quality was excellent!”
        </p>
      </div>

      {/* Review 3 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-xl transition">
        <div className="flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg dark:text-white">Simran Kaur</h3>
            <p className="text-yellow-500">⭐ 5.0</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          “Amazing service! Movers arrived on time and handled everything with care.
          MoveEase really makes relocation easy.”
        </p>
      </div>

    </div>
  </div>
</section>

{/* ---------------------------------------------------------------------------------------------------------- */}


{/* PAYMENT & SAFETY GUARANTEES */}
<section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">
      Your <span className="text-blue-600 dark:text-blue-400">Safety</span> is Our Priority
    </h2>

    {/* 6 Guarantee Boxes */}
    <div className="grid md:grid-cols-3 gap-10">

      {/* Box 1 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2920/2920261.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold dark:text-white">Secure Digital Payments</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Pay safely via verified payment gateways with fraud protection.
        </p>
      </div>

      {/* Box 2 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold dark:text-white">Transit Insurance</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Choose optional insurance to protect your goods from damage or loss.
        </p>
      </div>

      {/* Box 3 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold dark:text-white">Damage Protection</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Get compensation for any transit-related damages by movers.
        </p>
      </div>

      {/* Box 4 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5346/5346101.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold dark:text-white">Easy Refund & Disputes</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Quick dispute resolution and smooth refund process for customers.
        </p>
      </div>

      {/* Box 5 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/8172/8172370.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold dark:text-white">Verified Movers Guarantee</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          We onboard only background-checked, certified packers & movers.
        </p>
      </div>

      {/* Box 6 */}
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/726/726623.png"
          className="w-16 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold dark:text-white">24×7 Support</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Our support team is always available to assist you throughout the move.
        </p>
      </div>

    </div>
  </div>
</section>

{/* -------------------------------------------------------------------------------------------------------- */}


{/* FINAL CTA BANNER */}
<section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white transition-colors duration-300">
  <div className="max-w-6xl mx-auto text-center px-6">

    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
      Ready to Move? 🚚
    </h2>

    <p className="text-lg md:text-xl opacity-90 mb-8">
      Get instant quotes from verified packers & movers. Fast, safe & affordable.
    </p>

    <Link to='/find-movers' className="px-10 py-4 bg-white text-blue-700 font-bold rounded-2xl text-lg shadow-lg hover:bg-gray-100 transition">
      Get Best Price Now
    </Link>

  </div>
</section>

{/* ------------------------------------------------------------------------------------------------------------------------ */}

{/* FOOTER SECTION */}

<footer className="bg-gray-900 text-gray-300 py-16">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">

    {/* Brand */}
    <div>
      <h2 className="text-3xl font-extrabold text-white mb-3">MoveEase</h2>
      <p className="text-gray-400 leading-relaxed">
        India’s most trusted platform to compare & book verified packers and movers.
        Fast, easy and secure shifting experience.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2 flex flex-col items-start">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/find-movers" className="hover:text-white transition-colors">Find Movers</Link>
        <Link to="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link>
        <Link to="/help" className="hover:text-white transition-colors">Help & Support</Link>
      </ul>
    </div>

    {/* Services */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Services</h3>
      <ul className="space-y-2 flex flex-col items-start">
        <Link to="/services/home-shifting" className="hover:text-white transition-colors">Home Shifting</Link>
        <Link to="/services/office-shifting" className="hover:text-white transition-colors">Office Shifting</Link>
        <Link to="/services/vehicle-transport" className="hover:text-white transition-colors">Vehicle Transport</Link>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
      <p className="text-gray-400 mb-2">📍 Jaipur, India</p>
      <a href="tel:+919876543210" className="block text-gray-400 hover:text-white mb-2 transition-colors">📞 +91 98765 43210</a>
      <a href="mailto:support@moveease.com" className="block text-gray-400 hover:text-white mb-2 transition-colors">📧 support@moveease.com</a>

      {/* Social Icons */}
      <div className="flex gap-4 mt-4">
        <a href="#" className="text-gray-300 hover:text-white text-2xl">🌐</a>
        <a href="#" className="text-gray-300 hover:text-white text-2xl">📘</a>
        <a href="#" className="text-gray-300 hover:text-white text-2xl">📸</a>
      </div>
    </div>

  </div>

  {/* Bottom Copy */}
  <div className="text-center text-gray-500 mt-12 border-t border-gray-700 pt-6">
    © {new Date().getFullYear()} MoveEase. All Rights Reserved.
  </div>
</footer>


    </div>
  );
}
