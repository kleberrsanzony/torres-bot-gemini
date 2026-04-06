import React, { createContext, useContext, useReducer } from 'react';
import { MOCK_DESTINATIONS } from '../services/mockData';

const initialState = {
  view: 'dashboard',
  products: [],
  offers: [],
  destinations: MOCK_DESTINATIONS,
  history: [],
  settings: {
    storeName: 'Minha Loja PRO',
    defaultProvider: 'evolution',
    activeNumber: '+55 11 98888-7777',
    isConnected: true,
    mercadolivre: {
      clientId: '',
      clientSecret: '',
      redirectUri: 'https://torres-bot-gemini.vercel.app/auth/mercadolivre/callback',
      accessToken: '',
      refreshToken: '',
      isConnected: false
    },
    evolution: {
      instanceUrl: '',
      instanceName: '',
      apikey: '',
      targetGroupId: ''
    }
  },
  toast: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW': return { ...state, view: action.payload };
    case 'SET_PRODUCTS': return { ...state, products: action.payload };
    case 'ADD_OFFER': return { ...state, offers: [action.payload, ...state.offers], view: 'offer-editor', currentOffer: action.payload };
    case 'UPDATE_OFFER': return { ...state, offers: state.offers.map(o => o.id === action.payload.id ? action.payload : o), currentOffer: action.payload };
    case 'SET_CURRENT_OFFER': return { ...state, currentOffer: action.payload, view: 'offer-editor' };
    case 'ADD_HISTORY': return { ...state, history: [action.payload, ...state.history] };
    case 'SHOW_TOAST': return { ...state, toast: action.payload };
    case 'HIDE_TOAST': return { ...state, toast: null };
    case 'UPDATE_SETTINGS': 
      return { 
        ...state, 
        settings: { 
          ...state.settings, 
          ...action.payload,
          mercadolivre: {
            ...state.settings.mercadolivre,
            ...(action.payload.mercadolivre || {})
          },
          evolution: {
            ...state.settings.evolution,
            ...(action.payload.evolution || {})
          }
        } 
      };
    default: return state;
  }
}

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
