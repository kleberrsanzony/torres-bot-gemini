import React, { useState, useEffect } from 'react';
import { Edit, Save, Send, Image as ImageIcon, Zap, RefreshCcw, Smartphone, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import WhatsAppPreview from '../components/features/WhatsAppPreview';

const OfferEditorView = () => {
  const { state, dispatch } = useAppContext();
  const offer = state.currentOffer;

  const [localOffer, setLocalOffer] = useState(offer || { title: '', price: 0, promoPrice: '', copy: '', thumbnail: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (offer) setLocalOffer(offer);
  }, [offer]);

  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        <h2 className="text-xl font-medium text-slate-300">Nenhuma oferta selecionada</h2>
        <p className="mt-2 mb-6">Importe um produto do ML ou crie um manualmente.</p>
        <Button onClick={() => dispatch({type: 'SET_VIEW', payload: 'ml-products'})}>Ir para Produtos</Button>
      </div>
    );
  }

  const generateCopy = (style) => {
    setIsGenerating(true);
    setTimeout(() => {
      let newCopy = '';
      const priceStr = localOffer.promoPrice ? `~R$ ${localOffer.price.toFixed(2)}~ por *R$ ${localOffer.promoPrice.toFixed(2)}*` : `por apenas *R$ ${localOffer.price.toFixed(2)}*`;
      const link = localOffer.permalink !== '#' ? localOffer.permalink : 'https://wa.me/5511999999999?text=Quero%20comprar';

      if (style === 'direto') {
        newCopy = `⚡ *OFERTA RÁPIDA* ⚡\n\n${localOffer.title}\n\n${priceStr} 😱\n\n🏃‍♂️ ${localOffer.urgency || 'Últimas unidades!'}\n\nCompre agora: ${link}`;
      } else if (style === 'varejo') {
        newCopy = `🚨 *ATENÇÃO GRUPO! SUPER PROMOÇÃO!* 🚨\n\nOlha o que acabou de entrar em oferta na nossa loja:\n\n📦 *${localOffer.title}*\n\nDe ${localOffer.promoPrice ? `~R$ ${localOffer.price.toFixed(2)}~` : ''}\nPor apenas ➡️ *R$ ${(localOffer.promoPrice || localOffer.price).toFixed(2)}* ⬅️\n\n✅ Produto Original\n✅ Compra Segura\n\n⏳ *Corra!* ${localOffer.urgency || 'Estoque limitadíssimo!'}\n\n👇 *CLIQUE NO LINK PARA GARANTIR O SEU* 👇\n${link}`;
      } else {
        newCopy = `✨ *Condição Especial* ✨\n\nElevando o padrão com: *${localOffer.title}*.\n\nDisponibilizamos um lote exclusivo ${priceStr}.\n\nUma oportunidade única para quem busca qualidade. ${localOffer.urgency || 'Disponibilidade restrita.'}\n\nAcesse nossa loja oficial ou responda esta mensagem:\n🔗 ${link}`;
      }

      setLocalOffer({ ...localOffer, copy: newCopy });
      setIsGenerating(false);
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Copy gerada com sucesso!', type: 'success' } });
    }, 600);
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_OFFER', payload: localOffer });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Oferta salva no painel!', type: 'success' } });
  };

  const handleGoToSend = () => {
    handleSave();
    dispatch({ type: 'SET_VIEW', payload: 'send-central' });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Edit className="w-6 h-6 text-emerald-500" />
            Configurar Oferta
          </h2>
          <p className="text-slate-400">Ajuste os dados e gere mensagens persuasivas.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Save} onClick={handleSave}>Salvar Rascunho</Button>
          <Button icon={Send} onClick={handleGoToSend}>Preparar Envio</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-2">Dados do Produto</h3>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                {localOffer.thumbnail ? <img src={localOffer.thumbnail} alt="thumb" className="max-w-full max-h-full object-contain" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <div className="flex-1 space-y-3">
                <Input label="Título Comercial" value={localOffer.title} onChange={e => setLocalOffer({...localOffer, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Preço Original (R$)" type="number" value={localOffer.price} onChange={e => setLocalOffer({...localOffer, price: parseFloat(e.target.value)})} />
                  <Input label="Preço Promo (R$)" type="number" value={localOffer.promoPrice || ''} onChange={e => setLocalOffer({...localOffer, promoPrice: parseFloat(e.target.value)})} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Gatilho de Urgência" placeholder="Ex: Apenas 5 unidades!" value={localOffer.urgency || ''} onChange={e => setLocalOffer({...localOffer, urgency: e.target.value})} />
              <Input label="SKU / Ref" value={localOffer.sku || ''} readOnly className="opacity-50" />
            </div>
          </Card>

          <Card className="flex-1 flex flex-col min-h-[300px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> IA Copy Generator
              </h3>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto">
                <button onClick={() => generateCopy('direto')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Direto</button>
                <button onClick={() => generateCopy('varejo')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Varejo Pop</button>
                <button onClick={() => generateCopy('premium')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Premium</button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col relative">
              {isGenerating && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-emerald-500">
                  <RefreshCcw className="w-8 h-8 animate-spin mb-2" />
                  <span className="font-medium">Criando texto persuasivo...</span>
                </div>
              )}
              <textarea 
                className="w-full h-full min-h-[200px] bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 resize-none font-sans leading-relaxed"
                placeholder="A copy gerada aparecerá aqui. Você pode editá-la livremente antes de enviar."
                value={localOffer.copy}
                onChange={e => setLocalOffer({...localOffer, copy: e.target.value})}
              />
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>{localOffer.copy.length} caracteres</span>
                <span>Suporta emojis e marcação (*bold*, ~strike~)</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 h-full flex flex-col">
          <h3 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-slate-400" />
            Preview do WhatsApp
          </h3>
          <div className="flex-1 sticky top-0">
            <WhatsAppPreview text={localOffer.copy} image={localOffer.thumbnail} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferEditorView;
