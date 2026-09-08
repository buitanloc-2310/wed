import React from 'react';
import { 
  Mail, 
  Phone, 
  Clock, 
  Globe, 
  Send, 
  Sparkles, 
  Building2, 
  HelpCircle, 
  Compass
} from 'lucide-react';

interface ContactEditorFieldsProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  // 4 Key Contact Cards
  email: string;
  setEmail: (val: string) => void;
  secondaryEmail: string;
  setSecondaryEmail: (val: string) => void;
  hotline: string;
  setHotline: (val: string) => void;
  secondaryHotline: string;
  setSecondaryHotline: (val: string) => void;
  workHoursWeekdays: string;
  setWorkHoursWeekdays: (val: string) => void;
  workHoursSaturday: string;
  setWorkHoursSaturday: (val: string) => void;
  facebookUrl: string;
  setFacebookUrl: (val: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (val: string) => void;
  // Form details
  contactFormTitle: string;
  setContactFormTitle: (val: string) => void;
  contactFormDescription: string;
  setContactFormDescription: (val: string) => void;
  contactSubmitButtonLabel: string;
  setContactSubmitButtonLabel: (val: string) => void;
  // Units Directory (Right column top)
  contactUnitsTitle: string;
  setContactUnitsTitle: (val: string) => void;
  contactUnitsSubtitle: string;
  setContactUnitsSubtitle: (val: string) => void;
  // FAQs (Right column bottom)
  contactFaqTitle: string;
  setContactFaqTitle: (val: string) => void;
  contactFaq1Q: string;
  setContactFaq1Q: (val: string) => void;
  contactFaq1A: string;
  setContactFaq1A: (val: string) => void;
  contactFaq2Q: string;
  setContactFaq2Q: (val: string) => void;
  contactFaq2A: string;
  setContactFaq2A: (val: string) => void;
  contactFaq3Q: string;
  setContactFaq3Q: (val: string) => void;
  contactFaq3A: string;
  setContactFaq3A: (val: string) => void;
  contactFaq4Q: string;
  setContactFaq4Q: (val: string) => void;
  contactFaq4A: string;
  setContactFaq4A: (val: string) => void;
  // Bottom banner details
  contactCtaTitle: string;
  setContactCtaTitle: (val: string) => void;
  contactCtaDescription: string;
  setContactCtaDescription: (val: string) => void;
  buttonLabel: string;
  setButtonLabel: (val: string) => void;
  buttonUrl: string;
  setButtonUrl: (val: string) => void;
  secondaryButtonLabel: string;
  setSecondaryButtonLabel: (val: string) => void;
  secondaryButtonUrl: string;
  setSecondaryButtonUrl: (val: string) => void;
}

