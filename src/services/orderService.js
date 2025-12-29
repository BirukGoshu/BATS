import api from './api';

const orderService = {
  // Create order from cart
  createOrder: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  // Get all orders (filtered by user role)
  getOrders: async (params = {}) => {
    const response = await api.get('/orders/', { params });
    return response.data;
  },

  // Get single order by ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  // Get my orders (Current user's orders)
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders/');
    return response.data;
  },

  // Update order status (Admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.post(`/orders/${id}/cancel/`);
    return response.data;
  },

  // Get order invoice
  getOrderInvoice: async (id) => {
    const response = await api.get(`/orders/${id}/invoice/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Update delivery address
  updateDeliveryAddress: async (id, addressData) => {
    const response = await api.patch(`/orders/${id}/delivery/`, addressData);
    return response.data;
  },

  // Track order
  trackOrder: async (id) => {
    const response = await api.get(`/orders/${id}/track/`);
    return response.data;
  },
};

export default orderService;


