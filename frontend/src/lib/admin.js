"use client"

import { loginAdmin } from "@/services/adminService"
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
    }),
    {
      name: "nayak-admin-store",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)