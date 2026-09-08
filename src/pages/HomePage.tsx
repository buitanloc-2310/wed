import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Award, 
  GraduationCap, 
  HeartHandshake, 
  Network, 
  Megaphone, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Users, 
  Compass,
  Building,
  BookOpen,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { useDataContext } from '../context/DataContext';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { PageRoute, Program, NewsArticle } from '../types';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectProgram: (program: Program) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProgram,
  onSelectArticle,
}) => {
  const { siteConfig, corePillars, programs, newsArticles } = useDataContext();

  const dynamicStats = [
    {
      label: siteConfig.stats.membersLabel || 'Thành viên & Tình nguyện viên',
      value: siteConfig.stats.membersCount,
      subtext: siteConfig.stats.membersSubtext,
      color: 'sky',
    },
    {
      label: siteConfig.stats.provincesLabel || 'Điểm trường kết nối',
      value: siteConfig.stats.provincesCount,
      subtext: siteConfig.stats.provincesSubtext,
      color: 'emerald',
    },
    {
      label: siteConfig.stats.hoursLabel || 'Giờ tình nguyện cống hiến',
      value: siteConfig.stats.volunteerHours,
      subtext: siteConfig.stats.hoursSubtext,
      color: 'amber',
    },
    {
      label: siteConfig.stats.projectsLabel || 'Dự án & Chiến dịch',
      value: siteConfig.stats.communityProjects,
      subtext: siteConfig.stats.projectsSubtext,
      color: 'rose',
    },
  ];

  const pillarIcons: Record<string, React.ReactNode> = {
    GraduationCap: <GraduationCap size={22} className="text-[#0284C7]" />,
    Sparkles: <Sparkles size={22} className="text-amber-500" />,
    HeartHandshake: <HeartHandshake size={22} className="text-emerald-500" />,
    Network: <Network size={22} className="text-indigo-500" />,
    Megaphone: <Megaphone size={22} className="text-rose-500" />,
  };

  const pillarColorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    '01': { bg: 'bg-sky-50/70', border: 'border-sky-200', text: 'text-sky-950', badge: 'bg-[#0284C7]' },
    '02': { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-950', badge: 'bg-amber-500' },
    '03': { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-950', badge: 'bg-emerald-500' },
    '04': { bg: 'bg-indigo-50/70', border: 'border-indigo-200', text: 'text-indigo-950', badge: 'bg-indigo-500' },
    '05': { bg: 'bg-rose-50/70', border: 'border-rose-200', text: 'text-rose-950', badge: 'bg-rose-500' },
  };

  const sections = siteConfig.homeSections || {};

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION WITH VIBRANT AZURE GRADIENTS */}
      {sections.hero !== false && (
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-10 bg-gradient-to-b from-sky-100/70 via-white to-slate-50/40">
        
        {/* Soft Background Visual Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-16 right-10 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-6 left-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-7 space-y-5 text-center lg:text-left"
            >
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 shadow-2xs text-xs font-extrabold text-[#0284C7]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{siteConfig.heroBadge}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
                {siteConfig.heroHeading}
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {siteConfig.heroSubtext}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                {/* 1. Giới thiệu Sky First Network */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md shadow-sky-400/25 flex items-center gap-2"
                >
                  <Info size={16} className="text-white" />
                  <span>{siteConfig.heroButton1Text || 'Giới thiệu Sky First Network'}</span>
                </motion.button>

                {/* 2. Tra cứu Giấy chứng nhận */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate('certificate')}
                  className="px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-2xs"
                >
                  <Award size={16} className="text-emerald-700" />
                  <span>{siteConfig.heroButton2Text || 'Tra cứu Giấy chứng nhận'}</span>
                </motion.button>

                {/* 3. Tham gia Sky First Network Ngay */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate('join')}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md shadow-emerald-500/25 flex items-center gap-2"
                >
                  <span>{siteConfig.heroButton3Text || 'Tham gia Sky First Network Ngay'}</span>
                  <ArrowRight size={16} />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  <span>100% Phi lợi nhuận</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-sky-500" />
                  <span>Cấp GCN điện tử chuẩn hóa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-amber-500" />
                  <span>Mạng lưới thanh niên toàn quốc</span>
                </div>
              </div>

            </motion.div>

            {/* Right Image Frame Placeholder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5 space-y-3"
            >
              <div className="relative p-2 sm:p-3 bg-white rounded-3xl shadow-lg border border-sky-200/80">
                <ImagePlaceholder
                  sizeText="16:9 (1200x675px)"
                  description="Hình ảnh Banner Hoạt động Tổng quan SFN 2026"
                  aspectRatio="video"
                  theme="sky"
                  className="shadow-2xs"
                  imageUrl={siteConfig.heroImageUrl}
                />
                <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Sparkles size={13} /> Hoạt động thực tế & Đào tạo
                  </span>
                  <span>SFN Hub Media 2026</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      )}

      {/* 2. MULTI-COLOR IMPACT STATS */}
      {sections.stats !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {dynamicStats.map((stat, idx) => {
            const styles = {
              sky: 'bg-gradient-to-br from-sky-50 to-blue-100/60 border-sky-200 text-sky-600',
              emerald: 'bg-gradient-to-br from-emerald-50 to-teal-100/60 border-emerald-200 text-emerald-600',
              amber: 'bg-gradient-to-br from-amber-50 to-orange-100/60 border-amber-200 text-amber-600',
              rose: 'bg-gradient-to-br from-rose-50 to-pink-100/60 border-rose-200 text-rose-600',
            }[stat.color as 'sky' | 'emerald' | 'amber' | 'rose'] || 'bg-slate-50 border-slate-200 text-sky-600';

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 shadow-2xs hover:shadow-md ${styles.split('text-')[0]}`}
              >
                <div className={`text-3xl sm:text-4xl font-black mb-1 tracking-tight ${stat.color === 'sky' ? 'text-[#0284C7]' : stat.color === 'emerald' ? 'text-emerald-600' : stat.color === 'amber' ? 'text-amber-600' : 'text-rose-600'}`}>
                  {stat.value}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                  {stat.subtext}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      )}

      {/* 3. 5 LĨNH VỰC HOẠT ĐỘNG (5 CORE PILLARS) */}
      {sections.pillars !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0284C7] tracking-tight">
                {siteConfig.pillarsHeading || 'Lĩnh Vực Trọng Tâm'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {siteConfig.pillarsSubtext || 'Các trụ cột chiến lược định hướng toàn bộ chương trình và dự án phụng sự của SFN'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('programs')}
            className="text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 transition flex-shrink-0"
          >
            <span>Xem chi tiết các chương trình</span>
            <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {corePillars.map((pillar, pIdx) => {
            const colors = pillarColorClasses[pillar.number] || pillarColorClasses['01'];
            return (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: pIdx * 0.08 }}
                whileHover={{ y: -5 }}
                className={`p-6 sm:p-7 rounded-3xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`w-8 h-8 rounded-xl ${colors.badge} text-white font-black text-xs flex items-center justify-center shadow-2xs`}>
                      {pillar.number}
                    </span>
                    <div className="p-2 rounded-xl bg-white shadow-2xs">
                      {pillarIcons[pillar.iconName]}
                    </div>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-black ${colors.text} leading-snug`}>
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {pillar.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => onNavigate('programs')}
                    className="text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 transition"
                  >
                    <span>Khám phá hoạt động</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Callout Card */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="p-6 sm:p-7 rounded-3xl border border-sky-300 bg-gradient-to-br from-[#00A3FF] via-[#0284C7] to-[#2563EB] text-white flex flex-col justify-between space-y-5 shadow-md shadow-sky-500/20"
          >
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-black leading-snug text-white">
                Tham gia Sky First Network
              </h3>
              <p className="text-sm text-sky-100 leading-relaxed font-normal">
                SFN luôn mở rộng cơ hội cho tình nguyện viên, học viên và các đối tác cùng chung tay kiến tạo giá trị cộng đồng.
              </p>
            </div>

            <button
              onClick={() => onNavigate('join')}
              className="w-full py-3.5 bg-white hover:bg-sky-50 text-[#0284C7] font-black text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>Đăng ký tham gia ngay</span>
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      </section>
      )}

      {/* 4. CHƯƠNG TRÌNH & DỰ ÁN NỔI BẬT */}
      {sections.programs !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0284C7] tracking-tight">
                Chương Trình Tiêu Biểu
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Các khóa học thực chiến và chiến dịch tình nguyện đang mở đơn tiếp nhận thành viên
            </p>
          </div>
          <button
            onClick={() => onNavigate('programs')}
            className="text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 transition flex-shrink-0"
          >
            <span>Xem tất cả ({programs.length})</span>
            <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {programs.slice(0, 3).map((prog, prIdx) => {
            const isVolunteer = prog.category === 'volunteer';
            const isRecruit = prog.category === 'recruitment';
            const themeColor = isVolunteer ? 'emerald' : isRecruit ? 'amber' : 'sky';

            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: prIdx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Frame Placeholder */}
                  <div className="p-3 bg-slate-50/80 border-b border-slate-100">
                    <ImagePlaceholder
                      sizeText={prog.imageSizeText}
                      description={prog.imageDescription}
                      aspectRatio="video"
                      theme={themeColor}
                      imageUrl={prog.imageUrl}
                    />
                  </div>

                  <div className="p-6 space-y-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                        prog.category === 'volunteer'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : prog.category === 'recruitment'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-sky-50 text-[#0284C7] border-sky-200'
                      }`}>
                        {prog.categoryLabel}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                        prog.status === 'open'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {prog.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2 leading-snug">
                      {prog.title}
                    </h3>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {prog.summary}
                    </p>

                    <div className="pt-1 space-y-2 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-[#0284C7] flex-shrink-0" />
                        <span className="truncate">{prog.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin size={14} className="text-[#0284C7] flex-shrink-0" />
                        <span className="truncate">{prog.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectProgram(prog)}
                    className="w-full py-3 rounded-xl border border-sky-200 hover:bg-sky-50 text-[#0284C7] font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                  >
                    <span>Xem chi tiết & Đăng ký</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      )}

      {/* 5. ĐƠN VỊ TRỰC THUỘC */}
      {sections.units !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50/50 to-emerald-50/40 border border-sky-200 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-2xs">
                <Building size={14} className="text-sky-200" />
                <span>Hệ thống tổ chức chuyên môn</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#0284C7] tracking-tight">
                Các Đơn Vị Trực Thuộc SFN
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Mạng lưới SFN quy tụ 5 đơn vị chuyên môn gồm SFEC (Đào tạo kỹ năng), SFYC (Tình nguyện & cộng đồng), SFIR (Viện nghiên cứu & ươm tạo), SFMC (Truyền thông số) và SFCA (Quản lý & xác thực chứng nhận số).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-1 hover:border-sky-300 transition">
                  <div className="text-xs font-bold text-[#0284C7]">Trung tâm SFEC</div>
                  <div className="text-[11px] text-slate-500">Đào tạo kỹ năng & Mentorship</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-1 hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-emerald-700">Lực lượng SFYC</div>
                  <div className="text-[11px] text-slate-500">Tình nguyện & Chiến dịch hè</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-1 hover:border-amber-300 transition">
                  <div className="text-xs font-bold text-amber-700">Viện SFIR & SFMC</div>
                  <div className="text-[11px] text-slate-500">Nghiên cứu & Truyền thông số</div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate('units')}
                  className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-sm shadow-sky-500/25"
                >
                  <span>Xem tất cả đơn vị</span>
                  <ArrowRight size={15} />
                </motion.button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-sky-200/80">
                <ImagePlaceholder
                  sizeText="16:9 (800x450px)"
                  description="Hình ảnh Không gian học tập & Hoạt động các đơn vị SFN"
                  aspectRatio="video"
                  theme="sky"
                />
              </div>
            </div>

          </div>
        </motion.div>
      </section>
      )}

      {/* 6. TIN TỨC & BÀI VIẾT MỚI NHẤT */}
      {sections.news !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0284C7] tracking-tight">
                Tin Tức Mới Nhất
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Thông báo chính thức, phóng sự chiến dịch và câu chuyện thực tế từ mạng lưới SFN
            </p>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 transition flex-shrink-0"
          >
            <span>Tất cả tin tức</span>
            <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {newsArticles.slice(0, 3).map((article, aIdx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: aIdx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                  <ImagePlaceholder
                    sizeText={article.imageSizeText}
                    description={article.imageDescription}
                    aspectRatio="video"
                    theme={article.theme}
                    imageUrl={article.imageUrl}
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-extrabold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      {article.categoryLabel}
                    </span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectArticle(article)}
                  className="text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 transition"
                >
                  <span>Đọc bài viết</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* 7. QUICK CALL TO ACTION BANNER */}
      {sections.cta !== false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#00A3FF] via-[#0284C7] to-emerald-600 text-white relative overflow-hidden shadow-lg shadow-sky-500/20"
        >
          <div className="max-w-2xl space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              {siteConfig.ctaHeading || 'Đồng Hành Cùng SFN'}
            </h2>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-normal">
              {siteConfig.ctaSubtext || 'Dù bạn là sinh viên tìm kiếm môi trường rèn luyện, tình nguyện viên đam mê cống hiến, hay đơn vị đối tác mong muốn hợp tác bền vững — SFN luôn chào đón bạn!'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onNavigate('join')}
                className="px-7 py-3.5 bg-white hover:bg-sky-50 text-[#0284C7] font-black text-sm rounded-xl transition shadow-md"
              >
                {siteConfig.ctaButtonText || 'Đăng ký Tham gia Ngay'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onNavigate('units')}
                className="px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl transition border border-white/25"
              >
                {siteConfig.ctaSecondaryButtonText || 'Tìm hiểu Trung tâm SFEC'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
      )}

    </div>
  );
};
