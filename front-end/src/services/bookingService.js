import api from './api';

export const bookingService = {
  // User endpoints
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  createBooking: (data) => api.post('/bookings', data),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
  createPaymentUrl: (data) => api.post('/payments/create-payment-url', data),
  
  // Admin endpoints
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data)
};