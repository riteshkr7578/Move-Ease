import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://moveease-the-smartway-to-move.onrender.com/",
});

// Add a request interceptor to attach the auth token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
