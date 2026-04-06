import { MOCK_ML_PRODUCTS } from './mockData';

export const MLService = {
  fetchMyProducts: async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ML_PRODUCTS), 800));
  },
  getAuthUrl: (clientId, redirectUri) => {
    const baseUrl = 'https://auth.mercadolivre.com.br/authorization';
    return `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
};
