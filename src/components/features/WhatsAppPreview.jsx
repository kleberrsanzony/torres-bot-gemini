import React from 'react';
import { Users, Check } from 'lucide-react';

const WhatsAppPreview = ({ text, image }) => {
  return (
    <div className="bg-[#0b141a] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-inner relative">
      {/* Header WP fake */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
          <Users className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h4 className="text-slate-200 font-medium text-sm">Preview do Grupo</h4>
          <p className="text-slate-400 text-xs">tap here for group info</p>
        </div>
      </div>
      
      {/* Background patterns WP */}
      <div className="flex-1 p-4 overflow-y-auto relative" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', opacity: 0.8 }}>
        <div className="max-w-[85%] bg-[#005c4b] text-[#e9edef] rounded-lg p-2 rounded-tr-none shadow-sm float-right">
          {image && (
            <div className="relative mb-2 rounded-md overflow-hidden bg-black/20 aspect-square flex items-center justify-center">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="text-sm whitespace-pre-wrap font-sans leading-relaxed break-words" style={{ wordBreak: 'break-word' }}>
            {text?.split(/(\*[^*]+\*|~[^~]+~)/g).map((part, i) => {
              if (part.startsWith('*') && part.endsWith('*')) return <strong key={i} className="font-bold">{part.slice(1, -1)}</strong>;
              if (part.startsWith('~') && part.endsWith('~')) return <s key={i} className="opacity-70">{part.slice(1, -1)}</s>;
              return <span key={i}>{part}</span>;
            }) || 'Sua mensagem aparecerá aqui...'}
          </div>
          <div className="text-[10px] text-emerald-200/60 text-right mt-1 flex justify-end items-center gap-1">
            15:42 <Check className="w-3 h-3 text-[#53bdeb]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
