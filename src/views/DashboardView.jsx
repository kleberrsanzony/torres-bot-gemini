import React from 'react';
import { Zap, Send, Users, AlertCircle, History, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const DashboardView = () => {
  const { state, dispatch } = useAppContext();
  
  const stats = [
    { label: 'Ofertas Ativas', value: state.offers.length, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Envios Hoje', value: state.history.filter(h => h.status === 'enviado').length, icon: Send, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Destinos Ativos', value: state.destinations.filter(d => d.status === 'active').length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Falhas (24h)', value: state.history.filter(h => h.status === 'falhou').length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Visão Geral</h2>
        <p className="text-slate-400">Acompanhe o desempenho das suas ofertas no WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col h-[400px]">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-100">Últimos Envios</h3>
            <Button variant="ghost" size="sm" onClick={() => dispatch({type: 'SET_VIEW', payload: 'history'})}>Ver todos</Button>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            {state.history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                <History className="w-12 h-12 opacity-20" />
                <p>Nenhum envio registrado ainda.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-slate-900/50 sticky top-0">
                  <tr>
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium">Oferta</th>
                    <th className="px-5 py-3 font-medium">Destino</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {state.history.slice(0, 5).map((h, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 text-slate-300">{new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="px-5 py-4 font-medium text-slate-200 truncate max-w-[150px]">{h.offerName}</td>
                      <td className="px-5 py-4 text-slate-400 truncate max-w-[150px]">{h.destinationName}</td>
                      <td className="px-5 py-4">
                        <Badge variant={h.status === 'enviado' ? 'success' : h.status === 'falhou' ? 'danger' : 'warning'}>{h.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-semibold text-slate-100">Ações Rápidas</h3>
          </div>
          <div className="p-5 space-y-3">
            <Button className="w-full justify-start" icon={ShoppingBag} onClick={() => dispatch({type: 'SET_VIEW', payload: 'ml-products'})}>
              Importar do Mercado Livre
            </Button>
            <Button variant="secondary" className="w-full justify-start" icon={ShoppingBag} onClick={() => dispatch({type: 'SET_VIEW', payload: 'offer-editor'})}>
              Criar Oferta Manual
            </Button>
            <Button variant="secondary" className="w-full justify-start" icon={Send} onClick={() => dispatch({type: 'SET_VIEW', payload: 'send-central'})}>
              Nova Campanha
            </Button>
          </div>
          
          <div className="mt-auto p-5 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                 <Zap className="w-8 h-8 text-slate-400" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${state.settings.isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Status da API</p>
                <p className={`text-xs ${state.settings.isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {state.settings.isConnected ? 'Conectado e Operacional' : 'Desconectado'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
