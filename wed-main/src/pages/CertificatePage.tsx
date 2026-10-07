import { sanitizeHtml } from '../utils/sanitizeHtml';
import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Award,
  Building,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Copy,
  RotateCcw,
  Camera,
  X,
  QrCode,
  Users
} from 'lucide-react';

import { useDataContext } from '../context/DataContext';
import { Certificate } from '../types';

interface CertificatePageProps {
  onShowToast: (msg: string) => void;
}

export const CertificatePage: React.FC<CertificatePageProps> = ({ onShowToast }) => {
  const { certificates, customPages } = useDataContext();

  const pageData = customPages.find(
    p => p.slug === 'certificate' || p.id === 'page-certificate'
  );

  const badgeText =
    pageData?.badge || 'TRUNG TÂM XÁC THỰC SKY FIRST';

  const titleText =
    pageData?.title || 'Trung tâm Xác thực Sky First';

  const summaryText =
    pageData?.summary ||
    'Xác thực thông tin và trạng thái các ghi nhận được quản lý trên hệ thống Sky First.';

  const searchLabel =
    pageData?.certSearchLabel || 'Mã Tra Cứu Chứng Nhận';

  const searchPlaceholder =
    pageData?.certSearchPlaceholder || 'Nhập mã Giấy chứng nhận';

  const searchButtonLabel =
    pageData?.certSearchButtonLabel || 'Tra Cứu';

  const resetButtonLabel =
    pageData?.certResetButtonLabel || 'Làm mới';

  const guidanceNote =
    pageData?.certGuidanceNote ||
    'Hệ thống tra cứu tự động đối chiếu mã số với cơ sở dữ liệu số hóa hệ thống Giấy chứng nhận theo thời gian thực.';

  const certFeature1Title =
    pageData?.certFeature1Title || 'Mã Định Danh Duy Nhất';

  const certFeature1Desc =
    pageData?.certFeature1Desc ||
    'Mỗi Giấy chứng nhận được ghi nhận bằng một mã phục vụ việc tra cứu và đối chiếu thông tin.';

  const certFeature2Title =
    pageData?.certFeature2Title || 'Lưu Trữ Trong Hệ Thống';

  const certFeature2Desc =
    pageData?.certFeature2Desc ||
    'Hồ sơ được lưu trữ trên cơ sở dữ liệu số của Sky First Network phục vụ việc đối chiếu thông tin.';

  const certFeature3Title =
    pageData?.certFeature3Title || 'Hỗ Trợ Nhanh Chóng';

  const certFeature3Desc =
    pageData?.certFeature3Desc ||
    'Cần xác minh bổ sung hoặc chỉnh sửa thông tin, vui lòng gửi yêu cầu qua trang Liên hệ.';

  const certCtaTitle =
    pageData?.certCtaTitle || pageData?.ctaTitle;

  const certCtaDescription =
    pageData?.certCtaDescription || pageData?.ctaDescription;

  const certCtaButtonLabel =
    pageData?.certCtaButtonLabel || pageData?.buttonLabel;

  const certCtaButtonUrl =
    pageData?.certCtaButtonUrl ||
    pageData?.buttonUrl ||
    '/contact';

  const [certCode, setCertCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats,setStats]=useState<{issued:number;valid:number;programs:number;updatedAt:string}|null>(null);
  const [scanOpen,setScanOpen]=useState(false);
  const [scanError,setScanError]=useState('');
  const videoRef=useRef<HTMLVideoElement|null>(null);
  useEffect(()=>{fetch('/api/cms?collection=certificates&stats=1').then(r=>r.json()).then(d=>{if(d?.ok&&d.stats)setStats(d.stats)}).catch(()=>{})},[]);

  const handleLookup = async (codeToSearch?: string) => {
    const target = (codeToSearch ?? certCode)
      .trim()
      .toUpperCase();

    if (!target) {
      setErrorMsg('Vui lòng nhập mã Giấy chứng nhận để tra cứu');
      return;
    }

    setHasSearched(true);
    setErrorMsg('');
    setSearchedCode(target);
    setSearchedCert(null);

    // =====================================================
    // 1. TRA DỮ LIỆU TRỰC TIẾP TRÊN WEBSITE SKY FIRST
    // =====================================================

    const dynamicFound =
      certificates[target] ||
      Object.values(certificates).find(
        (c: Certificate) =>
          c.code?.toUpperCase() === target
      );

    if (dynamicFound) {
      setSearchedCert(dynamicFound);
      onShowToast(`Đã tìm thấy Giấy chứng nhận: ${target}`);
      return;
    }

    // Chỉ tra đúng mã được yêu cầu; public không tải toàn bộ kho chứng nhận/PII vào trình duyệt.
    try {
      const localResponse = await fetch(`/api/cms?collection=certificates&id=${encodeURIComponent(target)}`, { cache: 'no-store' });
      const localPayload = await localResponse.json().catch(() => null);
      if (localResponse.ok && localPayload?.item) {
        setSearchedCert(localPayload.item as Certificate);
        onShowToast(`Đã tìm thấy Giấy chứng nhận: ${target}`);
        return;
      }
    } catch {
      // Tiếp tục thử các nguồn tra cứu liên kết bên dưới.
    }

    // =====================================================
    // 2. HÀM CHUẨN HÓA DỮ LIỆU TỪ CÁC HỆ THỐNG
    // =====================================================

    type LookupSource = {
      name: string;
      url: string;
      adapt: (payload: any) => Certificate | null;
    };

    const normalizeStatus = (
      value: unknown
    ): Certificate['status'] => {
      const x = String(value || '').toLowerCase();

      if (
        [
          'revoked',
          'revoke',
          'cancelled',
          'canceled',
          'invalid'
        ].includes(x)
      ) {
        return 'revoked';
      }

      if (x === 'test') {
        return 'test';
      }

      return 'valid';
    };

    const makeCert = (
      item: any,
      sourceSystem: string,
      fallbackIssuer: string
    ): Certificate | null => {
      if (!item) return null;

      const code =
        item.code ||
        item.certificate_no ||
        item.certificateNo ||
        item.verify_code ||
        item.verifyCode;

      if (!code) return null;

      let metadata: any = {};

      if (typeof item.metadata_json === 'string') {
        try {
          metadata = JSON.parse(item.metadata_json);
        } catch {
          metadata = {};
        }
      } else if (
        item.metadata_json &&
        typeof item.metadata_json === 'object'
      ) {
        metadata = item.metadata_json;
      }

      const hoursRaw =
        item.hoursCompleted ??
        item.hours_completed ??
        metadata.hours_completed ??
        metadata.hoursCompleted;

      const hoursNumber =
        hoursRaw !== undefined &&
        hoursRaw !== null &&
        hoursRaw !== ''
          ? Number(hoursRaw)
          : undefined;

      return {
        code: String(code),

        recipientName:
          item.full_name ||
          item.fullName ||
          item.recipientName ||
          item.recipient_name ||
          item.name ||
          '',

        programTitle:
          item.program ||
          item.program_name ||
          item.activity ||
          item.activity_name ||
          item.title ||
          item.content ||
          item.cert_type ||
          item.type ||
          'Giấy chứng nhận',

        programType:
          item.programType ||
          item.program_type ||
          'Chứng Nhận Cống Hiến',

        certificateType:
          item.certificateType ||
          item.certificate_type ||
          item.cert_type ||
          item.type ||
          '',

        sourceSystem,

        role:
          item.role ||
          metadata.role ||
          '',

        issuer:
          item.unit_name ||
          item.unitName ||
          item.issuer ||
          item.organization ||
          metadata.unit_name ||
          metadata.issuer ||
          fallbackIssuer,

        issueDate:
          item.issued_at ||
          item.issuedAt ||
          item.issueDate ||
          item.issue_date ||
          '',

        expiryDate:
          item.expiryDate ||
          item.expiry_date ||
          item.expires_at ||
          item.expiresAt ||
          undefined,

        status: normalizeStatus(
          item.status ||
          item.verification_status ||
          item.verificationStatus ||
          (item.valid === false ? 'revoked' : 'valid')
        ),

        grade:
          item.grade ||
          item.rank ||
          metadata.grade ||
          undefined,

        hoursCompleted:
          hoursNumber !== undefined &&
          Number.isFinite(hoursNumber)
            ? hoursNumber
            : undefined,

        verificationUrl:
          window.location.href,

        signatory: {
          name:
            item.signatory?.name ||
            item.signer ||
            metadata.signer ||
            '',

          title:
            item.signatory?.title ||
            item.signer_title ||
            item.signerTitle ||
            metadata.signer_title ||
            ''
        }
      };
    };

    // =====================================================
    // 3. CÁC HỆ THỐNG TRA CỨU LIÊN THÔNG
    // =====================================================
    //
    // Member KHÔNG nằm ở đây.
    // Member là hệ thống tài khoản / hồ sơ cá nhân,
    // không phải nguồn tra cứu GCN công khai.
    //
    // Thứ tự:
    // CTT -> SFEC -> TNV -> NHN
    //
    // Nếu 1 cổng lỗi, hệ thống vẫn tiếp tục thử cổng sau.
    // =====================================================

    const sources: LookupSource[] = [
      {
        name: 'Cổng Thông tin Sky First Network',

        url:
          import.meta.env.VITE_CTT_CERTIFICATE_LOOKUP_URL ||
          'https://ctt.skyfirst.io.vn/api/lookup/certificate',

        adapt: p =>
          makeCert(
            p?.payload?.item ||
              p?.payload?.certificate ||
              p?.item ||
              p?.certificate ||
              p?.data,

            'Cổng Thông tin Sky First Network',
            'Sky First Network'
          )
      },

      {
        name: 'The Sky First English Club (SFEC)',

        url:
            import.meta.env.VITE_SFEC_CERTIFICATE_LOOKUP_URL ||
          'https://sfec.skyfirst.io.vn/api/lookup/certificate',

        adapt: p =>
          makeCert(
            p?.payload?.item ||
              p?.payload?.certificate ||
              p?.item ||
              p?.certificate ||
              p?.data,

            'The Sky First English Club (SFEC)',
            'The Sky First English Club (SFEC)'
          )
      },

      {
        name: 'Cổng Tình nguyện viên Sky First Network',

        url:
          import.meta.env.VITE_TNV_CERTIFICATE_LOOKUP_URL ||
          'https://tnv.skyfirst.io.vn/api/public/certificates/lookup',

        adapt: p =>
          makeCert(
            p?.payload?.item ||
              p?.payload?.certificate ||
              p?.certificate ||
              p?.item ||
              p?.data,

            'Cổng Tình nguyện viên Sky First Network',
            'Sky First Network'
          )
      },

      {
        name: 'Nhà Hán Ngữ',

        url:
  import.meta.env.VITE_NHN_CERTIFICATE_LOOKUP_URL ||
  'https://app.nhahanngu.io.vn/api/lookup/certificate',

        adapt: p =>
          makeCert(
            p?.payload?.item ||
              p?.payload?.certificate ||
              p?.item ||
              p?.certificate ||
              p?.data,

            'Nhà Hán Ngữ',
            'Nhà Hán Ngữ'
          )
      }
    ];

    // =====================================================
    // 4. THỰC HIỆN TRA CỨU
    // =====================================================

    let unavailable = 0;

    for (const source of sources) {
      try {
        const separator =
          source.url.includes('?') ? '&' : '?';

        const response = await fetch(
          `${source.url}${separator}code=${encodeURIComponent(target)}`,
          {
            cache: 'no-store',
            headers: {
              Accept: 'application/json'
            }
          }
        );

        // Không có ở nguồn này -> thử nguồn tiếp theo.
        if (response.status === 404) {
          continue;
        }

        // Nguồn lỗi -> vẫn thử nguồn tiếp theo.
        if (!response.ok) {
          unavailable += 1;
          continue;
        }

        const payload = await response.json();

        const cert = source.adapt(payload);

        if (cert) {
          setSearchedCert(cert);

          onShowToast(
            `Đã tìm thấy Giấy chứng nhận: ${target}`
          );

          return;
        }
      } catch {
        unavailable += 1;
      }
    }

    // =====================================================
    // 5. KHÔNG TÌM THẤY
    // =====================================================

    setErrorMsg(
      unavailable === sources.length
        ? 'Các nguồn tra cứu liên thông đang tạm thời không phản hồi. Vui lòng thử lại sau.'
        : `Không tìm thấy Giấy chứng nhận có mã ${target} trong các hệ thống đã kết nối.`
    );
  };

  const handleCopyCode = () => {
    if (!searchedCert) return;

    navigator.clipboard.writeText(searchedCert.code);

    onShowToast(
      'Đã sao chép mã chứng nhận!'
    );
  };

  const handleReset = () => {
    setCertCode('');
    setSearchedCode('');
    setSearchedCert(null);
    setHasSearched(false);
    setErrorMsg('');
  };


  useEffect(()=>{if(!scanOpen)return;let stream:MediaStream|undefined;let timer:number|undefined;let stopped=false;const run=async()=>{try{setScanError('');const Detector=(window as any).BarcodeDetector;if(!Detector)throw new Error('Trình duyệt này chưa hỗ trợ quét QR trực tiếp. Bạn vẫn có thể nhập mã thủ công.');stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play()}const detector=new Detector({formats:['qr_code']});timer=window.setInterval(async()=>{if(stopped||!videoRef.current)return;try{const result=await detector.detect(videoRef.current);const raw=String(result?.[0]?.rawValue||'').trim();if(!raw)return;let code=raw;try{const u=new URL(raw);code=u.searchParams.get('code')||u.pathname.split('/').filter(Boolean).pop()||raw}catch{}stopped=true;if(timer)window.clearInterval(timer);stream?.getTracks().forEach(t=>t.stop());setScanOpen(false);setCertCode(code.toUpperCase());void handleLookup(code)}catch{}},650)}catch(e:any){setScanError(e?.message||'Không thể mở camera.');}};void run();return()=>{stopped=true;if(timer)window.clearInterval(timer);stream?.getTracks().forEach(t=>t.stop())}},[scanOpen]);

  return (
    <div className="bg-[#F5F9FD] pb-16">
      <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-white via-sky-50 to-[#DDEEFF]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0B66C3]/15 blur-3xl"/>
        <div className="pointer-events-none absolute bottom-[-140px] left-[42%] h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"/>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3.5 py-1.5 text-xs font-black text-[#0B66C3] shadow-sm"><ShieldCheck size={14}/>{badgeText}</div>
            <h1 className="mt-5 text-4xl font-black tracking-[-.045em] text-slate-950 sm:text-5xl lg:text-6xl">{titleText}<span className="block text-[#0B66C3]">Sky First Network</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{summaryText}</p>
            <div className="mt-7 rounded-[26px] border border-white bg-white/90 p-4 shadow-[0_18px_50px_rgba(15,94,160,.12)] sm:p-5">
              <label className="text-xs font-black uppercase tracking-wide text-slate-800">{searchLabel}</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input value={certCode} onChange={e=>{setCertCode(e.target.value.toUpperCase());if(errorMsg)setErrorMsg('')}} onKeyDown={e=>{if(e.key==='Enter')void handleLookup()}} placeholder={searchPlaceholder} className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 font-mono text-sm font-bold uppercase tracking-wider outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"/></div><button onClick={()=>void handleLookup()} className="min-h-12 rounded-2xl bg-[#0B66C3] px-6 text-sm font-black text-white shadow-lg shadow-sky-900/10">{searchButtonLabel} →</button><button onClick={()=>setScanOpen(true)} className="min-h-12 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-black text-[#0B66C3] sm:hidden"><Camera size={17} className="inline mr-2"/>Quét QR</button></div>
              {guidanceNote&&<p className="mt-2 text-[11px] leading-5 text-slate-500">{guidanceNote}</p>}
              {errorMsg&&<div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"><AlertCircle size={15}/>{errorMsg}</div>}
            </div>
          </div>
          <div className="relative min-h-[330px]">
            <div className="absolute inset-4 rotate-[-5deg] rounded-[28px] border border-sky-200 bg-white/55 shadow-xl"/>
            <div className="absolute inset-x-8 inset-y-3 rotate-[4deg] rounded-[28px] border border-sky-200 bg-white/70 shadow-xl"/>
            <div className="relative mx-auto mt-6 max-w-lg rounded-[30px] border border-sky-200 bg-white p-7 shadow-[0_28px_70px_rgba(15,94,160,.18)]">
              <div className="flex items-start justify-between"><div><img src="/brand/sky-first-network-web.png" alt="Sky First" className="h-12 w-auto object-contain"/><div className="mt-5 text-xs font-black uppercase tracking-[.16em] text-[#0B66C3]">Giấy chứng nhận điện tử</div><div className="mt-2 text-3xl font-black text-slate-950">Xác thực nhanh.<br/>Đối chiếu minh bạch.</div></div><div className="grid h-16 w-16 place-items-center rounded-2xl bg-sky-50 text-[#0B66C3]"><QrCode size={34}/></div></div>
              <div className="mt-8 h-2 rounded-full bg-gradient-to-r from-[#0B66C3] via-cyan-400 to-sky-100"/>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 size={22}/><div><b className="block text-sm">Xác thực chính thức</b><span className="text-xs">Chỉ hiển thị dữ liệu đã được ghi nhận.</span></div></div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[[stats?.issued??'—','GCN đã phát hành',Award],[stats?.valid??'—','Đang hợp lệ',ShieldCheck],[stats?.programs??'—','Chương trình có GCN',Building],[stats?.updatedAt?new Date(stats.updatedAt).toLocaleDateString('vi-VN'):'—','Cập nhật gần nhất',Calendar]].map(([value,label,Icon]:any)=><div key={label} className="rounded-2xl border border-sky-100 bg-white/85 p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-[#0B66C3]"><Icon size={20}/></span><div><div className="text-2xl font-black tabular-nums text-slate-950">{value}</div><div className="text-xs font-bold text-slate-500">{label}</div></div></div></div>)}</div></div>
      </section>

      {scanOpen&&<div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/75 p-4"><div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-4"><div><h3 className="font-black">Quét QR Giấy chứng nhận</h3><p className="text-xs text-slate-500">Đưa QR vào giữa khung camera.</p></div><button onClick={()=>setScanOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X size={20}/></button></div><div className="relative aspect-square bg-black"><video ref={videoRef} playsInline muted className="h-full w-full object-cover"/><div className="pointer-events-none absolute inset-[14%] rounded-3xl border-2 border-cyan-300 shadow-[0_0_0_999px_rgba(0,0,0,.25)]"/></div>{scanError&&<div className="p-4 text-sm text-rose-600">{scanError}</div>}</div></div>}

      {/* ================================================= */}
      {/* KẾT QUẢ TRA CỨU */}
      {/* ================================================= */}

      {hasSearched && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {searchedCert ? (

            <div className="bg-white rounded-3xl border border-emerald-300 shadow-sm p-6 sm:p-8 space-y-6">

              {/* Header Card */}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">

                <div className="flex items-center gap-2.5">

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    searchedCert.status === 'revoked'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>

                    {searchedCert.status === 'revoked' ? (
                      <AlertCircle size={22} />
                    ) : (
                      <CheckCircle2 size={22} />
                    )}

                  </div>

                  <div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider ${
                        searchedCert.status === 'revoked'
                          ? 'text-rose-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {searchedCert.status === 'revoked'
                        ? 'Giấy chứng nhận đã thu hồi'
                        : 'Giấy chứng nhận hợp lệ'}
                    </span>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      {searchedCert.code}
                    </h3>

                  </div>

                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition"
                    title="Sao chép mã"
                  >
                    <Copy size={13} />
                    <span>Sao chép mã</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition"
                    title="Tra cứu mã khác"
                  >
                    <RotateCcw size={13} />
                    <span>Làm mới</span>
                  </button>

                </div>

              </div>

              {/* Thông tin chính */}

              <div className="space-y-4">

                <div>
                  <div className="text-xs font-medium text-slate-500">
                    Họ và tên người nhận
                  </div>

                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    {searchedCert.recipientName || 'Chưa có thông tin'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">

                  <div className="text-xs font-semibold text-[#0284C7]">
                    Chương trình / Chiến dịch
                  </div>

                  <div className="text-base font-extrabold text-slate-900">
                    {searchedCert.programTitle || 'Giấy chứng nhận'}
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Loại giấy:{' '}
                    <span className="text-slate-800 font-semibold">
                      {searchedCert.certificateType ||
                        searchedCert.programType ||
                        'Giấy chứng nhận'}
                    </span>
                  </div>

                </div>

                {/* Danh sách thông số */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs">

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">

                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Building
                        size={14}
                        className="text-[#0284C7]"
                      />
                      Đơn vị cấp
                    </span>

                    <span className="font-bold text-slate-900 block leading-snug">
                      {searchedCert.issuer ||
                        'Sky First Network'}
                    </span>

                  </div>

                  {searchedCert.sourceSystem && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">

                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <ShieldCheck
                          size={14}
                          className="text-[#0284C7]"
                        />
                        Nguồn dữ liệu
                      </span>

                      <span className="font-bold text-slate-900 block">
                        {searchedCert.sourceSystem}
                      </span>

                    </div>
                  )}

                  {searchedCert.issueDate && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">

                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Calendar
                          size={14}
                          className="text-emerald-600"
                        />
                        Ngày cấp chứng nhận
                      </span>

                      <span className="font-bold text-slate-900 block font-mono">
                        {searchedCert.issueDate}
                      </span>

                    </div>
                  )}

                  {searchedCert.hoursCompleted !== undefined && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">

                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock
                          size={14}
                          className="text-amber-600"
                        />
                        Thời lượng / Cống hiến
                      </span>

                      <span className="font-bold text-slate-900 block">
                        {searchedCert.hoursCompleted} giờ
                      </span>

                    </div>
                  )}

                  {searchedCert.grade && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">

                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Award
                          size={14}
                          className="text-indigo-600"
                        />
                        Xếp loại / Danh hiệu
                      </span>

                      <span className="font-bold text-emerald-700 block">
                        {searchedCert.grade}
                      </span>

                    </div>
                  )}

                </div>

                {(searchedCert.signatory?.name ||
                  searchedCert.signatory?.title) && (
                  <div className="pt-2 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-100">

                    <span>
                      Người ký:{' '}
                      <strong>
                        {searchedCert.signatory?.name ||
                          'Chưa cập nhật'}
                      </strong>

                      {searchedCert.signatory?.title
                        ? ` (${searchedCert.signatory.title})`
                        : ''}
                    </span>

                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      Đã số hóa
                    </span>

                  </div>
                )}

              </div>

            </div>

          ) : (

            <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-6 sm:p-8 text-center space-y-4">

              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <AlertCircle size={28} />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">

                <h3 className="text-lg font-black text-slate-900">
                  Không Tìm Thấy Thông Tin Chứng Nhận
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Hệ thống không tìm thấy hồ sơ dữ liệu tương ứng với mã{' '}
                  <strong className="font-mono text-slate-900">
                    "{searchedCode}"
                  </strong>.
                </p>

                <p className="text-xs text-slate-500 pt-1">
                  Vui lòng kiểm tra lại tính chính xác của mã Giấy chứng nhận hoặc liên hệ Sky First Network để được hỗ trợ kiểm tra.
                </p>

              </div>

              <div className="pt-2">

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Thử tra cứu mã khác</span>
                </button>

              </div>

            </div>

          )}

        </section>
      )}

      {/* ================================================= */}
      {/* QUY CHUẨN MINH BẠCH */}
      {/* ================================================= */}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="space-y-1">

            <div className="flex items-center gap-2 text-xs font-black text-[#0284C7] uppercase">

              <ShieldCheck
                size={16}
                className="text-[#0284C7]"
              />

              <span>{certFeature1Title}</span>

            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {certFeature1Desc}
            </p>

          </div>

          <div className="space-y-1">

            <div className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase">

              <FileCheck
                size={16}
                className="text-emerald-500"
              />

              <span>{certFeature2Title}</span>

            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {certFeature2Desc}
            </p>

          </div>

          <div className="space-y-1">

            <div className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase">

              <Sparkles
                size={16}
                className="text-amber-500"
              />

              <span>{certFeature3Title}</span>

            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {certFeature3Desc}
            </p>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* NỘI DUNG BỔ SUNG */}
      {/* ================================================= */}

      {(pageData?.contentFormatted ||
        pageData?.content) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-700 leading-relaxed formatted-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(pageData.contentFormatted || pageData.content)
            }}
          />

        </section>
      )}

      {/* ================================================= */}
      {/* CTA HỖ TRỢ */}
      {/* ================================================= */}

      {certCtaTitle && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">

          <div className="p-7 sm:p-8 rounded-3xl bg-linear-to-br from-sky-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">

            <div className="space-y-1.5 text-center sm:text-left">

              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                {certCtaTitle}
              </h3>

              {certCtaDescription && (
                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-xl font-normal">
                  {certCtaDescription}
                </p>
              )}

            </div>

            {(certCtaButtonLabel ||
              pageData?.buttonLabel) && (
              <a
                href={
                  certCtaButtonUrl ||
                  pageData?.buttonUrl ||
                  '/contact'
                }
                className="px-5 py-2.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-xs transition shadow-sm whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {certCtaButtonLabel ||
                    pageData?.buttonLabel ||
                    'Liên Hệ Ban Chấp hành'}
                </span>
              </a>
            )}

          </div>

        </section>
      )}

    </div>
  );
};
