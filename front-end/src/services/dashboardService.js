import api from './api';

export const dashboardService = {
  getStatistics: () => api.get('/dashboard/statistics'),
  getRevenueStats: (period = 'monthly') => api.get('/dashboard/revenue', { params: { period } }),
  getTourStats: () => api.get('/dashboard/tours')
};