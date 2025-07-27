import axios from "@/utils/axios"

export const loginAdmin = async (formData) => {
    try {
        const res = await axios.post("/admin/login", formData);
        return { ...res.data, status: res.status };
    } catch (error) {
        // Forward the error with a clear message for the frontend
        console.error('Admin login error:', error);
        throw error;
    }
}

//Get all users
export const getAllUsers = async () => {
    const res = await axios.get("/admin/users");
    return res.data;
  };

//Get all products
export const getProducts = async () => {
    const res = await axios.get("/admin/products");
    return res.data;
  };

// Add a new product
export const addProduct = async (productData) => {
  console.log('Adding product with data:', JSON.stringify(productData, null, 2));
  console.log('Admin token:', localStorage.getItem("admin_token"));
  try {
    const res = await axios.post("/products", productData);
    return res.data;
  } catch (error) {
    console.error('Add product error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.response?.data?.message);
    console.error('Full error:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  const res = await axios.put(`/products/${id}`, productData);
  return res.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};

// Admin: Create a new user
export const adminCreateUser = async (userData) => {
  const res = await axios.post("/admin/users", userData);
  return res.data;
};

// Admin: Update any user
export const adminUpdateUser = async (id, userData) => {
  const res = await axios.put(`/admin/users/${id}`, userData);
  return res.data;
};