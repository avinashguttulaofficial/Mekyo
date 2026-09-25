import React from 'react';
import { Check, Info, AlertCircle, X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export interface ToastProps {
  message?: string;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-[#111111] text-white rounded-lg shadow-lg border border-neutral-800 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-sm">
      <div className="flex items-center gap-2.5">
        {type === 'success' && <Check className="w-4 h-4 text-[#B8FF3D] shrink-0" />}
        {type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
        {type === 'info' && <Info className="w-4 h-4 text-[#8BD3FF] shrink-0" />}
        <span className="leading-snug">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#111111] text-white rounded-lg shadow-lg border border-neutral-800 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <Check className="w-4 h-4 text-[#B8FF3D] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#8BD3FF] shrink-0" />}
            <span className="leading-snug">{toast.title}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

