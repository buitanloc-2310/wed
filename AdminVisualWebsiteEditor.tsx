import React, { useMemo, useState } from 'react';
import { Monitor, Smartphone, Tablet, Save, ExternalLink, Pencil } from 'lucide-react';
import { HomePage } from '../../pages/HomePage';
import { useDataContext } from '../../context/DataContext';
import { PageRoute, SiteConfig } from '../../types';

type SectionKey='hero'|'direction'|'pillars'|'programs'|'units'|'certificate'|'values'|'news'|'transparency';
type Device='desktop'|'tablet'|'mobile';
const fields:Record<SectionKey,(keyof SiteConfig)[]>={
 hero:['heroBadge','heroHeading','heroSubtext','heroButton1Text','heroButton1Url','heroButton2Text','heroButton2Url'],
 direction:['directionLabel','directionText','directionPillarsCount','directionPillarsLabel','directionValuesCount','directionValuesLabel'],
 pillars:['pillarsHeading','pillarsSubtext'], programs:['programsLabel','programsHeading'], units:['unitsLabel','unitsHeading','unitsIntro'],
 certificate:['certificateLabel','certificateHeading','certificateText','certificateButtonText','certificateButtonUrl'], values:['valuesLabel','valuesHeading'],
 news:['newsLabel','newsHeading'], transparency:['transparencyHeading','transparencyText','transparencyButtonText','transparencyButtonUrl']
};
const labels:Record<string,string>={hero:'Đầu trang',direction:'Định hướng',pillars:'Trụ cột',programs:'Chương trình',units:'Đơn vị',certificate:'Tra cứu chứng nhận',values:'Giá trị cốt lõi',news:'Tin tức',transparency:'Minh bạch'};
const widths={desktop:'100%',tablet:'820px',mobile:'390px'};
export const AdminVisualWebsiteEditor:React.FC<{onShowToast:(m:string)=>void,onNavigate:(p:PageRoute)=>void}>=({onShowToast,onNavigate})=>{
 const {siteConfig,updateSiteConfig}=useDataContext(); const [device,setDevice]=useState<Device>('desktop'); const [editing,setEditing]=useState<SectionKey|null>(null); const [draft,setDraft]=useState<Record<string,string>>({}); const [saving,setSaving]=useState(false);
 const edit=(key:SectionKey)=>{const d:Record<string,string>={}; fields[key].forEach(k=>d[String(k)]=String((siteConfig as any)[k]??'')); setDraft(d); setEditing(key)};
 const save=async()=>{if(!editing)return; setSaving(true); const ok=await updateSiteConfig(draft as Partial<SiteConfig>); setSaving(false); if(ok){onShowToast('Đã lưu thay đổi website.');setEditing(null)}else onShowToast('Chưa thể lưu. Nội dung vẫn còn trong trình chỉnh sửa.');};
 const deviceButtons=useMemo(()=>[{id:'desktop' as Device,icon:<Monitor size={16}/>},{id:'tablet' as Device,icon:<Tablet size={16}/>},{id:'mobile' as Device,icon:<Smartphone size={16}/>}],[]);
 return <div className="min-h-full bg-slate-100">
  <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
   <div><div className="flex items-center gap-2 font-extrabold text-slate-900"><Pencil size={17}/>Chỉnh sửa Website</div><p className="text-[11px] text-slate-500">Chế độ riêng trong Admin. Website công khai không hiện cây bút.</p></div>
   <div className="flex items-center gap-2"><div className="flex rounded-xl border border-slate-200 p-1">{deviceButtons.map(x=><button key={x.id} onClick={()=>setDevice(x.id)} className={`rounded-lg p-2 ${device===x.id?'bg-sky-50 text-sky-700':'text-slate-500'}`}>{x.icon}</button>)}</div><button onClick={()=>onNavigate('home')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"><ExternalLink size={15}/>Mở website</button></div>
  </div>
  <div className="overflow-auto p-4"><div className="mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl transition-all" style={{width:widths[device],maxWidth:'100%'}}><HomePage onNavigate={()=>{}} visualEditMode onEditSection={edit}/></div></div>
  {editing&&<div className="fixed inset-0 z-[80] flex justify-end bg-slate-950/30"><div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b bg-white p-5"><div><p className="text-[11px] font-bold uppercase text-sky-600">Đang chỉnh trực tiếp</p><h3 className="font-extrabold">{labels[editing]}</h3></div><button onClick={()=>setEditing(null)} className="rounded-lg p-2 hover:bg-slate-100">×</button></div><div className="space-y-4 p-5">{Object.entries(draft).map(([k,v])=><label key={k} className="block"><span className="mb-1 block text-xs font-bold text-slate-600">{k}</span>{/Text|Subtext|Intro|Heading/.test(k)?<textarea rows={3} value={v} onChange={e=>setDraft({...draft,[k]:e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2"/>:<input value={v} onChange={e=>setDraft({...draft,[k]:e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2"/>}</label>)}</div><div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white p-4"><button onClick={()=>setEditing(null)} className="rounded-xl border px-4 py-2 text-xs font-bold">Hủy</button><button disabled={saving} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"><Save size={15}/>{saving?'Đang lưu...':'Lưu'}</button></div></div></div>}
 </div>
}
