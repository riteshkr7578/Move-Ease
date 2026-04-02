import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, User, ChevronDown, LogOut, LayoutDashboard, Truck, Settings } from "lucide-react";
import { BASE_URL } from "../api";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false); // Mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || !("theme" in localStorage)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    
    loadUser(); // Load initially

    // Listen for custom event when profile updates via same window
    window.addEventListener("userUpdated", loadUser);
    
    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          MoveEase
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 dark:text-gray-300 font-medium">
          <Link to="/" onClick={() => setOpenMenu(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Home</Link>
          <Link to="/find-movers" onClick={() => setOpenMenu(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Find Movers</Link>

          {/* Dropdown: Services */}
          <div className="relative group cursor-pointer py-2">
            <span className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Services 
              <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
            </span>

            <div className="absolute top-full left-0 hidden group-hover:block bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 mt-0 rounded-xl w-64 p-2 z-50 transition-all opacity-0 group-hover:opacity-100">
              <Link to='/services/home-shifting' onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <span className="text-xl bg-blue-100 dark:bg-gray-900 p-1.5 rounded-md">🏠</span> 
                <span className="font-medium text-[15px]">Home Shifting</span>
              </Link>
              <Link to='/services/office-shifting' onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-1">
                <span className="text-xl bg-blue-100 dark:bg-gray-900 p-1.5 rounded-md">🏢</span> 
                <span className="font-medium text-[15px]">Office Shifting</span>
              </Link>
              <Link to='/services/vehicle-transport' onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-1">
                <span className="text-xl bg-blue-100 dark:bg-gray-900 p-1.5 rounded-md">🚚</span> 
                <span className="font-medium text-[15px]">Vehicle Transport</span>
              </Link>
            </div>
          </div>

          <Link to="/reviews" onClick={() => setOpenMenu(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Customer Reviews</Link>
          <Link to="/help" onClick={() => setOpenMenu(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Help & Support</Link>
        </div>

        {/* Right Auth/Profile Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 shadow-sm"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500 animate-pulse" />
            ) : (
              <Moon size={20} className="text-blue-500" />
            )}
          </button>

          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 font-medium">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Sign Up</Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              {/* PROFILE ICON */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none bg-white dark:bg-gray-800 rounded-full"
              >
                <img
                  src={
                    user.profilePicture 
                      ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`) 
                      : `https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff`
                  }
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
                  alt="profile"
                />
              </button>

              {/* DROPDOWN MENU */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 transition-all opacity-100">
                  
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                     <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={18} className="text-blue-500" />
                    <span>My Profile</span>
                  </Link>

                  {user.role === "customer" && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard size={18} className="text-green-500" />
                      <span>My Bookings</span>
                    </Link>
                  )}

                  {user.role === "mover" && (
                    <Link
                      to="/mover-panel"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Truck size={18} className="text-orange-500" />
                      <span>Mover Panel</span>
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={18} className="text-purple-500" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-1 border-t border-gray-100 dark:border-gray-700 pt-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={toggleDarkMode} 
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 shadow-sm"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500 animate-pulse" />
            ) : (
              <Moon size={20} className="text-blue-500" />
            )}
          </button>
          <button
            className="text-3xl text-gray-700 dark:text-gray-300"
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {openMenu && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md px-6 py-4 space-y-3 text-gray-800 dark:text-gray-200 transition-colors duration-300">

          <Link to="/" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <Link to="/find-movers" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600 dark:hover:text-blue-400">Find Movers</Link>

          <p className="font-medium text-gray-700 dark:text-gray-300">Services</p>
          <div className="pl-4 space-y-1 mt-2">
            <Link to="/services/home-shifting" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600">Home Shifting</Link>
            <Link to="/services/office-shifting" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600">Office Shifting</Link>
            <Link to="/services/vehicle-transport" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600">Vehicle Transport</Link>
          </div>

          <Link to="/reviews" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600">Customer Reviews</Link>
          <Link to="/help" onClick={() => setOpenMenu(false)} className="block hover:text-blue-600">Help & Support</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpenMenu(false)} className="block px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 font-medium mt-4">Login</Link>
              <Link to="/signup" onClick={() => setOpenMenu(false)} className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Sign Up</Link>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 px-2 mb-4">
                <img
                  src={
                    user.profilePicture 
                      ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`) 
                      : `https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff`
                  }
                  className="w-10 h-10 rounded-full object-cover"
                  alt="profile"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              <Link to="/profile" onClick={() => setOpenMenu(false)} className="block py-2 hover:text-blue-600 dark:hover:text-blue-400">My Profile</Link>
              
              {user.role === "customer" && (
                <Link to="/dashboard" onClick={() => setOpenMenu(false)} className="block py-2 hover:text-blue-600 dark:hover:text-blue-400">My Bookings</Link>
              )}

              {user.role === "mover" && (
                <Link to="/mover-panel" onClick={() => setOpenMenu(false)} className="block py-2 hover:text-blue-600 dark:hover:text-blue-400">Mover Panel</Link>
              )}

              <button
                onClick={() => {
                   setOpenMenu(false);
                   handleLogout();
                }}
                className="block w-full text-left text-red-500 py-2 mt-2 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}

        </div>
      )}
    </nav>
  );
}
