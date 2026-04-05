import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Toast = () => {
  const { state, dispatch } = useAppContext();
  
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast, dispatch]);

  if (!state.toast) return null;

  const isError = state.toast.type === 'error';
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${isError ? 'bg-red-950/80 border-red-900/50 text-red-200' : 'bg-emerald-950/80 border-emerald-900/50 text-emerald-200'} backdrop-blur-md`}>
        {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        <p className="font-medium text-sm">{state.toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
