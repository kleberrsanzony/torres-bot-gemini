import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCcw, Search, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MLService } from '../services/mlService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MLProductsView = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isConnected = state.settings.mercadolivre.isConnected;

  useEffect(() => {
    if (isConnected && state.products.length === 0) {
      loadProducts();
    }
  }, [isConnected]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await MLService.fetchMyProducts();
    dispatch({ type: 'SET_PRODUCTS', payload: data });
    setLoading(false);
  };

  const handleImport = (product) => {
    const newOffer = {
      ...product,
      id: `offer_${Date.now()}`,
      originalProductId: product.id,
      copy: '',
      urgency: 'Estoque Limitado!',
      status: 'draft'
    };
    dispatch({ type: 'ADD_OFFER', payload: newOffer });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Produto importado! Gere sua copy agora.', type: 'success' } });
  };

  const filtered = state.products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-yellow-500" />
            Meus Anúncios ML
          </h2>
          <p className="text-slate-400">Selecione produtos da sua conta para criar ofertas.</p>
        </div>
        <Button onClick={loadProducts} loading={loading} icon={RefreshCcw} variant="secondary">Sincronizar</Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou SKU..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" icon={Filter} className="hidden sm:flex">Filtros</Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-500">
              <RefreshCcw className="w-8 h-8 animate-spin text-emerald-500" />
              <p>Buscando seus anúncios no Mercado Livre...</p>
            </div>
          ) : !isConnected ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 text-center px-4">
              <ShoppingBag className="w-16 h-16 opacity-10 mb-2" />
              <div className="space-y-1">
                <p className="text-xl font-medium text-slate-300">Conta não vinculada</p>
                <p className="text-sm max-w-sm">Você precisa conectar sua conta do Mercado Livre nas configurações para visualizar seus produtos.</p>
              </div>
              <Button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'settings' })} variant="primary">Ir para Configurações</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <ShoppingBag className="w-12 h-12 opacity-20 mb-3" />
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex gap-4 hover:border-slate-700 transition-colors group">
                  <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 p-1 flex items-center justify-center relative overflow-hidden">
                    <img src={product.thumbnail} alt={product.title} className="object-contain w-full h-full" />
                    {product.promoPrice && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                        -{Math.round((1 - product.promoPrice/product.price)*100)}%
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium text-slate-200 line-clamp-2" title={product.title}>{product.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">SKU: {product.sku || 'N/A'} • Est: {product.stock}</p>
                    
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div>
                        {product.promoPrice ? (
                          <>
                            <span className="text-xs text-slate-500 line-through block">R$ {product.price.toFixed(2)}</span>
                            <span className="text-lg font-bold text-emerald-400">R$ {product.promoPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-emerald-400 block mt-4">R$ {product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <Button size="sm" onClick={() => handleImport(product)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Importar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MLProductsView;
