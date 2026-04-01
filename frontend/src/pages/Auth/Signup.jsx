import { useState } from "react";
import api from "../../api"; // Replaced axios import
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/auth/register", formData);

      // Save session on signup
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role.toLowerCase());
      localStorage.setItem("userId", res.data.user.id);

      setSuccess("Signup successful! Logging you in...");
      setTimeout(() => {
        window.location.href = "/"; // Force reload to update Navbar state
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <form onSubmit={handleSignup} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md transition-colors duration-300">
        
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Create Account</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-4 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-4 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-4 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full p-4 mb-6 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="customer">Customer</option>
          <option value="mover">Mover</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Sign Up
        </button>

        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 dark:text-blue-400">Login</a>
        </p>
      </form>
    </div>
  );
}
