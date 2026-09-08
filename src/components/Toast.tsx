import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#062A67] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-sky-400/40 flex items-center gap-3 text-xs sm:text-sm font-medium">
        <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white transition p-1"
          aria-label="Đóng thông báo"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
