import React, { useMemo, useState } from 'react';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Menu, PanelBottom, Gem, Columns3 } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';

export const AdminGlobalContentManager:React.FC<{onShowToast:(m:string)=>void}>=({onShowToast})=>{
  const {siteConfig,updateSiteConfig,corePillars,updateCorePillar}=useDataContext();
  const [draft,setDraft]=useState(()=>JSON.parse(JSON.stringify(siteConfig)));
  const groups=draft.navigationGroups||[];
  const values=draft.coreValues||[];
  const quick=draft.footerQuickLinks||[];
  const contacts=draft.footerContacts||[];
  const portals=draft.footerPortals||[];
  const legal=draft.footerLegalLinks||[];
  const save=async()=>{const ok=await updateSiteConfig(draft);onShowToast(ok?'Đã lưu nội dung toàn cục và đồng bộ lên website.':'Đã cập nhật trên trình duyệt nhưng chưa ghi được lên Firebase. Hãy kiểm tra quyền hoặc kết nối.');};
  const set=(k:string,v:any)=>setDraft((d:any)=>({...d,[k]:v}));
  const move=(arr:any[],i:number,dir:number)=>{const n=[...arr],j=i+dir;if(j<0||j>=n.length)return arr;[n[i],n[j]]=[n[j],n[i]];return n};
  return <div className="space-y-6 max-w-6xl">
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"><div><h2 className="text-xl font-black">Nội dung toàn cục</h2><p className="text-xs text-slate-500 mt-1">Chỉnh các thành phần xuất hiện trên nhiều trang: menu, chân trang, trụ cột và giá trị cốt lõi.</p></div><button onClick={save} className="px-4 py-2.5 rounded-xl bg-[#0F2B5B] text-white font-bold text-sm inline-flex items-center gap-2"><Save size={16}/>Lưu toàn bộ</button></div>

    <Card icon={<Menu size={18}/>} title="Menu điều hướng">
      <div className="space-y-4">{groups.map((g:any,gi:number)=><div key={gi} className="border rounded-2xl p-4 bg-slate-50"><div className="flex gap-2 items-center"><input value={g.label} onChange={e=>{const n=[...groups];n[gi]={...g,label:e.target.value};set('navigationGroups',n)}} className="flex-1 border rounded-xl px-3 py-2 font-bold"/><button onClick={()=>set('navigationGroups',move(groups,gi,-1))} className="p-2 border rounded-lg"><ChevronUp size={16}/></button><button onClick={()=>set('navigationGroups',move(groups,gi,1))} className="p-2 border rounded-lg"><ChevronDown size={16}/></button><button onClick={()=>set('navigationGroups',groups.filter((_:any,i:number)=>i!==gi))} className="p-2 border rounded-lg text-rose-600"><Trash2 size={16}/></button></div><div className="mt-3 space-y-2">{(g.items||[]).map((it:any,ii:number)=><div key={ii} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-2"><input value={it.label} onChange={e=>{const n=JSON.parse(JSON.stringify(groups));n[gi].items[ii].label=e.target.value;set('navigationGroups',n)}} className="border rounded-lg px-3 py-2 text-sm" placeholder="Tên menu"/><input value={it.page||''} onChange={e=>{const n=JSON.parse(JSON.stringify(groups));n[gi].items[ii].page=e.target.value;set('navigationGroups',n)}} className="border rounded-lg px-3 py-2 text-sm" placeholder="Route"/><input value={it.slug||''} onChange={e=>{const n=JSON.parse(JSON.stringify(groups));n[gi].items[ii].slug=e.target.value;set('navigationGroups',n)}} className="border rounded-lg px-3 py-2 text-sm" placeholder="Slug (nếu có)"/><button onClick={()=>{const n=JSON.parse(JSON.stringify(groups));n[gi].items=n[gi].items.filter((_:any,i:number)=>i!==ii);set('navigationGroups',n)}} className="p-2 text-rose-600"><Trash2 size={16}/></button></div>)}<button onClick={()=>{const n=JSON.parse(JSON.stringify(groups));n[gi].items=[...(n[gi].items||[]),{label:'Mục mới',page:'custom-page',slug:''}];set('navigationGroups',n)}} className="text-sm font-bold text-sky-700 inline-flex items-center gap-1"><Plus size={15}/>Thêm menu con</button></div></div>)}<button onClick={()=>set('navigationGroups',[...groups,{label:'Nhóm mới',items:[]}])} className="px-3 py-2 rounded-xl border font-bold text-sm inline-flex items-center gap-2"><Plus size={15}/>Thêm nhóm menu</button></div>
    </Card>

    <Card icon={<Columns3 size={18}/>} title="05 trụ cột hoạt động">
      <div className="grid lg:grid-cols-2 gap-3">{corePillars.map((p:any,i:number)=><div key={i} className="border rounded-xl p-3 space-y-2"><input value={p.title} onChange={e=>updateCorePillar(i,{title:e.target.value})} className="w-full border rounded-lg px-3 py-2 font-bold"/><textarea value={p.shortDesc} onChange={e=>updateCorePillar(i,{shortDesc:e.target.value,fullDesc:e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>)}</div>
    </Card>

    <Card icon={<Gem size={18}/>} title="06 giá trị cốt lõi">
      <div className="grid lg:grid-cols-2 gap-3">{values.map((v:any,i:number)=><div key={i} className="border rounded-xl p-3 space-y-2"><input value={v.name} onChange={e=>{const n=[...values];n[i]={...v,name:e.target.value};set('coreValues',n)}} className="w-full border rounded-lg px-3 py-2 font-bold"/><textarea value={v.desc} onChange={e=>{const n=[...values];n[i]={...v,desc:e.target.value};set('coreValues',n)}} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>)}</div>
    </Card>

    <Card icon={<PanelBottom size={18}/>} title="Chân trang">
      <EditorList title="Liên kết nhanh" rows={quick} fields={['label','url']} onChange={n=>set('footerQuickLinks',n)}/>
      <EditorList title="Liên hệ & Kết nối" rows={contacts} fields={['label','value','url','icon']} onChange={n=>set('footerContacts',n)}/>
      <EditorList title="Các cổng Sky First" rows={portals} fields={['label','domain','url','icon']} onChange={n=>set('footerPortals',n)}/>
      <EditorList title="Liên kết pháp lý & hệ thống" rows={legal} fields={['label','url']} onChange={n=>set('footerLegalLinks',n)}/>
      <div className="mt-4"><label className="text-xs font-bold text-slate-700">Dòng bản quyền</label><input value={draft.footerCopyright||''} onChange={e=>set('footerCopyright',e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2"/></div>
    </Card>
  </div>
}
const Card:React.FC<{title:string;icon:React.ReactNode;children:React.ReactNode}>=({title,icon,children})=><section className="bg-white border border-slate-200 rounded-2xl p-5"><h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">{icon}{title}</h3>{children}</section>;
const EditorList:React.FC<{title:string;rows:any[];fields:string[];onChange:(n:any[])=>void}>=({title,rows,fields,onChange})=><div className="mb-5"><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-bold">{title}</h4><button onClick={()=>onChange([...rows,Object.fromEntries(fields.map(f=>[f,'']))])} className="text-xs font-bold text-sky-700 inline-flex items-center gap-1"><Plus size={14}/>Thêm</button></div><div className="space-y-2">{rows.map((r:any,i:number)=><div key={i} className={`grid gap-2 ${fields.length>=4?'lg:grid-cols-4':'lg:grid-cols-2'} items-center`}>{fields.map(f=><input key={f} value={r[f]||''} onChange={e=>{const n=[...rows];n[i]={...r,[f]:e.target.value};onChange(n)}} className="border rounded-lg px-3 py-2 text-sm" placeholder={f}/>) }<div className="lg:col-span-full flex justify-end gap-1"><button onClick={()=>onChange(moveLocal(rows,i,-1))} className="p-1.5 border rounded"><ChevronUp size={14}/></button><button onClick={()=>onChange(moveLocal(rows,i,1))} className="p-1.5 border rounded"><ChevronDown size={14}/></button><button onClick={()=>onChange(rows.filter((_:any,j:number)=>j!==i))} className="p-1.5 border rounded text-rose-600"><Trash2 size={14}/></button></div></div>)}</div></div>;
function moveLocal(arr:any[],i:number,d:number){const n=[...arr],j=i+d;if(j<0||j>=n.length)return arr;[n[i],n[j]]=[n[j],n[i]];return n}
