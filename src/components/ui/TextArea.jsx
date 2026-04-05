import React from 'react';

const TextArea = ({ label, className = '', ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="block text-sm font-medium text-slate-400">{label}</label>}
    <textarea className={`w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none ${className}`} {...props} />
  </div>
);

export default TextArea;
