import React, { useState } from 'react';
import { 
  Building, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Globe, 
  Send,
  ArrowRight,
  ShieldCheck, 
  Compass,
  MapPin,
  ExternalLink,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDataContext } from '../context/DataContext';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { PageRoute, NetworkUnit } from '../types';

interface UnitsPageProps {
  onNavigate: (page: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const UnitsPage: React.FC<UnitsPageProps> = ({ onNavigate, onShowToast }) => {
  const { networkUnits } = useDataContext();

  const themeColors: Record<string, { badge: string; border: string; text: string; bg: string }> = {
    sky: { badge: 'bg-sky-50 text-[#0284C7] border-sky-200', border: 'border-sky-200', text: 'text-[#0284C7]', bg: 'bg-sky-50' },
    emerald: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', border: 'border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    amber: { badge: 'bg-amber-50 text-amber-700 border-amber-200', border: 'border-amber-200', text: 'text-amber-700', bg: 'bg-amber-50' },
    rose: { badge: 'bg-rose-50 text-rose-700 border-rose-200', border: 'border-rose-200', text: 'text-rose-700', bg: 'bg-rose-50' },
    indigo: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', border: 'border-indigo-200', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7]">
            <Building size={14} />
            <span>HỆ THỐNG TỔ CHỨC SFN 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Các Đơn Vị Trực Thuộc Mạng Lưới
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Sky First Network hoạt động qua hệ thống 5 đơn vị chuyên trách, phân công đồng bộ trong giáo dục đào tạo, phong trào tình nguyện, nghiên cứu xã hội, sáng tạo truyền thông và quản trị dữ liệu số.
          </p>
        </motion.div>
      </section>

      {/* 2. Grid of Units */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0284C7] tracking-tight">
              5 Đơn Vị Chuyên Trách
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            5 Đơn vị trực thuộc
          </span>
        </div>

        {/* Grid of Units */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {networkUnits.map((unit, uIdx) => {
            const theme = themeColors[unit.theme] || themeColors.sky;
            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: uIdx * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-lg transition-all p-6 sm:p-8 flex flex-col h-full group"
              >
                {/* 1. Top Badge Row (Equal height across cards) */}
                <div className="h-8 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black border ${theme.badge}`}>
                      {unit.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {unit.categoryLabel}
                    </span>
                  </div>
                  {unit.isFlagship ? (
                    <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-500" />
                      <span>Đơn vị nòng cốt</span>
                    </span>
                  ) : (
                    <div className="h-6" aria-hidden="true" />
                  )}
                </div>

                {/* 2. Title (Aligned height) */}
                <div className="mt-4 min-h-[3.75rem] sm:min-h-[4.25rem] flex items-center">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
                    {unit.name}
                  </h3>
                </div>

                {/* 3. Description / Tagline (Aligned height) */}
                <div className="mt-1.5 min-h-[2.85rem] sm:min-h-[3rem] flex items-start">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">
                    {unit.tagline}
                  </p>
                </div>

                {/* 4. Leader Info (Aligned height) */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs min-h-[64px]">
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-400 block text-[11px] font-semibold">Phụ trách đơn vị:</span>
                    <span className="font-bold text-slate-800 truncate block">{unit.leader.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 flex-shrink-0 text-right max-w-[50%] leading-snug">
                    {unit.leader.title}
                  </span>
                </div>

                {/* 5. Image Placeholder (Aligned aspect-video frame with external URL support) */}
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-150 aspect-video w-full flex-shrink-0">
                  <ImagePlaceholder
                    sizeText={unit.imageSizeText}
                    description={unit.imageDescription}
                    aspectRatio="video"
                    theme={unit.theme as any}
                    imageUrl={unit.imageUrl}
                  />
                </div>

                {/* 6. Functions / Missions (Aligned height) */}
                <div className="mt-5 space-y-2 min-h-[175px] sm:min-h-[165px] flex flex-col justify-start">
                  <h4 className="text-xs font-black text-[#0284C7] uppercase tracking-wider">
                    Chức năng & Trách nhiệm chính:
                  </h4>
                  <div className="space-y-2">
                    {unit.functions.map((fn, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{fn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Key Projects (Aligned height) */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 min-h-[76px] sm:min-h-[72px] flex flex-col justify-start">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Chương trình / Dự án tiêu biểu:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {unit.keyProjects.map((p, pIdx) => (
                      <span key={pIdx} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        • {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 8. Contact Info Bar (Aligned height) */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 min-h-[38px] items-center">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-[#0284C7] flex-shrink-0" />
                    <span className="truncate">{unit.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-600 flex-shrink-0" />
                    <span>{unit.contact.phone}</span>
                  </div>
                </div>

                {/* 9. Card Action Buttons (Pinned to bottom) */}
                <div className="mt-auto pt-4 flex flex-wrap items-center gap-2.5 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onNavigate('contact')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 border border-sky-200 group-hover:border-[#0284C7]"
                  >
                    <span>Liên hệ làm việc</span>
                    <ChevronRight size={14} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onNavigate('programs')}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Xem dự án
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Deep Dive Tiêu Điểm: SFEC (Flagship Training Center) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border border-sky-200 shadow-2xs space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-xs mb-2">
                <GraduationCap size={14} className="text-white" />
                <span>Tiêu điểm đơn vị đào tạo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Mô Hình Service-Learning Tại Trung Tâm SFEC
              </h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('programs')}
              className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-sm self-start md:self-auto"
            >
              <span>Xem lịch khai giảng 2026</span>
              <ArrowRight size={15} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-sky-150 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-black">
                01
              </div>
              <h3 className="font-black text-base text-slate-900">Kỹ Năng Lãnh Đạo Trẻ</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Đào tạo tư duy lãnh đạo phục vụ, kỹ năng giải quyết mâu thuẫn, điều phối đội nhóm và quản trị ngân sách dự án.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sky-150 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="font-black text-base text-slate-900">Ứng Dụng Công Nghệ & AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Trang bị các công cụ số mới nhất: Prompt Engineering, Notion Project Management, Canva Design và Tự động hóa quy trình.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sky-150 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="font-black text-base text-slate-900">SFEC Mentorship Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Mạng lưới cố vấn 1-on-1 đồng hành cùng học viên trong định hướng nghề nghiệp, kỹ năng viết CV, phỏng vấn và học bổng.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. CTA Kết Nối & Liên Hệ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Bạn Cần Hợp Tác Hoặc Đặt Lịch Làm Việc Với Các Đơn Vị?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Hệ thống tiếp nhận thông tin và điều phối chuyên môn của Sky First Network sẵn sàng kết nối bạn trực tiếp với Ban Lãnh đạo từng đơn vị.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-md shadow-sky-500/20 flex items-center gap-2"
            >
              <span>Đến Trang Liên Hệ SFN</span>
              <ChevronRight size={15} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate('programs')}
              className="px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition"
            >
              Xem Dự Án Triển Khai
            </motion.button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
