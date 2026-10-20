import React,{useId,useRef,useState} from 'react';
import {X,AlertCircle,UploadCloud,Loader2,Images} from 'lucide-react';
import {MediaPicker} from './MediaPicker';
import {uploadMedia,MEDIA_ACCEPT} from '../lib/mediaApi';
interface Props{label?:string;value?:string;onChange:(url:string)=>void;helperText?:string;category?:string;placeholder?:string}

/** Optimizes large raster team portraits client-side without changing the source file in place. */
async function optimizeTeamPortrait(file:File,category?:string):Promise<File>{
 if(category!=='team'||!['image/jpeg','image/png','image/webp'].includes(file.type))return file;
 if(typeof createImageBitmap==='undefined')return file;
 let bitmap:ImageBitmap|undefined;
 try{
  bitmap=await createImageBitmap(file);
  const maxDimension=1400;
  if(file.size<700*1024&&bitmap.width<=maxDimension&&bitmap.height<=maxDimension)return file;
  const scale=Math.min(1,maxDimension/Math.max(bitmap.width,bitmap.height));
  const width=Math.max(1,Math.round(bitmap.width*scale)),height=Math.max(1,Math.round(bitmap.height*scale));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d');if(!context)return file;
  context.drawImage(bitmap,0,0,width,height);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/webp',0.86));
  if(!blob||blob.size>=file.size)return file;
  const baseName=file.name.replace(/\.[^.]+$/,'')||'team-portrait';
  return new File([blob],`${baseName}.webp`,{type:'image/webp',lastModified:Date.now()});
 }catch{return file}
 finally{bitmap?.close()}
}
export const ImageUrlInput:React.FC<Props>=({label='Ảnh',value='',onChange,helperText,category,placeholder})=>{
 const id=useId(),inputRef=useRef<HTMLInputElement|null>(null);const [uploading,setUploading]=useState(false),[error,setError]=useState(''),[picker,setPicker]=useState(false),[broken,setBroken]=useState(false);
 const upload=async(file:File)=>{setUploading(true);setError('');try{const prepared=await optimizeTeamPortrait(file,category);const d=await uploadMedia(prepared,true);onChange(d.url);setBroken(false)}catch(e){setError(e instanceof Error?e.message:'Không thể tải ảnh.')}finally{setUploading(false);if(inputRef.current)inputRef.current.value=''}};
 return <div className="space-y-3"><label htmlFor={id} className="text-xs font-bold text-slate-700">{label}</label><div className="flex gap-2 flex-wrap"><input ref={inputRef} type="file" accept={MEDIA_ACCEPT.replace(',application/pdf','')} className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)void upload(f)}}/><button type="button" disabled={uploading} onClick={()=>inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 disabled:opacity-60">{uploading?<Loader2 size={15} className="animate-spin"/>:<UploadCloud size={15}/>} {uploading?'Đang tải…':'Tải ảnh lên'}</button><button type="button" onClick={()=>setPicker(true)} className="inline-flex items-center gap-2 border rounded-lg px-3 py-2 text-xs font-semibold"><Images size={15}/>Chọn từ thư viện</button>{value&&<button type="button" onClick={()=>{onChange('');setBroken(false)}} className="border rounded-lg p-2 text-slate-500" aria-label="Gỡ ảnh"><X size={15}/></button>}</div><input id={id} type="text" inputMode="url" value={value} onChange={e=>{onChange(e.target.value);setBroken(false)}} placeholder={placeholder||'Liên kết ảnh hoặc /media/…'} className="w-full border rounded-xl px-3 py-2 text-xs"/>{error&&<p role="alert" className="flex gap-2 text-xs text-rose-700"><AlertCircle size={14}/>{error}</p>}{value&&<div className="bg-slate-50 border rounded-xl p-3">{!broken?<img src={value} alt={`Xem trước ${label.toLowerCase()}`} loading="lazy" decoding="async" onError={()=>setBroken(true)} className="max-h-40 w-full object-contain"/>:<p className="text-xs text-amber-700">Ảnh không tải được. Kiểm tra liên kết hoặc chọn một ảnh khác.</p>}</div>}<p className="text-[11px] text-slate-500">{helperText||'Ảnh lưu trong thư viện để sử dụng lại. Tối đa 20 MB; ảnh chân dung lớn có thể được tối ưu trước khi tải lên.'}</p>{picker&&<MediaPicker onClose={()=>setPicker(false)} onSelect={item=>{onChange(item.url);setBroken(false);setPicker(false)}}/>}</div>;
};
