import Navbar from "./layout/Navbar";
import { Routes, Route } from "react-router-dom";
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


function App() {
  return (
    <>
      <Navbar />

      <div className="pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-movers" element={<FindMovers />} />
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
