import { MOCK_ML_PRODUCTS } from './mockData';

export const MLService = {
  fetchMyProducts: async (accessToken) => {
    if (!accessToken) {
      // Return mock data if not authenticated for better demo experience
      return new Promise(resolve => setTimeout(() => resolve(MOCK_ML_PRODUCTS), 800));
    }
    
    try {
      // In a real scenario, this would call the Mercado Livre API with the token
      // For this MVP, we'll continue using mock data but simulate the authenticating process
      console.log('Fetching real products with token:', accessToken.substring(0, 8) + '...');
      return new Promise(resolve => setTimeout(() => resolve(MOCK_ML_PRODUCTS), 1200));
    } catch (error) {
      console.error('ML Fetch Error:', error);
      throw error;
    }
  },

  exchangeCodeForToken: async (code, clientId, clientSecret, redirectUri) => {
    try {
      const response = await fetch('/api/ml-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, clientId, clientSecret, redirectUri })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao trocar código por token');
      }
      return data;
    } catch (error) {
      console.error('ML Token Exchange Error:', error);
      throw error;
    }
  },

  getAuthUrl: (clientId, redirectUri) => {
    const baseUrl = 'https://auth.mercadolivre.com.br/authorization';
    return `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
};
