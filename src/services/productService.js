import api from './api';

const productService = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const response = await api.get('/product/', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/product/${id}/`);
    return response.data;
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          productData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, productData[key]);
        }
      }
    });
    const response = await api.post('/product/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update product (Admin only)
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          productData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, productData[key]);
        }
      }
    });
    const response = await api.patch(`/product/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/product/${id}/`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/productcategory/');
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get('/product/search/', {
      params: { q: query },
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/product/featured/');
    return response.data;
  },
};

export default productService;


