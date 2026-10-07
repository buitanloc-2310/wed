import React, {useEffect, useMemo, useState} from 'react';
import {ArrowRight, Building2, CheckCircle2, Copy, HeartHandshake, Mail, Phone, QrCode, ShieldCheck, UploadCloud} from 'lucide-react';
import {PageRoute} from '../types';
import {useDataContext} from '../context/DataContext';
import {RichTextRenderer} from '../components/RichTextRenderer';

interface SponsorPageProps{onNavigate:(page:PageRoute)=>void;onShowToast:(msg:string)=>void;}

const cleanAmount=(value:string)=>value.replace(/\D/g,'').slice(0,13);
const formatMoney=(value:string)=> value ? new Intl.NumberFormat('vi-VN').format(Number(value))+' ₫' : '';

export const SponsorPage:React.FC<SponsorPageProps>=({onNavigate,onShowToast})=>{
  const {customPages,siteConfig}=useDataContext();
  const p=customPages.find(x=>x.slug==='sponsor'||x.id==='page-sponsor');
  const [amount,setAmount]=useState('');
  const [transferNote,setTransferNote]=useState(p?.sponsorTransferSyntax||'');
  const [confirmed,setConfirmed]=useState(false);
  const [partnerForm,setPartnerForm]=useState<any|null>(null);
  const [partnerAnswers,setPartnerAnswers]=useState<Record<string,any>>({});
  const [partnerSending,setPartnerSending]=useState(false);
  const [partnerUploading,setPartnerUploading]=useState('');
  const [partnerCode,setPartnerCode]=useState('');
  useEffect(()=>{fetch('/api/forms?slug=hop-tac-dong-hanh').then(async r=>{const d=await r.json();if(r.ok&&d?.ok)setPartnerForm(d.item)}).catch(()=>{})},[]);
  const goalAmount=Number(String(p?.sponsorGoalAmount||'').replace(/\D/g,''))||0;
  const receivedAmount=Number(String(p?.sponsorReceivedAmount||'').replace(/\D/g,''))||0;
  const progress=goalAmount>0?Math.min(100,Math.max(0,(receivedAmount/goalAmount)*100)):0;

  const suggested=useMemo(()=>String(p?.sponsorSuggestedAmounts||'50000,100000,200000,500000').split(',').map(x=>cleanAmount(x)).filter(Boolean),[p?.sponsorSuggestedAmounts]);
  const autoQr=useMemo(()=>{
    const bank=(p?.sponsorBankId||'').trim();
    const account=(p?.sponsorBankAccount||'').replace(/[^0-9A-Za-z]/g,'');
    if(!bank||!account) return '';
    const qs=new URLSearchParams();
    const money=cleanAmount(amount);
    if(money && Number(money)>0) qs.set('amount',money);
    if(transferNote.trim()) qs.set('addInfo',transferNote.trim().slice(0,25));
    if(p?.sponsorAccountHolder?.trim()) qs.set('accountName',p.sponsorAccountHolder.trim());
    return `https://img.vietqr.io/image/${encodeURIComponent(bank)}-${encodeURIComponent(account)}-compact2.png?${qs.toString()}`;
  },[p?.sponsorBankId,p?.sponsorBankAccount,p?.sponsorAccountHolder,amount,transferNote]);
  const qrSrc=autoQr || p?.sponsorQrCodeUrl || '';
  const contactRows=Array.isArray(siteConfig.footerContacts)?siteConfig.footerContacts:[];
  const findContact=(needle:string,fallback:string)=>contactRows.find(x=>String(x.label||'').toLocaleLowerCase('vi').includes(needle.toLocaleLowerCase('vi')))?.value||fallback;
  const partnershipEmail=findContact('Hợp tác','hoptac@skyfirst.io.vn');
  const publicHotline=findContact('Hotline',siteConfig.hotline||'0924 910 210');

  const copy=async(text:string,label:string)=>{try{await navigator.clipboard.writeText(text);onShowToast(`Đã sao chép ${label}.`)}catch{onShowToast(`Không thể tự động sao chép ${label}.`)} };
  const partnerVisible=(f:any)=>{const rule=f?.showWhen;if(!rule?.fieldId)return true;const current=partnerAnswers[rule.fieldId];return Array.isArray(current)?current.map(String).includes(String(rule.equals??'')):String(current??'')===String(rule.equals??'')};
  const partnerUpdate=(id:string,value:any)=>setPartnerAnswers(a=>({...a,[id]:value}));
  const uploadPartnerFile=async(field:any,file:File)=>{if(!partnerForm)return;setPartnerUploading(field.id);try{const fd=new FormData();fd.append('file',file);const r=await fetch(`/api/forms?upload=1&formId=${encodeURIComponent(partnerForm.id)}&fieldId=${encodeURIComponent(field.id)}`,{method:'POST',body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error);partnerUpdate(field.id,d.url);onShowToast('Đã tải tài liệu lên.')}catch(err:any){onShowToast(err?.message||'Không thể tải tài liệu.')}finally{setPartnerUploading('')}};
  const submitPartnership=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!partnerForm){onShowToast('Biểu mẫu Hợp tác & Đồng hành chưa sẵn sàng.');return}
    setPartnerSending(true);
    try{
      const r=await fetch('/api/forms',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({formId:partnerForm.id,answers:partnerAnswers})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||!d?.ok)throw new Error(d?.error||'Không thể gửi đề xuất.');
      setPartnerCode(d.applicationCode||'');setPartnerAnswers({});
      onShowToast(d?.message||'Đề xuất đã được tiếp nhận.');
    }catch(err:any){onShowToast(err?.message||`Không thể gửi đề xuất. Vui lòng liên hệ ${partnershipEmail}.`)}finally{setPartnerSending(false)}
  };
  const go=(url?:string)=>{
    if(!url) return;
    if(url.startsWith('#')){document.getElementById(url.slice(1))?.scrollIntoView({behavior:'smooth'});return;}
    if(url==='/contact'){onNavigate('contact');return;}
    window.open(url,'_blank','noopener,noreferrer');
  };
  const commitments=[1,2,3,4].map(i=>({title:(p as any)?.[`sponsorCommit${i}Title`],desc:(p as any)?.[`sponsorCommit${i}Desc`]})).filter(x=>x.title||x.desc);
  const packages=[1,2,3,4].map(i=>({title:(p as any)?.[`sponsorPkg${i}Title`],badge:(p as any)?.[`sponsorPkg${i}Badge`],unit:(p as any)?.[`sponsorPkg${i}Unit`],desc:(p as any)?.[`sponsorPkg${i}Desc`],impact:(p as any)?.[`sponsorPkg${i}Impact`]})).filter(x=>x.title||x.desc||x.impact);
  const faqs=[1,2,3,4].map(i=>({q:(p as any)?.[`sponsorFaq${i}Q`],a:(p as any)?.[`sponsorFaq${i}A`]})).filter(x=>x.q||x.a);

  return <main className="bg-white">
    <section className="bg-[#071B3A] text-white py-20 lg:py-24"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-sky-200"><HeartHandshake size={16}/>{p?.badge||'Tài trợ & Đồng hành'}</div>
      <h1 className="mt-6 max-w-4xl text-5xl lg:text-6xl font-black tracking-[-.045em]">{p?.title||'Đồng hành cùng Sky First Network'}</h1>
      {p?.summary&&<p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{p.summary}</p>}
      <div className="mt-8 flex flex-wrap gap-3">{p?.sponsorHeroPrimaryButtonLabel&&<button onClick={()=>go(p.sponsorHeroPrimaryButtonUrl)} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#071B3A]">{p.sponsorHeroPrimaryButtonLabel}<ArrowRight size={17}/></button>}{p?.sponsorHeroSecondaryButtonLabel&&<button onClick={()=>go(p.sponsorHeroSecondaryButtonUrl)} className="rounded-xl border border-white/25 px-5 py-3 font-bold">{p.sponsorHeroSecondaryButtonLabel}</button>}</div>
    </div></section>

    <section className="py-16 lg:py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      {(p?.contentFormatted||p?.content)&&<RichTextRenderer content={p?.contentFormatted||p?.content||''}/>} 

      <section id="de-xuat-dong-hanh" className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.75fr)]">
        <form onSubmit={submitPartnership} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="text-xs font-black uppercase tracking-[.16em] text-[#0B66C3]">Hợp tác & Đồng hành</div>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{partnerForm?.title||'Gửi đề xuất đồng hành'}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{partnerForm?.description||'Biểu mẫu được quản lý tập trung trong Form Builder. Không gửi mật khẩu, OTP hoặc thông tin tài chính nhạy cảm.'}</p>
          {!partnerForm?<div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">Đang tải biểu mẫu Hợp tác & Đồng hành…</div>:<div className="mt-6 space-y-4">
            {(partnerForm.fields||[]).filter(partnerVisible).map((f:any)=>{
              if(f.type==='section')return <h3 key={f.id} className="pt-2 text-lg font-black">{f.label}</h3>;
              if(f.type==='consent')return <label key={f.id} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><input type="checkbox" checked={!!partnerAnswers[f.id]} onChange={e=>partnerUpdate(f.id,e.target.checked)} className="mt-1"/><span>{f.label}{f.required?' *':''}</span></label>;
              if(['file','image'].includes(f.type))return <label key={f.id} className="block text-sm font-bold">{f.label}{f.required?' *':''}<div className="mt-2 rounded-xl border border-dashed border-slate-300 p-4"><span className="inline-flex items-center gap-2 text-sm font-bold"><UploadCloud size={16}/>{partnerUploading===f.id?'Đang tải...':'Chọn tệp'}</span><input type="file" accept={f.type==='image'?'image/jpeg,image/png,image/webp':'image/jpeg,image/png,image/webp,application/pdf'} className="mt-2 block text-xs" onChange={e=>{const file=e.target.files?.[0];if(file)void uploadPartnerFile(f,file)}}/>{partnerAnswers[f.id]&&<div className="mt-2 text-xs text-emerald-700">Đã tải tệp thành công.</div>}</div></label>;
              if(f.type==='select'||f.type==='radio')return <label key={f.id} className="block text-sm font-bold">{f.label}{f.required?' *':''}<select required={!!f.required} value={partnerAnswers[f.id]||''} onChange={e=>partnerUpdate(f.id,e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"><option value="">Chọn...</option>{(f.options||[]).map((o:string)=><option key={o} value={o}>{o}</option>)}</select></label>;
              if(f.type==='checkbox')return <div key={f.id}><div className="text-sm font-bold">{f.label}{f.required?' *':''}</div><div className="mt-2 grid gap-2 sm:grid-cols-2">{(f.options||[]).map((o:string)=>{const arr=Array.isArray(partnerAnswers[f.id])?partnerAnswers[f.id]:[];return <label key={o} className="flex gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={arr.includes(o)} onChange={e=>partnerUpdate(f.id,e.target.checked?[...arr,o]:arr.filter((x:string)=>x!==o))}/>{o}</label>})}</div></div>;
              const htmlType=['email','url','date','time','number'].includes(f.type)?f.type:f.type==='phone'?'tel':f.type==='datetime'?'datetime-local':'text';
              return <label key={f.id} className="block text-sm font-bold">{f.label}{f.required?' *':''}{f.type==='textarea'?<textarea required={!!f.required} rows={5} value={partnerAnswers[f.id]||''} onChange={e=>partnerUpdate(f.id,e.target.value)} placeholder={f.placeholder||''} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/>:<input required={!!f.required} type={htmlType} value={partnerAnswers[f.id]||''} onChange={e=>partnerUpdate(f.id,e.target.value)} placeholder={f.placeholder||''} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/>}</label>;
            })}
          </div>}
          <button disabled={partnerSending||!!partnerUploading||!partnerForm} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0B66C3] px-5 py-3 font-black text-white disabled:opacity-60">{partnerSending?'Đang gửi...':'Gửi đề xuất'}</button>
          {partnerCode&&<div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">Mã hồ sơ: <strong className="font-mono">{partnerCode}</strong></div>}
        </form>
        <aside className="rounded-[28px] border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 lg:sticky lg:top-24 lg:self-start"><HeartHandshake className="text-[#0B66C3]"/><h3 className="mt-4 text-xl font-black">Kênh hợp tác chính thức</h3><p className="mt-2 text-sm leading-6 text-slate-600">Đề xuất hợp tác và đồng hành được ưu tiên tiếp nhận qua biểu mẫu hoặc email chuyên trách.</p><a href={`mailto:${partnershipEmail}`} className="mt-5 block rounded-xl bg-white p-4 font-black text-[#0B66C3] shadow-sm">{partnershipEmail}</a><a href={`tel:${publicHotline.replace(/\s/g,'')}`} className="mt-3 block rounded-xl bg-white p-4 font-black text-slate-900 shadow-sm">{publicHotline}</a></aside>
      </section>

      {commitments.length>0&&<section><div className="max-w-3xl"><h2 className="text-3xl font-black">{p?.sponsorCommitmentHeading||'Nguyên tắc tiếp nhận và minh bạch'}</h2>{p?.sponsorCommitmentSubtitle&&<p className="mt-3 text-slate-600 leading-7">{p.sponsorCommitmentSubtitle}</p>}</div><div className="mt-7 grid md:grid-cols-2 gap-4">{commitments.map((x,i)=><article key={i} className="rounded-2xl border border-slate-200 p-5"><ShieldCheck className="text-[#0B5FB4]"/><h3 className="mt-3 font-extrabold text-lg">{x.title}</h3>{x.desc&&<p className="mt-2 text-sm leading-6 text-slate-600">{x.desc}</p>}</article>)}</div></section>}

      {packages.length>0&&<section><h2 className="text-3xl font-black">{p?.sponsorPackagesHeading||'Các hình thức đồng hành'}</h2>{p?.sponsorPackagesSubtitle&&<p className="mt-3 text-slate-600">{p.sponsorPackagesSubtitle}</p>}<div className="mt-7 grid md:grid-cols-2 gap-4">{packages.map((x,i)=><article key={i} className="rounded-2xl border border-slate-200 p-5">{x.badge&&<div className="text-xs font-black uppercase tracking-wider text-[#0B5FB4]">{x.badge}</div>}<h3 className="mt-2 text-xl font-black">{x.title}</h3>{x.unit&&<div className="mt-2 text-sm font-semibold text-slate-500">{x.unit}</div>}{x.desc&&<p className="mt-3 text-sm leading-6 text-slate-600">{x.desc}</p>}{x.impact&&<p className="mt-3 text-sm rounded-xl bg-slate-50 p-3 text-slate-700">{x.impact}</p>}</article>)}</div></section>}

      {(p?.sponsorBankAccount||p?.sponsorQrCodeUrl)&&<section id="thong-tin-chuyen-khoan" className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 lg:p-9"><div className="grid lg:grid-cols-[1fr_.9fr] gap-8">
        <div><div className="inline-flex items-center gap-2 text-[#0B5FB4] font-extrabold"><Building2 size={19}/>Thông tin chuyển khoản</div><h2 className="mt-3 text-3xl font-black">Tài trợ & Đồng hành</h2>
          {(goalAmount>0||receivedAmount>0)&&<div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4"><div className="flex items-end justify-between gap-3"><div><div className="text-xs font-bold text-sky-700">Nguồn lực đã ghi nhận</div><div className="mt-1 text-2xl font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(receivedAmount)} ₫</div></div>{goalAmount>0&&<div className="text-right"><div className="text-[11px] text-slate-500">Mục tiêu</div><div className="font-black">{new Intl.NumberFormat('vi-VN').format(goalAmount)} ₫</div></div>}</div>{goalAmount>0&&<><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#0B66C3] transition-all" style={{width:`${progress}%`}}/></div><div className="mt-2 flex justify-between text-[11px] font-bold text-slate-500"><span>{progress.toFixed(progress>=10?0:1)}%</span>{p?.sponsorPublicLedgerUrl&&<a href={p.sponsorPublicLedgerUrl} target="_blank" rel="noopener noreferrer" className="text-[#0B66C3] hover:underline">Xem công khai / đối soát</a>}</div></>}</div>}
          {p?.sponsorRecipientEntity&&<div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="text-[11px] font-black uppercase tracking-wider text-amber-700">Chủ thể tiếp nhận nguồn lực</div><div className="mt-1 font-extrabold text-slate-900">{p.sponsorRecipientEntity}</div><p className="mt-1 text-xs leading-5 text-slate-600">Vui lòng đối chiếu đúng chủ thể, tên tài khoản và ngân hàng trước khi thực hiện giao dịch.</p></div>}
          <div className="mt-6 rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
            {p?.sponsorBankName&&<div className="p-4"><div className="text-xs text-slate-400">Ngân hàng</div><div className="font-bold">{p.sponsorBankName}</div></div>}
            {p?.sponsorBankAccount&&<div className="p-4 flex items-center justify-between gap-3"><div><div className="text-xs text-slate-400">Số tài khoản</div><div className="font-black text-xl tracking-wide">{p.sponsorBankAccount}</div></div><button onClick={()=>copy(p.sponsorBankAccount||'','số tài khoản')} className="p-2.5 rounded-xl border border-slate-200" title={p?.sponsorCopyButtonLabel||'Sao chép số tài khoản'}><Copy size={18}/></button></div>}
            {p?.sponsorAccountHolder&&<div className="p-4"><div className="text-xs text-slate-400">Tên người nhận</div><div className="font-bold uppercase">{p.sponsorAccountHolder}</div></div>}
            {p?.sponsorBankBranch&&<div className="p-4"><div className="text-xs text-slate-400">Chi nhánh / ghi chú ngân hàng</div><div className="font-semibold">{p.sponsorBankBranch}</div></div>}
          </div>
          <div className="mt-6"><label className="text-sm font-bold">Số tiền muốn chuyển</label><input inputMode="numeric" value={amount} onChange={e=>setAmount(cleanAmount(e.target.value))} placeholder="Nhập số tiền (VNĐ)" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold"/>{amount&&<div className="mt-1 text-sm text-slate-500">{formatMoney(amount)}</div>}<div className="mt-3 flex flex-wrap gap-2">{suggested.map(v=><button key={v} onClick={()=>setAmount(v)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold">{formatMoney(v)}</button>)}</div></div>
          <div className="mt-5"><label className="text-sm font-bold">Nội dung chuyển khoản</label><input value={transferNote} onChange={e=>setTransferNote(e.target.value.slice(0,25))} maxLength={25} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder={p?.sponsorTransferSyntax||'Nội dung chuyển khoản'}/><div className="mt-1 text-xs text-slate-400">Tối đa 25 ký tự để tăng khả năng tương thích với mã chuyển khoản.</div></div>
          <label className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-1"/><span>{p?.sponsorDonationNotice||'Vui lòng kiểm tra đúng tên người nhận, ngân hàng, số tài khoản, số tiền và nội dung trước khi xác nhận chuyển khoản. Website không tự động xác nhận đã nhận tiền chỉ dựa trên việc quét mã.'}</span></label>
        </div>
        <div className="rounded-3xl bg-white border border-slate-200 p-6 text-center"><div className="inline-flex items-center gap-2 font-black"><QrCode size={19}/>{p?.sponsorQrCodeTitle||'Mã QR chuyển khoản'}</div>{p?.sponsorQrCodeSubtitle&&<p className="mt-2 text-sm text-slate-500">{p.sponsorQrCodeSubtitle}</p>}{qrSrc?<div className={`mt-5 transition ${confirmed?'opacity-100':'opacity-35 pointer-events-none select-none'}`}><img src={qrSrc} alt="Mã QR chuyển khoản" className="mx-auto max-w-[320px] w-full rounded-2xl border border-slate-100"/><p className="mt-3 text-xs text-slate-400">Mã được tạo từ thông tin tài khoản đã công bố. Ứng dụng ngân hàng vẫn là nơi xác nhận giao dịch cuối cùng.</p></div>:<div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-10 text-slate-400">Chưa cấu hình mã QR hoặc thông tin ngân hàng đủ để tạo mã tự động.</div>}</div>
      </div></section>}

      <section className="rounded-[28px] border border-slate-200 bg-white p-7 lg:p-9 grid lg:grid-cols-[1fr_.8fr] gap-8"><div><CheckCircle2 className="text-[#0B5FB4]"/><h2 className="mt-5 text-3xl font-black">{p?.sponsorContactHeading||p?.sponsorContactLeadTitle||'Liên hệ trao đổi'}</h2>{p?.sponsorContactDescription&&<p className="mt-3 text-slate-600 leading-7">{p.sponsorContactDescription}</p>}</div><div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4">{(p?.sponsorContactEmail||p?.sponsorEmail||partnershipEmail)&&<div className="flex gap-3"><Mail className="text-[#0B5FB4]" size={20}/><div><div className="text-xs text-slate-400">Email hợp tác</div><a className="font-bold" href={`mailto:${p?.sponsorContactEmail||p?.sponsorEmail||partnershipEmail}`}>{p?.sponsorContactEmail||p?.sponsorEmail||partnershipEmail}</a></div></div>}{(p?.sponsorContactHotline||p?.sponsorHotline||publicHotline)&&<div className="flex gap-3"><Phone className="text-[#0B5FB4]" size={20}/><div><div className="text-xs text-slate-400">Điện thoại liên hệ</div><a className="font-bold" href={`tel:${String(p?.sponsorContactHotline||p?.sponsorHotline||publicHotline).replace(/\s/g,'')}`}>{p?.sponsorContactHotline||p?.sponsorHotline||publicHotline}</a></div></div>}{p?.sponsorContactButtonLabel&&<button onClick={()=>go(p.sponsorContactButtonUrl)} className="w-full rounded-xl bg-[#0B5FB4] px-5 py-3 text-white font-bold">{p.sponsorContactButtonLabel}</button>}</div></section>

      {faqs.length>0&&<section><h2 className="text-3xl font-black">{p?.sponsorFaqHeading||'Câu hỏi thường gặp'}</h2>{p?.sponsorFaqSubtitle&&<p className="mt-3 text-slate-600">{p.sponsorFaqSubtitle}</p>}<div className="mt-6 space-y-3">{faqs.map((x,i)=><details key={i} className="rounded-2xl border border-slate-200 p-5"><summary className="cursor-pointer font-extrabold">{x.q}</summary>{x.a&&<p className="mt-3 text-sm leading-6 text-slate-600">{x.a}</p>}</details>)}</div></section>}

      {(p?.sponsorCtaTitle||p?.buttonLabel)&&<section className="rounded-[30px] bg-[#071B3A] p-8 lg:p-10 text-white"><h2 className="text-3xl font-black">{p?.sponsorCtaTitle}</h2>{p?.sponsorCtaDescription&&<p className="mt-3 max-w-3xl text-slate-300 leading-7">{p.sponsorCtaDescription}</p>}<div className="mt-6 flex flex-wrap gap-3">{p?.buttonLabel&&<button onClick={()=>go(p.buttonUrl)} className="rounded-xl bg-white px-5 py-3 font-bold text-[#071B3A]">{p.buttonLabel}</button>}{p?.secondaryButtonLabel&&<button onClick={()=>go(p.secondaryButtonUrl)} className="rounded-xl border border-white/25 px-5 py-3 font-bold">{p.secondaryButtonLabel}</button>}</div></section>}
    </div></section>
  </main>;
};
