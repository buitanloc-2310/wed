import React, { useState, useRef } from 'react';
import { 
  CreditCard, 
  Copy, 
  Phone, 
  Mail, 
  Link as LinkIcon, 
  Sparkles, 
  HeartHandshake, 
  HelpCircle,
  ShieldCheck,
  Award,
  TrendingUp,
  FileText,
  Gift,
  GraduationCap,
  Users,
  QrCode,
  Upload,
  Trash2,
  Image as ImageIcon,
  RotateCcw,
  Check,
  ExternalLink
} from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';

interface SponsorEditorFieldsProps {
  // 1. Hero
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  sponsorHeroPrimaryButtonLabel: string;
  setSponsorHeroPrimaryButtonLabel: (val: string) => void;
  sponsorHeroPrimaryButtonUrl: string;
  setSponsorHeroPrimaryButtonUrl: (val: string) => void;
  sponsorHeroSecondaryButtonLabel: string;
  setSponsorHeroSecondaryButtonLabel: (val: string) => void;
  sponsorHeroSecondaryButtonUrl: string;
  setSponsorHeroSecondaryButtonUrl: (val: string) => void;

  // 2. Commitments
  sponsorCommitmentHeading: string;
  setSponsorCommitmentHeading: (val: string) => void;
  sponsorCommitmentSubtitle: string;
  setSponsorCommitmentSubtitle: (val: string) => void;
  sponsorCommit1Title: string;
  setSponsorCommit1Title: (val: string) => void;
  sponsorCommit1Desc: string;
  setSponsorCommit1Desc: (val: string) => void;
  sponsorCommit2Title: string;
  setSponsorCommit2Title: (val: string) => void;
  sponsorCommit2Desc: string;
  setSponsorCommit2Desc: (val: string) => void;
  sponsorCommit3Title: string;
  setSponsorCommit3Title: (val: string) => void;
  sponsorCommit3Desc: string;
  setSponsorCommit3Desc: (val: string) => void;
  sponsorCommit4Title: string;
  setSponsorCommit4Title: (val: string) => void;
  sponsorCommit4Desc: string;
  setSponsorCommit4Desc: (val: string) => void;

  // 3. Packages
  sponsorPackagesHeading: string;
  setSponsorPackagesHeading: (val: string) => void;
  sponsorPackagesSubtitle: string;
  setSponsorPackagesSubtitle: (val: string) => void;
  sponsorPkg1Title: string;
  setSponsorPkg1Title: (val: string) => void;
  sponsorPkg1Badge: string;
  setSponsorPkg1Badge: (val: string) => void;
  sponsorPkg1Unit: string;
  setSponsorPkg1Unit: (val: string) => void;
  sponsorPkg1Desc: string;
  setSponsorPkg1Desc: (val: string) => void;
  sponsorPkg1Impact: string;
  setSponsorPkg1Impact: (val: string) => void;

  sponsorPkg2Title: string;
  setSponsorPkg2Title: (val: string) => void;
  sponsorPkg2Badge: string;
  setSponsorPkg2Badge: (val: string) => void;
  sponsorPkg2Unit: string;
  setSponsorPkg2Unit: (val: string) => void;
  sponsorPkg2Desc: string;
  setSponsorPkg2Desc: (val: string) => void;
  sponsorPkg2Impact: string;
  setSponsorPkg2Impact: (val: string) => void;

  sponsorPkg3Title: string;
  setSponsorPkg3Title: (val: string) => void;
  sponsorPkg3Badge: string;
  setSponsorPkg3Badge: (val: string) => void;
  sponsorPkg3Unit: string;
  setSponsorPkg3Unit: (val: string) => void;
  sponsorPkg3Desc: string;
  setSponsorPkg3Desc: (val: string) => void;
  sponsorPkg3Impact: string;
  setSponsorPkg3Impact: (val: string) => void;

  sponsorPkg4Title: string;
  setSponsorPkg4Title: (val: string) => void;
  sponsorPkg4Badge: string;
  setSponsorPkg4Badge: (val: string) => void;
  sponsorPkg4Unit: string;
  setSponsorPkg4Unit: (val: string) => void;
  sponsorPkg4Desc: string;
  setSponsorPkg4Desc: (val: string) => void;
  sponsorPkg4Impact: string;
  setSponsorPkg4Impact: (val: string) => void;

  // 4. Bank Account Details
  sponsorBankName: string;
  setSponsorBankName: (val: string) => void;
  sponsorBankBranch: string;
  setSponsorBankBranch: (val: string) => void;
  sponsorBankAccount: string;
  setSponsorBankAccount: (val: string) => void;
  sponsorAccountHolder: string;
  setSponsorAccountHolder: (val: string) => void;
  sponsorTransferSyntax: string;
  setSponsorTransferSyntax: (val: string) => void;
  sponsorCopyButtonLabel: string;
  setSponsorCopyButtonLabel: (val: string) => void;
  sponsorHotline: string;
  setSponsorHotline: (val: string) => void;
  sponsorEmail: string;
  setSponsorEmail: (val: string) => void;
  sponsorContactLeadTitle: string;
  setSponsorContactLeadTitle: (val: string) => void;

