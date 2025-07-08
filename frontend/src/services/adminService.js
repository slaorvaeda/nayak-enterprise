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