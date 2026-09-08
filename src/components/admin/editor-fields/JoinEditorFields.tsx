import React from 'react';
import { 
  UserPlus, 
  HeartHandshake, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkIcon, 
  Sparkles, 
  FileText
} from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';

interface JoinEditorFieldsProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  // Roles section header
  joinRolesHeading: string;
  setJoinRolesHeading: (val: string) => void;
  joinRolesSubtitle: string;
  setJoinRolesSubtitle: (val: string) => void;
  // Role 1: SFYC
  joinRole1Title: string;
  setJoinRole1Title: (val: string) => void;
  joinRole1Tag: string;
  setJoinRole1Tag: (val: string) => void;
  joinRole1Description: string;
  setJoinRole1Description: (val: string) => void;
  joinRole1Period: string;
  setJoinRole1Period: (val: string) => void;
  joinRole1ButtonLabel: string;
  setJoinRole1ButtonLabel: (val: string) => void;
  joinRole1ButtonUrl: string;
  setJoinRole1ButtonUrl: (val: string) => void;
  joinRole1Highlight1: string;
  setJoinRole1Highlight1: (val: string) => void;
  joinRole1Highlight2: string;
  setJoinRole1Highlight2: (val: string) => void;
  joinRole1Highlight3: string;
  setJoinRole1Highlight3: (val: string) => void;
  joinRole1Highlight4: string;
  setJoinRole1Highlight4: (val: string) => void;
  // Role 2: Core Team
  joinRole2Title: string;
  setJoinRole2Title: (val: string) => void;
  joinRole2Tag: string;
  setJoinRole2Tag: (val: string) => void;
  joinRole2Description: string;
  setJoinRole2Description: (val: string) => void;
  joinRole2Period: string;
  setJoinRole2Period: (val: string) => void;
  joinRole2ButtonLabel: string;
  setJoinRole2ButtonLabel: (val: string) => void;
  joinRole2ButtonUrl: string;
  setJoinRole2ButtonUrl: (val: string) => void;
  joinRole2Highlight1: string;
  setJoinRole2Highlight1: (val: string) => void;
  joinRole2Highlight2: string;
  setJoinRole2Highlight2: (val: string) => void;
  joinRole2Highlight3: string;
  setJoinRole2Highlight3: (val: string) => void;
  joinRole2Highlight4: string;
  setJoinRole2Highlight4: (val: string) => void;
  // Role 3: Partner
  joinRole3Title: string;
  setJoinRole3Title: (val: string) => void;
  joinRole3Tag: string;
  setJoinRole3Tag: (val: string) => void;
  joinRole3Description: string;
  setJoinRole3Description: (val: string) => void;
  joinRole3Period: string;
  setJoinRole3Period: (val: string) => void;
  joinRole3ButtonLabel: string;
  setJoinRole3ButtonLabel: (val: string) => void;
  joinRole3ButtonUrl: string;
  setJoinRole3ButtonUrl: (val: string) => void;
  joinRole3Highlight1: string;
  setJoinRole3Highlight1: (val: string) => void;
  joinRole3Highlight2: string;
  setJoinRole3Highlight2: (val: string) => void;
  joinRole3Highlight3: string;
  setJoinRole3Highlight3: (val: string) => void;
  joinRole3Highlight4: string;
  setJoinRole3Highlight4: (val: string) => void;
  // CTA Banner
  joinCtaHeading: string;
  setJoinCtaHeading: (val: string) => void;
  joinCtaDescription: string;
  setJoinCtaDescription: (val: string) => void;
  joinCtaButtonLabel: string;
  setJoinCtaButtonLabel: (val: string) => void;
  joinCtaButtonUrl: string;
  setJoinCtaButtonUrl: (val: string) => void;
  // Contact info (3 cards)
  joinEmail: string;
  setJoinEmail: (val: string) => void;
  joinEmailTitle: string;
  setJoinEmailTitle: (val: string) => void;
  joinHotline: string;
  setJoinHotline: (val: string) => void;
  joinHotlineTitle: string;
  setJoinHotlineTitle: (val: string) => void;
  joinAddress: string;
  setJoinAddress: (val: string) => void;
  joinAddressTitle: string;
  setJoinAddressTitle: (val: string) => void;
  // Quy chế / Hướng dẫn ứng tuyển chi tiết
  contentFormatted: string;
  setContentFormatted: (val: string) => void;
}

