import api from './api';

export const tourService = {
  getAllTours: (params) => api.get('/tours', { params }),
  getTourById: (id) => api.get(`/tours/${id}`),
  searchTours: (query, params) => api.get('/tours/search', { 
    params: { query, ...params } 
  }),
  
  createTour: (data) => api.post('/tours', data),
  updateTour: (id, data) => api.put(`/tours/${id}`, data),
  deleteTour: (id) => api.delete(`/tours/${id}`)
};