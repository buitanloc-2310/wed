import React, {useMemo, useState} from 'react';
import {ArrowRight, Building2, CheckCircle2, Copy, HeartHandshake, Mail, Phone, QrCode, ShieldCheck} from 'lucide-react';
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
  const [partnerName,setPartnerName]=useState('');
  const [partnerOrg,setPartnerOrg]=useState('');
  const [partnerEmail,setPartnerEmail]=useState('');
  const [partnerPhone,setPartnerPhone]=useState('');
  const [partnerType,setPartnerType]=useState('Hợp tác chương trình / dự án');
  const [partnerMessage,setPartnerMessage]=useState('');
  const [partnerLink,setPartnerLink]=useState('');
  const [partnerConsent,setPartnerConsent]=useState(false);
  const [partnerSending,setPartnerSending]=useState(false);
  const [partnerCode,setPartnerCode]=useState('');
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

  const copy=async(text:string,label:string)=>{try{await navigator.clipboard.writeText(text);onShowToast(`Đã sao chép ${label}.`)}catch{onShowToast(`Không thể tự động sao chép ${label}.`)} };
  const submitPartnership=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!partnerConsent){onShowToast('Vui lòng xác nhận đồng ý để Sky First tiếp nhận nội dung đề xuất.');return}
    setPartnerSending(true);
    try{
      const detail=[`Tổ chức/Đơn vị: ${partnerOrg||'—'}`,`Điện thoại: ${partnerPhone||'—'}`,`Hình thức: ${partnerType}`,`Link/Tài liệu: ${partnerLink||'—'}`,'',partnerMessage].join('\n');
      const r=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:partnerName,email:partnerEmail,topic:'Hợp tác & Đồng hành',message:detail})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||!d?.ok)throw new Error(d?.error||'Không thể gửi đề xuất.');
      setPartnerCode(d.reference||'');setPartnerName('');setPartnerOrg('');setPartnerEmail('');setPartnerPhone('');setPartnerMessage('');setPartnerLink('');setPartnerConsent(false);
      onShowToast(d?.message||'Đề xuất đã được tiếp nhận.');
    }catch(err:any){onShowToast(err?.message||'Không thể gửi đề xuất. Vui lòng liên hệ hoptac@skyfirst.io.vn.')}finally{setPartnerSending(false)}
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
          <div className="text-xs font-black uppercase tracking-[.16em] text-[#0B66C3]">Hợp tác & Đồng hành</div><h2 className="mt-2 text-3xl font-black text-slate-950">Gửi đề xuất đồng hành</h2><p className="mt-2 text-sm leading-6 text-slate-500">Thông tin được lưu trên hệ thống để bộ phận phụ trách tiếp nhận và theo dõi. Không gửi mật khẩu, OTP hoặc thông tin tài chính nhạy cảm.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Họ và tên<input required value={partnerName} onChange={e=>setPartnerName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/></label><label className="text-sm font-bold">Tổ chức / Đơn vị<input value={partnerOrg} onChange={e=>setPartnerOrg(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/></label><label className="text-sm font-bold">Email<input required type="email" value={partnerEmail} onChange={e=>setPartnerEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/></label><label className="text-sm font-bold">Điện thoại<input value={partnerPhone} onChange={e=>setPartnerPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/></label></div>
          <label className="mt-4 block text-sm font-bold">Hình thức muốn đồng hành<select value={partnerType} onChange={e=>setPartnerType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"><option>Hợp tác chương trình / dự án</option><option>Đồng hành chuyên môn</option><option>Truyền thông & lan tỏa</option><option>Nguồn lực / tài trợ</option><option>Sự kiện</option><option>Đề xuất khác</option></select></label>
          <label className="mt-4 block text-sm font-bold">Nội dung đề xuất<textarea required rows={6} value={partnerMessage} onChange={e=>setPartnerMessage(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/></label><label className="mt-4 block text-sm font-bold">Link hoặc tài liệu đính kèm<input type="url" value={partnerLink} onChange={e=>setPartnerLink(e.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/></label>
          <label className="mt-4 flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><input type="checkbox" checked={partnerConsent} onChange={e=>setPartnerConsent(e.target.checked)} className="mt-1"/><span>Tôi đồng ý để Sky First sử dụng thông tin đã gửi nhằm tiếp nhận, liên hệ và xử lý đề xuất này.</span></label>
          <button disabled={partnerSending} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0B66C3] px-5 py-3 font-black text-white disabled:opacity-60">{partnerSending?'Đang gửi...':'Gửi đề xuất'}</button>{partnerCode&&<div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">Mã tiếp nhận: <strong className="font-mono">{partnerCode}</strong></div>}
        </form>
        <aside className="rounded-[28px] border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 lg:sticky lg:top-24 lg:self-start"><HeartHandshake className="text-[#0B66C3]"/><h3 className="mt-4 text-xl font-black">Kênh hợp tác chính thức</h3><p className="mt-2 text-sm leading-6 text-slate-600">Đề xuất hợp tác và đồng hành được ưu tiên tiếp nhận qua biểu mẫu hoặc email chuyên trách.</p><a href="mailto:hoptac@skyfirst.io.vn" className="mt-5 block rounded-xl bg-white p-4 font-black text-[#0B66C3] shadow-sm">hoptac@skyfirst.io.vn</a><a href="tel:0924910210" className="mt-3 block rounded-xl bg-white p-4 font-black text-slate-900 shadow-sm">0924 910 210</a></aside>
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

      <section className="rounded-[28px] border border-slate-200 bg-white p-7 lg:p-9 grid lg:grid-cols-[1fr_.8fr] gap-8"><div><CheckCircle2 className="text-[#0B5FB4]"/><h2 className="mt-5 text-3xl font-black">{p?.sponsorContactHeading||p?.sponsorContactLeadTitle||'Liên hệ trao đổi'}</h2>{p?.sponsorContactDescription&&<p className="mt-3 text-slate-600 leading-7">{p.sponsorContactDescription}</p>}</div><div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4">{(p?.sponsorContactEmail||p?.sponsorEmail||siteConfig.contact?.contactEmail)&&<div className="flex gap-3"><Mail className="text-[#0B5FB4]" size={20}/><div><div className="text-xs text-slate-400">Email hợp tác</div><a className="font-bold" href={`mailto:${p?.sponsorContactEmail||p?.sponsorEmail||siteConfig.contact?.contactEmail}`}>{p?.sponsorContactEmail||p?.sponsorEmail||siteConfig.contact?.contactEmail}</a></div></div>}{(p?.sponsorContactHotline||p?.sponsorHotline||siteConfig.hotline)&&<div className="flex gap-3"><Phone className="text-[#0B5FB4]" size={20}/><div><div className="text-xs text-slate-400">Điện thoại liên hệ</div><a className="font-bold" href={`tel:${String(p?.sponsorContactHotline||p?.sponsorHotline||siteConfig.hotline).replace(/\s/g,'')}`}>{p?.sponsorContactHotline||p?.sponsorHotline||siteConfig.hotline}</a></div></div>}{p?.sponsorContactButtonLabel&&<button onClick={()=>go(p.sponsorContactButtonUrl)} className="w-full rounded-xl bg-[#0B5FB4] px-5 py-3 text-white font-bold">{p.sponsorContactButtonLabel}</button>}</div></section>

      {faqs.length>0&&<section><h2 className="text-3xl font-black">{p?.sponsorFaqHeading||'Câu hỏi thường gặp'}</h2>{p?.sponsorFaqSubtitle&&<p className="mt-3 text-slate-600">{p.sponsorFaqSubtitle}</p>}<div className="mt-6 space-y-3">{faqs.map((x,i)=><details key={i} className="rounded-2xl border border-slate-200 p-5"><summary className="cursor-pointer font-extrabold">{x.q}</summary>{x.a&&<p className="mt-3 text-sm leading-6 text-slate-600">{x.a}</p>}</details>)}</div></section>}

      {(p?.sponsorCtaTitle||p?.buttonLabel)&&<section className="rounded-[30px] bg-[#071B3A] p-8 lg:p-10 text-white"><h2 className="text-3xl font-black">{p?.sponsorCtaTitle}</h2>{p?.sponsorCtaDescription&&<p className="mt-3 max-w-3xl text-slate-300 leading-7">{p.sponsorCtaDescription}</p>}<div className="mt-6 flex flex-wrap gap-3">{p?.buttonLabel&&<button onClick={()=>go(p.buttonUrl)} className="rounded-xl bg-white px-5 py-3 font-bold text-[#071B3A]">{p.buttonLabel}</button>}{p?.secondaryButtonLabel&&<button onClick={()=>go(p.secondaryButtonUrl)} className="rounded-xl border border-white/25 px-5 py-3 font-bold">{p.secondaryButtonLabel}</button>}</div></section>}
    </div></section>
  </main>;
};