export const JoinEditorFields: React.FC<JoinEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  joinRolesHeading,
  setJoinRolesHeading,
  joinRolesSubtitle,
  setJoinRolesSubtitle,
  joinRole1Title,
  setJoinRole1Title,
  joinRole1Tag,
  setJoinRole1Tag,
  joinRole1Description,
  setJoinRole1Description,
  joinRole1Period,
  setJoinRole1Period,
  joinRole1ButtonLabel,
  setJoinRole1ButtonLabel,
  joinRole1ButtonUrl,
  setJoinRole1ButtonUrl,
  joinRole1Highlight1,
  setJoinRole1Highlight1,
  joinRole1Highlight2,
  setJoinRole1Highlight2,
  joinRole1Highlight3,
  setJoinRole1Highlight3,
  joinRole1Highlight4,
  setJoinRole1Highlight4,
  joinRole2Title,
  setJoinRole2Title,
  joinRole2Tag,
  setJoinRole2Tag,
  joinRole2Description,
  setJoinRole2Description,
  joinRole2Period,
  setJoinRole2Period,
  joinRole2ButtonLabel,
  setJoinRole2ButtonLabel,
  joinRole2ButtonUrl,
  setJoinRole2ButtonUrl,
  joinRole2Highlight1,
  setJoinRole2Highlight1,
  joinRole2Highlight2,
  setJoinRole2Highlight2,
  joinRole2Highlight3,
  setJoinRole2Highlight3,
  joinRole2Highlight4,
  setJoinRole2Highlight4,
  joinRole3Title,
  setJoinRole3Title,
  joinRole3Tag,
  setJoinRole3Tag,
  joinRole3Description,
  setJoinRole3Description,
  joinRole3Period,
  setJoinRole3Period,
  joinRole3ButtonLabel,
  setJoinRole3ButtonLabel,
  joinRole3ButtonUrl,
  setJoinRole3ButtonUrl,
  joinRole3Highlight1,
  setJoinRole3Highlight1,
  joinRole3Highlight2,
  setJoinRole3Highlight2,
  joinRole3Highlight3,
  setJoinRole3Highlight3,
  joinRole3Highlight4,
  setJoinRole3Highlight4,
  joinCtaHeading,
  setJoinCtaHeading,
  joinCtaDescription,
  setJoinCtaDescription,
  joinCtaButtonLabel,
  setJoinCtaButtonLabel,
  joinCtaButtonUrl,
  setJoinCtaButtonUrl,
  joinEmail,
  setJoinEmail,
  joinEmailTitle,
  setJoinEmailTitle,
  joinHotline,
  setJoinHotline,
  joinHotlineTitle,
  setJoinHotlineTitle,
  joinAddress,
  setJoinAddress,
  joinAddressTitle,
  setJoinAddressTitle,
  contentFormatted,
  setContentFormatted,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Khối Đầu Trang (Hero Banner - /join) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Hero Banner - /join)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Phần mở đầu trang Tham Gia Sky First Network
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
            placeholder="SFN MEMBERSHIP & PARTNERSHIP"
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
            placeholder="Gia Nhập Mạng Lưới Sky First"
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
            placeholder="Dù bạn muốn cống hiến với vai trò Tình nguyện viên..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Cấu Hình 3 Nhóm Đối Tượng Gia Nhập */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Cấu Hình 3 Nhóm Đối Tượng Gia Nhập (/join)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Tiêu đề khối & chi tiết 3 thẻ vai trò
          </span>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Tiêu đề khối 3 nhóm đối tượng
            </label>
            <input
              type="text"
              value={joinRolesHeading}
              onChange={(e) => setJoinRolesHeading(e.target.value)}
              placeholder="Các Nhóm Đối Tượng Tham Gia Sky First Network"
              className="w-full text-xs font-black text-slate-900 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Dòng mô tả phụ đề
            </label>
            <input
              type="text"
              value={joinRolesSubtitle}
              onChange={(e) => setJoinRolesSubtitle(e.target.value)}
              placeholder="Lựa chọn hình thức đóng góp và đồng hành phù hợp..."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Nhóm 1: TNV */}
        <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
              <HeartHandshake size={18} className="text-emerald-600" />
              <span>NHÓM 1: TÌNH NGUYỆN VIÊN CHIẾN DỊCH (SFYC)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              {joinRole1Tag || 'TÌNH NGUYỆN VIÊN'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tiêu đề vai trò
              </label>
              <input
                type="text"
                value={joinRole1Title}
                onChange={(e) => setJoinRole1Title(e.target.value)}
                placeholder="Tình Nguyện Viên Chiến Dịch (SFYC)"
                className="w-full text-xs font-black text-slate-900 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nhãn phân loại (Tag)
              </label>
              <input
                type="text"
                value={joinRole1Tag}
                onChange={(e) => setJoinRole1Tag(e.target.value)}
                placeholder="TÌNH NGUYỆN VIÊN"
                className="w-full text-xs font-bold text-emerald-700 px-3 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-hidden uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Đoạn văn mô tả vai trò
              </label>
              <textarea
                rows={2}
                value={joinRole1Description}
                onChange={(e) => setJoinRole1Description(e.target.value)}
                placeholder="Tham gia trực tiếp các chiến dịch xã hội..."
                className="w-full text-xs text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thời gian / Nhiệm kỳ
              </label>
              <input
                type="text"
                value={joinRole1Period}
                onChange={(e) => setJoinRole1Period(e.target.value)}
                placeholder="Linh hoạt theo từng chiến dịch"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút bấm
              </label>
              <input
                type="text"
                value={joinRole1ButtonLabel}
                onChange={(e) => setJoinRole1ButtonLabel(e.target.value)}
                placeholder="Đăng Ký Tình Nguyện Viên"
                className="w-full text-xs px-3 py-2 bg-emerald-600 text-white font-bold rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                <LinkIcon size={13} className="text-emerald-600" />
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={joinRole1ButtonUrl}
                onChange={(e) => setJoinRole1ButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* 4 Highlights of Role 1 */}
          <div className="pt-3 border-t border-emerald-200/60 space-y-2">
            <label className="block text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
              4 Quyền Lợi & Điểm Nổi Bật (Highlights):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-black text-emerald-600 w-4">1.</span>
                <input
                  type="text"
                  value={joinRole1Highlight1}
                  onChange={(e) => setJoinRole1Highlight1(e.target.value)}
                  placeholder="Điểm nổi bật 1..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-black text-emerald-600 w-4">2.</span>
                <input
                  type="text"
                  value={joinRole1Highlight2}
                  onChange={(e) => setJoinRole1Highlight2(e.target.value)}
                  placeholder="Điểm nổi bật 2..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-black text-emerald-600 w-4">3.</span>
                <input
                  type="text"
                  value={joinRole1Highlight3}
                  onChange={(e) => setJoinRole1Highlight3(e.target.value)}
                  placeholder="Điểm nổi bật 3..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-black text-emerald-600 w-4">4.</span>
                <input
                  type="text"
                  value={joinRole1Highlight4}
                  onChange={(e) => setJoinRole1Highlight4(e.target.value)}
                  placeholder="Điểm nổi bật 4..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nhóm 2: Core Team */}
        <div className="p-5 rounded-2xl bg-sky-50/40 border border-sky-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-800 font-extrabold text-xs">
              <UserPlus size={18} className="text-[#0284C7]" />
              <span>NHÓM 2: THÀNH VIÊN BAN ĐIỀU HÀNH & CORE TEAM</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-[#0284C7] border border-sky-200 uppercase">
              {joinRole2Tag || 'CORE TEAM SFN'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tiêu đề vai trò
              </label>
              <input
                type="text"
                value={joinRole2Title}
                onChange={(e) => setJoinRole2Title(e.target.value)}
                placeholder="Thành Viên Ban Điều Hành & Core Team"
                className="w-full text-xs font-black text-slate-900 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nhãn phân loại (Tag)
              </label>
              <input
                type="text"
                value={joinRole2Tag}
                onChange={(e) => setJoinRole2Tag(e.target.value)}
                placeholder="CORE TEAM SFN"
                className="w-full text-xs font-bold text-sky-700 px-3 py-2 bg-white border border-sky-200 rounded-xl focus:outline-hidden uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Đoạn văn mô tả vai trò
              </label>
              <textarea
                rows={2}
                value={joinRole2Description}
                onChange={(e) => setJoinRole2Description(e.target.value)}
                placeholder="Trực tiếp tham gia quản trị, xây dựng nội dung..."
                className="w-full text-xs text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thời gian / Nhiệm kỳ
              </label>
              <input
                type="text"
                value={joinRole2Period}
                onChange={(e) => setJoinRole2Period(e.target.value)}
                placeholder="Nhiệm kỳ cam kết 06 - 12 tháng"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút bấm
              </label>
              <input
                type="text"
                value={joinRole2ButtonLabel}
                onChange={(e) => setJoinRole2ButtonLabel(e.target.value)}
                placeholder="Ứng Tuyển Ban Điều Hành"
                className="w-full text-xs px-3 py-2 bg-[#0284C7] text-white font-bold rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                <LinkIcon size={13} className="text-[#0284C7]" />
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={joinRole2ButtonUrl}
                onChange={(e) => setJoinRole2ButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* 4 Highlights of Role 2 */}
          <div className="pt-3 border-t border-sky-200/60 space-y-2">
            <label className="block text-[11px] font-bold text-sky-900 uppercase tracking-wider">
              4 Quyền Lợi & Điểm Nổi Bật (Highlights):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200">
                <span className="text-[10px] font-black text-[#0284C7] w-4">1.</span>
                <input
                  type="text"
                  value={joinRole2Highlight1}
                  onChange={(e) => setJoinRole2Highlight1(e.target.value)}
                  placeholder="Điểm nổi bật 1..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200">
                <span className="text-[10px] font-black text-[#0284C7] w-4">2.</span>
                <input
                  type="text"
                  value={joinRole2Highlight2}
                  onChange={(e) => setJoinRole2Highlight2(e.target.value)}
                  placeholder="Điểm nổi bật 2..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200">
                <span className="text-[10px] font-black text-[#0284C7] w-4">3.</span>
                <input
                  type="text"
                  value={joinRole2Highlight3}
                  onChange={(e) => setJoinRole2Highlight3(e.target.value)}
                  placeholder="Điểm nổi bật 3..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200">
                <span className="text-[10px] font-black text-[#0284C7] w-4">4.</span>
                <input
                  type="text"
                  value={joinRole2Highlight4}
                  onChange={(e) => setJoinRole2Highlight4(e.target.value)}
                  placeholder="Điểm nổi bật 4..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nhóm 3: Đối Tác */}
        <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
              <Building2 size={18} className="text-amber-600" />
              <span>NHÓM 3: TỔ CHỨC ĐỐI TÁC & BẢO TRỢ ĐỒNG HÀNH</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase">
              {joinRole3Tag || 'ĐỐI TÁC CHIẾN LƯỢC'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tiêu đề vai trò
              </label>
              <input
                type="text"
                value={joinRole3Title}
                onChange={(e) => setJoinRole3Title(e.target.value)}
                placeholder="Tổ Chức Đối Tác & Bảo Trợ Đồng Hành"
                className="w-full text-xs font-black text-slate-900 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nhãn phân loại (Tag)
              </label>
              <input
                type="text"
                value={joinRole3Tag}
                onChange={(e) => setJoinRole3Tag(e.target.value)}
                placeholder="ĐỐI TÁC CHIẾN LƯỢC"
                className="w-full text-xs font-bold text-amber-700 px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Đoạn văn mô tả vai trò
              </label>
              <textarea
                rows={2}
                value={joinRole3Description}
                onChange={(e) => setJoinRole3Description(e.target.value)}
                placeholder="Dành cho CLB/Đội/Nhóm, Đoàn Thanh niên..."
                className="w-full text-xs text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thời gian / Nhiệm kỳ
              </label>
              <input
                type="text"
                value={joinRole3Period}
                onChange={(e) => setJoinRole3Period(e.target.value)}
                placeholder="Hợp tác thường niên / Theo MOU"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút bấm
              </label>
              <input
                type="text"
                value={joinRole3ButtonLabel}
                onChange={(e) => setJoinRole3ButtonLabel(e.target.value)}
                placeholder="Gửi Đề Xuất Hợp Tác"
                className="w-full text-xs px-3 py-2 bg-amber-600 text-white font-bold rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                <LinkIcon size={13} className="text-amber-600" />
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={joinRole3ButtonUrl}
                onChange={(e) => setJoinRole3ButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* 4 Highlights of Role 3 */}
          <div className="pt-3 border-t border-amber-200/60 space-y-2">
            <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              4 Quyền Lợi & Điểm Nổi Bật (Highlights):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-black text-amber-600 w-4">1.</span>
                <input
                  type="text"
                  value={joinRole3Highlight1}
                  onChange={(e) => setJoinRole3Highlight1(e.target.value)}
                  placeholder="Điểm nổi bật 1..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-black text-amber-600 w-4">2.</span>
                <input
                  type="text"
                  value={joinRole3Highlight2}
                  onChange={(e) => setJoinRole3Highlight2(e.target.value)}
                  placeholder="Điểm nổi bật 2..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-black text-amber-600 w-4">3.</span>
                <input
                  type="text"
                  value={joinRole3Highlight3}
                  onChange={(e) => setJoinRole3Highlight3(e.target.value)}
                  placeholder="Điểm nổi bật 3..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-black text-amber-600 w-4">4.</span>
                <input
                  type="text"
                  value={joinRole3Highlight4}
                  onChange={(e) => setJoinRole3Highlight4(e.target.value)}
                  placeholder="Điểm nổi bật 4..."
                  className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Khối Trao Đổi Chi Tiết Về Cơ Hội Gia Nhập (CTA Banner) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Khối Trao Đổi Chi Tiết Về Cơ Hội Gia Nhập (CTA Banner)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Banner nổi bật trên trang Gia Nhập
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối
            </label>
            <input
              type="text"
              value={joinCtaHeading}
              onChange={(e) => setJoinCtaHeading(e.target.value)}
              placeholder="Bạn Cần Trao Đổi Chi Tiết Về Cơ Hội Gia Nhập Hoặc Đề Xuất Dự Án?"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả
            </label>
            <textarea
              rows={2}
              value={joinCtaDescription}
              onChange={(e) => setJoinCtaDescription(e.target.value)}
              placeholder="Hệ thống tiếp nhận hồ sơ tập trung của Ban Nhân Sự & Đối Ngoại SFN..."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tên nút bấm
              </label>
              <input
                type="text"
                value={joinCtaButtonLabel}
                onChange={(e) => setJoinCtaButtonLabel(e.target.value)}
                placeholder="Đến Trang Liên Hệ SFN"
                className="w-full text-xs px-3 py-2 bg-[#0284C7] text-white font-bold rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <LinkIcon size={14} className="text-[#0284C7]" />
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={joinCtaButtonUrl}
                onChange={(e) => setJoinCtaButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Thông Tin Tiếp Nhận & Kết Nối (3 Thẻ Cuối Trang) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Thông Tin Tiếp Nhận & Kết Nối (3 Hộp Cuối Trang)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            3 hộp thông tin liên hệ điều phối
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Email */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                <Mail size={13} className="text-[#0284C7]" />
                Tiêu đề hộp 1
              </label>
              <input
                type="text"
                value={joinEmailTitle}
                onChange={(e) => setJoinEmailTitle(e.target.value)}
                placeholder="Email Tuyển Dụng & Nhân Sự"
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">
                Địa chỉ Email
              </label>
              <input
                type="text"
                value={joinEmail}
                onChange={(e) => setJoinEmail(e.target.value)}
                placeholder="tuyendung@skyfirst.io.vn"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Hotline */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                <Phone size={13} className="text-emerald-600" />
                Tiêu đề hộp 2
              </label>
              <input
                type="text"
                value={joinHotlineTitle}
                onChange={(e) => setJoinHotlineTitle(e.target.value)}
                placeholder="Hotline Điều Phối"
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={joinHotline}
                onChange={(e) => setJoinHotline(e.target.value)}
                placeholder="0337 775 329"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Address */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                <MapPin size={13} className="text-rose-500" />
                Tiêu đề hộp 3
              </label>
              <input
                type="text"
                value={joinAddressTitle}
                onChange={(e) => setJoinAddressTitle(e.target.value)}
                placeholder="Văn Phòng Mạng Lưới"
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                value={joinAddress}
                onChange={(e) => setJoinAddress(e.target.value)}
                placeholder="Hà Nội & TP. Hồ Chí Minh, Việt Nam"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Hướng Dẫn & Quy Chế Ứng Tuyển Chi Tiết (Tùy chọn) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Hướng Dẫn & Quy Chế Ứng Tuyển Chi Tiết (Tùy chọn)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Hiển thị khối văn bản hướng dẫn bổ sung trên trang /join
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Nội dung chi tiết (tự động giữ định dạng in đậm, in nghiêng, danh sách, bảng biểu khi dán từ Word, Docs)
          </label>
          <RichTextEditor
            id="editor-join-content"
            value={contentFormatted}
            onChange={setContentFormatted}
            placeholder="Nhập hoặc dán quy trình tuyển chọn 3 bước, tiêu chuẩn ứng viên hoặc quy chế hoạt động..."
            minHeight="220px"
          />
        </div>
      </div>
    </div>
  );
};
