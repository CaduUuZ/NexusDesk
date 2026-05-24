import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const api = axios.create({ baseURL: API_URL });

let _token = null;
export const setToken = (t) => { _token = t; };

api.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const ticketAPI = {
  list: (params) => api.get('/tickets', { params }),
  get: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  assign: (id, technicianId) => api.patch(`/tickets/${id}/assign`, { technicianId }),
  dashboard: () => api.get('/tickets/dashboard'),
};

export const commentAPI = {
  list: (ticketId) => api.get(`/tickets/${ticketId}/comments`),
  create: (ticketId, data) => api.post(`/tickets/${ticketId}/comments`, data),
  delete: (ticketId, commentId) => api.delete(`/tickets/${ticketId}/comments/${commentId}`),
};

export const notificationAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};
