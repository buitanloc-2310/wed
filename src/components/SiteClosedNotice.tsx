import React from 'react';
import {
  Wrench,
  Edit3,
  RefreshCw,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { SiteConfig } from '../types';

interface SiteClosedNoticeProps {
  siteConfig: SiteConfig;
  onNavigateToAdmin?: () => void;
  onNavigateToContact?: () => void;
}

export const SiteClosedNotice: React.FC<SiteClosedNoticeProps> = ({
  siteConfig,
}) => {
  const reasonText =
    siteConfig.closedReasonText ||
    (siteConfig.closedReason === 'editing'
      ? 'Hệ thống đang trong quá trình biên tập nội dung'
      : siteConfig.closedReason === 'upgrading'
      ? 'Hệ thống đang nâng cấp tính năng & cơ sở hạ tầng'
      : 'Hệ thống đang bảo trì định kỳ');

  const getReasonIcon = () => {
    switch (siteConfig.closedReason) {
      case 'editing':
        return <Edit3 className="w-8 h-8 text-amber-600" />;
      case 'upgrading':
        return <RefreshCw className="w-8 h-8 text-sky-600 animate-spin-slow" />;
      default:
        return <Wrench className="w-8 h-8 text-rose-600" />;
    }
  };

  const getBadgeColor = () => {
    switch (siteConfig.closedReason) {
      case 'editing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'upgrading':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3FF] to-[#2563EB] flex items-center justify-center font-black text-white text-lg shadow-md shadow-sky-500/20 overflow-hidden">
            {siteConfig.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt={siteConfig.siteName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>S</span>
            )}
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
              {siteConfig.siteName || 'Sky First Network'}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium -mt-0.5">
              {siteConfig.siteDescription || siteConfig.tagline || 'Mạng lưới Giáo dục & Phát triển Cộng đồng'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Center Announcement Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="max-w-2xl w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500" />

          {/* Status Icon & Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-inner mb-5">
            {getReasonIcon()}
          </div>

          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getBadgeColor()}`}
            >
              {siteConfig.closedReason === 'editing'
                ? 'Đang Biên Tập Nội Dung'
                : siteConfig.closedReason === 'upgrading'
                ? 'Đang Nâng Cấp Hệ Thống'
                : 'Đang Bảo Trì Website'}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug mb-3">
            {reasonText}
          </h2>

          {/* Description Message */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8 max-w-lg mx-auto">
            {siteConfig.closedMessage ||
              'Website hiện đang tạm thời đóng để đội ngũ kỹ thuật và ban biên tập chuẩn hóa dữ liệu mới. Mọi dịch vụ và tiện ích sẽ sớm trở lại hoạt động bình thường.'}
          </p>

          {/* Key Details Grid: Estimated reopen & Hotline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 text-left max-w-lg mx-auto">
            <div className="bg-slate-900/70 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                  Dự kiến hoàn thành
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-100 block mt-0.5">
                  {siteConfig.closedEstimatedReopen || 'Đang cập nhật thời gian'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                  Đường dây hỗ trợ
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-100 block mt-0.5">
                  {siteConfig.hotline || '0337 775 329'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2"
              >
                <Mail size={15} />
                <span>Gửi Email hỗ trợ ({siteConfig.email})</span>
              </a>
            )}

            {siteConfig.hotline && (
              <a
                href={`tel:${siteConfig.hotline.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition flex items-center justify-center gap-2"
              >
                <Phone size={15} className="text-slate-400" />
                <span>Gọi Hotline</span>
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-3 text-center text-xs text-slate-500">
        <p>
          {siteConfig.siteName || 'Sky First Network'} • Thông báo tạm dừng hoạt động
        </p>
      </footer>
    </div>
  );
};
