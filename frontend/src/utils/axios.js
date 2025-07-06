
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Try to get token from localStorage first (for backward compatibility)
    let token = localStorage.getItem("token");
    
    // If not in localStorage, try to get from Zustand store
    if (!token) {
      try {
        const authStore = JSON.parse(localStorage.getItem("nayak-auth"));
        if (authStore && authStore.state && authStore.state.token) {
          token = authStore.state.token;
        }
      } catch (error) {
        console.error("Error reading auth store:", error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
