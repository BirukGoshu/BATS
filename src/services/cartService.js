import api from './api';

const cartService = {
  // Get cart items
  getCart: async () => {
    const response = await api.get('/cart/');
    return response.data;
  },

  // Add item to cart
  addToCart: async (itemData) => {
    const response = await api.post('/cart/add/', itemData);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await api.patch(`/cart/items/${itemId}/`, {
      quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}/`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart/clear/');
    return response.data;
  },

  // Get cart total
  getCartTotal: async () => {
    const response = await api.get('/cart/total/');
    return response.data;
  },
};

export default cartService;


