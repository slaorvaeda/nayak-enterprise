"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      // Load cart from backend
      loadCart: async () => {
        const { getAuthHeaders } = useAuth.getState();
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.cart.get();
          set({ items: response.data.items || [], isLoading: false });
        } catch (error) {
          console.error('Failed to load cart:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      addItem: async (product, quantity = 1) => {
        const { getAuthHeaders } = useAuth.getState();
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.cart.addItem(product._id || product.id, quantity);
          set({ 
            items: response.data.items || [], 
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to add item:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      removeItem: async (productId) => {
        const { getAuthHeaders } = useAuth.getState();
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.cart.removeItem(productId);
          set({ 
            items: response.data.items || [], 
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to remove item:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { getAuthHeaders } = useAuth.getState();
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.cart.updateQuantity(productId, quantity);
          set({ 
            items: response.data.items || [], 
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to update quantity:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      clearCart: async () => {
        const { getAuthHeaders } = useAuth.getState();
        set({ isLoading: true, error: null });
        
        try {
          await api.cart.clear();
          set({ items: [], isLoading: false });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.18; // 18% GST
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        return subtotal + tax;
      },

      // Apply promo code
      applyPromoCode: async (code) => {
        const { getAuthHeaders } = useAuth.getState();
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.cart.applyPromoCode(code);
          set({ 
            items: response.data.items || [],
            discount: response.data.discount || 0,
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to apply promo code:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Get cart summary
      getSummary: async () => {
        const { getAuthHeaders } = useAuth.getState();
        
        try {
          const response = await api.cart.getSummary();
          return response.data;
        } catch (error) {
          console.error('Failed to get cart summary:', error);
          throw error;
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ 
        items: state.items,
        discount: state.discount 
      }),
    }
  )
);
