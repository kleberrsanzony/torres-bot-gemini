import { MOCK_ML_PRODUCTS } from './mockData';

export const MLService = {
  fetchMyProducts: async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ML_PRODUCTS), 800));
  }
};
