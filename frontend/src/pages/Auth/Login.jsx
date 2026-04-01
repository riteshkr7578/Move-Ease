import { useState } from "react";
import api from "../../api"; // Replaced axios import
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", data);


      // Save JWT token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role.toLowerCase());
localStorage.setItem("userId", res.data.user.id);

      // Redirect to homepage
      window.location.href = "/";   

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md transition-colors duration-300">

        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-4 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-4 mb-6 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Login
        </button>

        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          New here?{" "}
          <a href="/signup" className="text-blue-600 dark:text-blue-400">Create Account</a>
        </p>
      </form>
    </div>
  );
}