  // QR Code Chuyển Khoản Tiếp Nhận Tài Trợ
  sponsorQrCodeUrl: string;
  setSponsorQrCodeUrl: (val: string) => void;
  sponsorQrCodeTitle: string;
  setSponsorQrCodeTitle: (val: string) => void;
  sponsorQrCodeSubtitle: string;
  setSponsorQrCodeSubtitle: (val: string) => void;

  // 5. Section 5: Đồng Hành & Hợp Tác
  sponsorContactHeading: string;
  setSponsorContactHeading: (val: string) => void;
  sponsorContactDescription: string;
  setSponsorContactDescription: (val: string) => void;
  sponsorContactButtonLabel: string;
  setSponsorContactButtonLabel: (val: string) => void;
  sponsorContactButtonUrl: string;
  setSponsorContactButtonUrl: (val: string) => void;
  sponsorUnitsButtonLabel: string;
  setSponsorUnitsButtonLabel: (val: string) => void;
  sponsorUnitsButtonUrl: string;
  setSponsorUnitsButtonUrl: (val: string) => void;
  sponsorContactHotline: string;
  setSponsorContactHotline: (val: string) => void;
  sponsorContactEmail: string;
  setSponsorContactEmail: (val: string) => void;

  // 6. Section 6: FAQs
  sponsorFaqHeading: string;
  setSponsorFaqHeading: (val: string) => void;
  sponsorFaqSubtitle: string;
  setSponsorFaqSubtitle: (val: string) => void;
  sponsorFaq1Q: string;
  setSponsorFaq1Q: (val: string) => void;
  sponsorFaq1A: string;
  setSponsorFaq1A: (val: string) => void;
  sponsorFaq2Q: string;
  setSponsorFaq2Q: (val: string) => void;
  sponsorFaq2A: string;
  setSponsorFaq2A: (val: string) => void;
  sponsorFaq3Q: string;
  setSponsorFaq3Q: (val: string) => void;
  sponsorFaq3A: string;
  setSponsorFaq3A: (val: string) => void;
  sponsorFaq4Q: string;
  setSponsorFaq4Q: (val: string) => void;
  sponsorFaq4A: string;
  setSponsorFaq4A: (val: string) => void;

  // 7. Section 7: Quick CTA
  sponsorCtaTitle: string;
  setSponsorCtaTitle: (val: string) => void;
  sponsorCtaDescription: string;
  setSponsorCtaDescription: (val: string) => void;
  buttonLabel: string;
  setButtonLabel: (val: string) => void;
  buttonUrl: string;
  setButtonUrl: (val: string) => void;
  secondaryButtonLabel: string;
  setSecondaryButtonLabel: (val: string) => void;
  secondaryButtonUrl: string;
  setSecondaryButtonUrl: (val: string) => void;

  // 8. Rich text content
  contentFormatted: string;
  setContentFormatted: (val: string) => void;
}

