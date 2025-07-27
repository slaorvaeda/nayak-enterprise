"use client"

import { getAllUsers, loginAdmin, getProducts, addProduct, updateProduct, deleteProduct } from "@/services/adminService"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAdmin = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        try {
          const data = await loginAdmin({ email, password });
          if (data.user?.role === "admin" && data.token && data.status === 200) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
            });
            // Store token in localStorage for axios interceptor
            if (typeof window !== "undefined") {
              localStorage.setItem("admin_token", data.token);
            }
          } else {
            set({ user: null, token: null, isAuthenticated: false });
          }
          return data;
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin-auth");
          localStorage.removeItem("admin_authenticated");
          // Optionally clear the persisted Zustand state
          localStorage.removeItem("nayak-admin-store");
        }
      },
      getUsers: async () => {
        try {
          const data = await getAllUsers();
          // console.log(data);
          return data;
        } catch (error) {
          console.log(`Error in getUsers: ${error}`);
          throw error;
        } 
      },
      getProducts: async () => {
        try {
          const data = await getProducts();
          return data;
        } catch (error) {
          console.log(`Error in getProducts: ${error}`);
          throw error;
        } 
      },
      addProduct: async (productData) => {
        try {
          const data = await addProduct(productData);
          return data;
        } catch (error) {
          console.log(`Error in addProduct: ${error}`);
          throw error;
        }
      },
      updateProduct: async (id, productData) => {
        try {
          const data = await updateProduct(id, productData);
          return data;
        } catch (error) {
          console.log(`Error in updateProduct: ${error}`);
          throw error;
        }
      },
      deleteProduct: async (id) => {
        try {
          const data = await deleteProduct(id);
          return data;
        } catch (error) {
          console.log(`Error in deleteProduct: ${error}`);
          throw error;
        }
      },
    }),
    {
      name: "nayak-admin-store",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)