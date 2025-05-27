
import api from './api';

export const tourScheduleService = {
  getAllSchedules: (params) => api.get('/tour-schedules', { params }),
  getScheduleById: (id) => api.get(`/tour-schedules/${id}`),
  getAvailableSchedules: (params) => api.get('/tour-schedules/available', { params }),
  
  createSchedule: (data) => api.post('/tour-schedules', data),
  updateSchedule: (id, data) => api.put(`/tour-schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/tour-schedules/${id}`)
};
