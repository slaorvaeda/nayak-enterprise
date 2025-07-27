import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/utils';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.cart.get();
    return response.data.cart.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.cart.addItem(productId, quantity);
    return response.data.cart.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.cart.updateQuantity(productId, quantity);
    return response.data.cart.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productId, { rejectWithValue }) => {
  try {
    const response = await api.cart.removeItem(productId);
    return response.data.cart.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const clearCartOnLogout = createAsyncThunk('cart/clearCartOnLogout', async (_, { rejectWithValue }) => {
  try {
    await api.cart.clear();
    return [];
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(clearCartOnLogout.fulfilled, (state) => {
        state.items = [];
        state.status = 'idle';
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;

export const getTotalPrice = (state) =>
  state.cart.items.reduce(
    (total, item) => total + (item.unitPrice || item.price) * item.quantity,
    0
  );

export default cartSlice.reducer; 