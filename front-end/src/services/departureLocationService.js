import api from './api';

export const departureLocationService = {
  getAllDepartureLocations: (params) => api.get('/departure-locations', { params }),
  getDepartureLocationById: (id) => api.get(`/departure-locations/${id}`),
  createDepartureLocation: (data) => api.post('/departure-locations', data),
  updateDepartureLocation: (id, data) => api.put(`/departure-locations/${id}`, data),
  deleteDepartureLocation: (id) => api.delete(`/departure-locations/${id}`)
};
