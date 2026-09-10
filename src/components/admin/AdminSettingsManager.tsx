import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Database
} from 'lucide-react';
import { SiteConfig, PageRoute } from '../../types';

interface AdminSettingsManagerProps {
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (updates: Partial<SiteConfig>) => void;
  onExport: () => void;
  onOpenImportModal: () => void;
  onOpenResetConfirm: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({
  siteConfig,
  onUpdateSiteConfig,
  onExport,
  onOpenImportModal,
  onOpenResetConfirm,
  onShowToast,
}) => {
  const [tempConfig, setTempConfig] = useState<SiteConfig>({ ...siteConfig });

  const handleSave = () => {
    onUpdateSiteConfig(tempConfig);
    onShowToast('Đã lưu toàn bộ cài đặt hệ thống thành công!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings size={22} className="text-[#E37400]" />
            Cài Đặt Hệ Thống & Lưu Trữ (Cài đặt website)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình thông tin cơ bản của website, tiêu đề xuất bản, quyền riêng tư và sao lưu dữ liệu toàn hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#E37400] hover:bg-[#D36300] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Save size={15} />
          <span>Lưu Thay Đổi</span>
        </button>
      </div>

      {/* Basic Settings (giao diện quản trị) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Globe size={16} className="text-[#0284C7]" />
          <span>Thông Tin Cơ Bản Website</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tiêu đề blog / Website <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tempConfig.siteName}
              onChange={(e) => setTempConfig({ ...tempConfig, siteName: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#E37400] outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Khẩu hiệu định vị (Tagline)
            </label>
            <input
              type="text"
              value={tempConfig.tagline}
              onChange={(e) => setTempConfig({ ...tempConfig, tagline: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#E37400] outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Mô tả tóm tắt cho công cụ tìm kiếm (Search Meta Description)
          </label>
          <textarea
            rows={2}
            value={tempConfig.heroSubtext}
            onChange={(e) => setTempConfig({ ...tempConfig, heroSubtext: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#E37400] outline-none transition"
          />
        </div>

        {/* Contact info */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-800 block mb-3">
            Thông tin liên hệ & Ban Chấp hành
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Email hỗ trợ</label>
              <input
                type="email"
                value={tempConfig.email}
                onChange={(e) => setTempConfig({ ...tempConfig, email: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Hotline liên hệ</label>
              <input
                type="text"
                value={tempConfig.hotline}
                onChange={(e) => setTempConfig({ ...tempConfig, hotline: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Địa chỉ liên hệ công khai (nếu có)</label>
              <input
                type="text"
                value={tempConfig.address}
                onChange={(e) => setTempConfig({ ...tempConfig, address: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backup, Import & Defaults (Database Section) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Database size={16} className="text-[#E37400]" />
          <span>Quản Trị Cơ Sở Dữ Liệu & Sao Lưu (Data Management)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Export button */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Sao lưu dữ liệu</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tải về tệp JSON chứa toàn bộ bài đăng, đơn vị, dự án và chứng nhận.
              </p>
            </div>
            <button
              type="button"
              onClick={onExport}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Tải bản sao lưu JSON</span>
            </button>
          </div>

          {/* Import button */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Nhập dữ liệu</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Phục hồi dữ liệu từ bản sao lưu JSON đã tải trước đó.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenImportModal}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Upload size={14} />
              <span>Nhập tệp JSON</span>
            </button>
          </div>

          {/* Reset button */}
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200/80 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-rose-800 block">Khôi phục mặc định</span>
              <p className="text-[11px] text-rose-600/80 mt-0.5">
                Đặt lại toàn bộ nội dung về phiên bản khởi tạo gốc của Sky First Network.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenResetConfirm}
              className="w-full py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Đặt lại mặc định</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
