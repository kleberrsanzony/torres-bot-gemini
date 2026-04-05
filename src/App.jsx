import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Send, Users, History, Settings, 
  Menu, X, Edit, Zap
} from 'lucide-react';
import { useAppContext } from './context/AppContext';
import DashboardView from './views/DashboardView';
import MLProductsView from './views/MLProductsView';
import OfferEditorView from './views/OfferEditorView';
import SendCentralView from './views/SendCentralView';
import HistoryView from './views/HistoryView';
import SettingsView from './views/SettingsView';
import Toast from './components/ui/Toast';

const Store = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>;

const SidebarItem = ({ icon: Icon, label, view, currentView, onClick }) => {
  const active = currentView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-emerald-500' : ''}`} />
      {label}
    </button>
  );
};

function App() {
  const { state, dispatch } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
    setSidebarOpen(false);
  };

  const renderView = () => {
    switch (state.view) {
      case 'dashboard': return <DashboardView />;
      case 'ml-products': return <MLProductsView />;
      case 'offer-editor': return <OfferEditorView />;
      case 'send-central': return <SendCentralView />;
      case 'history': return <HistoryView />;
      case 'settings': return <SettingsView />;
      default: return <div className="text-white">Em construção...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Painel Zap<span className="text-emerald-500">PRO</span></h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" view="dashboard" currentView={state.view} onClick={navigate} />
          <SidebarItem icon={ShoppingBag} label="Meus Produtos ML" view="ml-products" currentView={state.view} onClick={navigate} />
          <SidebarItem icon={Edit} label="Criar Oferta" view="offer-editor" currentView={state.view} onClick={navigate} />
          <SidebarItem icon={Send} label="Central de Envios" view="send-central" currentView={state.view} onClick={navigate} />
          <div className="my-4 border-t border-slate-800/50 pt-4"></div>
          <SidebarItem icon={Users} label="Destinos" view="destinations" currentView={state.view} onClick={navigate} />
          <SidebarItem icon={History} label="Histórico" view="history" currentView={state.view} onClick={navigate} />
          <SidebarItem icon={Settings} label="Configurações" view="settings" currentView={state.view} onClick={navigate} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <Store className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{state.settings.storeName}</p>
              <p className="text-xs text-emerald-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Conectado
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay & Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-72 max-w-[80%] bg-slate-900 border-r border-slate-800 flex flex-col animate-in slide-in-from-left-full">
            <div className="p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-slate-950 fill-current" />
                </div>
                <h1 className="font-bold text-lg">Painel ZapPRO</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" view="dashboard" currentView={state.view} onClick={navigate} />
              <SidebarItem icon={ShoppingBag} label="Meus Produtos ML" view="ml-products" currentView={state.view} onClick={navigate} />
              <SidebarItem icon={Edit} label="Criar Oferta" view="offer-editor" currentView={state.view} onClick={navigate} />
              <SidebarItem icon={Send} label="Central de Envios" view="send-central" currentView={state.view} onClick={navigate} />
              <SidebarItem icon={Users} label="Destinos" view="destinations" currentView={state.view} onClick={navigate} />
              <SidebarItem icon={History} label="Histórico" view="history" currentView={state.view} onClick={navigate} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020617] relative">
        {/* Topbar Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div className="w-9"></div> {/* Spacer */}
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </div>
      </main>

      <Toast />
    </div>
  );
}

export default App;
