"use client";

import { loginUser, registerUser, updateProfile as updateProfileService } from "@/services/userService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// User roles
const USER_ROLES = ["admin", "customer"];

// Role-based permissions
const rolePermissions = {
  admin: ["*"],
  customer: ["products.read", "orders.read", "orders.write", "cart.*", "profile.*"],
};

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const result = await loginUser({ email, password });
          if (result.success) {
            const { user, token } = result.data;
            set({ user, token, isAuthenticated: true });
            return { success: true };
          } else {
            return { success: false, error: result.message || 'Login failed' };
          }
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: 'Network error. Please try again.' };
        }
      },

      register: async (userData) => {
        try {
          const result = await registerUser(userData);
          
          if (result.success) {
            const { user, token } = result.data;
            set({ user, token, isAuthenticated: true });
            return { success: true };
          } else {
            return { success: false, error: result.message || 'Registration failed' };
          }
        } catch (error) {
          console.error('Registration error:', error);
          return { success: false, error: 'Network error. Please try again.' };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      getProfile: async () => {
        try {
          const { token } = get();
          if (!token) return { success: false, error: 'No token available' };

          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              set({ user: null, token: null, isAuthenticated: false });
            }
            return { success: false, error: data.message || 'Failed to get profile' };
          }

          set({ user: data.data.user });
          return { success: true, user: data.data.user };
        } catch (error) {
          console.error('Get profile error:', error);
          return { success: false, error: 'Network error' };
        }
      },


      
      updateProfile: async (profileData) => {
        try {
          const result = await updateProfileService(profileData);
          if (result.success) {
            set({ user: result.data.user });
            return { success: true, user: result.data.user };
          } else {
            return { success: false, error: result.message || 'Failed to update profile' };
          }
        } catch (error) {
          console.error('Update profile error:', error);
          return { success: false, error: 'Network error' };
        }
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'admin') return true;
        if (user.role === 'customer') {
          return rolePermissions.customer.includes(permission) || 
                 rolePermissions.customer.includes('*');
        }
        return false;
      },

      hasRole: (role) => {
        const { user } = get();
        return user && user.role === role;
      },

      getAuthHeaders: () => {
        const { token } = get();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
      },
    }),
    {
      name: "nayak-auth",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
