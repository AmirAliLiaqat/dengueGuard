import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Replace with your local machine's IP address for Expo Go or 10.0.2.2 for Emulator
const API_BASE_URL = 'http://192.168.1.103:8000/api/v1';

export const denguApi = createApi({
  reducerPath: 'denguApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'History', 'Stats'],
  endpoints: (builder) => ({
    // Diagnosis
    diagnoseSymptoms: builder.mutation({
      query: (symptoms) => ({
        url: '/diagnose/symptoms',
        method: 'POST',
        body: symptoms,
      }),
      invalidatesTags: ['History', 'Stats'],
    }),
    getHistory: builder.query({
      query: (limit = 10) => `/diagnose/history?limit=${limit}`,
      providesTags: ['History'],
    }),
    getStats: builder.query({
      query: () => '/diagnose/stats',
      providesTags: ['Stats'],
    }),
    getReportDetail: builder.query({
      query: (id) => `/diagnose/report/${id}`,
    }),

    // Auth
    login: builder.mutation({
      query: (credentials) => {
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);
        return {
          url: '/auth/login',
          method: 'POST',
          body: formData,
        };
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/auth/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: '/auth/upload-profile-picture',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useDiagnoseSymptomsMutation, 
  useGetHistoryQuery,
  useGetStatsQuery,
  useGetReportDetailQuery,
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation
} = denguApi;
