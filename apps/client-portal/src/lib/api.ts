import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data: {
    companyName: string;
    name: string;
    email: string;
    password: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),
};

// Company API
export const companyApi = {
  get: (companyId: string) => api.get(`/companies/${companyId}`),

  update: (companyId: string, data: Record<string, unknown>) =>
    api.put(`/companies/${companyId}`, data),

  getOnboarding: (companyId: string) =>
    api.get(`/companies/${companyId}/onboarding`),

  updateOnboarding: (companyId: string, data: Record<string, unknown>) =>
    api.put(`/companies/${companyId}/onboarding`, data),

  completeOnboarding: (companyId: string) =>
    api.post(`/companies/${companyId}/onboarding/complete`),

  getUsers: (companyId: string) => api.get(`/companies/${companyId}/users`),

  inviteUser: (
    companyId: string,
    data: { email: string; name: string; role?: string }
  ) => api.post(`/companies/${companyId}/users`, data),
};

// Project API
export const projectApi = {
  list: () => api.get('/projects'),

  get: (projectId: string) => api.get(`/projects/${projectId}`),

  getMilestones: (projectId: string) =>
    api.get(`/projects/${projectId}/milestones`),

  getTasks: (projectId: string, params?: { status?: string; milestoneId?: string }) =>
    api.get(`/projects/${projectId}/tasks`, { params }),

  getFeatureRequests: (projectId: string, params?: { status?: string; type?: string }) =>
    api.get(`/projects/${projectId}/feature-requests`, { params }),

  createFeatureRequest: (
    projectId: string,
    data: { type?: string; priority?: string; title: string; description: string }
  ) => api.post(`/projects/${projectId}/feature-requests`, data),

  getIssues: (projectId: string, params?: { status?: string; severity?: string }) =>
    api.get(`/projects/${projectId}/issues`, { params }),

  createIssue: (
    projectId: string,
    data: { title: string; description: string; severity?: string }
  ) => api.post(`/projects/${projectId}/issues`, data),

  getComments: (projectId: string) => api.get(`/projects/${projectId}/comments`),

  createComment: (projectId: string, data: { content: string; parentId?: string }) =>
    api.post(`/projects/${projectId}/comments`, data),

  getFiles: (projectId: string) => api.get(`/projects/${projectId}/files`),

  getActivity: (projectId: string, limit?: number) =>
    api.get(`/projects/${projectId}/activity`, { params: { limit } }),
};

// Billing API
export const billingApi = {
  getOverview: () => api.get('/billing/overview'),

  createSubscriptionCheckout: (data: {
    priceId: string;
    successUrl?: string;
    cancelUrl?: string;
  }) => api.post('/billing/checkout/subscription', data),

  createMilestoneCheckout: (
    milestoneId: string,
    data?: { successUrl?: string; cancelUrl?: string }
  ) => api.post(`/billing/checkout/milestone/${milestoneId}`, data),

  createPortalSession: (returnUrl?: string) =>
    api.post('/billing/portal', { returnUrl }),

  getInvoices: () => api.get('/billing/invoices'),

  getInvoice: (invoiceId: string) => api.get(`/billing/invoices/${invoiceId}`),

  getSubscriptions: () => api.get('/billing/subscriptions'),

  cancelSubscription: (subscriptionId: string) =>
    api.post(`/billing/subscriptions/${subscriptionId}/cancel`),
};
