import api from './api';

const designService = {
  // Get all designs with optional filters
  getDesigns: async (params = {}) => {
    const response = await api.get('/designs/', { params });
    return response.data;
  },

  // Get single design by ID
  getDesign: async (id) => {
    const response = await api.get(`/designs/${id}/`);
    return response.data;
  },

  // Upload new design (Designer only)
  uploadDesign: async (designData) => {
    const formData = new FormData();
    Object.keys(designData).forEach((key) => {
      if (designData[key] !== null && designData[key] !== undefined) {
        if (Array.isArray(designData[key])) {
          designData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, designData[key]);
        }
      }
    });
    const response = await api.post('/designs/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update design (Designer/Owner only)
  updateDesign: async (id, designData) => {
    const formData = new FormData();
    Object.keys(designData).forEach((key) => {
      if (designData[key] !== null && designData[key] !== undefined) {
        if (Array.isArray(designData[key])) {
          designData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, designData[key]);
        }
      }
    });
    const response = await api.patch(`/designs/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete design (Designer/Owner only)
  deleteDesign: async (id) => {
    const response = await api.delete(`/designs/${id}/`);
    return response.data;
  },

  // Get designs by designer
  getDesignsByDesigner: async (designerId) => {
    const response = await api.get('/designs/', {
      params: { designer: designerId },
    });
    return response.data;
  },

  // Get my designs (Current user's designs)
  getMyDesigns: async () => {
    const response = await api.get('/designs/my-designs/');
    return response.data;
  },

  // Assign design to product
  assignDesignToProduct: async (designId, productId) => {
    const response = await api.post(`/designs/${designId}/assign-product/`, {
      product_id: productId,
    });
    return response.data;
  },

  // Search designs
  searchDesigns: async (query) => {
    const response = await api.get('/designs/search/', {
      params: { q: query },
    });
    return response.data;
  },
};

export default designService;


