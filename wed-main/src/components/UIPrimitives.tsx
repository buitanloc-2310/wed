import React, { ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Home, RotateCcw, X } from 'lucide-react';


// -----------------------------------------------------------------------------
// Preserved component source: ErrorBoundary.tsx
// -----------------------------------------------------------------------------

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    try {
      const prev = JSON.parse(sessionStorage.getItem('sfn_runtime_errors') || '[]');
      const next = [{ at: new Date().toISOString(), message: String(error?.message || 'Runtime error').slice(0, 300) }, ...prev].slice(0, 20);
      sessionStorage.setItem('sfn_runtime_errors', JSON.stringify(next));
    } catch {}
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">
                Đã xảy ra sự cố hiển thị
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hệ thống đã ghi nhận lỗi và bảo vệ phiên làm việc của bạn an toàn. Vui lòng tải lại trang hoặc quay về trang chủ.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw size={14} />
                <span>Tải lại trang</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <Home size={14} />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


// -----------------------------------------------------------------------------
// Preserved component source: Toast.tsx
// -----------------------------------------------------------------------------

interface ToastProps { message:string|null; onClose:()=>void }
export const Toast:React.FC<ToastProps>=({message,onClose})=>{
 if(!message)return null; const isError=/không|lỗi|thất bại|hết hạn|chưa được|từ chối|mã \d+/i.test(message);
 return <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 duration-200 max-w-[min(92vw,460px)]"><div className={`${isError?'bg-rose-950 border-rose-400/50':'bg-[#062A67] border-sky-400/40'} text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-medium`}>{isError?<AlertCircle size={18} className="text-rose-300 shrink-0"/>:<CheckCircle2 size={18} className="text-emerald-400 shrink-0"/>}<span>{message}</span><button onClick={onClose} className="ml-2 text-slate-300 hover:text-white transition p-1" aria-label="Đóng thông báo"><X size={14}/></button></div></div>
}


// -----------------------------------------------------------------------------
// Preserved component source: ImagePlaceholder.tsx
// -----------------------------------------------------------------------------

interface ImagePlaceholderProps{sizeText?:string;description?:string;aspectRatio?:'video'|'square'|'4/3'|'21/9'|'3/2'|'auto';className?:string;theme?:string;imageUrl?:string;objectFit?:'cover'|'contain';objectPosition?:string}
export const ImagePlaceholder:React.FC<ImagePlaceholderProps>=({sizeText='',description='Sky First Network',aspectRatio='video',className='',theme='sky',imageUrl,objectFit,objectPosition='center'})=>{
 const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[imageUrl]);
 const aspect={video:'aspect-video',square:'aspect-square','4/3':'aspect-[4/3]','21/9':'aspect-[21/9]','3/2':'aspect-[3/2]',auto:'min-h-[180px]'}[aspectRatio];
 const fit=objectFit||(/logo|nhận diện|biểu trưng/i.test(sizeText+' '+description)?'contain':'cover');
 return <div className={`relative ${aspect} overflow-hidden rounded-2xl ${theme==='navy'?'bg-[#102C51]':'bg-slate-100'} ${className}`}>{imageUrl&&!failed?<img src={imageUrl} alt={description} loading="lazy" decoding="async" onError={()=>setFailed(true)} className={`w-full h-full ${aspectRatio==='auto'?'max-h-[480px]':'absolute inset-0'}`} style={{objectFit:fit,objectPosition}}/>:<div className="absolute inset-0 flex flex-col justify-center items-center gap-5 p-7 text-center sf-image-fallback"><div className="bg-white/95 rounded-2xl p-5 w-[70%] max-w-[260px]"><img src="/brand/sky-first-network-web.png" alt="Sky First Network" className="w-full h-auto object-contain"/></div><p className={`text-[11px] tracking-[.1em] font-bold uppercase ${theme==='navy'?'text-sky-100':'text-slate-500'}`}>Giáo dục · Người trẻ · Cộng đồng</p></div>}</div>;
};

