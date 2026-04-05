import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-slate-800 text-slate-300",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    brand: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${variants[variant]}`}>{children}</span>;
};

export default Badge;
