import React from 'react';
import { Search, RotateCcw, ShieldCheck, Sparkles, FileText, CheckCircle2, Award, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';

interface CertificateEditorFieldsProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  certSearchLabel: string;
  setCertSearchLabel: (val: string) => void;
  certSearchPlaceholder: string;
  setCertSearchPlaceholder: (val: string) => void;
  certGuidanceNote: string;
  setCertGuidanceNote: (val: string) => void;
  certSearchButtonLabel: string;
  setCertSearchButtonLabel: (val: string) => void;
  certResetButtonLabel: string;
  setCertResetButtonLabel: (val: string) => void;
  // Khối 3: 3 Cột Quy Chuẩn Minh Bạch
  certFeature1Title: string;
  setCertFeature1Title: (val: string) => void;
  certFeature1Desc: string;
  setCertFeature1Desc: (val: string) => void;
  certFeature2Title: string;
  setCertFeature2Title: (val: string) => void;
  certFeature2Desc: string;
  setCertFeature2Desc: (val: string) => void;
  certFeature3Title: string;
  setCertFeature3Title: (val: string) => void;
  certFeature3Desc: string;
  setCertFeature3Desc: (val: string) => void;
  // Khối 4: Kêu Gọi Hành Động / CTA Banner
  certCtaTitle: string;
  setCertCtaTitle: (val: string) => void;
  certCtaDescription: string;
  setCertCtaDescription: (val: string) => void;
  certCtaButtonLabel: string;
  setCertCtaButtonLabel: (val: string) => void;
  certCtaButtonUrl: string;
  setCertCtaButtonUrl: (val: string) => void;
  certStatIssuedMode: 'auto'|'manual';
  setCertStatIssuedMode: (val: 'auto'|'manual') => void;
  certStatIssuedManual: string;
  setCertStatIssuedManual: (val: string) => void;
  certStatValidMode: 'auto'|'manual';
  setCertStatValidMode: (val: 'auto'|'manual') => void;
  certStatValidManual: string;
  setCertStatValidManual: (val: string) => void;
  certStatProgramsMode: 'auto'|'manual';
  setCertStatProgramsMode: (val: 'auto'|'manual') => void;
  certStatProgramsManual: string;
  setCertStatProgramsManual: (val: string) => void;
  certStatUpdatedMode: 'auto'|'manual';
  setCertStatUpdatedMode: (val: 'auto'|'manual') => void;
  certStatUpdatedManual: string;
  setCertStatUpdatedManual: (val: string) => void;
  // Khối 5: Soạn thảo nội dung quy chuẩn / hướng dẫn bổ sung
  contentFormatted: string;
  setContentFormatted: (val: string) => void;
}

