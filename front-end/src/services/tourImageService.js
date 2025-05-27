import api from './api';

export const tourImageService = {
  getTourImages: (tourId) => api.get(`/tours/${tourId}/images`),
  
  addTourImages: (tourId, images) => {
    const formData = new FormData();
    images.forEach(file => {
      formData.append('images', file);
    });
    return api.post(`/tours/${tourId}/images`, formData);
  },

  updateImageOrder: (tourId, imageOrders) => 
    api.put(`/tours/${tourId}/images/order`, { imageOrders }),

  deleteImage: (tourId, imageId) => 
    api.delete(`/tours/${tourId}/images/${imageId}`)
};