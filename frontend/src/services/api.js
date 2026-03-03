import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const denguApi = createApi({
  reducerPath: 'denguApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api/v1',
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
