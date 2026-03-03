import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { denguApi } from '../services/api';

export const store = configureStore({
  reducer: {
    [denguApi.reducerPath]: denguApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(denguApi.middleware),
});

setupListeners(store.dispatch);
