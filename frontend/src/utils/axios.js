
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
    let adminToken = localStorage.getItem("admin_token");

    //If admin token is available, attach it to the request header
    if(adminToken){
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log('Attaching admin token to request:', config.url);
    }

    //If not in local storage, try to get from Zustand store
    if(!adminToken){
      try {
        const adminStore = JSON.parse(localStorage.getItem("nayak-admin-store"));
        if(adminStore && adminStore.state && adminStore.state.token){
          adminToken = adminStore.state.token;
          config.headers.Authorization = `Bearer ${adminToken}`;
          console.log('Attaching admin token from store to request:', config.url);
        }
      } catch (error) {
        console.error("Error reading admin store:", error);
      }
    }
  

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
    
    if (token && !adminToken) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Attaching user token to request:', config.url);
    }
  }
  return config;
});

export default instance;
