import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use your computer's local network IP for physical device / Expo Go access
const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';

export const denguApi = createApi({
  reducerPath: 'denguApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    diagnoseSymptoms: builder.mutation({
      query: (symptoms) => ({
        url: '/diagnose/symptoms',
        method: 'POST',
        body: symptoms,
      }),
    }),
    getKbsRules: builder.query({
      query: () => '/diagnose/rules',
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { 
  useDiagnoseSymptomsMutation, 
  useGetKbsRulesQuery,
  useLoginMutation,
  useSignupMutation
} = denguApi;
