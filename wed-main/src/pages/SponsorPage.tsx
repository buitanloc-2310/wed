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
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-sky-200"><HeartHandshake size={16}/>{p?.badge||'Tài trợ, đóng góp & quyên góp'}</div>
      <h1 className="mt-6 max-w-4xl text-5xl lg:text-6xl font-black tracking-[-.045em]">{p?.title||'Đồng hành cùng Sky First Network'}</h1>
      {p?.summary&&<p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{p.summary}</p>}
      <div className="mt-8 flex flex-wrap gap-3">{p?.sponsorHeroPrimaryButtonLabel&&<button onClick={()=>go(p.sponsorHeroPrimaryButtonUrl)} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#071B3A]">{p.sponsorHeroPrimaryButtonLabel}<ArrowRight size={17}/></button>}{p?.sponsorHeroSecondaryButtonLabel&&<button onClick={()=>go(p.sponsorHeroSecondaryButtonUrl)} className="rounded-xl border border-white/25 px-5 py-3 font-bold">{p.sponsorHeroSecondaryButtonLabel}</button>}</div>
    </div></section>

    <section className="py-16 lg:py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      {(p?.contentFormatted||p?.content)&&<RichTextRenderer content={p?.contentFormatted||p?.content||''}/>} 

      {commitments.length>0&&<section><div className="max-w-3xl"><h2 className="text-3xl font-black">{p?.sponsorCommitmentHeading||'Nguyên tắc tiếp nhận và minh bạch'}</h2>{p?.sponsorCommitmentSubtitle&&<p className="mt-3 text-slate-600 leading-7">{p.sponsorCommitmentSubtitle}</p>}</div><div className="mt-7 grid md:grid-cols-2 gap-4">{commitments.map((x,i)=><article key={i} className="rounded-2xl border border-slate-200 p-5"><ShieldCheck className="text-[#0B5FB4]"/><h3 className="mt-3 font-extrabold text-lg">{x.title}</h3>{x.desc&&<p className="mt-2 text-sm leading-6 text-slate-600">{x.desc}</p>}</article>)}</div></section>}

      {packages.length>0&&<section><h2 className="text-3xl font-black">{p?.sponsorPackagesHeading||'Các hình thức đồng hành'}</h2>{p?.sponsorPackagesSubtitle&&<p className="mt-3 text-slate-600">{p.sponsorPackagesSubtitle}</p>}<div className="mt-7 grid md:grid-cols-2 gap-4">{packages.map((x,i)=><article key={i} className="rounded-2xl border border-slate-200 p-5">{x.badge&&<div className="text-xs font-black uppercase tracking-wider text-[#0B5FB4]">{x.badge}</div>}<h3 className="mt-2 text-xl font-black">{x.title}</h3>{x.unit&&<div className="mt-2 text-sm font-semibold text-slate-500">{x.unit}</div>}{x.desc&&<p className="mt-3 text-sm leading-6 text-slate-600">{x.desc}</p>}{x.impact&&<p className="mt-3 text-sm rounded-xl bg-slate-50 p-3 text-slate-700">{x.impact}</p>}</article>)}</div></section>}

      {(p?.sponsorBankAccount||p?.sponsorQrCodeUrl)&&<section id="thong-tin-chuyen-khoan" className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 lg:p-9"><div className="grid lg:grid-cols-[1fr_.9fr] gap-8">
        <div><div className="inline-flex items-center gap-2 text-[#0B5FB4] font-extrabold"><Building2 size={19}/>Thông tin chuyển khoản</div><h2 className="mt-3 text-3xl font-black">Tài trợ, đóng góp & quyên góp</h2>
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
