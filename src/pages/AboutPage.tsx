import React from 'react';
import { 
  Compass, 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Calendar,
  Network
} from 'lucide-react';
import { motion } from 'motion/react';
import { CORE_VALUES } from '../data/mockData';
import { useDataContext } from '../context/DataContext';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { corePillars, teamMembers, timeline, networkUnits, customPages } = useDataContext();

  const pageData = customPages.find(p => p.slug === 'about' || p.id === 'page-about');
  const badgeText = pageData?.badge || 'HỆ SINH THÁI GIÁO DỤC Sky First Network 2026';
  const titleText = pageData?.title || 'Về Sky First Network';
  const subtitleText = pageData?.summary || 'Mạng lưới Giáo dục & Phát triển Cộng đồng — nơi người trẻ học tập, phát triển năng lực, kết nối và tham gia các hoạt động tạo giá trị tích cực cho cộng đồng.';

  const visionBadge = pageData?.visionBadge || 'Định Hướng Chiến Lược';
  const visionTitle = pageData?.visionTitle || 'Tầm Nhìn 2030';
  const visionContent = pageData?.visionContent || 'Nội dung tầm nhìn được cập nhật theo tài liệu chính thức của Sky First Network.';

  const missionBadge = pageData?.missionBadge || 'Mục Tiêu Hành Động';
  const missionTitle = pageData?.missionTitle || 'Sứ Mệnh Phụng Sự';
  const missionContent = pageData?.missionContent || 'Nội dung sứ mệnh được cập nhật theo tài liệu chính thức của Sky First Network.';

  const philosophyBadge = pageData?.philosophyBadge || 'Kim Chỉ Nam';
  const philosophyTitle = pageData?.philosophyTitle || 'Triết Lý Cốt Lõi';
  const philosophyContent = pageData?.philosophyContent || '"Học để Phụng sự - Phụng sự để Trưởng thành". Sự tiến bộ của từng cá nhân gắn liền mật thiết với giá trị mà bạn đem lại cho cộng đồng xung quanh.';

  // 3. Trụ cột hoạt động
  const pillarsSectionTitle = pageData?.pillarsSectionTitle || '5 Trụ Cột Hoạt Động Cốt Lõi';
  const pillarsSectionBadge = pageData?.pillarsSectionBadge || 'Định Hướng Chiến Lược';
  const activePillars = pageData?.customPillars && pageData.customPillars.length > 0 ? pageData.customPillars : corePillars;

  // 4. Giá trị cốt lõi
  const valuesSectionTitle = pageData?.valuesSectionTitle || 'Giá Trị Cốt Lõi';
  const activeValues = pageData?.customValues && pageData.customValues.length > 0 ? pageData.customValues : CORE_VALUES;

  // 5. Hành trình phát triển
  const timelineSectionTitle = pageData?.timelineSectionTitle || 'Hành Trình Phát Triển';
  const timelineSectionBadge = pageData?.timelineSectionBadge || '2024 - 2026';
  const activeTimeline = pageData?.customTimeline && pageData.customTimeline.length > 0 ? pageData.customTimeline : timeline;

  // 6. Ban Lãnh Đạo
  const teamSectionTitle = pageData?.teamSectionTitle || 'Đội Ngũ Lãnh Đạo';
  const teamSectionSubtitle = pageData?.teamSectionSubtitle || 'Ban Chấp hành Sky First Network';
  const activeTeam = pageData?.customTeam && pageData.customTeam.length > 0 ? pageData.customTeam : teamMembers;

  // 7. Hệ thống đơn vị
  const unitsSectionBadge = pageData?.unitsSectionBadge || 'Hệ Thống Đơn Vị Trực Thuộc';
  const unitsSectionTitle = pageData?.unitsSectionTitle || 'Đơn vị trực thuộc Sky First Network';
  const unitsButtonLabel = pageData?.unitsButtonLabel || 'Xem chi tiết tất cả đơn vị';
  const unitsButtonUrl = pageData?.unitsButtonUrl || '/units';

  // 8. CTA Banner
  const ctaTitle = pageData?.ctaTitle || 'Kết nối cùng Sky First Network';
  const ctaDescription = pageData?.ctaDescription || 'Tìm hiểu hình thức tham gia phù hợp với vai trò, thời gian và nhu cầu của bạn tại Sky First Network.';
  const buttonLabel = pageData?.buttonLabel || 'Tham gia ngay';
  const buttonUrl = pageData?.buttonUrl || '/join';
  const secondaryButtonLabel = pageData?.secondaryButtonLabel || 'Xem chương trình';
  const secondaryButtonUrl = pageData?.secondaryButtonUrl || '/programs';

  const handleButtonClick = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const clean = url.replace(/^\//, '') as PageRoute;
      onNavigate(clean || 'join');
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 overflow-hidden">
      
      {/* 1. Header / Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7]">
            <Sparkles size={13} className="text-[#0284C7]" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {titleText}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            {subtitleText}
          </p>
        </motion.div>
      </section>

      {/* 2. Sứ mệnh, Tầm nhìn & Triết lý */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tầm nhìn */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-3xl bg-white border border-sky-200 shadow-2xs space-y-4 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shadow-2xs group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
              <Eye size={24} />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-black text-[#0284C7] uppercase tracking-wider">{visionBadge}</div>
              <h3 className="text-xl font-black text-slate-900">{visionTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {visionContent}
              </p>
            </div>
          </motion.div>

          {/* Sứ mệnh */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-3xl bg-white border border-sky-200 shadow-2xs space-y-4 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Target size={24} />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-black text-emerald-600 uppercase tracking-wider">{missionBadge}</div>
              <h3 className="text-xl font-black text-slate-900">{missionTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {missionContent}
              </p>
            </div>
          </motion.div>

          {/* Triết lý */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-3xl bg-white border border-sky-200 shadow-2xs space-y-4 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Heart size={24} />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-black text-amber-600 uppercase tracking-wider">{philosophyBadge}</div>
              <h3 className="text-xl font-black text-slate-900">{philosophyTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {philosophyContent}
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2.5. 5 Trụ Cột Hoạt Động Cốt Lõi (5 Core Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {pillarsSectionTitle}
            </h2>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
            {pillarsSectionBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePillars.map((pillar, idx) => (
            <motion.div
              key={pillar.number || idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#0284C7] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-sky-100 text-[#0284C7] font-black text-sm border border-sky-200">
                    {pillar.number || `0${idx + 1}`}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Trụ cột #{idx + 1}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pillar.fullDesc || pillar.shortDesc}
                </p>
              </div>

              {pillar.activities && pillar.activities.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Hoạt động trọng tâm
                  </span>
                  <ul className="space-y-1">
                    {pillar.activities.map((act, actIdx) => (
                      <li key={actIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-[#0284C7] font-black mt-0.5">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Giá Trị Cốt Lõi (5 Core Values) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0284C7] tracking-tight">
            {valuesSectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {activeValues.map((val, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#0284C7] transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-black border ${val.badge || 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                  0{idx + 1}
                </span>
                <h3 className="font-black text-base text-slate-900 leading-tight">
                  {val.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal pt-2">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Hành Trình & Cột Mốc Phát Triển (Timeline) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {timelineSectionTitle}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">{timelineSectionBadge}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTimeline.map((milestone) => (
            <motion.div 
              key={milestone.year}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-3xl border transition-all space-y-4 flex flex-col justify-between ${
                milestone.isCurrent 
                  ? 'bg-gradient-to-br from-sky-50 via-white to-blue-50/40 border-sky-300 shadow-md ring-1 ring-sky-300' 
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                    milestone.isCurrent ? 'bg-[#0284C7] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    Năm {milestone.year}
                  </span>
                  {milestone.isCurrent && (
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Đang Vận Hành
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {milestone.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {milestone.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                {milestone.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={14} className="text-[#0284C7] mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Ban Chấp hành & Đội ngũ Sky First Network */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0284C7] tracking-tight">
              {teamSectionTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">{teamSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTeam.map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-lg transition-all space-y-4 text-center group"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl overflow-hidden shadow-2xs border-2 border-sky-100 group-hover:border-[#0284C7] transition-all bg-slate-100 flex items-center justify-center">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    sizeText={member.imageSizeText || '1:1 (400x400px)'}
                    description={member.imageDescription || `Ảnh chân dung ${member.name}`}
                    aspectRatio="square"
                    theme={member.theme || 'sky'}
                    imageUrl={member.imageUrl}
                  />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#0284C7] transition-colors">
                  {member.name}
                </h3>
                <div className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                  {member.role}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-2 font-normal text-left">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Hệ Thống Đơn Vị Trực Thuộc (Quick Link to Units) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border border-sky-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black text-[#0284C7] uppercase tracking-wider">{unitsSectionBadge}</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {unitsSectionTitle}
              </h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleButtonClick(unitsButtonUrl)}
              className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{unitsButtonLabel}</span>
              <ArrowRight size={15} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {networkUnits.map((u) => (
              <motion.div 
                key={u.id}
                whileHover={{ y: -3 }}
                onClick={() => onNavigate('units')}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0284C7] cursor-pointer transition shadow-2xs space-y-2"
              >
                <span className="text-xs font-black px-2 py-0.5 rounded bg-sky-100 text-[#0284C7]">
                  {u.code}
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {u.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {u.tagline}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          whileHover={{ scale: 1.005 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#00A3FF] via-[#0284C7] to-[#2563EB] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-sky-500/20"
        >
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {ctaTitle}
            </h2>
            <p className="text-sm text-sky-100 font-normal leading-relaxed">
              {ctaDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            {buttonLabel && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleButtonClick(buttonUrl)}
                className="px-6 py-3 bg-white text-[#0284C7] hover:bg-sky-50 font-extrabold text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                {buttonLabel}
              </motion.button>
            )}
            {secondaryButtonLabel && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleButtonClick(secondaryButtonUrl)}
                className="px-5 py-3 bg-sky-800/40 hover:bg-sky-800/60 border border-sky-300/40 text-white font-bold text-sm rounded-xl transition cursor-pointer"
              >
                {secondaryButtonLabel}
              </motion.button>
            )}
          </div>
        </motion.div>
      </section>

    </div>
  );
};
