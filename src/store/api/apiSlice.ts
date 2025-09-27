import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {RootState} from "@/store";
import type {
  School,
  Diploma,
  Application,
  LoginRequest,
  RegisterRequest,
  ApplicationRequest,
  ApiResponse,
  AuthResponse,
} from '@/types/api';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL + '/api'}` ||'http://localhost:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['School', 'Diploma', 'Application', 'User'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ status: string; message: string }, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getUser: builder.query<{ status: string; user: string }, void>({
      query: () => ({
        url: '/user',
        method: 'POST',
      }),
      providesTags: ['User'],
    }),

    // Schools endpoints
    getSchools: builder.query<ApiResponse<School[]>, void>({
      query: () => '/school',
      providesTags: ['School'],
    }),
    getSchool: builder.query<ApiResponse<School>, number>({
      query: (id) => `/school/${id}`,
      providesTags: ['School'],
    }),

    // Diplomas endpoints
    getDiplomas: builder.query<ApiResponse<Diploma[]>, void>({
      query: () => '/diploma',
      providesTags: ['Diploma'],
    }),
    getDiploma: builder.query<ApiResponse<Diploma>, number>({
      query: (id) => `/diploma/${id}`,
      providesTags: ['Diploma'],
    }),

    // Applications endpoints
    getApplications: builder.query<ApiResponse<Application[]>, void>({
      query: () => '/application',
      providesTags: ['Application'],
    }),
    getApplication: builder.query<ApiResponse<Application>, number>({
      query: (id) => `/application/${id}`,
      providesTags: ['Application'],
    }),
    createApplication: builder.mutation<ApiResponse<Application>, ApplicationRequest>({
      query: (applicationData) => ({
        url: '/application',
        method: 'POST',
        body: applicationData,
      }),
      invalidatesTags: ['Application'],
    }),
    deleteApplication: builder.mutation<void, number>({
      query: (id) => ({
        url: `/application/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetSchoolsQuery,
  useGetSchoolQuery,
  useGetDiplomasQuery,
  useGetDiplomaQuery,
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useCreateApplicationMutation,
  useDeleteApplicationMutation,
} = apiSlice;