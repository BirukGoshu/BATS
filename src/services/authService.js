import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    // Check if userData contains files (FormData)
    const isFormData = userData instanceof FormData;
    
    const config = isFormData
      ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      : {
          headers: {
            'Content-Type': 'application/json',
          },
        };

    const response = await api.post('/register/', userData, config);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    const { token, user } = response.data;
    
    // Store token and user data in localStorage
    if (token) {
      localStorage.setItem('access_token', token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return { token, user };
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/api/users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/', userData);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await api.post('/users/change-password/', passwords);
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken,
    });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;


