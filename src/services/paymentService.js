import api from './api';

const paymentService = {
  // Initiate payment
  initiatePayment: async (orderId, paymentData) => {
    const response = await api.post(`/payments/initiate/`, {
      order_id: orderId,
      ...paymentData,
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentId, verificationData) => {
    const response = await api.post(`/payments/${paymentId}/verify/`, verificationData);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history/');
    return response.data;
  },

  // Process payment callback (for payment gateway webhooks)
  processCallback: async (callbackData) => {
    const response = await api.post('/payments/callback/', callbackData);
    return response.data;
  },
};

export default paymentService;


