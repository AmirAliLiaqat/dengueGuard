import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Platform } from 'react-native';

// Development URL vs Production URL
// Use your local IP for mobile devices (e.g. 192.168.x.x) or localhost for web
const API_BASE_URL = __DEV__
  ? Platform.OS === 'web'
    ? "http://localhost:8000/api/v1"
    // IMPORTANT: If testing on a mobile device, change this to your computer's current local IP address!
    : "http://192.168.1.105:8000/api/v1"
  : "https://dengue-dignose.onrender.com/api/v1";

export const denguApi = createApi({
  reducerPath: "denguApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "History", "Stats", "Notification", "Admin", "Doctor"],
  endpoints: (builder) => ({
    // Benchmarks (comparison stats)
    getBenchmarks: builder.query({
      query: () => "/benchmarks/",
    }),

    // Notifications
    getNotifications: builder.query({
      query: () => "/notifications/",
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: "/notifications/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    syncReminders: builder.mutation({
      query: () => ({
        url: "/notifications/sync-reminders",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    recordAction: builder.mutation({
      query: (data) => ({
        url: "/notifications/action",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    // Diagnosis
    diagnoseSymptoms: builder.mutation({
      query: (symptoms) => ({
        url: "/diagnose/symptoms",
        method: "POST",
        body: symptoms,
      }),
      invalidatesTags: ["History", "Stats", "Notification"],
    }),
    getHistory: builder.query({
      query: (limit = 10) => `/diagnose/history?limit=${limit}`,
      providesTags: ["History"],
    }),
    getStats: builder.query({
      query: () => "/diagnose/stats",
      providesTags: ["Stats"],
    }),
    getReportDetail: builder.query({
      query: (id) => `/diagnose/report/${id}`,
    }),
    updateReport: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/diagnose/report/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["History", "Stats"],
    }),

    // Admin
    getAdminOverview: builder.query({
      query: () => "/admin/overview",
      providesTags: ["Admin"],
    }),
    getAdminUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Admin"],
    }),
    getAdminUserReports: builder.query({
      query: (userId) => `/admin/users/${userId}/reports`,
      providesTags: ["Admin"],
    }),
    getAdminDoctors: builder.query({
      query: () => "/admin/doctors",
      providesTags: ["Doctor"],
    }),
    uploadDoctorPicture: builder.mutation({
      query: (formData) => ({
        url: "/admin/doctors/upload-picture",
        method: "POST",
        body: formData,
      }),
    }),
    createAdminDoctor: builder.mutation({
      query: (data) => ({
        url: "/admin/doctors",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Doctor"],
    }),
    updateAdminDoctor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/doctors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Doctor"],
    }),
    deleteAdminDoctor: builder.mutation({
      query: (id) => ({
        url: `/admin/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
    getPublicDoctors: builder.query({
      query: () => "/admin/doctors-public",
      providesTags: ["Doctor"],
    }),
    getPublicDoctorDetail: builder.query({
      query: (id) => `/admin/doctors-public/${id}`,
      providesTags: ["Doctor"],
    }),

    // Auth
    login: builder.mutation({
      query: (credentials) => {
        const formData = new FormData();
        formData.append("username", credentials.email);
        formData.append("password", credentials.password);
        return {
          url: "/auth/login",
          method: "POST",
          body: formData,
        };
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    request2faOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/request-2fa-otp",
        method: "POST",
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    getPublicProfiles: builder.query({
      query: () => "/auth/public-profiles",
      providesTags: ["User"],
    }),
    getPublicProfileDetail: builder.query({
      query: (id) => `/auth/public-profile/${id}`,
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User", "Notification"],
    }),
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: "/auth/upload-profile-picture",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User", "Notification"],
    }),
  }),
});

export const {
  useDiagnoseSymptomsMutation,
  useGetHistoryQuery,
  useGetStatsQuery,
  useGetReportDetailQuery,
  useUpdateReportMutation,
  useGetAdminOverviewQuery,
  useGetAdminUsersQuery,
  useGetAdminUserReportsQuery,
  useGetAdminDoctorsQuery,
  useUploadDoctorPictureMutation,
  useCreateAdminDoctorMutation,
  useUpdateAdminDoctorMutation,
  useDeleteAdminDoctorMutation,
  useGetPublicDoctorsQuery,
  useGetPublicDoctorDetailQuery,
  useGetBenchmarksQuery,
  useLoginMutation,
  useSignupMutation,
  useRequest2faOtpMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useSyncRemindersMutation,
  useRecordActionMutation,
  useGetPublicProfilesQuery,
  useGetPublicProfileDetailQuery,
} = denguApi;
