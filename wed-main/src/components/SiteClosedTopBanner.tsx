import React from 'react';
import { Wrench, Edit3, RefreshCw } from 'lucide-react';
import { SiteConfig } from '../types';

interface SiteClosedTopBannerProps {
  siteConfig: SiteConfig;
  onNavigateToAdmin?: () => void;
}

export const SiteClosedTopBanner: React.FC<SiteClosedTopBannerProps> = ({
  siteConfig,
}) => {
  if (siteConfig.siteStatus !== 'closed') return null;

  const reasonLabel =
    siteConfig.closedReason === 'editing'
      ? 'Đang biên tập nội dung'
      : siteConfig.closedReason === 'upgrading'
      ? 'Đang nâng cấp hệ thống'
      : 'Đang bảo trì định kỳ';

  const reasonDetail =
    siteConfig.closedReasonText ||
    siteConfig.closedMessage ||
    'Website hiện đang tạm đóng một số tính năng để cập nhật dữ liệu mới.';

  return (
    <aside aria-label="Thông báo trạng thái hệ thống" className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white text-xs py-2.5 px-4 shadow-md sticky top-0 z-50 transition-all border-b border-white/15">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] tracking-wider uppercase backdrop-blur-xs">
            {siteConfig.closedReason === 'editing' ? (
              <Edit3 size={11} />
            ) : siteConfig.closedReason === 'upgrading' ? (
              <RefreshCw size={11} />
            ) : (
              <Wrench size={11} />
            )}
            <span>{reasonLabel}</span>
          </span>

          <span className="font-semibold text-white/95 text-xs sm:text-sm">
            {reasonDetail}
          </span>

          {siteConfig.closedEstimatedReopen && (
            <span className="text-white/85 text-[11px] sm:text-xs font-medium bg-black/15 px-2 py-0.5 rounded-md">
              (Dự kiến: {siteConfig.closedEstimatedReopen})
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
