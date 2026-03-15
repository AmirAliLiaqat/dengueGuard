import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    isAuthenticated: false,
    isVerified: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      state.isVerified = user?.is_verified || false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isVerified = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