export const ContactEditorFields: React.FC<ContactEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  email,
  setEmail,
  secondaryEmail,
  setSecondaryEmail,
  hotline,
  setHotline,
  secondaryHotline,
  setSecondaryHotline,
  workHoursWeekdays,
  setWorkHoursWeekdays,
  workHoursSaturday,
  setWorkHoursSaturday,
  facebookUrl,
  setFacebookUrl,
  linkedinUrl,
  setLinkedinUrl,
  contactFormTitle,
  setContactFormTitle,
  contactFormDescription,
  setContactFormDescription,
  contactSubmitButtonLabel,
  setContactSubmitButtonLabel,
  contactUnitsTitle,
  setContactUnitsTitle,
  contactUnitsSubtitle,
  setContactUnitsSubtitle,
  contactFaqTitle,
  setContactFaqTitle,
  contactFaq1Q,
  setContactFaq1Q,
  contactFaq1A,
  setContactFaq1A,
  contactFaq2Q,
  setContactFaq2Q,
  contactFaq2A,
  setContactFaq2A,
  contactFaq3Q,
  setContactFaq3Q,
  contactFaq3A,
  setContactFaq3A,
  contactFaq4Q,
  setContactFaq4Q,
  contactFaq4A,
  setContactFaq4A,
  contactCtaTitle,
  setContactCtaTitle,
  contactCtaDescription,
  setContactCtaDescription,
  buttonLabel,
  setButtonLabel,
  buttonUrl,
  setButtonUrl,
  secondaryButtonLabel,
  setSecondaryButtonLabel,
  secondaryButtonUrl,
  setSecondaryButtonUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Khối Đầu Trang (Hero Banner) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Hero Banner - /contact)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Phần mở đầu trang Liên Hệ Với Chúng Tôi
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Huy hiệu nổi bật (Badge)
          </label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="KẾT NỐI & HỢP TÁC CÙNG Sky First Network"
            className="w-full text-xs font-bold text-[#0284C7] px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tiêu đề trang <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Liên Hệ Với Chúng Tôi"
            className="w-full text-xl sm:text-2xl font-black text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Đoạn văn mở đầu (Mô tả giới thiệu phụ)
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ban Điều hành Sky First Network luôn sẵn sàng lắng nghe, tư vấn và đồng hành..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Khối Kênh Tiếp Nhận & Kết Nối Trực Tiếp (4 Thẻ Thông Tin) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Kênh Tiếp Nhận & Kết Nối Trực Tiếp (4 Thẻ Thông Tin)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            4 Thẻ tiếp nhận: Email, Hotline, Giờ làm việc và Mạng xã hội
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Thẻ 1: Email */}
          <div className="p-4 rounded-xl bg-sky-50/40 border border-sky-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0284C7]">
              <Mail size={14} />
              <span>Thẻ 1: Hòm thư điện tử (Email)</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Email chính thức
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="skyfirst.ec@gmail.com"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Email phụ / Tiếp nhận chung
              </label>
              <input
                type="text"
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
                placeholder="contact@skyfirst.network"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Thẻ 2: Hotline */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
              <Phone size={14} />
              <span>Thẻ 2: Tổng đài tiếp nhận (Hotline)</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Hotline chính (Điều phối chung)
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="0337 775 329"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Hotline phụ / Ban Đối ngoại
              </label>
              <input
                type="text"
                value={secondaryHotline}
                onChange={(e) => setSecondaryHotline(e.target.value)}
                placeholder="0912 838 xxx (Đối ngoại)"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Thẻ 3: Thời Gian Làm Việc */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
              <Clock size={14} />
              <span>Thẻ 3: Khung giờ làm việc</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thứ 2 - Thứ 6
              </label>
              <input
                type="text"
                value={workHoursWeekdays}
                onChange={(e) => setWorkHoursWeekdays(e.target.value)}
                placeholder="08:30 - 18:00"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thứ 7
              </label>
              <input
                type="text"
                value={workHoursSaturday}
                onChange={(e) => setWorkHoursSaturday(e.target.value)}
                placeholder="08:30 - 12:00"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* Thẻ 4: Mạng Xã Hội */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
              <Globe size={14} />
              <span>Thẻ 4: Mạng xã hội SFN</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Facebook Fanpage
              </label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/skyfirstnetwork"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                LinkedIn Trang Mạng Lưới
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/skyfirstnetwork"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Khối Biểu Mẫu Gửi Tin Nhắn Trực Tuyến */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Send size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Cấu Hình Biểu Mẫu Gửi Tin Nhắn Trực Tuyến
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Form tiếp nhận thư gửi trực tiếp đến ban điều hành (Cột trái)
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề biểu mẫu
            </label>
            <input
              type="text"
              value={contactFormTitle}
              onChange={(e) => setContactFormTitle(e.target.value)}
              placeholder="Gửi Tin Nhắn Đến Ban Điều Hành"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn mô tả hướng dẫn
            </label>
            <textarea
              rows={2}
              value={contactFormDescription}
              onChange={(e) => setContactFormDescription(e.target.value)}
              placeholder="Vui lòng điền đầy đủ các thông tin bên dưới. Hệ thống sẽ điều phối thư đến đúng phòng ban và đơn vị liên quan."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên nút gửi tin nhắn
            </label>
            <input
              type="text"
              value={contactSubmitButtonLabel}
              onChange={(e) => setContactSubmitButtonLabel(e.target.value)}
              placeholder="Gửi Tin Nhắn Đến SFN"
              className="w-full text-xs px-3 py-2 bg-[#0284C7] text-white font-bold rounded-xl focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Biểu mẫu gửi tin nhắn thực hiện gửi trực tiếp và hiển thị màn hình thông báo phản hồi tự động.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Khối Đầu Mối 5 Đơn Vị Trực Thuộc (Cột phải trên) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Khối Đầu Mối 5 Đơn Vị Trực Thuộc (Cột Phải Trên)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Danh bạ chuyên biệt từng đơn vị SFEC, SFYC, SFIR, SFMC, SFCA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối đơn vị
            </label>
            <input
              type="text"
              value={contactUnitsTitle}
              onChange={(e) => setContactUnitsTitle(e.target.value)}
              placeholder="Đầu Mối 5 Đơn Vị Trực Thuộc"
              className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dòng mô tả phụ
            </label>
            <input
              type="text"
              value={contactUnitsSubtitle}
              onChange={(e) => setContactUnitsSubtitle(e.target.value)}
              placeholder="Liên hệ chuyên biệt theo từng mảng chuyên môn của mạng lưới:"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-[#0284C7] flex items-center gap-1">
            <Building2 size={13} />
            <span>Tự động đồng bộ hóa cùng Hệ Sinh Thái Mạng Lưới:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Danh sách các đơn vị trực thuộc (SFEC, SFYC, SFIR, SFMC, SFCA) cùng email và số điện thoại phụ trách được liên kết tự động từ mục Quản Lý Đơn Vị Mạng Lưới để người gửi có thể bấm chọn kết nối ngay lập tức.
          </p>
        </div>
      </div>

      {/* 5. Khối Câu Hỏi Thường Gặp Về Liên Hệ (Contact FAQs) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              5. Khối Câu Hỏi Thường Gặp Về Liên Hệ (Contact FAQs - Cột Phải Dưới)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Hộp mở/đóng giải đáp thắc mắc liên hệ
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tiêu đề khối FAQ
          </label>
          <input
            type="text"
            value={contactFaqTitle}
            onChange={(e) => setContactFaqTitle(e.target.value)}
            placeholder="Câu Hỏi Thường Gặp Về Liên Hệ"
            className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div className="space-y-4 pt-2">
          {/* FAQ 1 */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#0284C7]">Câu hỏi 1:</span>
            <input
              type="text"
              value={contactFaq1Q}
              onChange={(e) => setContactFaq1Q(e.target.value)}
              placeholder="Thời gian Ban Điều hành Sky First Network tiếp nhận và phản hồi email là bao lâu?"
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq1A}
              onChange={(e) => setContactFaq1A(e.target.value)}
              placeholder="Toàn bộ thư từ và yêu cầu kết nối..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* FAQ 2 */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#0284C7]">Câu hỏi 2:</span>
            <input
              type="text"
              value={contactFaq2Q}
              onChange={(e) => setContactFaq2Q(e.target.value)}
              placeholder="Tôi muốn đặt lịch làm việc trực tiếp tại văn phòng SFN thì cần làm gì?"
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq2A}
              onChange={(e) => setContactFaq2A(e.target.value)}
              placeholder="Quý đối tác hoặc các bạn trẻ vui lòng gửi thông tin trước qua biểu mẫu..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* FAQ 3 */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#0284C7]">Câu hỏi 3:</span>
            <input
              type="text"
              value={contactFaq3Q}
              onChange={(e) => setContactFaq3Q(e.target.value)}
              placeholder="Làm thế nào để liên hệ trực tiếp với người phụ trách từng đơn vị trực thuộc?"
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq3A}
              onChange={(e) => setContactFaq3A(e.target.value)}
              placeholder="Bạn có thể chọn trực tiếp đơn vị mong muốn (SFEC, SFYC, SFIR, SFMC, SFCA)..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* FAQ 4 (Tùy chọn) */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-500">Câu hỏi 4 (Tùy chọn thêm):</span>
            <input
              type="text"
              value={contactFaq4Q}
              onChange={(e) => setContactFaq4Q(e.target.value)}
              placeholder="Nhập câu hỏi thường gặp số 4 (nếu có)..."
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq4A}
              onChange={(e) => setContactFaq4A(e.target.value)}
              placeholder="Nhập câu trả lời giải đáp..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 6. Khối Điều Hướng Chương Trình & Dự Án (Banner cuối trang) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              6. Khối Điều Hướng Chương Trình & Dự Án (Banner Cuối Trang)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Banner chân trang điều hướng đến chương trình & tài trợ
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề banner
            </label>
            <input
              type="text"
              value={contactCtaTitle}
              onChange={(e) => setContactCtaTitle(e.target.value)}
              placeholder="Bạn quan tâm đến các chương trình & dự án cụ thể?"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả
            </label>
            <textarea
              rows={2}
              value={contactCtaDescription}
              onChange={(e) => setContactCtaDescription(e.target.value)}
              placeholder="Khám phá danh sách các khóa học SFEC, chiến dịch tình nguyện và đề tài nghiên cứu đang mở đăng ký."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nút 1 */}
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <span className="text-xs font-extrabold text-[#0284C7] block">
                Nút hành động 1 (Xem Chương Trình)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={buttonLabel}
                  onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="Xem Chương Trình"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Liên kết trỏ đến
                </label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="/programs"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Nút 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-extrabold text-slate-700 block">
                Nút hành động 2 (Trang Tài Trợ)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={secondaryButtonLabel}
                  onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                  placeholder="Trang Tài Trợ"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Liên kết trỏ đến
                </label>
                <input
                  type="text"
                  value={secondaryButtonUrl}
                  onChange={(e) => setSecondaryButtonUrl(e.target.value)}
                  placeholder="/sponsor"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
