import Navbar from "./layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import FindMovers from "./pages/FindMovers";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import Help from "./pages/Help";
import HomeShifting from "./pages/HomeShifting";
import OfficeShifting from "./pages/OfficeShifting";
import VehicleTransport from "./pages/VehicleTransport";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MoverDashboard from "./pages/MoverDashboard";
import MoverProfile from "./pages/MoverProfile";
import Payouts from "./pages/Payouts";
import LiveTracking from "./pages/LiveTracking";
import AdminAnalytics from "./pages/AdminAnalytics";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />

      <div className="pt-[72px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/mover-panel" element={<ProtectedRoute><MoverDashboard /></ProtectedRoute>} />
          <Route path="/mover/payouts" element={<ProtectedRoute><Payouts /></ProtectedRoute>} />
          <Route path="/mover/tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
          <Route path="/find-movers" element={<FindMovers />} />
          <Route path="/mover-profile/:id" element={<MoverProfile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/help" element={<Help />} />
          <Route path="/services/home-shifting" element={<HomeShifting />} />
          <Route path="/services/office-shifting" element={<OfficeShifting />} />
  <Route path="/services/vehicle-transport" element={<VehicleTransport />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        
        </Routes>
      </div>
    </>
  );
}

export default App;