export const CertificateEditorFields: React.FC<CertificateEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  certSearchLabel,
  setCertSearchLabel,
  certSearchPlaceholder,
  setCertSearchPlaceholder,
  certGuidanceNote,
  setCertGuidanceNote,
  certSearchButtonLabel,
  setCertSearchButtonLabel,
  certResetButtonLabel,
  setCertResetButtonLabel,
  certFeature1Title,
  setCertFeature1Title,
  certFeature1Desc,
  setCertFeature1Desc,
  certFeature2Title,
  setCertFeature2Title,
  certFeature2Desc,
  setCertFeature2Desc,
  certFeature3Title,
  setCertFeature3Title,
  certFeature3Desc,
  setCertFeature3Desc,
  certCtaTitle,
  setCertCtaTitle,
  certCtaDescription,
  setCertCtaDescription,
  certCtaButtonLabel,
  setCertCtaButtonLabel,
  certCtaButtonUrl,
  setCertCtaButtonUrl,
  certStatIssuedMode,
  setCertStatIssuedMode,
  certStatIssuedManual,
  setCertStatIssuedManual,
  certStatValidMode,
  setCertStatValidMode,
  certStatValidManual,
  setCertStatValidManual,
  certStatProgramsMode,
  setCertStatProgramsMode,
  certStatProgramsManual,
  setCertStatProgramsManual,
  certStatUpdatedMode,
  setCertStatUpdatedMode,
  certStatUpdatedManual,
  setCertStatUpdatedManual,
  contentFormatted,
  setContentFormatted,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. KHỐI ĐẦU TRANG (HERO BANNER) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Hero Banner - /certificate)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Tiêu đề và giới thiệu đầu trang tra cứu
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
            placeholder="XÁC THỰC GIẤY CHỨNG NHẬN"
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
            placeholder="Xác thực GCN"
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
            placeholder="Nhập mã định danh trên Giấy chứng nhận để xác thực tính toàn vẹn..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. KHUNG TÌM KIẾM & TRA CỨU CHỨNG NHẬN hệ thống Giấy chứng nhận */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Khung Tra Cứu Chứng Nhận Điện Tử hệ thống Giấy chứng nhận
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Hộp công cụ nhập mã & tìm kiếm chứng nhận trên website
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nhãn ô tìm kiếm (Label)
            </label>
            <input
              type="text"
              value={certSearchLabel}
              onChange={(e) => setCertSearchLabel(e.target.value)}
              placeholder="Mã Tra Cứu Chứng Nhận"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gợi ý nhập trong ô (Placeholder)
            </label>
            <input
              type="text"
              value={certSearchPlaceholder}
              onChange={(e) => setCertSearchPlaceholder(e.target.value)}
              placeholder="Nhập mã Giấy chứng nhận"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Search size={14} className="text-[#0284C7]" />
              Tên nút Tra Cứu
            </label>
            <input
              type="text"
              value={certSearchButtonLabel}
              onChange={(e) => setCertSearchButtonLabel(e.target.value)}
              placeholder="Tra Cứu"
              className="w-full text-xs px-3 py-2 bg-sky-50 border border-sky-200 text-[#0284C7] font-bold rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <RotateCcw size={14} className="text-slate-500" />
              Tên nút Làm Mới
            </label>
            <input
              type="text"
              value={certResetButtonLabel}
              onChange={(e) => setCertResetButtonLabel(e.target.value)}
              placeholder="Làm mới"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            Đoạn ghi chú hướng dẫn & bảo đảm tính toàn vẹn
          </label>
          <textarea
            rows={2}
            value={certGuidanceNote}
            onChange={(e) => setCertGuidanceNote(e.target.value)}
            placeholder="Hệ thống tra cứu tự động đối chiếu mã số với cơ sở dữ liệu số hóa hệ thống Giấy chứng nhận theo thời gian thực."
            className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div><h3 className="text-sm font-extrabold text-slate-900">3. Nguồn dữ liệu thống kê GCN</h3><p className="mt-1 text-[11px] text-slate-500">Mỗi chỉ số có thể dùng dữ liệu tự động từ aggregate cache hoặc nhập thủ công độc lập. Chọn Tự động để khôi phục dữ liệu hệ thống.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['GCN đã phát hành',certStatIssuedMode,setCertStatIssuedMode,certStatIssuedManual,setCertStatIssuedManual,'VD: 1250'],
            ['Đang hợp lệ',certStatValidMode,setCertStatValidMode,certStatValidManual,setCertStatValidManual,'VD: 1210'],
            ['Chương trình có GCN',certStatProgramsMode,setCertStatProgramsMode,certStatProgramsManual,setCertStatProgramsManual,'VD: 18'],
            ['Cập nhật gần nhất',certStatUpdatedMode,setCertStatUpdatedMode,certStatUpdatedManual,setCertStatUpdatedManual,'VD: 07/10/2026']
          ].map(([label,mode,setMode,manual,setManual,placeholder]:any)=><div key={label} className="rounded-xl border border-slate-200 p-4"><div className="text-xs font-black">{label}</div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={()=>setMode('auto')} className={`rounded-lg border px-3 py-2 text-xs font-bold ${mode==='auto'?'border-sky-500 bg-sky-50 text-sky-700':'border-slate-200'}`}>Tự động</button><button type="button" onClick={()=>setMode('manual')} className={`rounded-lg border px-3 py-2 text-xs font-bold ${mode==='manual'?'border-sky-500 bg-sky-50 text-sky-700':'border-slate-200'}`}>Nhập thủ công</button></div>{mode==='manual'&&<><input value={manual} onChange={(e)=>setManual(e.target.value)} placeholder={placeholder} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/><button type="button" onClick={()=>{setMode('auto');setManual('')}} className="mt-2 text-[11px] font-black text-[#0B66C3] hover:underline">↺ Khôi phục dữ liệu tự động</button></>}{mode==='auto'&&<div className="mt-3 text-[11px] text-emerald-700">Đang dùng dữ liệu tự động từ aggregate cache.</div>}</div>)}
        </div>
      </div>

      {/* 4. KHỐI 3 CỘT QUY CHUẨN MINH BẠCH & TIÊU CHUẨN CHỨNG NHẬN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Khối 3 Cột Quy Chuẩn Minh Bạch (Tiêu Chuẩn hệ thống Giấy chứng nhận)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            3 tiêu chuẩn xác thực nằm ở phần dưới của trang tra cứu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cột 1 */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
              <ShieldCheck size={15} />
              <span>Cột 1: Mã Định Danh Duy Nhất</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={certFeature1Title}
                onChange={(e) => setCertFeature1Title(e.target.value)}
                placeholder="Mã Định Danh Duy Nhất"
                className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-[#0284C7] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung mô tả</label>
              <textarea
                rows={3}
                value={certFeature1Desc}
                onChange={(e) => setCertFeature1Desc(e.target.value)}
                placeholder="Mỗi chứng nhận được cấp một mã số duy nhất theo định dạng mã Giấy chứng nhận..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={15} />
              <span>Cột 2: Lưu Trữ Trong Hệ Thống</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={certFeature2Title}
                onChange={(e) => setCertFeature2Title(e.target.value)}
                placeholder="Lưu Trữ Trong Hệ Thống"
                className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung mô tả</label>
              <textarea
                rows={3}
                value={certFeature2Desc}
                onChange={(e) => setCertFeature2Desc(e.target.value)}
                placeholder="Hồ sơ được lưu trữ trên cơ sở dữ liệu số của Sky First Network phục vụ đối chiếu..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* Cột 3 */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Sparkles size={15} />
              <span>Cột 3: Hỗ Trợ Nhanh Chóng</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={certFeature3Title}
                onChange={(e) => setCertFeature3Title(e.target.value)}
                placeholder="Hỗ Trợ Nhanh Chóng"
                className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung mô tả</label>
              <textarea
                rows={3}
                value={certFeature3Desc}
                onChange={(e) => setCertFeature3Desc(e.target.value)}
                placeholder="Cần xác minh bổ sung hoặc chỉnh sửa thông tin, vui lòng gửi yêu cầu..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-amber-600 focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. KHỐI KÊU GỌI HÀNH ĐỘNG / LIÊN HỆ HỖ TRỢ XÁC MINH (BOTTOM CTA) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Khối Kêu Gọi Hành Động & Hỗ Trợ Xác Minh (Bottom Banner)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Banner nổi bật hỗ trợ giải đáp hoặc đối soát hồ sơ
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề Banner Hỗ Trợ
            </label>
            <input
              type="text"
              value={certCtaTitle}
              onChange={(e) => setCertCtaTitle(e.target.value)}
              placeholder="Bạn cần hỗ trợ tra cứu hoặc cấp lại chứng nhận?"
              className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn mô tả phụ
            </label>
            <textarea
              rows={2}
              value={certCtaDescription}
              onChange={(e) => setCertCtaDescription(e.target.value)}
              placeholder="Đội ngũ điều phối và kỹ thuật viên hệ thống Giấy chứng nhận luôn sẵn sàng giải đáp và xử lý yêu cầu xác minh thông tin..."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <LinkIcon size={14} className="text-[#0284C7]" />
                Tên nút bấm hành động
              </label>
              <input
                type="text"
                value={certCtaButtonLabel}
                onChange={(e) => setCertCtaButtonLabel(e.target.value)}
                placeholder="Gửi Yêu Cầu Hỗ Trợ"
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <LinkIcon size={14} className="text-slate-500" />
                Đường dẫn liên kết trỏ đến (URL)
              </label>
              <input
                type="text"
                value={certCtaButtonUrl}
                onChange={(e) => setCertCtaButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. SOẠN THẢO NỘI DUNG QUY CHUẨN / HƯỚNG DẪN BỔ SUNG (RICH TEXT) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-slate-700" />
            <h3 className="text-sm font-extrabold text-slate-900">
              5. Nội Dung Quy Chuẩn / Hướng Dẫn Bổ Sung (Tùy chọn)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Soạn văn bản/quy chế xuất hiện thêm trên trang chứng nhận
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Bạn có thể nhập nội dung văn bản giới thiệu quy chế cấp chứng nhận, tiêu chuẩn đối chiếu hệ thống Giấy chứng nhận hoặc dán trực tiếp từ văn bản Word, Docs (tự động giữ nguyên định dạng in đậm, danh sách, bảng biểu).
        </p>

        <div>
          <RichTextEditor
            id="editor-cert-content"
            value={contentFormatted}
            onChange={setContentFormatted}
            placeholder="Nhập hoặc dán nội dung quy chuẩn chứng nhận hệ thống Giấy chứng nhận..."
            minHeight="220px"
          />
        </div>
      </div>
    </div>
  );
};
