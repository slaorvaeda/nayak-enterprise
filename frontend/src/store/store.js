import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 