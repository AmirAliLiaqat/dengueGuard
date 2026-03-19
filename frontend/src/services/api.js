import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Development URL (Your local IP) vs Production URL (Render.com)
const API_BASE_URL = __DEV__
  ? "http://192.168.18.28:8000/api/v1"
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
  tagTypes: ["User", "History", "Stats", "Notification"],
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
