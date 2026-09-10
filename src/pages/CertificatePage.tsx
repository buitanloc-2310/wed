import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';

import { CERTIFICATES_DATABASE } from '../data/mockData';
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
    pageData?.badge || 'XÁC THỰC GIẤY CHỨNG NHẬN';

  const titleText =
    pageData?.title || 'Tra cứu Giấy chứng nhận';

  const summaryText =
    pageData?.summary ||
    'Nhập mã định danh trên Giấy chứng nhận để xác thực thông tin thành tích, khóa học hoặc chiến dịch tình nguyện từ Sky First Network.';

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

    const localFound =
      dynamicFound ||
      CERTIFICATES_DATABASE[target];

    if (localFound) {
      setSearchedCert(localFound);
      onShowToast(`Đã tìm thấy Giấy chứng nhận: ${target}`);
      return;
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
          'https://ctt.sfec.skyfirst.io.vn/api/lookup/certificate',

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
          'https://ctt.nhahanngu.io.vn/api/lookup/certificate',

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

  return (
    <div className="space-y-10 py-6 sm:py-10">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7] shadow-2xs">
            <ShieldCheck
              size={14}
              className="text-[#0284C7]"
            />

            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {titleText}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {summaryText}
          </p>

        </div>
      </section>

      {/* ================================================= */}
      {/* SEARCH BOX */}
      {/* ================================================= */}

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5">

          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            {searchLabel}
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">

            <div className="relative flex-1">

              <input
                type="text"
                value={certCode}
                onChange={e => {
                  setCertCode(
                    e.target.value.toUpperCase()
                  );

                  if (errorMsg) {
                    setErrorMsg('');
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleLookup();
                  }
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none font-mono font-bold text-sm tracking-wider uppercase transition shadow-2xs"
              />

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

            <button
              type="button"
              onClick={() => handleLookup()}
              className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20 cursor-pointer"
            >
              <Search size={16} />
              <span>{searchButtonLabel}</span>
            </button>

            {(certCode || hasSearched) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Làm mới kết quả"
              >
                <RotateCcw size={14} />
                <span>{resetButtonLabel}</span>
              </button>
            )}

          </div>

          {guidanceNote && (
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              *{guidanceNote}
            </p>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">

              <AlertCircle
                size={15}
                className="flex-shrink-0"
              />

              <span>{errorMsg}</span>

            </div>
          )}

        </div>
      </section>

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
              __html:
                pageData.contentFormatted ||
                pageData.content
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
