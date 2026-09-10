import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  Send,
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDataContext } from '../context/DataContext';
import { PageRoute, Program } from '../types';
import { getProgramSlug } from '../utils/slug';
import { ImagePlaceholder } from '../components/ImagePlaceholder';

interface ProgramDetailPageProps {
  programSlugOrId: string;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (message: string) => void;
  onSelectProgram?: (program: Program) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({
  programSlugOrId,
  onNavigate,
  onShowToast,
  onSelectProgram
}) => {
  const { programs } = useDataContext();

  // Find program by slug or id
  const program = programs.find(
    (p) =>
      getProgramSlug(p) === programSlugOrId ||
      p.id === programSlugOrId ||
      (p.slug && p.slug === programSlugOrId)
  );

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [motivation, setMotivation] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');

  if (!program) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Không Tìm Thấy Chương Trình
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Đường dẫn chương trình hoặc dự án này có thể đã thay đổi hoặc đang được điều chỉnh trong hệ thống.
        </p>
        <button
          type="button"
          onClick={() => {
            onNavigate('programs');
            window.history.pushState({}, '', '/programs');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm rounded-xl shadow-sm transition"
        >
          <ArrowLeft size={16} />
          <span>Xem Tất Cả Chương Trình & Dự Án</span>
        </button>
      </div>
    );
  }

  const currentSlug = getProgramSlug(program);
  const fullPublicUrl = typeof window !== 'undefined' ? `${window.location.origin}/du-an/${currentSlug}` : `/du-an/${currentSlug}`;

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullPublicUrl);
      onShowToast(`Đã sao chép liên kết dự án: /du-an/${currentSlug}`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !organization.trim() || !motivation.trim()) {
      onShowToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    if (!agreeTerms) {
      onShowToast('Vui lòng xác nhận cam kết tham gia chương trình');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const code = `SKYFIRST-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setApplicationCode(code);
      setIsSubmitting(false);
      setIsSuccess(true);
      onShowToast(`Đăng ký thành công! Mã hồ sơ của bạn là ${code}`);
    }, 900);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setBirthYear('');
    setPortfolioUrl('');
    setMotivation('');
    setAgreeTerms(false);
    setIsSuccess(false);
  };

  const scrollToRegister = () => {
    const el = document.getElementById('dang-ky-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const statusColors = {
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
    closed: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      {/* Draft Warning Banner */}
      {program.isPublished === false && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
          <AlertTriangle size={15} />
          <span>Đây là bản nháp nội bộ — Dự án chưa được xuất bản chính thức trên website công khai.</span>
        </div>
      )}

      {/* Top Header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <button
              onClick={() => {
                onNavigate('home');
                window.history.pushState({}, '', '/home');
              }}
              className="hover:text-[#0284C7] font-medium"
            >
              Trang chủ
            </button>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <button
              onClick={() => {
                onNavigate('programs');
                window.history.pushState({}, '', '/programs');
              }}
              className="hover:text-[#0284C7] font-medium"
            >
              Chương trình & Dự án
            </button>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {program.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              title="Sao chép liên kết URL dự án này"
            >
              <Copy size={13} />
              <span className="hidden sm:inline">Sao chép link</span>
            </button>
            <button
              type="button"
              onClick={scrollToRegister}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              <Send size={13} />
              <span>Đăng Ký Ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Column (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Badges */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-sky-50 text-[#0284C7] border border-sky-200 rounded-full text-xs font-black tracking-wide uppercase">
                  {program.categoryLabel}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[program.status] || statusColors.open}`}>
                  {program.statusLabel}
                </span>
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-0.5 rounded-md">
                  URL: /du-an/{currentSlug}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {program.title}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {program.summary}
              </p>

              {/* Cover Image */}
              <div className="pt-2">
                <ImagePlaceholder
                  imageUrl={program.imageUrl}
                  sizeText="16:9 (1200x675px)"
                  description={`Hình ảnh dự án: ${program.title}`}
                  aspectRatio="video"
                  theme={program.theme || 'sky'}
                  className="rounded-2xl overflow-hidden shadow-xs"
                />
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                    <Calendar size={13} className="text-[#0284C7]" /> Thời gian
                  </span>
                  <p className="text-xs font-bold text-slate-900">{program.date}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                    <MapPin size={13} className="text-rose-500" /> Địa điểm
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate" title={program.location}>
                    {program.location}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                    <Users size={13} className="text-emerald-500" /> Đối tượng
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate" title={program.targetAudience}>
                    {program.targetAudience}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                    <Clock size={13} className="text-amber-500" /> Chỉ tiêu
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {program.spotsLeft ? `${program.spotsLeft} suất mở` : 'Theo đợt'}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                Mô Tả Chi Tiết & Mục Tiêu Dự Án
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {program.description}
              </p>
            </div>

            {/* Timeline & Steps */}
            {program.timeline && program.timeline.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock size={20} className="text-[#0284C7]" />
                  Lộ Trình Triển Khai Chi Tiết
                </h2>
                <div className="space-y-3 pt-2">
                  {program.timeline.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <span className="font-medium leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Benefits */}
              {program.benefits && program.benefits.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Award size={18} className="text-emerald-600" />
                    Quyền Lợi Tham Gia
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {program.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {program.requirements && program.requirements.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles size={18} className="text-sky-600" />
                    Yêu Cầu & Tiêu Chí
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {program.requirements.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                        <span className="leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Registration Form Section (Anchor #dang-ky-form) */}
            <div id="dang-ky-form" className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-500/30 shadow-lg shadow-sky-500/5 scroll-mt-28 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#0284C7] rounded-full text-xs font-black mb-2">
                  <Send size={13} />
                  <span>CỔNG ĐĂNG KÝ TRỰC TUYẾN</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Đơn Đăng Ký Tham Gia Dự Án
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Vui lòng điền thông tin chính xác để Ban Chấp hành Sky First Network liên hệ hướng dẫn các bước tiếp theo.
                </p>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/25">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-emerald-900">
                      Gửi Đơn Đăng Ký Thành Công!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                      Cảm ơn bạn <strong>{fullName}</strong> đã đăng ký tham gia chương trình. Ban tổ chức đã ghi nhận hồ sơ của bạn.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-emerald-200 max-w-sm mx-auto">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      Mã hồ sơ tiếp nhận
                    </span>
                    <span className="text-lg font-mono font-black text-emerald-700">
                      {applicationCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                    >
                      Đăng ký hồ sơ khác
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('programs');
                        window.history.pushState({}, '', '/programs');
                      }}
                      className="px-4 py-2 bg-[#0284C7] text-white rounded-xl text-xs font-bold hover:bg-[#0369A1] transition"
                    >
                      Khám phá thêm dự án
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Selected Program Indicator */}
                  <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Chương trình đăng ký:</span>
                    <span className="font-extrabold text-[#0284C7]">{program.title}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Minh Anh"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Email liên hệ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09xx xxx xxx"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Trường học / Đơn vị công tác <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Ví dụ: ĐH Quốc Gia TP.HCM"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Năm sinh (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="Ví dụ: 2004"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Link CV / Hồ sơ / Facebook (tùy chọn)
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Lý do tham gia & Mục tiêu của bạn <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Chia sẻ lý do bạn mong muốn đồng hành cùng dự án này và những kỳ vọng bạn muốn đạt được..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded-sm text-[#0284C7] focus:ring-sky-400 border-slate-300"
                    />
                    <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-relaxed select-none">
                      Tôi cam kết thông tin cung cấp là chính xác, đồng thời sẵn sàng tham gia đầy đủ các buổi tập huấn và hoạt động theo quy chế của Sky First Network.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#2563EB] hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Đang gửi hồ sơ...
                      </span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Nộp Đơn Đăng Ký Dự Án</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Column (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Chia Sẻ Dự Án Này
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lan tỏa cơ hội ý nghĩa này đến bạn bè, câu lạc bộ hoặc đội nhóm tình nguyện của bạn.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullPublicUrl}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold transition shrink-0"
                  title="Sao chép"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Other Programs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Chương Trình Cùng Mạng Lưới
              </h3>

              <div className="space-y-3">
                {programs
                  .filter((p) => p.id !== program.id)
                  .slice(0, 3)
                  .map((otherProg) => {
                    const otherSlug = getProgramSlug(otherProg);
                    return (
                      <div
                        key={otherProg.id}
                        onClick={() => {
                          window.history.pushState({}, '', `/du-an/${otherSlug}`);
                          if (onSelectProgram) onSelectProgram(otherProg);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-3 bg-slate-50 hover:bg-sky-50/60 rounded-2xl border border-slate-100 hover:border-sky-200 transition cursor-pointer group space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#0284C7] font-bold">{otherProg.categoryLabel}</span>
                          <span className="text-slate-400">{otherProg.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2 leading-snug">
                          {otherProg.title}
                        </h4>
                      </div>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => {
                  onNavigate('programs');
                  window.history.pushState({}, '', '/programs');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition text-center block"
              >
                Xem tất cả chương trình
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
