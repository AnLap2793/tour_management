import api from './api';

export const categoryService = {
  getAllCategories: (params) => api.get('/categories', { params }),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  
  createCategory: (data) => {
    // Handle image upload if present
    if (data.image?.length > 0) {
      const formData = new FormData();
      formData.append('image', data.image[0].originFileObj);
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('status', data.status);
      return api.post('/categories', formData);
    }
    
    // If no image, send regular JSON
    const { image, ...categoryData } = data;
    return api.post('/categories', categoryData);
  },

  updateCategory: (id, data) => {
    // Handle image upload if present
    if (data.image?.length > 0) {
      const formData = new FormData();
      formData.append('image', data.image[0].originFileObj);
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('status', data.status);
      return api.put(`/categories/${id}`, formData);
    }
    
    // If no image, send regular JSON
    const { image, ...categoryData } = data;
    return api.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: (id) => api.delete(`/categories/${id}`)
};