import api from './api';

export const reviewService = {
  getAllReviews: (params) => api.get('/reviews', { params }),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  getTourReviews: (tourId, params) => api.get(`/reviews/tour/${tourId}`, { params }),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};
