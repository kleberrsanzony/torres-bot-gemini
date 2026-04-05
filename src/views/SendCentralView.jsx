import React, { useState } from 'react';
import { Send, Play, Zap, ExternalLink, Calendar, Check, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { WhatsAppProviderAdapter } from '../services/whatsappAdapter';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import WhatsAppPreview from '../components/features/WhatsAppPreview';

const SendCentralView = () => {
  const { state, dispatch } = useAppContext();
  const offer = state.currentOffer;
  
  const [selectedDests, setSelectedDests] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendMode, setSendMode] = useState('auto'); // auto, semi, manual

  if (!offer || !offer.copy) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
        <Send className="w-12 h-12 mb-4 opacity-50" />
        <h2 className="text-xl font-medium text-slate-300">Nenhuma oferta pronta para envio</h2>
        <p className="mt-2 mb-6">Crie a copy da oferta antes de vir para a central de envios.</p>
        <Button onClick={() => dispatch({type: 'SET_VIEW', payload: 'offer-editor'})}>Voltar ao Editor</Button>
      </div>
    );
  }

  const toggleDest = (id) => {
    setSelectedDests(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const selectAllGroups = () => {
    const groupIds = state.destinations.filter(d => d.type === 'group').map(d => d.id);
    setSelectedDests(groupIds);
  };

  const handleSend = async () => {
    if (selectedDests.length === 0) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Selecione pelo menos um destino!', type: 'error' } });
      return;
    }

    if (sendMode === 'manual') {
      const text = encodeURIComponent(offer.copy);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      return;
    }

    setIsSending(true);
    
    // Simula loop de envios
    const destsToSend = [...selectedDests];
    for (const destId of destsToSend) {
      const dest = state.destinations.find(d => d.id === destId);
      try {
        await WhatsAppProviderAdapter.sendText(dest.identifier, offer.copy, 1500);
        
        dispatch({ 
          type: 'ADD_HISTORY', 
          payload: { 
            id: `hist_${Date.now()}_${Math.random()}`, 
            offerName: offer.title, 
            destinationName: dest.name, 
            timestamp: new Date().toISOString(), 
            status: 'enviado' 
          } 
        });
      } catch (error) {
         dispatch({ 
          type: 'ADD_HISTORY', 
          payload: { 
            id: `hist_${Date.now()}_${Math.random()}`, 
            offerName: offer.title, 
            destinationName: dest.name, 
            timestamp: new Date().toISOString(), 
            status: 'falhou' 
          } 
        });
      }
    }

    setIsSending(false);
    setSelectedDests([]);
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Campanha finalizada! Verifique o histórico.', type: 'success' } });
    setTimeout(() => dispatch({ type: 'SET_VIEW', payload: 'history' }), 1000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-500" />
            Disparar Campanha
          </h2>
          <p className="text-slate-400">Selecione os grupos e envie sua oferta: <span className="text-emerald-400 font-medium">{offer.title}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-7 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-200">Destinos ({selectedDests.length} selecionados)</h3>
            <Button variant="ghost" size="sm" onClick={selectAllGroups}>Sel. Todos Grupos</Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {state.destinations.map(dest => (
              <label key={dest.id} className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${selectedDests.includes(dest.id) ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                <div onClick={(e) => { e.preventDefault(); toggleDest(dest.id); }} className={`w-5 h-5 rounded flex items-center justify-center border ${selectedDests.includes(dest.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                  {selectedDests.includes(dest.id) && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1" onClick={() => toggleDest(dest.id)}>
                  <p className="text-sm font-medium text-slate-200">{dest.name}</p>
                  <p className="text-xs text-slate-500">{dest.type === 'group' ? 'Grupo' : dest.type === 'list' ? 'Lista' : 'Contato'} • {dest.contactsCount} contatos</p>
                </div>
                <Badge variant={dest.status === 'active' ? 'success' : 'default'}>{dest.status === 'active' ? 'Online' : 'Offline'}</Badge>
              </label>
            ))}
          </div>

          <div className="p-5 border-t border-slate-800 bg-slate-900/80 space-y-4">
             <div>
                <p className="text-sm font-medium text-slate-400 mb-2">Modo de Envio</p>
                <div className="grid grid-cols-3 gap-2">
                  <div onClick={() => setSendMode('auto')} className={`text-center p-2 rounded-lg border cursor-pointer text-sm ${sendMode === 'auto' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <Zap className="w-4 h-4 mx-auto mb-1" /> Automático
                  </div>
                  <div onClick={() => setSendMode('manual')} className={`text-center p-2 rounded-lg border cursor-pointer text-sm ${sendMode === 'manual' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <ExternalLink className="w-4 h-4 mx-auto mb-1" /> Abrir Web
                  </div>
                  <div className={`text-center p-2 rounded-lg border text-sm bg-slate-950 border-slate-800 text-slate-700 cursor-not-allowed opacity-50`}>
                    <Calendar className="w-4 h-4 mx-auto mb-1" /> Agendar
                  </div>
                </div>
             </div>
             
             <Button 
                className="w-full" 
                size="lg" 
                icon={Play} 
                onClick={handleSend} 
                loading={isSending}
                disabled={selectedDests.length === 0}
              >
                {isSending ? `Enviando (${selectedDests.length} restam)...` : `Iniciar Disparo (${selectedDests.length})`}
             </Button>
          </div>
        </Card>

        <div className="lg:col-span-5 h-full flex flex-col gap-4">
          <Card className="p-4 bg-slate-900/50 border-emerald-900/30">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Status da Operação</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-200 font-medium">Pronto para envio</p>
                <p className="text-xs text-slate-500">Provider: Evolution API ({state.settings.activeNumber})</p>
              </div>
            </div>
          </Card>

          <div className="flex-1 min-h-0 flex flex-col">
            <h3 className="font-semibold text-slate-300 mb-2 text-sm">Resumo da Mensagem</h3>
            <div className="flex-1 rounded-xl overflow-hidden border border-slate-800">
               <WhatsAppPreview text={offer.copy} image={offer.thumbnail} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCentralView;
