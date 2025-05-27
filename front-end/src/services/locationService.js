import api from './api';

export const locationService = {
  getAllLocations: (params) => api.get('/locations', { params }),
  getLocationById: (id) => api.get(`/locations/${id}`),
  searchLocations: (query, params) => api.get('/locations/search', { 
    params: { query, ...params } 
  }),
  
  createLocation: (data) => api.post('/locations', data),
  updateLocation: (id, data) => api.put(`/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/locations/${id}`)
};