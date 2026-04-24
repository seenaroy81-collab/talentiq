import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
  withCredentials: true,
});

// Request interceptor to add Clerk auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from Clerk's session stored in window
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // Silently continue without token if not available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
