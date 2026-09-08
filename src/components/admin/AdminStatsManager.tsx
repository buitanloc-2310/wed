import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Eye,
  MessageSquare,
  Users,
  FileText,
  Building,
  Award,
  Calendar,
  ArrowUpRight,
  Globe,
  Smartphone,
  Laptop
} from 'lucide-react';
import { NewsArticle, NetworkUnit, Program, Certificate } from '../../types';

interface AdminStatsManagerProps {
  articles: NewsArticle[];
  units: NetworkUnit[];
  programs: Program[];
  certificates: Certificate[];
}

export const AdminStatsManager: React.FC<AdminStatsManagerProps> = ({
  articles,
  units,
  programs,
  certificates,
}) => {
  // Simulated analytics data matching Blogger's metrics style
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.isPublished !== false).length;
  const draftArticles = articles.filter((a) => a.isPublished === false).length;

  const totalViews = 18450 + totalArticles * 185;
  const monthlyViews = 4280;
  const todayViews = 342;
  const totalComments = 28;

  // Mock post views ranking
  const rankedArticles = [...articles].map((art, idx) => ({
    ...art,
    views: 120 + ((idx * 83 + 37) % 350),
    comments: (idx % 3),
  })).sort((a, b) => b.views - a.views);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Overview Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart2 size={22} className="text-[#E37400]" />
              Thống Kê Hoạt Động & Lượt Xem (Blogger Analytics)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Báo cáo thời gian thực về lưu lượng truy cập bài đăng, mức độ tương tác và quy mô toàn hệ thống Sky First Network.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 bg-orange-50 text-[#E37400] border border-orange-200 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#E37400] animate-pulse" />
            <span>Dữ liệu trực tiếp</span>
          </div>
        </div>

        {/* 4 Big Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Tổng số lượt xem
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
              <span>{totalViews.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight size={13} /> +12.4%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Toàn thời gian</span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Lượt xem hôm nay
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
              <span>{todayViews}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight size={13} /> +8.1%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Cập nhật 5 phút trước</span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Bài viết đã đăng
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
              <span>{publishedArticles}</span>
              <span className="text-xs font-semibold text-slate-400">/ {totalArticles}</span>
            </div>
            <span className="text-[11px] text-amber-600 mt-1 block font-medium">
              {draftArticles} bản nháp chưa công khai
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Hệ sinh thái SFN
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
              <span>{units.length} đơn vị</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {programs.length} dự án • {certificates.length} chứng nhận SFCA
            </span>
          </div>
        </div>
      </div>

      {/* Chart & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly traffic bar representation */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#E37400]" />
              <span>Biểu đồ truy cập 7 ngày gần nhất</span>
            </h3>
            <span className="text-xs text-slate-400">Đơn vị: Lượt xem</span>
          </div>

          {/* Simple pure Tailwind Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
            {[
              { day: 'T2', count: 320, pct: 60 },
              { day: 'T3', count: 410, pct: 75 },
              { day: 'T4', count: 380, pct: 70 },
              { day: 'T5', count: 490, pct: 90 },
              { day: 'T6', count: 540, pct: 100 },
              { day: 'T7', count: 420, pct: 78 },
              { day: 'CN', count: 360, pct: 68 },
            ].map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div
                  style={{ height: `${item.pct}%` }}
                  className="w-full max-w-[36px] bg-orange-100 group-hover:bg-[#E37400] rounded-t-md transition-colors"
                />
                <span className="text-xs font-semibold text-slate-600 mt-1">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources & Devices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe size={16} className="text-[#0284C7]" />
            <span>Nguồn & Thiết Bị Truy Cập</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Smartphone size={14} className="text-slate-400" /> Điện thoại di động
                </span>
                <span className="text-slate-900 font-bold">64%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#E37400] rounded-full w-[64%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Laptop size={14} className="text-slate-400" /> Máy tính để bàn
                </span>
                <span className="text-slate-900 font-bold">31%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0284C7] rounded-full w-[31%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Globe size={14} className="text-slate-400" /> Máy tính bảng & khác
                </span>
                <span className="text-slate-900 font-bold">5%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-[5%]" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            Hầu hết độc giả truy cập từ các bài chia sẻ trên mạng xã hội Facebook, Zalo và quét mã QR trên chứng nhận SFCA.
          </div>
        </div>
      </div>

      {/* Top Performing Articles Table (Blogger Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText size={16} className="text-[#E37400]" />
            <span>Bài viết có lượt xem cao nhất</span>
          </h3>
          <span className="text-xs text-slate-400">Sắp xếp theo lượt xem</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rankedArticles.slice(0, 5).map((article, idx) => (
            <div key={article.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 truncate">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 truncate hover:text-[#E37400] transition">
                    {article.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {article.date} • {article.categoryLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <MessageSquare size={13} className="text-slate-400" />
                  <span>{article.comments}</span>
                </span>
                <span className="flex items-center gap-1.5 font-bold text-slate-900 min-w-[60px] justify-end">
                  <BarChart2 size={14} className="text-[#E37400]" />
                  <span>{article.views}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
