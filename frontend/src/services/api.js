// src/services/api.js
// API service layer for all HTTP requests

import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";

      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    } else {
      // Something else happened
      return Promise.reject(new Error("An unexpected error occurred"));
    }
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// Users API endpoints (for future use)
export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updatePassword: (id, password) =>
    api.patch(`/users/${id}/password`, { newPassword: password }),
};

// Tasks API endpoints (for future use)
export const tasksAPI = {
  getAll: (params) => api.get("/tasks", { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  cancel: (id, reason) =>
    api.patch(`/tasks/${id}/cancel`, { cancellationReason: reason }),
  addReport: (id, report) =>
    api.patch(`/tasks/${id}/report`, { workReport: report }),
  reassign: (id, employeeId) =>
    api.patch(`/tasks/${id}/reassign`, { employeeId }),
};

// Dashboard API endpoints
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getMyStats: () => api.get("/dashboard/my-stats"),
  getEmployeeStats: () => api.get("/dashboard/employee-stats"),
  getRecentTasks: (params) => api.get("/dashboard/recent-tasks", { params }),
  getChartData: () => api.get("/dashboard/charts"),
  getMyChartData: () => api.get("/dashboard/my-charts"),
};

// Notifications API endpoints (for future use)
export const notificationsAPI = {
  getAll: (params) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/mark-all-read"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
