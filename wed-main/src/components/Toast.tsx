import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
interface ToastProps { message:string|null; onClose:()=>void }
export const Toast:React.FC<ToastProps>=({message,onClose})=>{
 if(!message)return null; const isError=/không|lỗi|thất bại|hết hạn|chưa được|từ chối|mã \d+/i.test(message);
 return <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 duration-200 max-w-[min(92vw,460px)]"><div className={`${isError?'bg-rose-950 border-rose-400/50':'bg-[#062A67] border-sky-400/40'} text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-medium`}>{isError?<AlertCircle size={18} className="text-rose-300 shrink-0"/>:<CheckCircle2 size={18} className="text-emerald-400 shrink-0"/>}<span>{message}</span><button onClick={onClose} className="ml-2 text-slate-300 hover:text-white transition p-1" aria-label="Đóng thông báo"><X size={14}/></button></div></div>
}
