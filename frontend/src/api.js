import axios from "axios";

export const BASE_URL = "https://moveease-the-smartway-to-move.onrender.com";
// export const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
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
