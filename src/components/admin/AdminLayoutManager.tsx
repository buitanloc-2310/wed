import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, Save, X } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { PageRoute, SiteConfig } from '../../types';

interface Props {
  onNavigate?: (page: PageRoute) => void;
  onShowToast?: (msg: string) => void;
  onSwitchTab?: (tabId: string) => void;
}

type SectionKey = 'hero'|'direction'|'pillars'|'programs'|'units'|'certificate'|'values'|'news'|'transparency';

const LABELS: Record<SectionKey,string> = {
  hero:'Đầu trang', direction:'Định hướng 2026', pillars:'05 Trụ cột hoạt động', programs:'Chương trình & hoạt động',
  units:'Đơn vị trực thuộc', certificate:'Tra cứu Giấy chứng nhận', values:'06 Giá trị cốt lõi', news:'Tin tức & hoạt động', transparency:'Thông tin minh bạch'
};
const DEFAULT_ORDER: SectionKey[] = ['hero','direction','pillars','programs','units','certificate','values','news','transparency'];

export const AdminLayoutManager: React.FC<Props> = ({ onShowToast, onSwitchTab }) => {
  const { siteConfig, updateSiteConfig } = useDataContext();
  const [editing, setEditing] = useState<SectionKey|null>(null);
  const [draft, setDraft] = useState<Record<string,string>>({});
  const sections = siteConfig.homeSections || {};
  const order = useMemo(() => {
    const saved=(siteConfig.homeSectionOrder||[]).filter((x): x is SectionKey => DEFAULT_ORDER.includes(x as SectionKey));
    return [...saved, ...DEFAULT_ORDER.filter(x=>!saved.includes(x))];
  }, [siteConfig.homeSectionOrder]);

  const toggle = (key:SectionKey) => {
    const next={...sections,[key]:sections[key]===false};
    updateSiteConfig({homeSections:next});
    onShowToast?.(`${next[key] ? 'Đã hiện' : 'Đã ẩn'} “${LABELS[key]}” trên Trang chủ.`);
  };
  const move = (key:SectionKey, dir:-1|1) => {
    const i=order.indexOf(key), j=i+dir; if(j<0||j>=order.length) return;
    const next=[...order]; [next[i],next[j]]=[next[j],next[i]];
    updateSiteConfig({homeSectionOrder:next});
  };
  const open = (key:SectionKey) => {
    const data:Record<SectionKey,Record<string,string>>={
      hero:{heroBadge:siteConfig.heroBadge||'',heroHeading:siteConfig.heroHeading||'',heroSubtext:siteConfig.heroSubtext||'',heroButton1Text:siteConfig.heroButton1Text||'',heroButton1Url:siteConfig.heroButton1Url||'',heroButton2Text:siteConfig.heroButton2Text||'',heroButton2Url:siteConfig.heroButton2Url||''},
      direction:{directionLabel:siteConfig.directionLabel||'',directionPillarsCount:siteConfig.directionPillarsCount||'05',directionPillarsLabel:siteConfig.directionPillarsLabel||'Trụ cột hoạt động',directionValuesCount:siteConfig.directionValuesCount||'06',directionValuesLabel:siteConfig.directionValuesLabel||'Giá trị cốt lõi',directionText:siteConfig.directionText||''},
      pillars:{pillarsHeading:siteConfig.pillarsHeading||'',pillarsSubtext:siteConfig.pillarsSubtext||''},
      programs:{programsLabel:siteConfig.programsLabel||'',programsHeading:siteConfig.programsHeading||''},
      units:{unitsLabel:siteConfig.unitsLabel||'',unitsHeading:siteConfig.unitsHeading||'',unitsIntro:siteConfig.unitsIntro||''},
      certificate:{certificateLabel:siteConfig.certificateLabel||'',certificateHeading:siteConfig.certificateHeading||'',certificateText:siteConfig.certificateText||'',certificateButtonText:siteConfig.certificateButtonText||'',certificateButtonUrl:siteConfig.certificateButtonUrl||''},
      values:{valuesLabel:siteConfig.valuesLabel||'',valuesHeading:siteConfig.valuesHeading||''},
      news:{newsLabel:siteConfig.newsLabel||'',newsHeading:siteConfig.newsHeading||''},
      transparency:{transparencyHeading:siteConfig.transparencyHeading||'',transparencyText:siteConfig.transparencyText||'',transparencyButtonText:siteConfig.transparencyButtonText||'',transparencyButtonUrl:siteConfig.transparencyButtonUrl||''},
    };
    setDraft(data[key]); setEditing(key);
  };
  const save=async()=>{ if(!editing)return; const ok=await updateSiteConfig(draft as Partial<SiteConfig>); onShowToast?.(ok?`Đã lưu nội dung “${LABELS[editing]}” và đồng bộ lên website.`:`Đã cập nhật “${LABELS[editing]}” trên trình duyệt nhưng chưa ghi được lên Firebase.`); if(ok)setEditing(null); };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-extrabold text-slate-900">Quản lý Trang chủ</h2>
      <p className="mt-1 text-sm text-slate-500">Các khối dưới đây là dữ liệu thật của Trang chủ. Có thể sửa nội dung, ẩn/hiện và đổi thứ tự hiển thị.</p>
    </div>

    <div className="space-y-3">
      {order.map((key,i)=><div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-slate-100 grid place-items-center font-black text-slate-600">{String(i+1).padStart(2,'0')}</div>
        <div className="flex-1 min-w-0"><div className="font-extrabold text-slate-900">{LABELS[key]}</div><div className="text-xs text-slate-500 mt-1">{sections[key]===false?'Đang ẩn khỏi Trang chủ':'Đang hiển thị trên Trang chủ'}</div></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>move(key,-1)} disabled={i===0} className="p-2 rounded-lg border border-slate-200 disabled:opacity-30" title="Di chuyển lên"><ArrowUp size={16}/></button>
          <button onClick={()=>move(key,1)} disabled={i===order.length-1} className="p-2 rounded-lg border border-slate-200 disabled:opacity-30" title="Di chuyển xuống"><ArrowDown size={16}/></button>
          <button onClick={()=>toggle(key)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold flex items-center gap-2">{sections[key]===false?<><Eye size={16}/>Hiện</>:<><EyeOff size={16}/>Ẩn</>}</button>
          <button onClick={()=>open(key)} className="px-3 py-2 rounded-lg bg-[#0B5FB4] text-white text-sm font-bold">Chỉnh sửa nội dung</button>
          {key==='programs'&&<button onClick={()=>onSwitchTab?.('programs')} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold">Quản lý chương trình</button>}
          {key==='units'&&<button onClick={()=>onSwitchTab?.('units')} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold">Quản lý đơn vị</button>}
          {key==='news'&&<button onClick={()=>onSwitchTab?.('posts')} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold">Quản lý tin tức</button>}
        </div>
      </div>)}
    </div>

    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Chân trang, menu điều hướng, 05 trụ cột và 06 giá trị cốt lõi được chỉnh tại mục “Nội dung toàn cục”.
    </div>

    {editing && <div className="fixed inset-0 z-[100] bg-slate-950/45 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[88vh] overflow-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex justify-between items-center"><div><div className="text-xs uppercase tracking-wider text-[#0B5FB4] font-black">Trang chủ</div><h3 className="text-xl font-extrabold">{LABELS[editing]}</h3></div><button onClick={()=>setEditing(null)} className="p-2"><X size={20}/></button></div>
        <div className="p-5 space-y-4">
          {Object.entries(draft).map(([k,v])=><label key={k} className="block"><span className="block text-sm font-bold text-slate-700 mb-1">{fieldLabel(k)}</span>{isLong(k)?<textarea rows={4} value={v} onChange={e=>setDraft({...draft,[k]:e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"/>:<input value={v} onChange={e=>setDraft({...draft,[k]:e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"/>}</label>)}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5 flex justify-end gap-2"><button onClick={()=>setEditing(null)} className="px-4 py-2 rounded-xl border border-slate-200 font-bold">Hủy</button><button onClick={save} className="px-4 py-2 rounded-xl bg-[#0B5FB4] text-white font-bold flex items-center gap-2"><Save size={16}/>Lưu thay đổi</button></div>
      </div>
    </div>}
  </div>;
};

function isLong(k:string){return ['heroSubtext','directionText','pillarsSubtext','unitsIntro','certificateText','transparencyText'].includes(k)}
function fieldLabel(k:string){
  const m:Record<string,string>={heroBadge:'Nhãn đầu trang',heroHeading:'Tiêu đề chính',heroSubtext:'Mô tả',heroButton1Text:'Nút 1',heroButton1Url:'Liên kết nút 1',heroButton2Text:'Nút 2',heroButton2Url:'Liên kết nút 2',directionLabel:'Nhãn định hướng',directionText:'Nội dung định hướng',directionPillarsCount:'Số trụ cột',directionPillarsLabel:'Nhãn số trụ cột',directionValuesCount:'Số giá trị',directionValuesLabel:'Nhãn số giá trị',pillarsHeading:'Nhãn trụ cột',pillarsSubtext:'Tiêu đề khối',programsLabel:'Nhãn chương trình',programsHeading:'Tiêu đề chương trình',unitsLabel:'Nhãn đơn vị',unitsHeading:'Tiêu đề đơn vị',unitsIntro:'Mô tả đơn vị',certificateLabel:'Nhãn tra cứu',certificateHeading:'Tiêu đề tra cứu',certificateText:'Mô tả tra cứu',certificateButtonText:'Chữ trên nút',certificateButtonUrl:'Liên kết nút',valuesLabel:'Nhãn giá trị cốt lõi',valuesHeading:'Tiêu đề giá trị cốt lõi',newsLabel:'Nhãn tin tức',newsHeading:'Tiêu đề tin tức',transparencyHeading:'Tiêu đề minh bạch',transparencyText:'Nội dung minh bạch',transparencyButtonText:'Chữ trên nút',transparencyButtonUrl:'Liên kết nút'}; return m[k]||k;
}
