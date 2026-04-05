import React from 'react';
import { RefreshCcw } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', icon: Icon, loading, ...props }) => {
  const base = "inline-flex items-center justify-center font-medium transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-900/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    ghost: "hover:bg-slate-800 text-slate-300",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    warning: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
