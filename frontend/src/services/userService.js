import axios from "@/utils/axios";

// Register user
export const registerUser = async (formData) => {
  const res = await axios.post("/auth/register", formData);
  return res.data;
};

// Login user
export const loginUser = async (formData) => {
  const res = await axios.post("/auth/login", formData);
  return res.data;
};

// Get user profile
export const getProfile = async () => {
  const res = await axios.get("/auth/me"); // token auto-attached
  return res.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    // console.log("Updating profile with data:", profileData);
    // console.log("Making request to:", "/auth/profile/update");
    
    const res = await axios.put("/auth/profile/update", profileData);
    // console.log("Profile update response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Profile update error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
};




