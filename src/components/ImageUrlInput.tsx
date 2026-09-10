import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon, Check, X, ExternalLink, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';

interface ImageUrlInputProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  category?: 'education' | 'volunteer' | 'tech' | 'media' | 'team' | 'general';
  helperText?: string;
}

const TOKEN_KEY = 'sfn_admin_api_token';

function getAdminToken(): string {
  try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
function saveAdminToken(token: string) {
  try { sessionStorage.setItem(TOKEN_KEY, token); } catch {}
}

export const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  label = 'Ảnh đại diện / minh họa',
  value = '',
  onChange,
  placeholder = 'https://... hoặc /media/...',
  helperText,
}) => {
  const [testError, setTestError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (newVal: string) => {
    setTestError(false);
    setUploadError('');
    onChange(newVal.trim());
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      let token = getAdminToken();
      if (!token) {
        token = window.prompt('Nhập ADMIN_API_TOKEN để tải ảnh lên kho Media:')?.trim() || '';
        if (!token) throw new Error('Chưa nhập ADMIN_API_TOKEN.');
        saveAdminToken(token);
      }
      const form = new FormData();
      form.append('file', file);
      let response = await fetch('/api/media/upload', { method: 'POST', headers: { 'x-admin-token': token }, body: form });
      if (response.status === 401) {
        try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
        token = window.prompt('ADMIN_API_TOKEN chưa đúng. Nhập lại:')?.trim() || '';
        if (!token) throw new Error('Không có quyền tải ảnh.');
        saveAdminToken(token);
        response = await fetch('/api/media/upload', { method: 'POST', headers: { 'x-admin-token': token }, body: form });
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok || !data?.url) throw new Error(data?.error || 'Không thể tải ảnh lên.');
      handleInputChange(data.url);
    } catch (error: any) {
      setUploadError(error?.message || 'Không thể tải ảnh lên.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadFile(file); }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-extrabold text-sky-700 hover:bg-sky-100 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
            {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none"><LinkIcon size={14} /></div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-20 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent font-mono placeholder:font-sans transition"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {value && <>
            <button type="button" onClick={() => handleInputChange('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-md" title="Xóa ảnh"><X size={14} /></button>
            <a href={value} target="_blank" rel="noreferrer" className="p-1 text-[#0284C7] hover:text-[#0369A1] rounded-md" title="Mở ảnh"><ExternalLink size={14} /></a>
          </>}
        </div>
      </div>

      {uploadError && <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] font-semibold text-rose-700"><AlertCircle size={14} className="mt-0.5 shrink-0" />{uploadError}</div>}

      {value ? (
        <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
            {!testError ? <img src={value} alt="Xem trước ảnh" referrerPolicy="no-referrer" onError={() => setTestError(true)} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-500"><AlertCircle size={16} /></div>}
          </div>
          <div className="text-[11px] leading-tight min-w-0 flex-1">
            {!testError ? <div className="flex items-center gap-1 text-emerald-600 font-bold"><Check size={12} /><span>Ảnh sẵn sàng hiển thị</span></div> : <div className="flex items-center gap-1 text-rose-600 font-bold"><AlertCircle size={12} /><span>Không tải được ảnh</span></div>}
            <p className="text-slate-500 truncate mt-1 font-mono text-[10px]">{value}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 text-[11px] text-slate-500"><ImageIcon size={13} className="mt-0.5 shrink-0" /><p>{helperText || 'Có thể tải ảnh trực tiếp lên Cloudflare R2 hoặc dán URL ảnh đã có. JPG/PNG/WebP/GIF, tối đa 8 MB.'}</p></div>
      )}
    </div>
  );
};
