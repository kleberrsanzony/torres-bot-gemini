import React from 'react';
import { History, Search, RefreshCcw, Copy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const HistoryView = () => {
  const { state } = useAppContext();

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
       <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-slate-400" />
          Histórico de Envios
        </h2>
        <p className="text-slate-400">Acompanhe o status de todas as mensagens disparadas.</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-[500px]">
         <div className="p-4 border-b border-slate-800 flex gap-4 bg-slate-900/50">
           <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Buscar no histórico..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
           </div>
           <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none">
             <option value="all">Todos os Status</option>
             <option value="enviado">Enviados</option>
             <option value="falhou">Falhas</option>
           </select>
         </div>

         <div className="flex-1 overflow-y-auto">
           {state.history.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                <History className="w-12 h-12 opacity-20" />
                <p>Nenhum envio registrado ainda.</p>
              </div>
           ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-900/50 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Data/Hora</th>
                  <th className="px-6 py-4 font-medium">Oferta</th>
                  <th className="px-6 py-4 font-medium">Destino</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {state.history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(h.timestamp).toLocaleDateString()} <br/>
                      <span className="text-xs">{new Date(h.timestamp).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{h.offerName}</td>
                    <td className="px-6 py-4 text-slate-400">{h.destinationName}</td>
                    <td className="px-6 py-4">
                      <Badge variant={h.status === 'enviado' ? 'success' : h.status === 'falhou' ? 'danger' : 'warning'}>{h.status.toUpperCase()}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <Button variant="ghost" size="sm" icon={RefreshCcw} className="w-8 h-8 p-0" title="Reenviar" />
                       <Button variant="ghost" size="sm" icon={Copy} className="w-8 h-8 p-0" title="Copiar Log" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           )}
         </div>
      </Card>
    </div>
  );
};

export default HistoryView;
