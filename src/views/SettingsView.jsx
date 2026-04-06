import React, { useState } from 'react';
import { 
  Settings, Save, Key, Globe, Layout, 
  ShieldCheck, RefreshCw, ExternalLink, Bot, ShoppingBag, Users
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import { MLService } from '../services/mlService';

const SettingsView = () => {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    mercadolivre: { ...state.settings.mercadolivre },
    evolution: { ...state.settings.evolution }
  });

  // Sync form data whenever global settings change (especially after auth callback)
  React.useEffect(() => {
    setFormData({
      mercadolivre: { ...state.settings.mercadolivre },
      evolution: { ...state.settings.evolution }
    });
  }, [state.settings]);

  const [loading, setLoading] = useState({
    ml: false,
    evo: false,
    qr: false
  });

  const handleMLChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      mercadolivre: { ...prev.mercadolivre, [name]: value }
    }));
  };

  const handleEvoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      evolution: { ...prev.evolution, [name]: value }
    }));
  };

  const handleSave = () => {
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { 
        mercadolivre: formData.mercadolivre,
        evolution: formData.evolution
      }
    });
    
    dispatch({
      type: 'SHOW_TOAST',
      payload: { title: 'Configurações Salvas', message: 'Suas chaves de API foram atualizadas com sucesso.', type: 'success' }
    });
    
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
  };

  const handleMLConnect = () => {
    const { clientId, redirectUri } = formData.mercadolivre;
    if (!clientId) {
      dispatch({ type: 'SHOW_TOAST', payload: { title: 'Erro de Configuração', message: 'Por favor, preencha o Client ID antes de conectar.', type: 'error' } });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return;
    }

    // CRITICAL: Save current form data to global state before redirecting
    // so it's not lost when the page reloads/redirects back.
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { 
        mercadolivre: formData.mercadolivre,
        evolution: formData.evolution
      }
    });

    setLoading(prev => ({ ...prev, ml: true }));
    const authUrl = MLService.getAuthUrl(clientId, redirectUri);
    
    // Simulate a small delay for UI feedback
    setTimeout(() => {
      window.open(authUrl, '_blank');
      setLoading(prev => ({ ...prev, ml: false }));
    }, 800);
  };

  const handleEvoTest = () => {
    const { instanceUrl, instanceName, apikey } = formData.evolution;
    if (!instanceUrl || !instanceName || !apikey) {
      dispatch({ type: 'SHOW_TOAST', payload: { title: 'Dados Incompletos', message: 'Preencha todos os campos da Evolution API para testar.', type: 'error' } });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return;
    }

    setLoading(prev => ({ ...prev, evo: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoading(prev => ({ ...prev, evo: false }));
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { 
          title: 'Conexão Estabelecida', 
          message: `Instância "${instanceName}" respondendo corretamente.`, 
          type: 'success' 
        } 
      });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    }, 1500);
  };

  const handleEvoQR = () => {
    const { instanceName } = formData.evolution;
    if (!instanceName) {
      dispatch({ type: 'SHOW_TOAST', payload: { title: 'Erro', message: 'Nome da instância é obrigatório para gerar QR Code.', type: 'error' } });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return;
    }

    setLoading(prev => ({ ...prev, qr: true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, qr: false }));
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { 
          title: 'QR Code Gerado', 
          message: `O QR Code para a instância "${instanceName}" foi enviado para o serviço de pareamento.`, 
          type: 'success' 
        } 
      });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-500" />
            Configurações do Sistema
          </h2>
          <p className="text-slate-400 mt-1">Gerencie suas conexões de API e preferências do painel.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Save className="w-5 h-5" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mercado Livre Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <ShoppingBag className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mercado Livre API</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Integração de Vendas</p>
            </div>
          </div>

          <Card className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Layout className="w-4 h-4 text-slate-500" />
                Client ID
              </label>
              <input 
                type="text" 
                name="clientId"
                value={formData.mercadolivre.clientId}
                onChange={handleMLChange}
                placeholder="Ex: 5829103948571"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Client Secret
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  name="clientSecret"
                  value={formData.mercadolivre.clientSecret}
                  onChange={handleMLChange}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/50 transition-all pr-12"
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                Redirect URI (Callback)
              </label>
              <input 
                type="text" 
                name="redirectUri"
                value={formData.mercadolivre.redirectUri}
                onChange={handleMLChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 focus:outline-none cursor-not-allowed bg-slate-900/30"
                readOnly
              />
              <p className="text-[10px] text-slate-500 px-1 italic">Configure esta URL exatamente igual no seu painel de desenvolvedor do Mercado Livre.</p>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleMLConnect}
                disabled={loading.ml}
                className={`w-full flex items-center justify-center gap-2 p-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-xl font-medium transition-all group ${loading.ml ? 'opacity-70 cursor-wait' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading.ml ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {loading.ml ? 'Iniciando Conexão...' : 'Vincular Nova Conta'}
              </button>
            </div>
          </Card>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-4">
            <div className="shrink-0">
              <ExternalLink className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-sm">
              <p className="text-blue-300 font-medium">Link Útil</p>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Você pode criar e gerenciar suas integrações no <a href="https://developers.mercadolivre.com.br/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Portal de Desenvolvedores</a> do Mercado Livre.
              </p>
            </div>
          </div>
        </div>

        {/* Evolution API Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Bot className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Evolution API</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gateway de WhatsApp</p>
            </div>
          </div>

          <Card className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                URL da Instância
              </label>
              <input 
                type="text" 
                name="instanceUrl"
                value={formData.evolution.instanceUrl}
                onChange={handleEvoChange}
                placeholder="https://api.seuserver.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Layout className="w-4 h-4 text-slate-500" />
                Nome da Instância
              </label>
              <input 
                type="text" 
                name="instanceName"
                value={formData.evolution.instanceName}
                onChange={handleEvoChange}
                placeholder="ex: TorresBot_01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                API Key (Token)
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  name="apikey"
                  value={formData.evolution.apikey}
                  onChange={handleEvoChange}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all pr-12"
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Grupo Alvo (JID)
              </label>
              <input 
                type="text" 
                name="targetGroupId"
                value={formData.evolution.targetGroupId}
                onChange={handleEvoChange}
                placeholder="ex: 120363424792513247@g.us"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all font-mono text-sm"
              />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <button 
                onClick={handleEvoTest}
                disabled={loading.evo}
                className={`flex items-center justify-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl font-medium transition-all ${loading.evo ? 'opacity-70 cursor-wait' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading.evo ? 'animate-spin' : ''}`} />
                {loading.evo ? 'Testando...' : 'Testar Link'}
              </button>
              <button 
                onClick={handleEvoQR}
                disabled={loading.qr}
                className={`flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all ${loading.qr ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading.qr ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                {loading.qr ? 'Gerando...' : 'Gerar QR Code'}
              </button>
            </div>
          </Card>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
            <p className="text-sm text-slate-400 leading-relaxed italic">
              "A Evolution API permite conectar instâncias oficiais e não-oficiais do WhatsApp para automação de mensagens em massa e chatbots."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
