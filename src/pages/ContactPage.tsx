import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Globe, 
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onShowToast }) => {
  const { siteConfig, networkUnits, customPages } = useDataContext();

  const pageData = customPages.find(p => p.slug === 'contact' || p.id === 'page-contact');
  const badgeText = pageData?.badge || 'KẾT NỐI & HỢP TÁC CÙNG Sky First Network';
  const titleText = pageData?.title || 'Liên Hệ Với Chúng Tôi';
  const subtitleText = pageData?.summary || 'Ban Điều hành Sky First Network luôn sẵn sàng lắng nghe, tư vấn và đồng hành cùng quý đối tác doanh nghiệp, các cơ quan báo chí, nhà trường và các bạn trẻ trên toàn quốc.';
  const emailText = pageData?.email || siteConfig.email;
  const secondaryEmailText = pageData?.secondaryEmail || 'contact@skyfirst.network';
  const hotlineText = pageData?.hotline || siteConfig.hotline;
  const secondaryHotlineText = pageData?.secondaryHotline || '0912 838 xxx (Đối ngoại)';
  const workHoursWeekdays = pageData?.workHoursWeekdays || '08:30 - 18:00';
  const workHoursSaturday = pageData?.workHoursSaturday || '08:30 - 12:00';
  const facebookUrl = pageData?.facebookUrl || 'https://facebook.com/skyfirstnetwork';
  const linkedinUrl = pageData?.linkedinUrl || 'https://linkedin.com/company/skyfirstnetwork';

  const contactFormTitle = pageData?.contactFormTitle || 'Gửi Tin Nhắn Đến Ban Điều Hành';
  const contactFormDescription = pageData?.contactFormDescription || 'Vui lòng điền đầy đủ các thông tin bên dưới. Hệ thống sẽ điều phối thư đến đúng phòng ban và đơn vị liên quan.';
  const contactSubmitButtonLabel = pageData?.contactSubmitButtonLabel || 'Gửi Tin Nhắn Đến SFN';

  const contactUnitsTitle = pageData?.contactUnitsTitle || 'Đầu Mối 5 Đơn Vị Trực Thuộc';
  const contactUnitsSubtitle = pageData?.contactUnitsSubtitle || 'Liên hệ chuyên biệt theo từng mảng chuyên môn của mạng lưới:';

  const contactFaqTitle = pageData?.contactFaqTitle || 'Câu Hỏi Thường Gặp Về Liên Hệ';

  const contactCtaTitle = pageData?.contactCtaTitle || 'Bạn quan tâm đến các chương trình & dự án cụ thể?';
  const contactCtaDescription = pageData?.contactCtaDescription || 'Khám phá danh sách các khóa học SFEC, chiến dịch tình nguyện và đề tài nghiên cứu đang mở đăng ký.';
  const buttonLabel = pageData?.buttonLabel || 'Xem Chương Trình';
  const buttonUrl = pageData?.buttonUrl || '/programs';
  const secondaryButtonLabel = pageData?.secondaryButtonLabel || 'Trang Tài Trợ';
  const secondaryButtonUrl = pageData?.secondaryButtonUrl || '/sponsor';

  // Unified Contact Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [targetUnit, setTargetUnit] = useState('SFN-CORE');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion (Default closed, opens only when user clicks)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onShowToast('Gửi thông tin liên hệ thành công! Ban Điều hành Sky First Network sẽ phản hồi sớm nhất.');
    }, 600);
  };

  const contactCategories = [
    { id: 'general', label: 'Liên hệ chung & Đóng góp ý kiến' },
    { id: 'sponsor', label: 'Tài trợ & Đồng hành dự án (CSR)' },
    { id: 'education', label: 'Hợp tác đào tạo kỹ năng & Workshop (SFEC)' },
    { id: 'volunteer', label: 'Hoạt động tình nguyện & Dự án cộng đồng (SFYC)' },
    { id: 'research', label: 'Nghiên cứu & Khảo sát xã hội (SFIR)' },
    { id: 'media', label: 'Báo chí & Bảo trợ truyền thông (SFMC)' },
    { id: 'certificate', label: 'Xác thực & Khiếu nại Giấy chứng nhận số (SFCA)' },
  ];

  const contactFaqs = [
    {
      q: pageData?.contactFaq1Q || 'Thời gian Ban Điều hành Sky First Network tiếp nhận và phản hồi email là bao lâu?',
      a: pageData?.contactFaq1A || 'Toàn bộ thư từ và yêu cầu kết nối qua hòm thư điện tử hoặc biểu mẫu trực tuyến đều được phân loại và phản hồi chính thức trong vòng 24 - 48 giờ làm việc.'
    },
    {
      q: pageData?.contactFaq2Q || 'Tôi muốn đặt lịch làm việc trực tiếp tại văn phòng SFN thì cần làm gì?',
      a: pageData?.contactFaq2A || 'Quý đối tác hoặc các bạn trẻ vui lòng gửi thông tin trước qua biểu mẫu bên dưới hoặc gọi tới hotline điều phối (0337 775 329) trước ít nhất 01 ngày làm việc để ban thư ký sắp xếp tiếp đón chu đáo.'
    },
    {
      q: pageData?.contactFaq3Q || 'Làm thế nào để liên hệ trực tiếp với người phụ trách từng đơn vị trực thuộc?',
      a: pageData?.contactFaq3A || 'Bạn có thể chọn trực tiếp đơn vị mong muốn (SFEC, SFYC, SFIR, SFMC, SFCA) tại mục "Đơn vị muốn kết nối" trong biểu mẫu liên hệ, thông tin sẽ được tự động gửi tới email nội bộ của trưởng đơn vị đó.'
    },
    {
      q: pageData?.contactFaq4Q || '',
      a: pageData?.contactFaq4A || ''
    }
  ].filter(f => f.q && f.a);

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 overflow-hidden">
      
      {/* 1. Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7] shadow-2xs">
            <MessageSquare size={15} className="text-[#0284C7]" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {titleText}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            {subtitleText}
          </p>
        </motion.div>
      </section>

      {/* 2. Key Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-3xl border border-sky-100 shadow-2xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-black">
              <Mail size={22} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Hòm thư điện tử</div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Email Chính Thức</h3>
            </div>
            <div className="space-y-1 text-xs text-slate-600 font-mono">
              <p className="hover:text-[#0284C7] transition">{emailText}</p>
              <p className="hover:text-[#0284C7] transition">{secondaryEmailText}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: 0.12 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-3xl border border-emerald-100 shadow-2xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Phone size={22} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Tổng đài tiếp nhận</div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Hotline Trực Tuyến</h3>
            </div>
            <div className="space-y-1 text-xs text-slate-600 font-mono">
              <p className="font-bold text-emerald-700">{hotlineText} (Chung)</p>
              <p>{secondaryHotlineText}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: 0.19 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-3xl border border-amber-100 shadow-2xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Clock size={22} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Khung giờ tiếp nhận</div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Thời Gian Làm Việc</h3>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <p><strong>Thứ 2 - Thứ 6:</strong> {workHoursWeekdays}</p>
              <p><strong>Thứ 7:</strong> {workHoursSaturday}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: 0.26 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-3xl border border-indigo-100 shadow-2xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Globe size={22} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Nền tảng truyền thông</div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Mạng Xã Hội SFN</h3>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-bold text-indigo-600 truncate">{facebookUrl.replace(/^https?:\/\//, '')}</p>
              <p className="truncate">{linkedinUrl.replace(/^https?:\/\//, '')}</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Contact Form & Unit Quick Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-xs font-bold text-[#0284C7]">
                <Send size={13} />
                <span>BIỂU MẪU TIẾP NHẬN TRỰC TUYẾN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {contactFormTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {contactFormDescription}
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-emerald-900">
                    Gửi Thông Tin Liên Hệ Thành Công!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Cảm ơn bạn <strong>{fullName}</strong>. Yêu cầu của bạn đã được chuyển đến bộ phận phụ trách. Thư xác nhận và phản hồi sẽ được gửi qua email <strong>{email}</strong>.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setOrganization('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Gửi thêm nội dung khác
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4.5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Họ và tên của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Email liên hệ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Cơ quan / Tổ chức / Trường học (nếu có)
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Công ty / Trường Đại học..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Mục đích liên hệ <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] bg-white transition"
                    >
                      {contactCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Đơn vị phụ trách muốn gửi tới
                    </label>
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] bg-white transition"
                    >
                      <option value="SFN-CORE">Ban Điều Hành Mạng Lưới SFN (Chung)</option>
                      <option value="SFEC">Trung Tâm Giáo Dục SFEC (Đào tạo & Kỹ năng)</option>
                      <option value="SFYC">Ban Chỉ Huy Lực Lượng Tình Nguyện SFYC</option>
                      <option value="SFIR">Viện Nghiên Cứu Đổi Mới Xã Hội SFIR</option>
                      <option value="SFMC">Trung Tâm Truyền Thông & Sáng Tạo SFMC</option>
                      <option value="SFCA">Ban Quản Lý & Xác Thực Chứng Nhận Số SFCA</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Tiêu đề yêu cầu / Thư ngỏ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ví dụ: Đề xuất tài trợ học bổng / Đăng ký hợp tác tổ chức hội thảo..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Nội dung chi tiết <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mô tả cụ thể mong muốn hợp tác, thời gian, quy mô hoặc câu hỏi bạn cần SFN giải đáp..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0284C7] transition resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#00A3FF] via-[#0284C7] to-[#2563EB] hover:from-[#0284C7] hover:to-[#1D4ED8] text-white font-extrabold text-sm rounded-xl transition shadow-md shadow-sky-400/25 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>{contactSubmitButtonLabel}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </motion.div>

          {/* Right Column: 5 Units Directory & Quick FAQs (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* 5 Units Directory */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  {contactUnitsTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {contactUnitsSubtitle}
                </p>
              </div>

              <div className="space-y-2.5">
                {networkUnits.map((unit) => (
                  <div 
                    key={unit.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[#0284C7] bg-sky-50 px-1.5 py-0.5 rounded text-[10px] border border-sky-100">
                          {unit.code}
                        </span>
                        <span className="font-bold text-slate-900 line-clamp-1">{unit.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        {unit.contact.email} • {unit.contact.phone}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setTargetUnit(unit.code);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white font-bold text-[11px] rounded-lg transition flex-shrink-0"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <HelpCircle size={16} className="text-[#0284C7]" />
                <h4 className="text-sm font-black text-slate-900">{contactFaqTitle}</h4>
              </div>

              <div className="space-y-2.5">
                {contactFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-slate-50 transition text-xs font-bold text-slate-800"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={14} className="text-[#0284C7] flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2 bg-slate-50/50">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* 5. Navigation shortcut banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="p-6 sm:p-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {contactCtaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {contactCtaDescription}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (buttonUrl.startsWith('http')) {
                  window.open(buttonUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate((buttonUrl.replace(/^\//, '') || 'programs') as PageRoute);
                }
              }}
              className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
            >
              {buttonLabel}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (secondaryButtonUrl.startsWith('http')) {
                  window.open(secondaryButtonUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate((secondaryButtonUrl.replace(/^\//, '') || 'sponsor') as PageRoute);
                }
              }}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {secondaryButtonLabel}
            </motion.button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
