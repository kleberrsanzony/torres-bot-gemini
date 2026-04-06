import React, { useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MLCallbackView = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Get code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const { clientId, clientSecret, redirectUri } = state.settings.mercadolivre;

    const completeConnection = async () => {
      if (code && clientId && clientSecret) {
        console.log('Finalizing Mercado Livre Auth with Proxy...');
        
        try {
          // Perform the real token exchange via our Vercel Serverless Function
          const tokenData = await MLService.exchangeCodeForToken(code, clientId, clientSecret, redirectUri);
          
          // Update state with the token and info
          dispatch({ 
            type: 'UPDATE_SETTINGS', 
            payload: { 
              mercadolivre: {
                authCode: code,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                isConnected: true,
                connectedAt: new Date().toISOString()
              }
            } 
          });

          dispatch({ 
            type: 'SHOW_TOAST', 
            payload: { 
              title: 'Conectado!', 
              message: 'Sua conta do Mercado Livre foi vinculada com sucesso.', 
              type: 'success' 
            } 
          });

          // Redirect back to settings after a delay
          setTimeout(() => {
            dispatch({ type: 'SET_VIEW', payload: 'settings' });
            dispatch({ type: 'HIDE_TOAST' });
          }, 2000);
        } catch (error) {
          console.error('Finalization Error:', error);
          dispatch({ 
            type: 'SHOW_TOAST', 
            payload: { 
              title: 'Erro na Fase 2', 
              message: `Não foi possível trocar o código pelo token: ${error.message}`, 
              type: 'error' 
            } 
          });
          setTimeout(() => {
            dispatch({ type: 'SET_VIEW', payload: 'settings' });
            dispatch({ type: 'HIDE_TOAST' });
          }, 4000);
        }
      } else {
        // Handle error or lack of code/data
        dispatch({ 
          type: 'SHOW_TOAST', 
          payload: { 
            title: 'Erro de Configuração', 
            message: 'Faltam dados (Client ID ou Secret) para completar a conexão.', 
            type: 'error' 
          } 
        });
        setTimeout(() => {
          dispatch({ type: 'SET_VIEW', payload: 'settings' });
          dispatch({ type: 'HIDE_TOAST' });
        }, 3000);
      }
    };

    completeConnection();
  }, [dispatch, state.settings.mercadolivre]);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 border-4 border-slate-950 flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-slate-950" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Finalizando Conexão</h2>
        <p className="text-slate-400 max-w-xs mx-auto">
          Estamos processando sua autorização com o Mercado Livre. Você será redirecionado em instantes...
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-xs font-mono text-emerald-400">Verificando tokens de acesso...</span>
      </div>
    </div>
  );
};

// Icon helper
const ShoppingBag = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;

export default MLCallbackView;