export const SponsorEditorFields: React.FC<SponsorEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  sponsorHeroPrimaryButtonLabel,
  setSponsorHeroPrimaryButtonLabel,
  sponsorHeroPrimaryButtonUrl,
  setSponsorHeroPrimaryButtonUrl,
  sponsorHeroSecondaryButtonLabel,
  setSponsorHeroSecondaryButtonLabel,
  sponsorHeroSecondaryButtonUrl,
  setSponsorHeroSecondaryButtonUrl,
  // 2. Commitments
  sponsorCommitmentHeading,
  setSponsorCommitmentHeading,
  sponsorCommitmentSubtitle,
  setSponsorCommitmentSubtitle,
  sponsorCommit1Title,
  setSponsorCommit1Title,
  sponsorCommit1Desc,
  setSponsorCommit1Desc,
  sponsorCommit2Title,
  setSponsorCommit2Title,
  sponsorCommit2Desc,
  setSponsorCommit2Desc,
  sponsorCommit3Title,
  setSponsorCommit3Title,
  sponsorCommit3Desc,
  setSponsorCommit3Desc,
  sponsorCommit4Title,
  setSponsorCommit4Title,
  sponsorCommit4Desc,
  setSponsorCommit4Desc,
  // 3. Packages
  sponsorPackagesHeading,
  setSponsorPackagesHeading,
  sponsorPackagesSubtitle,
  setSponsorPackagesSubtitle,
  sponsorPkg1Title,
  setSponsorPkg1Title,
  sponsorPkg1Badge,
  setSponsorPkg1Badge,
  sponsorPkg1Unit,
  setSponsorPkg1Unit,
  sponsorPkg1Desc,
  setSponsorPkg1Desc,
  sponsorPkg1Impact,
  setSponsorPkg1Impact,
  sponsorPkg2Title,
  setSponsorPkg2Title,
  sponsorPkg2Badge,
  setSponsorPkg2Badge,
  sponsorPkg2Unit,
  setSponsorPkg2Unit,
  sponsorPkg2Desc,
  setSponsorPkg2Desc,
  sponsorPkg2Impact,
  setSponsorPkg2Impact,
  sponsorPkg3Title,
  setSponsorPkg3Title,
  sponsorPkg3Badge,
  setSponsorPkg3Badge,
  sponsorPkg3Unit,
  setSponsorPkg3Unit,
  sponsorPkg3Desc,
  setSponsorPkg3Desc,
  sponsorPkg3Impact,
  setSponsorPkg3Impact,
  sponsorPkg4Title,
  setSponsorPkg4Title,
  sponsorPkg4Badge,
  setSponsorPkg4Badge,
  sponsorPkg4Unit,
  setSponsorPkg4Unit,
  sponsorPkg4Desc,
  setSponsorPkg4Desc,
  sponsorPkg4Impact,
  setSponsorPkg4Impact,
  // 4. Bank Details
  sponsorBankName,
  setSponsorBankName,
  sponsorBankBranch,
  setSponsorBankBranch,
  sponsorBankAccount,
  setSponsorBankAccount,
  sponsorAccountHolder,
  setSponsorAccountHolder,
  sponsorTransferSyntax,
  setSponsorTransferSyntax,
  sponsorCopyButtonLabel,
  setSponsorCopyButtonLabel,
  sponsorHotline,
  setSponsorHotline,
  sponsorEmail,
  setSponsorEmail,
  sponsorContactLeadTitle,
  setSponsorContactLeadTitle,
  // QR Code
  sponsorQrCodeUrl,
  setSponsorQrCodeUrl,
  sponsorQrCodeTitle,
  setSponsorQrCodeTitle,
  sponsorQrCodeSubtitle,
  setSponsorQrCodeSubtitle,
  // 5. Contact Section
  sponsorContactHeading,
  setSponsorContactHeading,
  sponsorContactDescription,
  setSponsorContactDescription,
  sponsorContactButtonLabel,
  setSponsorContactButtonLabel,
  sponsorContactButtonUrl,
  setSponsorContactButtonUrl,
  sponsorUnitsButtonLabel,
  setSponsorUnitsButtonLabel,
  sponsorUnitsButtonUrl,
  setSponsorUnitsButtonUrl,
  sponsorContactHotline,
  setSponsorContactHotline,
  sponsorContactEmail,
  setSponsorContactEmail,
  // 6. FAQs
  sponsorFaqHeading,
  setSponsorFaqHeading,
  sponsorFaqSubtitle,
  setSponsorFaqSubtitle,
  sponsorFaq1Q,
  setSponsorFaq1Q,
  sponsorFaq1A,
  setSponsorFaq1A,
  sponsorFaq2Q,
  setSponsorFaq2Q,
  sponsorFaq2A,
  setSponsorFaq2A,
  sponsorFaq3Q,
  setSponsorFaq3Q,
  sponsorFaq3A,
  setSponsorFaq3A,
  sponsorFaq4Q,
  setSponsorFaq4Q,
  sponsorFaq4A,
  setSponsorFaq4A,
  // 7. Quick CTA
  sponsorCtaTitle,
  setSponsorCtaTitle,
  sponsorCtaDescription,
  setSponsorCtaDescription,
  buttonLabel,
  setButtonLabel,
  buttonUrl,
  setButtonUrl,
  secondaryButtonLabel,
  setSecondaryButtonLabel,
  secondaryButtonUrl,
  setSecondaryButtonUrl,
  // 8. Rich text content
  contentFormatted,
  setContentFormatted,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Vui lòng chọn file ảnh có dung lượng dưới 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSponsorQrCodeUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Vui lòng chọn file ảnh có dung lượng dưới 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSponsorQrCodeUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVietQR = () => {
    let bankCode = 'MB';
    const bName = sponsorBankName.toUpperCase();
    if (bName.includes('VIETCOMBANK') || bName.includes('VCB')) bankCode = 'VCB';
    else if (bName.includes('TECHCOMBANK') || bName.includes('TCB')) bankCode = 'TCB';
    else if (bName.includes('BIDV')) bankCode = 'BIDV';
    else if (bName.includes('VIETINBANK') || bName.includes('CTG') || bName.includes('ICB')) bankCode = 'ICB';
    else if (bName.includes('ACB')) bankCode = 'ACB';
    else if (bName.includes('TPBANK') || bName.includes('TPB')) bankCode = 'TPB';
    else if (bName.includes('VPBANK') || bName.includes('VPB')) bankCode = 'VPB';
    else if (bName.includes('AGRIBANK') || bName.includes('VARB')) bankCode = 'VBA';

    const cleanAccount = sponsorBankAccount.replace(/[^0-9A-Za-z]/g, '') || '';
    const cleanName = encodeURIComponent(sponsorAccountHolder.trim() || 'Sky First Network');
    const cleanSyntax = encodeURIComponent('HOP TAC SKY FIRST');
    const generatedUrl = `https://img.vietqr.io/image/${bankCode}-${cleanAccount}-compact2.png?amount=0&addInfo=${cleanSyntax}&accountName=${cleanName}`;
    setSponsorQrCodeUrl(generatedUrl);
  };

  return (
    <div className="space-y-6">
      {/* 1. KHỐI ĐẦU TRANG (HERO BANNER) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Hero Banner - /sponsor)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Phần mở đầu trang Tài Trợ & Đồng Hành Doanh Nghiệp
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
            placeholder="TÀI TRỢ & ĐỒNG HÀNH DOANH NGHIỆP"
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
            placeholder="Hợp tác & Đồng hành cùng Sky First Network"
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
            placeholder="Sky First Network trân trọng mọi sự chung tay từ Quý Doanh nghiệp, Tổ chức và Nhà hảo tâm..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="p-3.5 bg-sky-50/40 rounded-xl border border-sky-100 space-y-2">
            <span className="text-xs font-bold text-[#0284C7] block">Nút hành động chính (Hero Button 1)</span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên nút</label>
              <input
                type="text"
                value={sponsorHeroPrimaryButtonLabel}
                onChange={(e) => setSponsorHeroPrimaryButtonLabel(e.target.value)}
                placeholder="Đăng Ký Tài Trợ Ngay"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Đường dẫn URL</label>
              <input
                type="text"
                value={sponsorHeroPrimaryButtonUrl}
                onChange={(e) => setSponsorHeroPrimaryButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Nút hành động phụ (Hero Button 2)</span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên nút</label>
              <input
                type="text"
                value={sponsorHeroSecondaryButtonLabel}
                onChange={(e) => setSponsorHeroSecondaryButtonLabel(e.target.value)}
                placeholder="Thông Tin Chuyển Khoản"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Đường dẫn URL / Neo trang</label>
              <input
                type="text"
                value={sponsorHeroSecondaryButtonUrl}
                onChange={(e) => setSponsorHeroSecondaryButtonUrl(e.target.value)}
                placeholder="#thong-tin-chuyen-khoan"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. KHỐI 4 CAM KẾT MINH BẠCH DÀNH CHO NHÀ TÀI TRỢ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. 4 Cam Kết Minh Bạch Dành Cho Nhà Tài Trợ
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Các trụ cột bảo chứng uy tín và trách nhiệm xã hội
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối cam kết
            </label>
            <input
              type="text"
              value={sponsorCommitmentHeading}
              onChange={(e) => setSponsorCommitmentHeading(e.target.value)}
              placeholder="4 Cam Kết Minh Bạch Dành Cho Nhà Tài Trợ"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả khối cam kết
            </label>
            <input
              type="text"
              value={sponsorCommitmentSubtitle}
              onChange={(e) => setSponsorCommitmentSubtitle(e.target.value)}
              placeholder="Mọi nguồn lực quý báu được quý đối tác gửi gắm đều được quản lý với tiêu chuẩn trách nhiệm cao nhất."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Cam kết 1 */}
          <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0284C7]">
              <FileText size={15} />
              <span>Cam Kết 1 (Sao Kê)</span>
            </div>
            <input
              type="text"
              value={sponsorCommit1Title}
              onChange={(e) => setSponsorCommit1Title(e.target.value)}
              placeholder="Minh bạch theo thông tin được xác nhận"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorCommit1Desc}
              onChange={(e) => setSponsorCommit1Desc(e.target.value)}
              placeholder="Cập nhật thu - chi rõ ràng theo từng dự án cụ thể..."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {/* Cam kết 2 */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
              <Award size={15} />
              <span>Cam Kết 2 (Chứng Nhận Số)</span>
            </div>
            <input
              type="text"
              value={sponsorCommit2Title}
              onChange={(e) => setSponsorCommit2Title(e.target.value)}
              placeholder="Giấy chứng nhận"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorCommit2Desc}
              onChange={(e) => setSponsorCommit2Desc(e.target.value)}
              placeholder="Cấp Giấy chứng nhận tri ân điện tử có mã định danh..."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {/* Cam kết 3 */}
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700">
              <TrendingUp size={15} />
              <span>Cam Kết 3 (Báo Cáo Tác Động)</span>
            </div>
            <input
              type="text"
              value={sponsorCommit3Title}
              onChange={(e) => setSponsorCommit3Title(e.target.value)}
              placeholder="Báo Cáo Tác Động Thực"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorCommit3Desc}
              onChange={(e) => setSponsorCommit3Desc(e.target.value)}
              placeholder="Gửi tận tay nhà tài trợ báo cáo hình ảnh, video..."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {/* Cam kết 4 */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700">
              <Sparkles size={15} />
              <span>Cam Kết 4 (Lan Tỏa Truyền Thông)</span>
            </div>
            <input
              type="text"
              value={sponsorCommit4Title}
              onChange={(e) => setSponsorCommit4Title(e.target.value)}
              placeholder="Lan Tỏa Truyền Thông"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorCommit4Desc}
              onChange={(e) => setSponsorCommit4Desc(e.target.value)}
              placeholder="Đồng hành cùng Trung tâm Truyền thông hoạt động truyền thông..."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 3. KHỐI CÁC GÓI & HÌNH THỨC ĐỒNG HÀNH (4 GÓI TÀI TRỢ) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HeartHandshake size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Các Hình Thức & Gói Tài Trợ Đồng Hành Cùng SFN
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            4 gói tài trợ tiêu chuẩn với quyền lợi và mục tiêu rõ ràng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối gói tài trợ
            </label>
            <input
              type="text"
              value={sponsorPackagesHeading}
              onChange={(e) => setSponsorPackagesHeading(e.target.value)}
              placeholder="Các hình thức đồng hành cùng Sky First Network"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả khối gói tài trợ
            </label>
            <input
              type="text"
              value={sponsorPackagesSubtitle}
              onChange={(e) => setSponsorPackagesSubtitle(e.target.value)}
              placeholder="Lựa chọn hình thức đóng góp phù hợp với định hướng phát triển..."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* Gói 1 */}
          <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-[#0284C7]">
                <GraduationCap size={16} />
                <span>Gói 1: Học Bổng Tri Thức & Kỹ Năng</span>
              </div>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">Bảo trợ đào tạo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên gói</label>
                <input
                  type="text"
                  value={sponsorPkg1Title}
                  onChange={(e) => setSponsorPkg1Title(e.target.value)}
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Huy hiệu</label>
                <input
                  type="text"
                  value={sponsorPkg1Badge}
                  onChange={(e) => setSponsorPkg1Badge(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Đơn vị phụ trách</label>
                <input
                  type="text"
                  value={sponsorPkg1Unit}
                  onChange={(e) => setSponsorPkg1Unit(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả nội dung tài trợ</label>
                <textarea
                  rows={2}
                  value={sponsorPkg1Desc}
                  onChange={(e) => setSponsorPkg1Desc(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hiệu quả cam kết</label>
                <textarea
                  rows={2}
                  value={sponsorPkg1Impact}
                  onChange={(e) => setSponsorPkg1Impact(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Gói 2 */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                <Users size={16} />
                <span>Gói 2: Chiến Dịch Phụng Sự Cộng Đồng</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Tác động xã hội</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên gói</label>
                <input
                  type="text"
                  value={sponsorPkg2Title}
                  onChange={(e) => setSponsorPkg2Title(e.target.value)}
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Huy hiệu</label>
                <input
                  type="text"
                  value={sponsorPkg2Badge}
                  onChange={(e) => setSponsorPkg2Badge(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Đơn vị phụ trách</label>
                <input
                  type="text"
                  value={sponsorPkg2Unit}
                  onChange={(e) => setSponsorPkg2Unit(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả nội dung tài trợ</label>
                <textarea
                  rows={2}
                  value={sponsorPkg2Desc}
                  onChange={(e) => setSponsorPkg2Desc(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hiệu quả cam kết</label>
                <textarea
                  rows={2}
                  value={sponsorPkg2Impact}
                  onChange={(e) => setSponsorPkg2Impact(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Gói 3 */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-amber-800">
                <Gift size={16} />
                <span>Gói 3: Tài Trợ Hiện Vật & Cơ Sở Hạ Tầng</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Hỗ trợ thiết bị</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên gói</label>
                <input
                  type="text"
                  value={sponsorPkg3Title}
                  onChange={(e) => setSponsorPkg3Title(e.target.value)}
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Huy hiệu</label>
                <input
                  type="text"
                  value={sponsorPkg3Badge}
                  onChange={(e) => setSponsorPkg3Badge(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Đơn vị phụ trách</label>
                <input
                  type="text"
                  value={sponsorPkg3Unit}
                  onChange={(e) => setSponsorPkg3Unit(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả nội dung tài trợ</label>
                <textarea
                  rows={2}
                  value={sponsorPkg3Desc}
                  onChange={(e) => setSponsorPkg3Desc(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hiệu quả cam kết</label>
                <textarea
                  rows={2}
                  value={sponsorPkg3Impact}
                  onChange={(e) => setSponsorPkg3Impact(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Gói 4 */}
          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-purple-800">
                <TrendingUp size={16} />
                <span>Gói 4: Hợp tác dài hạn</span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">Đồng hành toàn diện</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên gói</label>
                <input
                  type="text"
                  value={sponsorPkg4Title}
                  onChange={(e) => setSponsorPkg4Title(e.target.value)}
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Huy hiệu</label>
                <input
                  type="text"
                  value={sponsorPkg4Badge}
                  onChange={(e) => setSponsorPkg4Badge(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Đơn vị phụ trách</label>
                <input
                  type="text"
                  value={sponsorPkg4Unit}
                  onChange={(e) => setSponsorPkg4Unit(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả nội dung tài trợ</label>
                <textarea
                  rows={2}
                  value={sponsorPkg4Desc}
                  onChange={(e) => setSponsorPkg4Desc(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hiệu quả cam kết</label>
                <textarea
                  rows={2}
                  value={sponsorPkg4Impact}
                  onChange={(e) => setSponsorPkg4Impact(e.target.value)}
                  className="w-full text-xs text-slate-700 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THÔNG TIN TÀI KHOẢN TIẾP NHẬN TÀI TRỢ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Thông Tin Tài Khoản Ngân Hàng Tiếp Nhận
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Thẻ tài khoản ngân hàng hiển thị trên website
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ngân hàng thụ hưởng
            </label>
            <input
              type="text"
              value={sponsorBankName}
              onChange={(e) => setSponsorBankName(e.target.value)}
              placeholder="Ngân hàng Quân Đội (MB Bank)"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Chi nhánh ngân hàng
            </label>
            <input
              type="text"
              value={sponsorBankBranch}
              onChange={(e) => setSponsorBankBranch(e.target.value)}
              placeholder="Chi nhánh TP. Hồ Chí Minh"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Số tài khoản tiếp nhận
            </label>
            <input
              type="text"
              value={sponsorBankAccount}
              onChange={(e) => setSponsorBankAccount(e.target.value)}
              placeholder="Chỉ nhập khi có thông tin tiếp nhận đã được xác nhận"
              className="w-full text-xs px-3 py-2 bg-sky-50 border border-sky-200 font-mono font-bold text-[#0284C7] rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={sponsorAccountHolder}
              onChange={(e) => setSponsorAccountHolder(e.target.value)}
              placeholder="Sky First Network"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 uppercase font-black text-slate-900 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cú pháp chuyển khoản mẫu
            </label>
            <input
              type="text"
              value={sponsorTransferSyntax}
              onChange={(e) => setSponsorTransferSyntax(e.target.value)}
              placeholder="TAITRO [HọTên/TênDoanhNghiệp] [SốĐiệnThoại]"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-mono font-semibold rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Copy size={13} className="text-[#0284C7]" />
              Tên nút sao chép STK
            </label>
            <input
              type="text"
              value={sponsorCopyButtonLabel}
              onChange={(e) => setSponsorCopyButtonLabel(e.target.value)}
              placeholder="Sao chép số tài khoản"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-bold rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Phone size={13} className="text-emerald-600" />
              Hotline tiếp nhận tài trợ
            </label>
            <input
              type="text"
              value={sponsorHotline}
              onChange={(e) => setSponsorHotline(e.target.value)}
              placeholder="0337 775 329"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-mono rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Mail size={13} className="text-[#0284C7]" />
              Hòm thư tiếp nhận tài trợ
            </label>
            <input
              type="text"
              value={sponsorEmail}
              onChange={(e) => setSponsorEmail(e.target.value)}
              placeholder="hoptac.sfn@gmail.com"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-mono rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Users size={13} className="text-sky-600" />
              Đầu mối phụ trách tiếp nhận
            </label>
            <input
              type="text"
              value={sponsorContactLeadTitle}
              onChange={(e) => setSponsorContactLeadTitle(e.target.value)}
              placeholder="Ban Đối ngoại & Sự kiện"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-bold rounded-xl focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 5. KHỐI MÃ QR CHUYỂN KHOẢN TIẾP NHẬN TÀI TRỢ (VIETQR / NGÂN HÀNG) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                5. Khối Mã QR Chuyển Khoản Tiếp Nhận Tài Trợ (VietQR / Ngân Hàng)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Tải lên ảnh QR chuyển khoản hoặc sinh tự động mã VietQR liên kết theo số tài khoản
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateVietQR}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold rounded-xl border border-sky-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Tự động tạo đường dẫn VietQR chuẩn từ thông tin ngân hàng và STK bên trên"
            >
              <Sparkles size={13} />
              <span>Tạo nhanh VietQR từ STK</span>
            </button>
            {sponsorQrCodeUrl && (
              <button
                type="button"
                onClick={() => setSponsorQrCodeUrl('')}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                title="Xóa mã QR hiện tại"
              >
                <Trash2 size={13} />
                <span>Xóa QR</span>
              </button>
            )}
          </div>
        </div>

        {/* Cấu hình tiêu đề và phụ đề trên thẻ QR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề trên thẻ mã QR
            </label>
            <input
              type="text"
              value={sponsorQrCodeTitle}
              onChange={(e) => setSponsorQrCodeTitle(e.target.value)}
              placeholder="VietQR Chuyển Khoản Nhanh"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-semibold text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">Dòng chữ in đậm phía trên mã QR</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dòng hướng dẫn / phụ đề dưới thẻ QR
            </label>
            <input
              type="text"
              value={sponsorQrCodeSubtitle}
              onChange={(e) => setSponsorQrCodeSubtitle(e.target.value)}
              placeholder="Quét bằng mọi ứng dụng Ngân hàng & Ví điện tử"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">Hướng dẫn quét mã cho nhà hảo tâm</p>
          </div>
        </div>

        {/* Hai phương thức chèn ảnh QR: Tải tệp lên (Drag-and-Drop / File Upload) hoặc Nhập URL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          {/* Cột trái: Tải ảnh & Nhập liên kết */}
          <div className="lg:col-span-7 space-y-4">
            {/* Vùng tải tệp lên (Hỗ trợ kéo thả & click tải tệp) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Upload size={14} className="text-[#0284C7]" />
                Tải ảnh mã QR lên từ thiết bị (Hỗ trợ Kéo & Thả)
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                  isDragging 
                    ? 'border-[#0284C7] bg-sky-50/70 scale-[1.01]' 
                    : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/60 bg-slate-50/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Nhấn để chọn tệp ảnh QR hoặc kéo thả vào đây
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ định dạng PNG, JPG, WEBP, SVG (tối đa 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Nhập URL ảnh trực tiếp */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <LinkIcon size={14} className="text-[#0284C7]" />
                Hoặc dán liên kết hình ảnh mã QR (URL trực tiếp)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sponsorQrCodeUrl}
                  onChange={(e) => setSponsorQrCodeUrl(e.target.value)}
                  placeholder="https://img.vietqr.io/... hoặc link ảnh QR trực tiếp"
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono pr-20"
                />
                {sponsorQrCodeUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(sponsorQrCodeUrl);
                        setCopiedStatus(true);
                        setTimeout(() => setCopiedStatus(false), 2000);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-200/70 hover:bg-slate-300 text-slate-700 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedStatus ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    <span>{copiedStatus ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Có thể sử dụng ảnh xuất từ ứng dụng Mobile Banking hoặc liên kết dịch vụ VietQR API
              </p>
            </div>

            {/* Các gợi ý thao tác nhanh */}
            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Sparkles size={13} className="text-amber-600" />
                Mẹo sử dụng VietQR tự động:
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Nhấn nút <strong>"Tạo nhanh VietQR từ STK"</strong> để hệ thống tự động đồng bộ mã QR chuẩn Ngân hàng Nhà nước (NAPAS 247) theo số tài khoản và chủ tài khoản đã khai báo ở mục 4.
              </p>
            </div>
          </div>

          {/* Cột phải: Khung xem trước trực tiếp (Live QR Preview Card) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-900/95 rounded-2xl border border-slate-800 text-center text-white">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 mb-3 block">
              Xem trước hiển thị trên trang (/sponsor)
            </span>

            {/* Thẻ QR chuẩn giống trên trang thực tế */}
            <div className="w-full max-w-[210px] bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center text-slate-900 border-2 border-sky-400 space-y-1.5">
              <div className="text-[11px] font-black text-[#0284C7] uppercase tracking-wide">
                {sponsorQrCodeTitle || 'VietQR Chuyển Khoản Nhanh'}
              </div>

              <div className="w-36 h-36 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                {sponsorQrCodeUrl ? (
                  <img
                    src={sponsorQrCodeUrl}
                    alt="Xem trước mã QR"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 p-2">
                    <QrCode size={40} className="stroke-[1.5]" />
                    <span className="text-[9px] text-slate-400 mt-1 font-semibold">Chưa có mã QR</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 font-medium leading-tight">
                {sponsorQrCodeSubtitle || 'Quét bằng mọi ứng dụng Ngân hàng & Ví điện tử'}
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
              <Check size={13} className="text-emerald-400" />
              <span>{sponsorQrCodeUrl ? 'Đã nạp mã QR sẵn sàng hiển thị' : 'Đang để trống'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. KHỐI ĐỒNG HÀNH & HỢP TÁC CÙNG SFN (MỤC 6 TRÊN TRANG) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HeartHandshake size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              6. Khối Đồng hành & Hợp tác cùng Sky First Network
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Khung trung tâm điều hướng liên hệ tài trợ
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối
            </label>
            <input
              type="text"
              value={sponsorContactHeading}
              onChange={(e) => setSponsorContactHeading(e.target.value)}
              placeholder="Đồng hành & Hợp tác cùng Sky First Network"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả hướng dẫn
            </label>
            <textarea
              rows={2}
              value={sponsorContactDescription}
              onChange={(e) => setSponsorContactDescription(e.target.value)}
              placeholder="Quý Doanh nghiệp, Tổ chức và Quý Nhà tài trợ vui lòng liên hệ..."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Nút 1 */}
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <span className="text-xs font-extrabold text-[#0284C7] block">
                Nút hành động 1 (Gửi đề xuất)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={sponsorContactButtonLabel}
                  onChange={(e) => setSponsorContactButtonLabel(e.target.value)}
                  placeholder="Gửi Đề Xuất Tại Trang Liên Hệ"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Liên kết trỏ đến
                </label>
                <input
                  type="text"
                  value={sponsorContactButtonUrl}
                  onChange={(e) => setSponsorContactButtonUrl(e.target.value)}
                  placeholder="/contact"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Nút 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-extrabold text-slate-700 block">
                Nút hành động 2 (Xem 5 đơn vị)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={sponsorUnitsButtonLabel}
                  onChange={(e) => setSponsorUnitsButtonLabel(e.target.value)}
                  placeholder="Xem Chi Tiết 5 Đơn Vị"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Liên kết trỏ đến
                </label>
                <input
                  type="text"
                  value={sponsorUnitsButtonUrl}
                  onChange={(e) => setSponsorUnitsButtonUrl(e.target.value)}
                  placeholder="/units"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Phone size={13} className="text-[#0284C7]" />
                Hotline Đối Ngoại
              </label>
              <input
                type="text"
                value={sponsorContactHotline}
                onChange={(e) => setSponsorContactHotline(e.target.value)}
                placeholder="0912.838.xxx"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-mono rounded-xl focus:outline-hidden"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Mail size={13} className="text-[#0284C7]" />
                Email Đối Ngoại
              </label>
              <input
                type="text"
                value={sponsorContactEmail}
                onChange={(e) => setSponsorContactEmail(e.target.value)}
                placeholder="hoptac.sfn@gmail.com"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-mono rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. CÂU HỎI THƯỜNG GẶP VỀ TÀI TRỢ (FAQS) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-amber-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              7. Câu hỏi thường gặp về hợp tác & đồng hành (FAQs)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Giải đáp 4 câu hỏi thường gặp về minh bạch, chứng nhận và pháp lý
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối FAQ
            </label>
            <input
              type="text"
              value={sponsorFaqHeading}
              onChange={(e) => setSponsorFaqHeading(e.target.value)}
              placeholder="Câu hỏi thường gặp về hợp tác & đồng hành"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Huy hiệu danh mục
            </label>
            <input
              type="text"
              value={sponsorFaqSubtitle}
              onChange={(e) => setSponsorFaqSubtitle(e.target.value)}
              placeholder="GIẢI ĐÁP THẮC MẮC"
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* FAQ 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Câu hỏi 1: Đóng góp cá nhân</span>
            <input
              type="text"
              value={sponsorFaq1Q}
              onChange={(e) => setSponsorFaq1Q(e.target.value)}
              placeholder="Cá nhân có thể đề xuất đồng hành cùng Sky First Network không?"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorFaq1A}
              onChange={(e) => setSponsorFaq1A(e.target.value)}
              placeholder="Cá nhân hoặc đơn vị có thể gửi đề xuất đồng hành..."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {/* FAQ 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Câu hỏi 2: Kiểm tra tính minh bạch</span>
            <input
              type="text"
              value={sponsorFaq2Q}
              onChange={(e) => setSponsorFaq2Q(e.target.value)}
              placeholder="Làm sao tôi có thể kiểm tra tính minh bạch của số tiền đã tài trợ?"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorFaq2A}
              onChange={(e) => setSponsorFaq2A(e.target.value)}
              placeholder="Chỉ công bố thông tin tài chính khi có dữ liệu và cơ chế được xác nhận."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {/* FAQ 3 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Câu hỏi 3: Cấp Giấy Chứng Nhận</span>
            <input
              type="text"
              value={sponsorFaq3Q}
              onChange={(e) => setSponsorFaq3Q(e.target.value)}
              placeholder="Nhà tài trợ có được cấp Giấy Chứng Nhận chính thức không?"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorFaq3A}
              onChange={(e) => setSponsorFaq3A(e.target.value)}
              placeholder="Có. Toàn bộ nhà tài trợ và đối tác đồng hành đều được Ban Quản lý Chứng nhận Số (hệ thống Giấy chứng nhận)..."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {/* FAQ 4 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Câu hỏi 4: Khấu trừ thuế TNDN</span>
            <input
              type="text"
              value={sponsorFaq4Q}
              onChange={(e) => setSponsorFaq4Q(e.target.value)}
              placeholder="Doanh nghiệp có được khấu trừ thuế TNDN cho khoản tài trợ này không?"
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
            <textarea
              rows={2}
              value={sponsorFaq4A}
              onChange={(e) => setSponsorFaq4A(e.target.value)}
              placeholder="Nội dung hợp tác được xem xét theo từng trường hợp cụ thể."
              className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 8. KHỐI TRAO ĐỔI TRỰC TIẾP (BANNER CUỐI TRANG - QUICK CTA) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              8. Khối Trao Đổi Trực Tiếp (Banner Cuối Trang)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Banner chân trang điều hướng xem đơn vị hoặc tham gia
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề banner
            </label>
            <input
              type="text"
              value={sponsorCtaTitle}
              onChange={(e) => setSponsorCtaTitle(e.target.value)}
              placeholder="Bạn muốn trao đổi trực tiếp cùng Ban Chấp hành Sky First Network?"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả banner
            </label>
            <textarea
              rows={2}
              value={sponsorCtaDescription}
              onChange={(e) => setSponsorCtaDescription(e.target.value)}
              placeholder="Vui lòng gọi hotline đối ngoại hoặc đặt lịch hẹn gặp trực tiếp tại Sky First Network."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nút 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-extrabold text-slate-700 block">
                Nút hành động 1 (Xem các đơn vị)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={buttonLabel}
                  onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="Xem các đơn vị"
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
                  placeholder="/units"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Nút 2 */}
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <span className="text-xs font-extrabold text-[#0284C7] block">
                Nút hành động 2 (Tham gia Sky First Network)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={secondaryButtonLabel}
                  onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                  placeholder="Tham gia Sky First Network"
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
                  placeholder="/join"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. NỘI DUNG THƯ NGỎ / QUY CHẾ VẬN ĐỘNG TÀI TRỢ BỔ SUNG (TÙY CHỌN) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-slate-700" />
            <h3 className="text-sm font-extrabold text-slate-900">
              9. Thư Ngỏ / Quy Chế Vận Động Tài Trợ Bổ Sung (Tùy chọn)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Soạn văn bản/quy chế xuất hiện thêm trên trang tài trợ
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Bạn có thể nhập thư ngỏ kêu gọi tài trợ của Ban Chấp hành Sky First Network, quy chế tiếp nhận và quản lý nguồn quỹ hoặc dán trực tiếp từ Word, Docs (tự động giữ nguyên định dạng in đậm, danh sách, bảng biểu).
        </p>

        <div>
          <RichTextEditor
            id="editor-sponsor-content"
            value={contentFormatted}
            onChange={setContentFormatted}
            placeholder="Nhập hoặc dán thư ngỏ, quy chế tài trợ..."
            minHeight="240px"
          />
        </div>
      </div>
    </div>
  );
};
