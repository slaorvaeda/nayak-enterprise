'use client';

import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { fetchCart } from './cartSlice';

export default function StoreProvider({ children }) {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      store.dispatch(fetchCart());
    }
  }, [isAuthenticated]);
  return <Provider store={store}>{children}</Provider>;
} 