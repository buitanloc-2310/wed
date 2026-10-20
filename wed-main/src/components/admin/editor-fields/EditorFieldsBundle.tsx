import React, { useRef, useState } from 'react';
import { Award, Building2, Check, CheckCircle2, Clock, Compass, Copy, CreditCard, ExternalLink, FileText, Gift, Globe, GraduationCap, HeartHandshake, HelpCircle, Image as ImageIcon, Layers, Link as LinkIcon, Mail, MapPin, Megaphone, MessageSquare, Milestone, Phone, Plus, QrCode, RotateCcw, Search, Send, ShieldCheck, Sparkles, Trash2, TrendingUp, Upload, UserPlus, Users } from 'lucide-react';
import { CorePillar, CoreValueItem, TeamMember, TimelineMilestone } from '../../../types';
import { ImageUrlInput } from '../../MediaInputs';
import { EntityColorPicker } from '../../EntityColorSystem';
import { CORE_PILLARS, CORE_VALUES, TEAM_DATA, TIMELINE_DATA } from '../../../data/baselineData';
import { RichTextEditor } from '../RichTextEditor';
import { uploadMedia } from '../../../lib/mediaApi';


// -----------------------------------------------------------------------------
// AboutEditorFields.tsx
// -----------------------------------------------------------------------------

interface AboutEditorFieldsProps {
  // 1. Hero
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;

  // 2. Vision, Mission, Philosophy
  visionBadge: string;
  setVisionBadge: (val: string) => void;
  visionTitle: string;
  setVisionTitle: (val: string) => void;
  visionContent: string;
  setVisionContent: (val: string) => void;

  missionBadge: string;
  setMissionBadge: (val: string) => void;
  missionTitle: string;
  setMissionTitle: (val: string) => void;
  missionContent: string;
  setMissionContent: (val: string) => void;

  philosophyBadge: string;
  setPhilosophyBadge: (val: string) => void;
  philosophyTitle: string;
  setPhilosophyTitle: (val: string) => void;
  philosophyContent: string;
  setPhilosophyContent: (val: string) => void;

  // 3. Core Pillars
  pillarsSectionTitle: string;
  setPillarsSectionTitle: (val: string) => void;
  pillarsSectionBadge: string;
  setPillarsSectionBadge: (val: string) => void;
  customPillars: CorePillar[];
  setCustomPillars: (val: CorePillar[]) => void;

  // 4. Core Values
  valuesSectionTitle: string;
  setValuesSectionTitle: (val: string) => void;
  customValues: CoreValueItem[];
  setCustomValues: (val: CoreValueItem[]) => void;

  // 5. Timeline
  timelineSectionTitle: string;
  setTimelineSectionTitle: (val: string) => void;
  timelineSectionBadge: string;
  setTimelineSectionBadge: (val: string) => void;
  customTimeline: TimelineMilestone[];
  setCustomTimeline: (val: TimelineMilestone[]) => void;

  // 6. Leadership Team
  teamSectionTitle: string;
  setTeamSectionTitle: (val: string) => void;
  teamSectionSubtitle: string;
  setTeamSectionSubtitle: (val: string) => void;
  customTeam: TeamMember[];
  setCustomTeam: (val: TeamMember[]) => void;

  // 7. Units section
  unitsSectionBadge: string;
  setUnitsSectionBadge: (val: string) => void;
  unitsSectionTitle: string;
  setUnitsSectionTitle: (val: string) => void;
  unitsButtonLabel: string;
  setUnitsButtonLabel: (val: string) => void;
  unitsButtonUrl: string;
  setUnitsButtonUrl: (val: string) => void;

  // 8. CTA section
  ctaTitle: string;
  setCtaTitle: (val: string) => void;
  ctaDescription: string;
  setCtaDescription: (val: string) => void;
  buttonLabel: string;
  setButtonLabel: (val: string) => void;
  buttonUrl: string;
  setButtonUrl: (val: string) => void;
  secondaryButtonLabel: string;
  setSecondaryButtonLabel: (val: string) => void;
  secondaryButtonUrl: string;
  setSecondaryButtonUrl: (val: string) => void;
}

export const AboutEditorFields: React.FC<AboutEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  visionBadge,
  setVisionBadge,
  visionTitle,
  setVisionTitle,
  visionContent,
  setVisionContent,
  missionBadge,
  setMissionBadge,
  missionTitle,
  setMissionTitle,
  missionContent,
  setMissionContent,
  philosophyBadge,
  setPhilosophyBadge,
  philosophyTitle,
  setPhilosophyTitle,
  philosophyContent,
  setPhilosophyContent,
  pillarsSectionTitle,
  setPillarsSectionTitle,
  pillarsSectionBadge,
  setPillarsSectionBadge,
  customPillars,
  setCustomPillars,
  valuesSectionTitle,
  setValuesSectionTitle,
  customValues,
  setCustomValues,
  timelineSectionTitle,
  setTimelineSectionTitle,
  timelineSectionBadge,
  setTimelineSectionBadge,
  customTimeline,
  setCustomTimeline,
  teamSectionTitle,
  setTeamSectionTitle,
  teamSectionSubtitle,
  setTeamSectionSubtitle,
  customTeam,
  setCustomTeam,
  unitsSectionBadge,
  setUnitsSectionBadge,
  unitsSectionTitle,
  setUnitsSectionTitle,
  unitsButtonLabel,
  setUnitsButtonLabel,
  unitsButtonUrl,
  setUnitsButtonUrl,
  ctaTitle,
  setCtaTitle,
  ctaDescription,
  setCtaDescription,
  buttonLabel,
  setButtonLabel,
  buttonUrl,
  setButtonUrl,
  secondaryButtonLabel,
  setSecondaryButtonLabel,
  secondaryButtonUrl,
  setSecondaryButtonUrl,
}) => {
  // Handlers for Pillars
  const handleUpdatePillar = (index: number, updated: Partial<CorePillar>) => {
    const next = [...customPillars];
    next[index] = { ...next[index], ...updated };
    setCustomPillars(next);
  };

  const handleAddPillar = () => {
    const nextIndex = customPillars.length + 1;
    const newPillar: CorePillar = {
      number: nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`,
      title: 'Trụ Cột Hoạt Động Mới',
      shortDesc: 'Mô tả ngắn gọn về định hướng trụ cột hoạt động này.',
      fullDesc: 'Mô tả chi tiết các chương trình, hoạt động triển khai của trụ cột.',
      iconName: 'Sparkles',
      activities: ['Hoạt động triển khai chính 1', 'Hoạt động triển khai chính 2'],
    };
    setCustomPillars([...customPillars, newPillar]);
  };

  const handleDeletePillar = (index: number) => {
    setCustomPillars(customPillars.filter((_, i) => i !== index));
  };

  const handleResetPillars = () => {
    setCustomPillars([...CORE_PILLARS]);
  };

  // Handlers for Core Values
  const handleUpdateValue = (index: number, updated: Partial<CoreValueItem>) => {
    const next = [...customValues];
    next[index] = { ...next[index], ...updated };
    setCustomValues(next);
  };

  const handleAddValue = () => {
    const newValue: CoreValueItem = {
      name: 'Giá trị mới (Core Value)',
      desc: 'Mô tả ý nghĩa và cam kết thực hiện của giá trị này đối với cộng đồng.',
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
    };
    setCustomValues([...customValues, newValue]);
  };

  const handleDeleteValue = (index: number) => {
    setCustomValues(customValues.filter((_, i) => i !== index));
  };

  const handleResetValues = () => {
    setCustomValues([...CORE_VALUES]);
  };

  // Handlers for Timeline
  const handleUpdateMilestone = (index: number, updated: Partial<TimelineMilestone>) => {
    const next = [...customTimeline];
    next[index] = { ...next[index], ...updated };
    setCustomTimeline(next);
  };

  const handleAddMilestone = () => {
    const currentYear = new Date().getFullYear().toString();
    const newMilestone: TimelineMilestone = {
      year: currentYear,
      title: 'Cột mốc phát triển mới',
      description: 'Mô tả những thành tựu và dấu ấn quan trọng đạt được trong giai đoạn này.',
      highlights: ['Điểm nổi bật trọng tâm 1', 'Điểm nổi bật trọng tâm 2'],
      isCurrent: false,
    };
    setCustomTimeline([...customTimeline, newMilestone]);
  };

  const handleDeleteMilestone = (index: number) => {
    setCustomTimeline(customTimeline.filter((_, i) => i !== index));
  };

  const handleResetTimeline = () => {
    setCustomTimeline([...TIMELINE_DATA]);
  };

  // Handlers for Team Members
  const handleUpdateMember = (index: number, updated: Partial<TeamMember>) => {
    const next = [...customTeam];
    next[index] = { ...next[index], ...updated };
    setCustomTeam(next);
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      name: 'Thành viên Lãnh đạo Mới',
      role: 'Chức vụ / Vai trò Ban Chấp hành',
      bio: 'Tóm tắt kinh nghiệm làm việc, năng lực chuyên môn và đóng góp cho mạng lưới.',
      imageUrl: '',
      imageSizeText: '1:1 (400x400px)',
      imageDescription: 'Ảnh chân dung thành viên',
      theme: 'sky',
    };
    setCustomTeam([...customTeam, newMember]);
  };

  const handleDeleteMember = (index: number) => {
    setCustomTeam(customTeam.filter((_, i) => i !== index));
  };

  const handleResetTeam = () => {
    setCustomTeam([...TEAM_DATA]);
  };

  return (
    <div className="space-y-6">
      {/* 1. KHỐI ĐẦU TRANG (HERO BANNER) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 1: Khối Đầu Trang (Hero Banner - /about)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Phần mở đầu trang Giới Thiệu
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
            placeholder="VD: HỆ SINH THÁI GIÁO DỤC Sky First Network 2026"
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
            placeholder="Về Sky First Network"
            className="w-full text-xl sm:text-2xl font-black text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Đoạn văn mở đầu (Tóm tắt giới thiệu chung)
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Nhập đoạn văn mở đầu trang giới thiệu..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. KHỐI TẦM NHÌN, SỨ MỆNH & TRIẾT LÝ HOẠT ĐỘNG (3 THẺ) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 2: Tầm Nhìn, Sứ Mệnh & Triết Lý Hoạt Động (3 Thẻ)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            3 thẻ định hướng trung tâm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Thẻ 1: Tầm Nhìn */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
              <span className="text-xs font-extrabold text-[#0284C7]">Thẻ 1: TẦM NHÌN</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhãn phụ</label>
              <input
                type="text"
                value={visionBadge}
                onChange={(e) => setVisionBadge(e.target.value)}
                placeholder="Định Hướng Chiến Lược"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề thẻ</label>
              <input
                type="text"
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="Tầm Nhìn 2030"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung chi tiết</label>
              <textarea
                rows={4}
                value={visionContent}
                onChange={(e) => setVisionContent(e.target.value)}
                placeholder="Nhập nội dung tầm nhìn..."
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
              />
            </div>
          </div>

          {/* Thẻ 2: Sứ Mệnh */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-extrabold text-emerald-700">Thẻ 2: SỨ MỆNH</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhãn phụ</label>
              <input
                type="text"
                value={missionBadge}
                onChange={(e) => setMissionBadge(e.target.value)}
                placeholder="Mục Tiêu Hành Động"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề thẻ</label>
              <input
                type="text"
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="Sứ Mệnh Phụng Sự"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung chi tiết</label>
              <textarea
                rows={4}
                value={missionContent}
                onChange={(e) => setMissionContent(e.target.value)}
                placeholder="Nhập nội dung sứ mệnh..."
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
              />
            </div>
          </div>

          {/* Thẻ 3: Triết Lý */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span className="text-xs font-extrabold text-amber-700">Thẻ 3: TRIẾT LÝ HOẠT ĐỘNG</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhãn phụ</label>
              <input
                type="text"
                value={philosophyBadge}
                onChange={(e) => setPhilosophyBadge(e.target.value)}
                placeholder="Kim Chỉ Nam"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề thẻ</label>
              <input
                type="text"
                value={philosophyTitle}
                onChange={(e) => setPhilosophyTitle(e.target.value)}
                placeholder="Triết Lý Cốt Lõi"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung chi tiết</label>
              <textarea
                rows={4}
                value={philosophyContent}
                onChange={(e) => setPhilosophyContent(e.target.value)}
                placeholder="Nhập nội dung triết lý..."
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. KHỐI 5 TRỤ CỘT HOẠT ĐỘNG CỐT LÕI */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 3: 5 Trụ Cột Hoạt Động Cốt Lõi
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetPillars}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Khôi phục mặc định</span>
            </button>
            <button
              type="button"
              onClick={handleAddPillar}
              className="text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Thêm trụ cột</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối trụ cột
            </label>
            <input
              type="text"
              value={pillarsSectionTitle}
              onChange={(e) => setPillarsSectionTitle(e.target.value)}
              placeholder="5 Trụ Cột Hoạt Động Cốt Lõi"
              className="w-full text-xs font-bold text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Huy hiệu phụ khối trụ cột
            </label>
            <input
              type="text"
              value={pillarsSectionBadge}
              onChange={(e) => setPillarsSectionBadge(e.target.value)}
              placeholder="Định Hướng Chiến Lược"
              className="w-full text-xs font-bold text-[#0284C7] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Danh sách các trụ cột */}
        <div className="space-y-4 pt-2">
          {customPillars.map((pillar, pIdx) => (
            <div
              key={pIdx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] font-black text-xs flex items-center justify-center">
                    {pillar.number || `0${pIdx + 1}`}
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    Trụ cột #{pIdx + 1}: {pillar.title || 'Chưa đặt tiêu đề'}
                  </span>
                </div>
                {customPillars.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePillar(pIdx)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                    title="Xóa trụ cột này"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Số thứ tự (Mã)
                  </label>
                  <input
                    type="text"
                    value={pillar.number}
                    onChange={(e) => handleUpdatePillar(pIdx, { number: e.target.value })}
                    placeholder="01"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold font-mono"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tiêu đề trụ cột
                  </label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => handleUpdatePillar(pIdx, { title: e.target.value })}
                    placeholder="VD: Giáo dục & Đào tạo"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mô tả nội dung chi tiết
                </label>
                <textarea
                  rows={2}
                  value={pillar.fullDesc || pillar.shortDesc}
                  onChange={(e) =>
                    handleUpdatePillar(pIdx, {
                      fullDesc: e.target.value,
                      shortDesc: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả triển khai trụ cột này..."
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Hoạt động trọng tâm (Mỗi dòng là một hoạt động)
                </label>
                <textarea
                  rows={3}
                  value={pillar.activities ? pillar.activities.join('\n') : ''}
                  onChange={(e) =>
                    handleUpdatePillar(pIdx, {
                      activities: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0),
                    })
                  }
                  placeholder="Khóa rèn luyện Kỹ năng Lãnh đạo Trẻ (Youth Leadership)&#10;Chuỗi Workshop Kỹ năng mềm & Ứng dụng Công nghệ"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. KHỐI GIÁ TRỊ CỐT LÕI (5 CORE VALUES) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 4: Giá Trị Cốt Lõi (5 Core Values)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetValues}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Khôi phục mặc định</span>
            </button>
            <button
              type="button"
              onClick={handleAddValue}
              className="text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Thêm giá trị</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tiêu đề khối giá trị
          </label>
          <input
            type="text"
            value={valuesSectionTitle}
            onChange={(e) => setValuesSectionTitle(e.target.value)}
            placeholder="Giá Trị Cốt Lõi"
            className="w-full text-xs font-bold text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {customValues.map((val, vIdx) => (
            <div
              key={vIdx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#0284C7] bg-sky-100 px-2 py-0.5 rounded">
                  0{vIdx + 1}
                </span>
                {customValues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteValue(vIdx)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                    title="Xóa giá trị này"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên giá trị cốt lõi
                </label>
                <input
                  type="text"
                  value={val.name}
                  onChange={(e) => handleUpdateValue(vIdx, { name: e.target.value })}
                  placeholder="Tận tâm (Dedication)"
                  className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mô tả ý nghĩa
                </label>
                <textarea
                  rows={2}
                  value={val.desc}
                  onChange={(e) => handleUpdateValue(vIdx, { desc: e.target.value })}
                  placeholder="Hành động vì lợi ích cộng đồng..."
                  className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. KHỐI HÀNH TRÌNH PHÁT TRIỂN (TIMELINE CỘT MỐC) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Milestone size={16} className="text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 5: Hành Trình & Cột Mốc Phát Triển (Timeline)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTimeline}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Khôi phục mặc định</span>
            </button>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Thêm cột mốc</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối hành trình
            </label>
            <input
              type="text"
              value={timelineSectionTitle}
              onChange={(e) => setTimelineSectionTitle(e.target.value)}
              placeholder="Hành Trình Phát Triển"
              className="w-full text-xs font-bold text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Giai đoạn / Khoảng thời gian
            </label>
            <input
              type="text"
              value={timelineSectionBadge}
              onChange={(e) => setTimelineSectionBadge(e.target.value)}
              placeholder="2024 - 2026"
              className="w-full text-xs font-bold text-emerald-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {customTimeline.map((milestone, mIdx) => (
            <div
              key={mIdx}
              className={`p-4 rounded-xl border transition space-y-3 ${
                milestone.isCurrent
                  ? 'border-sky-300 bg-sky-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold font-mono">
                    Năm {milestone.year}
                  </span>
                  <span className="text-xs font-black text-slate-800">{milestone.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={milestone.isCurrent || false}
                      onChange={(e) =>
                        handleUpdateMilestone(mIdx, { isCurrent: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-600"
                    />
                    <span>Đang vận hành (Current)</span>
                  </label>
                  {customTimeline.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(mIdx)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                      title="Xóa cột mốc này"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm</label>
                  <input
                    type="text"
                    value={milestone.year}
                    onChange={(e) => handleUpdateMilestone(mIdx, { year: e.target.value })}
                    placeholder="2026"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tiêu đề cột mốc
                  </label>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => handleUpdateMilestone(mIdx, { title: e.target.value })}
                    placeholder="Chuẩn hóa & vận hành hệ thống số Sky First Network"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mô tả chi tiết cột mốc
                </label>
                <textarea
                  rows={2}
                  value={milestone.description}
                  onChange={(e) =>
                    handleUpdateMilestone(mIdx, { description: e.target.value })
                  }
                  placeholder="Nhập mô tả các cột mốc trong năm..."
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Các điểm nổi bật (Mỗi dòng 1 ý)
                </label>
                <textarea
                  rows={3}
                  value={milestone.highlights ? milestone.highlights.join('\n') : ''}
                  onChange={(e) =>
                    handleUpdateMilestone(mIdx, {
                      highlights: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0),
                    })
                  }
                  placeholder="Ban hành Quy chuẩn Giao diện & Thương hiệu Sky First Network 2026&#10;Ra mắt Website và Cổng Tình nguyện viên"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. KHỐI BAN CHẤP HÀNH & ĐỘI NGŨ SKY FIRST NETWORK */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 6: Ban Chấp hành & Đội ngũ Sky First Network
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTeam}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Khôi phục mặc định</span>
            </button>
            <button
              type="button"
              onClick={handleAddMember}
              className="text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Thêm thành viên</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối lãnh đạo
            </label>
            <input
              type="text"
              value={teamSectionTitle}
              onChange={(e) => setTeamSectionTitle(e.target.value)}
              placeholder="Đội Ngũ Lãnh Đạo"
              className="w-full text-xs font-bold text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Phụ đề / Ghi chú khối
            </label>
            <input
              type="text"
              value={teamSectionSubtitle}
              onChange={(e) => setTeamSectionSubtitle(e.target.value)}
              placeholder="Ban Chấp hành Sky First Network"
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {customTeam.map((member, mIdx) => (
            <div
              key={mIdx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Xem trước ảnh đại diện */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold text-center px-1">
                        Chưa có ảnh
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleUpdateMember(mIdx, { name: e.target.value })}
                        placeholder="VD: Nguyễn Minh Tân Lợi"
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Chức vụ / Vai trò
                      </label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleUpdateMember(mIdx, { role: e.target.value })}
                        placeholder="VD: Thành viên Ban Chấp hành"
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[#0284C7] font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMember(mIdx)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                    title="Xóa thành viên này"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <EntityColorPicker
                  label="Màu chức danh"
                  entityLabel={member.role || member.name || 'Chức danh'}
                  value={member.roleColor}
                  onChange={(roleColor) => handleUpdateMember(mIdx, { roleColor })}
                />

                <ImageUrlInput label="Ảnh chân dung" value={member.imageUrl || ''} onChange={(v)=>handleUpdateMember(mIdx,{imageUrl:v})} helperText="Tải ảnh chân dung trực tiếp từ thiết bị."/>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tiểu sử tóm tắt (Bio)
                  </label>
                  <textarea
                    rows={2}
                    value={member.bio}
                    onChange={(e) => handleUpdateMember(mIdx, { bio: e.target.value })}
                    placeholder="Tóm tắt kinh nghiệm và đóng góp..."
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. KHỐI HỆ THỐNG ĐƠN VỊ TRỰC THUỘC */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 7: Hệ Thống Đơn Vị Trực Thuộc (Quick Link - /about)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Khối giới thiệu 5 đơn vị thành viên
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nhãn phụ khối đơn vị
            </label>
            <input
              type="text"
              value={unitsSectionBadge}
              onChange={(e) => setUnitsSectionBadge(e.target.value)}
              placeholder="HỆ THỐNG ĐƠN VỊ TRỰC THUỘC"
              className="w-full text-xs font-bold text-[#0284C7] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối đơn vị
            </label>
            <input
              type="text"
              value={unitsSectionTitle}
              onChange={(e) => setUnitsSectionTitle(e.target.value)}
              placeholder="Đơn vị trực thuộc Sky First Network"
              className="w-full text-xs font-bold text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-extrabold text-slate-700 block">
            Cấu hình nút điều hướng đến trang Đơn vị
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút bấm
              </label>
              <input
                type="text"
                value={unitsButtonLabel}
                onChange={(e) => setUnitsButtonLabel(e.target.value)}
                placeholder="Xem chi tiết tất cả đơn vị"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={unitsButtonUrl}
                onChange={(e) => setUnitsButtonUrl(e.target.value)}
                placeholder="/units"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 8. KHỐI KÊU GỌI HÀNH ĐỘNG (CTA BANNER CUỐI TRANG) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 8: Khối Kêu Gọi Hành Động (CTA Banner Cuối Trang - /about)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Banner nổi bật màu xanh cuối trang
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề banner CTA
            </label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              placeholder="Kết nối cùng Sky First Network"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả banner CTA
            </label>
            <textarea
              rows={2}
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              placeholder="Dù bạn là học viên, tình nguyện viên hay đối tác tổ chức..."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nút chính */}
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <span className="text-xs font-extrabold text-[#0284C7] block">
                Nút hành động chính 1
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={buttonLabel}
                  onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="Tham gia ngay"
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
                  placeholder="/join"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Nút phụ */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-extrabold text-slate-700 block">
                Nút hành động phụ 2
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={secondaryButtonLabel}
                  onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                  placeholder="Xem chương trình"
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
                  placeholder="/programs"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// -----------------------------------------------------------------------------
// CertificateEditorFields.tsx
// -----------------------------------------------------------------------------

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


// -----------------------------------------------------------------------------
// ContactEditorFields.tsx
// -----------------------------------------------------------------------------

interface ContactEditorFieldsProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  // 4 Key Contact Cards
  email: string;
  setEmail: (val: string) => void;
  secondaryEmail: string;
  setSecondaryEmail: (val: string) => void;
  hotline: string;
  setHotline: (val: string) => void;
  secondaryHotline: string;
  setSecondaryHotline: (val: string) => void;
  workHoursWeekdays: string;
  setWorkHoursWeekdays: (val: string) => void;
  workHoursSaturday: string;
  setWorkHoursSaturday: (val: string) => void;
  facebookUrl: string;
  setFacebookUrl: (val: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (val: string) => void;
  // Form details
  contactFormTitle: string;
  setContactFormTitle: (val: string) => void;
  contactFormDescription: string;
  setContactFormDescription: (val: string) => void;
  contactSubmitButtonLabel: string;
  setContactSubmitButtonLabel: (val: string) => void;
  // Units Directory (Right column top)
  contactUnitsTitle: string;
  setContactUnitsTitle: (val: string) => void;
  contactUnitsSubtitle: string;
  setContactUnitsSubtitle: (val: string) => void;
  // FAQs (Right column bottom)
  contactFaqTitle: string;
  setContactFaqTitle: (val: string) => void;
  contactFaq1Q: string;
  setContactFaq1Q: (val: string) => void;
  contactFaq1A: string;
  setContactFaq1A: (val: string) => void;
  contactFaq2Q: string;
  setContactFaq2Q: (val: string) => void;
  contactFaq2A: string;
  setContactFaq2A: (val: string) => void;
  contactFaq3Q: string;
  setContactFaq3Q: (val: string) => void;
  contactFaq3A: string;
  setContactFaq3A: (val: string) => void;
  contactFaq4Q: string;
  setContactFaq4Q: (val: string) => void;
  contactFaq4A: string;
  setContactFaq4A: (val: string) => void;
  // Bottom banner details
  contactCtaTitle: string;
  setContactCtaTitle: (val: string) => void;
  contactCtaDescription: string;
  setContactCtaDescription: (val: string) => void;
  buttonLabel: string;
  setButtonLabel: (val: string) => void;
  buttonUrl: string;
  setButtonUrl: (val: string) => void;
  secondaryButtonLabel: string;
  setSecondaryButtonLabel: (val: string) => void;
  secondaryButtonUrl: string;
  setSecondaryButtonUrl: (val: string) => void;
}

export const ContactEditorFields: React.FC<ContactEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  email,
  setEmail,
  secondaryEmail,
  setSecondaryEmail,
  hotline,
  setHotline,
  secondaryHotline,
  setSecondaryHotline,
  workHoursWeekdays,
  setWorkHoursWeekdays,
  workHoursSaturday,
  setWorkHoursSaturday,
  facebookUrl,
  setFacebookUrl,
  linkedinUrl,
  setLinkedinUrl,
  contactFormTitle,
  setContactFormTitle,
  contactFormDescription,
  setContactFormDescription,
  contactSubmitButtonLabel,
  setContactSubmitButtonLabel,
  contactUnitsTitle,
  setContactUnitsTitle,
  contactUnitsSubtitle,
  setContactUnitsSubtitle,
  contactFaqTitle,
  setContactFaqTitle,
  contactFaq1Q,
  setContactFaq1Q,
  contactFaq1A,
  setContactFaq1A,
  contactFaq2Q,
  setContactFaq2Q,
  contactFaq2A,
  setContactFaq2A,
  contactFaq3Q,
  setContactFaq3Q,
  contactFaq3A,
  setContactFaq3A,
  contactFaq4Q,
  setContactFaq4Q,
  contactFaq4A,
  setContactFaq4A,
  contactCtaTitle,
  setContactCtaTitle,
  contactCtaDescription,
  setContactCtaDescription,
  buttonLabel,
  setButtonLabel,
  buttonUrl,
  setButtonUrl,
  secondaryButtonLabel,
  setSecondaryButtonLabel,
  secondaryButtonUrl,
  setSecondaryButtonUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Khối Đầu Trang (Hero Banner) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Hero Banner - /contact)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Phần mở đầu trang Liên Hệ Với Chúng Tôi
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
            placeholder="KẾT NỐI & HỢP TÁC CÙNG Sky First Network"
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
            placeholder="Liên Hệ Với Chúng Tôi"
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
            placeholder="Ban Chấp hành Sky First Network luôn sẵn sàng lắng nghe, tư vấn và đồng hành..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Khối Kênh Tiếp Nhận & Kết Nối Trực Tiếp (4 Thẻ Thông Tin) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Kênh Tiếp Nhận & Kết Nối Trực Tiếp (4 Thẻ Thông Tin)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            4 Thẻ tiếp nhận: Email, Hotline, Giờ làm việc và Mạng xã hội
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Thẻ 1: Email */}
          <div className="p-4 rounded-xl bg-sky-50/40 border border-sky-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0284C7]">
              <Mail size={14} />
              <span>Thẻ 1: Hòm thư điện tử (Email)</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Email chính thức
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lienhe@skyfirst.io.vn"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Email phụ / Tiếp nhận chung
              </label>
              <input
                type="text"
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
                placeholder="lienhe@skyfirst.io.vn"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Thẻ 2: Hotline */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
              <Phone size={14} />
              <span>Thẻ 2: Tổng đài tiếp nhận (Hotline)</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Hotline chính (Điều phối chung)
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="0924 910 210"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Hotline phụ / Ban Đối ngoại
              </label>
              <input
                type="text"
                value={secondaryHotline}
                onChange={(e) => setSecondaryHotline(e.target.value)}
                placeholder="0912 838 xxx (Đối ngoại)"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Thẻ 3: Thời Gian Làm Việc */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
              <Clock size={14} />
              <span>Thẻ 3: Khung giờ làm việc</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thứ 2 - Thứ 6
              </label>
              <input
                type="text"
                value={workHoursWeekdays}
                onChange={(e) => setWorkHoursWeekdays(e.target.value)}
                placeholder="08:30 - 18:00"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thứ 7
              </label>
              <input
                type="text"
                value={workHoursSaturday}
                onChange={(e) => setWorkHoursSaturday(e.target.value)}
                placeholder="08:30 - 12:00"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* Thẻ 4: Mạng Xã Hội */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
              <Globe size={14} />
              <span>Thẻ 4: Mạng xã hội Sky First Network</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Facebook Fanpage
              </label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Instagram của Sky First Network
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/skyfirstnetwork"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Khối Biểu Mẫu Gửi Tin Nhắn Trực Tuyến */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Send size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Cấu Hình Biểu Mẫu Gửi Tin Nhắn Trực Tuyến
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Form tiếp nhận thư gửi trực tiếp đến ban điều hành (Cột trái)
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề biểu mẫu
            </label>
            <input
              type="text"
              value={contactFormTitle}
              onChange={(e) => setContactFormTitle(e.target.value)}
              placeholder="Gửi Tin Nhắn Đến Ban Chấp hành"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn mô tả hướng dẫn
            </label>
            <textarea
              rows={2}
              value={contactFormDescription}
              onChange={(e) => setContactFormDescription(e.target.value)}
              placeholder="Vui lòng điền đầy đủ các thông tin bên dưới. Hệ thống sẽ điều phối thư đến đúng phòng ban và đơn vị liên quan."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên nút gửi tin nhắn
            </label>
            <input
              type="text"
              value={contactSubmitButtonLabel}
              onChange={(e) => setContactSubmitButtonLabel(e.target.value)}
              placeholder="Gửi tin nhắn"
              className="w-full text-xs px-3 py-2 bg-[#0284C7] text-white font-bold rounded-xl focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Biểu mẫu gửi tin nhắn thực hiện gửi trực tiếp và hiển thị màn hình thông báo phản hồi tự động.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Khối Đầu mối đơn vị trực thuộc (Cột phải trên) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Khối Đầu mối đơn vị trực thuộc (Cột Phải Trên)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Danh bạ chuyên biệt từng đơn vị Câu lạc bộ Tiếng Anh The Sky First hoặc Nhà Hán Ngữ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề khối đơn vị
            </label>
            <input
              type="text"
              value={contactUnitsTitle}
              onChange={(e) => setContactUnitsTitle(e.target.value)}
              placeholder="Đầu mối đơn vị trực thuộc"
              className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dòng mô tả phụ
            </label>
            <input
              type="text"
              value={contactUnitsSubtitle}
              onChange={(e) => setContactUnitsSubtitle(e.target.value)}
              placeholder="Liên hệ chuyên biệt theo từng mảng chuyên môn của mạng lưới:"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-[#0284C7] flex items-center gap-1">
            <Building2 size={13} />
            <span>Tự động đồng bộ hóa cùng Hệ Sinh Thái Mạng Lưới:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Danh sách các đơn vị trực thuộc (Câu lạc bộ Tiếng Anh The Sky First hoặc Nhà Hán Ngữ) cùng email và số điện thoại phụ trách được liên kết tự động từ mục Quản Lý Đơn Vị Mạng Lưới để người gửi có thể bấm chọn kết nối ngay lập tức.
          </p>
        </div>
      </div>

      {/* 5. Khối Câu Hỏi Thường Gặp Về Liên Hệ (Contact FAQs) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              5. Khối Câu Hỏi Thường Gặp Về Liên Hệ (Contact FAQs - Cột Phải Dưới)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Hộp mở/đóng giải đáp thắc mắc liên hệ
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tiêu đề khối FAQ
          </label>
          <input
            type="text"
            value={contactFaqTitle}
            onChange={(e) => setContactFaqTitle(e.target.value)}
            placeholder="Câu Hỏi Thường Gặp Về Liên Hệ"
            className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div className="space-y-4 pt-2">
          {/* FAQ 1 */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#0284C7]">Câu hỏi 1:</span>
            <input
              type="text"
              value={contactFaq1Q}
              onChange={(e) => setContactFaq1Q(e.target.value)}
              placeholder="Thời gian Ban Chấp hành Sky First Network tiếp nhận và phản hồi email là bao lâu?"
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq1A}
              onChange={(e) => setContactFaq1A(e.target.value)}
              placeholder="Toàn bộ thư từ và yêu cầu kết nối..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* FAQ 2 */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#0284C7]">Câu hỏi 2:</span>
            <input
              type="text"
              value={contactFaq2Q}
              onChange={(e) => setContactFaq2Q(e.target.value)}
              placeholder="Tôi muốn đặt lịch làm việc trực tiếp tại Sky First Network thì cần làm gì?"
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq2A}
              onChange={(e) => setContactFaq2A(e.target.value)}
              placeholder="Quý đối tác hoặc các bạn trẻ vui lòng gửi thông tin trước qua biểu mẫu..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* FAQ 3 */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#0284C7]">Câu hỏi 3:</span>
            <input
              type="text"
              value={contactFaq3Q}
              onChange={(e) => setContactFaq3Q(e.target.value)}
              placeholder="Làm thế nào để liên hệ trực tiếp với người phụ trách từng đơn vị trực thuộc?"
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq3A}
              onChange={(e) => setContactFaq3A(e.target.value)}
              placeholder="Bạn có thể chọn trực tiếp đơn vị mong muốn (Câu lạc bộ Tiếng Anh The Sky First hoặc Nhà Hán Ngữ)..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* FAQ 4 (Tùy chọn) */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-500">Câu hỏi 4 (Tùy chọn thêm):</span>
            <input
              type="text"
              value={contactFaq4Q}
              onChange={(e) => setContactFaq4Q(e.target.value)}
              placeholder="Nhập câu hỏi thường gặp số 4 (nếu có)..."
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
            <textarea
              rows={2}
              value={contactFaq4A}
              onChange={(e) => setContactFaq4A(e.target.value)}
              placeholder="Nhập câu trả lời giải đáp..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 6. Khối Điều Hướng Chương Trình & Dự Án (Banner cuối trang) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              6. Khối Điều Hướng Chương Trình & Dự Án (Banner Cuối Trang)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Banner chân trang điều hướng đến chương trình & tài trợ
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tiêu đề banner
            </label>
            <input
              type="text"
              value={contactCtaTitle}
              onChange={(e) => setContactCtaTitle(e.target.value)}
              placeholder="Bạn quan tâm đến các chương trình & dự án cụ thể?"
              className="w-full text-sm font-black text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Đoạn văn mô tả
            </label>
            <textarea
              rows={2}
              value={contactCtaDescription}
              onChange={(e) => setContactCtaDescription(e.target.value)}
              placeholder="Khám phá danh sách các chương trình và hoạt động đang được công bố đang mở đăng ký."
              className="w-full text-xs text-slate-700 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nút 1 */}
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <span className="text-xs font-extrabold text-[#0284C7] block">
                Nút hành động 1 (Xem Chương Trình)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={buttonLabel}
                  onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="Xem Chương Trình"
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
                  placeholder="/programs"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Nút 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-extrabold text-slate-700 block">
                Nút hành động 2 (Trang Tài Trợ)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={secondaryButtonLabel}
                  onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                  placeholder="Trang Tài Trợ"
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
                  placeholder="/sponsor"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// -----------------------------------------------------------------------------
// JoinEditorFields.tsx
// -----------------------------------------------------------------------------

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
  // Role 1: hoạt động tình nguyện
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
            placeholder="THAM GIA & HỢP TÁC"
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

        {/* Nhóm 1: Tình nguyện viên */}
        <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
              <HeartHandshake size={18} className="text-emerald-600" />
              <span>NHÓM 1: TÌNH NGUYỆN VIÊN CHIẾN DỊCH (hoạt động tình nguyện)</span>
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
                placeholder="Tình Nguyện Viên Chiến Dịch (hoạt động tình nguyện)"
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
              {joinRole2Tag || 'Core Team Sky First Network'}
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
                placeholder="Thành Viên Ban Chấp hành & Core Team"
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
                placeholder="Core Team Sky First Network"
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
                placeholder="Ứng Tuyển Ban Chấp hành"
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
                placeholder="Theo chương trình / thỏa thuận phù hợp"
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
              placeholder="Hệ thống tiếp nhận hồ sơ tập trung của Ban Nhân sự và Ban Đối ngoại & Sự kiện..."
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
                placeholder="Đến trang Liên hệ"
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
                placeholder="nhansu@skyfirst.io.vn"
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
                placeholder="0924 910 210"
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
                placeholder=""
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


// -----------------------------------------------------------------------------
// SponsorEditorFields.tsx
// -----------------------------------------------------------------------------

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
  sponsorRecipientEntity: string;
  setSponsorRecipientEntity: (val: string) => void;
  sponsorGoalAmount: string;
  setSponsorGoalAmount: (val: string) => void;
  sponsorReceivedAmount: string;
  setSponsorReceivedAmount: (val: string) => void;
  sponsorPublicLedgerUrl: string;
  setSponsorPublicLedgerUrl: (val: string) => void;
  sponsorBankName: string;
  setSponsorBankName: (val: string) => void;
  sponsorBankId: string;
  setSponsorBankId: (val: string) => void;
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
  sponsorDonationNotice: string;
  setSponsorDonationNotice: (val: string) => void;
  sponsorSuggestedAmounts: string;
  setSponsorSuggestedAmounts: (val: string) => void;

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
  sponsorRecipientEntity,
  setSponsorRecipientEntity,
  sponsorGoalAmount,
  setSponsorGoalAmount,
  sponsorReceivedAmount,
  setSponsorReceivedAmount,
  sponsorPublicLedgerUrl,
  setSponsorPublicLedgerUrl,
  sponsorBankName,
  setSponsorBankName,
  sponsorBankId,
  setSponsorBankId,
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
  sponsorDonationNotice,
  setSponsorDonationNotice,
  sponsorSuggestedAmounts,
  setSponsorSuggestedAmounts,
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

  const uploadQr=async(file:File)=>{try{const item=await uploadMedia(file,true);setSponsorQrCodeUrl(item.url);}catch(error){alert(error instanceof Error?error.message:'Không tải được ảnh QR.');}};
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {const file=e.target.files?.[0];if(file)void uploadQr(file);};

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {e.preventDefault();setIsDragging(false);const file=e.dataTransfer.files?.[0];if(file)void uploadQr(file);};

  const handleGenerateVietQR = () => {
    const bankId = sponsorBankId.trim();
    const account = sponsorBankAccount.replace(/[^0-9A-Za-z]/g, '');
    if (!bankId || !account) {
      alert('Vui lòng nhập Mã ngân hàng VietQR và số tài khoản trước khi tạo mã.');
      return;
    }
    const params = new URLSearchParams();
    if (sponsorAccountHolder.trim()) params.set('accountName', sponsorAccountHolder.trim());
    if (sponsorTransferSyntax.trim()) params.set('addInfo', sponsorTransferSyntax.trim().slice(0, 25));
    const generatedUrl = `https://img.vietqr.io/image/${encodeURIComponent(bankId)}-${encodeURIComponent(account)}-compact2.png?${params.toString()}`;
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
            placeholder="Hợp tác & Đồng hành cùng Tên chủ tài khoản đã được xác nhận"
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
            placeholder="Tên chủ tài khoản đã được xác nhận trân trọng mọi sự chung tay từ Quý Doanh nghiệp, Tổ chức và Nhà hảo tâm..."
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
              3. Các hình thức đồng hành cùng Tên chủ tài khoản đã được xác nhận
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
              placeholder="Các hình thức đồng hành cùng Tên chủ tài khoản đã được xác nhận"
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
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Chủ thể/đơn vị tiếp nhận nguồn lực</label>
            <input type="text" value={sponsorRecipientEntity} onChange={(e)=>setSponsorRecipientEntity(e.target.value)} placeholder="Bắt buộc ghi rõ chủ thể thực tế đứng tên tài khoản tiếp nhận" className="w-full text-xs px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl font-bold focus:outline-hidden" />
            <p className="mt-1 text-[10px] leading-4 text-slate-500">Thông tin này hiển thị cạnh QR để tránh hiểu nhầm đơn vị nào trực tiếp tiếp nhận tiền.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mục tiêu chiến dịch (VNĐ)</label>
            <input inputMode="numeric" value={sponsorGoalAmount} onChange={(e)=>setSponsorGoalAmount(e.target.value.replace(/\D/g,''))} placeholder="100000000" className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-hidden" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Đã ghi nhận/đối soát (VNĐ)</label>
            <input inputMode="numeric" value={sponsorReceivedAmount} onChange={(e)=>setSponsorReceivedAmount(e.target.value.replace(/\D/g,''))} placeholder="0" className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-hidden" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Liên kết công khai/đối soát (nếu có)</label>
            <input type="url" value={sponsorPublicLedgerUrl} onChange={(e)=>setSponsorPublicLedgerUrl(e.target.value)} placeholder="https://..." className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden" />
          </div>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mã ngân hàng VietQR</label>
            <input type="text" value={sponsorBankId} onChange={(e)=>setSponsorBankId(e.target.value)} placeholder="Ví dụ: MB, VCB, BIDV..." className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 font-mono font-bold rounded-xl focus:outline-hidden" />
            <p className="text-[10px] text-slate-400 mt-1">Bắt buộc khi dùng chức năng tạo mã tự động. Không tự suy đoán ngân hàng từ tên để tránh tạo sai mã nhận tiền.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={sponsorAccountHolder}
              onChange={(e) => setSponsorAccountHolder(e.target.value)}
              placeholder="Tên chủ tài khoản đã được xác nhận"
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
              placeholder="0924 910 210"
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
              placeholder="hoptac@skyfirst.io.vn"
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

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-4">
        <div><label className="block text-xs font-bold text-slate-800 mb-1.5">Cảnh báo an toàn hiển thị công khai</label><textarea rows={3} value={sponsorDonationNotice} onChange={(e)=>setSponsorDonationNotice(e.target.value)} className="w-full text-xs px-3 py-2 bg-white border border-amber-200 rounded-xl" /></div>
        <div><label className="block text-xs font-bold text-slate-800 mb-1.5">Mức tiền gợi ý (VNĐ, phân cách bằng dấu phẩy)</label><input value={sponsorSuggestedAmounts} onChange={(e)=>setSponsorSuggestedAmounts(e.target.value)} placeholder="50000,100000,200000,500000" className="w-full text-xs px-3 py-2 bg-white border border-amber-200 rounded-xl font-mono" /></div>
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
              placeholder="Mã QR chuyển khoản"
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
              placeholder="Quét bằng ứng dụng ngân hàng có hỗ trợ mã chuyển khoản phù hợp"
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
                {sponsorQrCodeTitle || 'Mã QR chuyển khoản'}
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
                {sponsorQrCodeSubtitle || 'Quét bằng ứng dụng ngân hàng có hỗ trợ mã chuyển khoản phù hợp'}
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
              <Check size={13} className="text-emerald-400" />
              <span>{sponsorQrCodeUrl ? 'Đã nạp mã QR sẵn sàng hiển thị' : 'Đang để trống'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. KHỐI ĐỒNG HÀNH & HỢP TÁC CÙNG SKY FIRST NETWORK (MỤC 6 TRÊN TRANG) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HeartHandshake size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              6. Khối Đồng hành & Hợp tác cùng Tên chủ tài khoản đã được xác nhận
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
              placeholder="Đồng hành & Hợp tác cùng Tên chủ tài khoản đã được xác nhận"
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
                  placeholder="Xem đơn vị trực thuộc"
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
                placeholder="0924 910 210"
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
                placeholder="hoptac@skyfirst.io.vn"
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
              placeholder="Cá nhân có thể đề xuất đồng hành cùng Tên chủ tài khoản đã được xác nhận không?"
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
              placeholder="Bạn muốn trao đổi trực tiếp cùng Ban Chấp hành Tên chủ tài khoản đã được xác nhận?"
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
              placeholder="Vui lòng gọi hotline đối ngoại hoặc đặt lịch hẹn gặp trực tiếp tại Tên chủ tài khoản đã được xác nhận."
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
                Nút hành động 2 (Tham gia Tên chủ tài khoản đã được xác nhận)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tên nút
                </label>
                <input
                  type="text"
                  value={secondaryButtonLabel}
                  onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                  placeholder="Tham gia Tên chủ tài khoản đã được xác nhận"
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
          Bạn có thể nhập thư ngỏ kêu gọi tài trợ của Ban Chấp hành Tên chủ tài khoản đã được xác nhận, quy chế tiếp nhận và quản lý nguồn quỹ hoặc dán trực tiếp từ Word, Docs (tự động giữ nguyên định dạng in đậm, danh sách, bảng biểu).
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


// -----------------------------------------------------------------------------
// StandardEditorFields.tsx
// -----------------------------------------------------------------------------

interface StandardEditorFieldsProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  imageFit: 'original'|'contain'|'cover';
  setImageFit: (val:'original'|'contain'|'cover')=>void;
  imageFocalX:number; setImageFocalX:(val:number)=>void;
  imageFocalY:number; setImageFocalY:(val:number)=>void;
  contentFormatted: string;
  setContentFormatted: (val: string) => void;
  secondaryImageUrl: string;
  setSecondaryImageUrl: (val: string) => void;
  buttonLabel: string;
  setButtonLabel: (val: string) => void;
  buttonUrl: string;
  setButtonUrl: (val: string) => void;
  secondaryButtonLabel: string;
  setSecondaryButtonLabel: (val: string) => void;
  secondaryButtonUrl: string;
  setSecondaryButtonUrl: (val: string) => void;
}

export const StandardEditorFields: React.FC<StandardEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  imageUrl,
  setImageUrl,
  imageFit,setImageFit,imageFocalX,setImageFocalX,imageFocalY,setImageFocalY,
  contentFormatted,
  setContentFormatted,
  secondaryImageUrl,
  setSecondaryImageUrl,
  buttonLabel,
  setButtonLabel,
  buttonUrl,
  setButtonUrl,
  secondaryButtonLabel,
  setSecondaryButtonLabel,
  secondaryButtonUrl,
  setSecondaryButtonUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Khối Đầu Trang */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Tiêu Đề & Giới Thiệu)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Hiển thị ở phần đầu trang bài viết / thông tin
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
            placeholder="VD: HỎI ĐÁP & HỖ TRỢ hoặc QUY CHẾ HOẠT ĐỘNG"
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
            placeholder="Nhập tiêu đề trang..."
            className="w-full text-xl sm:text-2xl font-black text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Đoạn tóm tắt / Mở đầu trang
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Nhập đoạn văn tóm tắt nội dung chính của trang..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Hình Ảnh Đại Diện / Banner Đầu Trang */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Hình Ảnh Đại Diện (Banner Đầu Trang)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Chèn ảnh bằng liên kết URL
          </span>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <LinkIcon size={14} className="text-[#0284C7]" />
            Đường dẫn liên kết hình ảnh (URL)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/media/... hoặc https://..."
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono"
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-600">Cách hiển thị<select value={imageFit} onChange={e=>setImageFit(e.target.value as 'original'|'contain'|'cover')} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"><option value="original">Original — tỷ lệ gốc</option><option value="contain">Fit — không cắt</option><option value="cover">Cover — phủ khung</option></select></label><label className="text-xs font-bold text-slate-600">Focal X<input type="number" min="0" max="100" value={imageFocalX} onChange={e=>setImageFocalX(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"/></label><label className="text-xs font-bold text-slate-600">Focal Y<input type="number" min="0" max="100" value={imageFocalY} onChange={e=>setImageFocalY(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"/></label></div>
          {imageUrl && (
            <div className={`mt-3 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 ${imageFit==='cover'?'aspect-video':imageFit==='contain'?'h-64':''}`}>
              <img src={imageUrl} alt="Banner preview" style={{objectPosition:`${imageFocalX}% ${imageFocalY}%`}} className={imageFit==='cover'?'w-full h-full object-cover':imageFit==='contain'?'w-full h-full object-contain':'block max-w-full h-auto mx-auto'} onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Nội Dung Văn Bản Chi Tiết */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Nội Dung Văn Bản Chi Tiết
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Tự động giữ nguyên định dạng khi dán từ Word, Docs hoặc Website khác
          </span>
        </div>

        <div>
          <RichTextEditor
            id="editor-standard-content"
            value={contentFormatted}
            onChange={setContentFormatted}
            placeholder="Soạn thảo nội dung bài viết chi tiết hoặc dán trực tiếp từ nơi khác..."
            minHeight="320px"
          />
        </div>
      </div>

      {/* 4. Hình Ảnh Minh Họa Bổ Sung */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Hình Ảnh Minh Họa Bổ Sung (Dưới Bài Viết)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Chèn ảnh bằng liên kết URL (tùy chọn)
          </span>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <LinkIcon size={14} className="text-[#0284C7]" />
            Đường dẫn liên kết hình ảnh phụ (URL)
          </label>
          <input
            type="text"
            value={secondaryImageUrl}
            onChange={(e) => setSecondaryImageUrl(e.target.value)}
            placeholder="/media/... hoặc https://..."
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono"
          />
          {secondaryImageUrl && (
            <div className="mt-3 h-48 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={secondaryImageUrl}
                alt="Secondary preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 5. Các Nút Bấm Hành Động Trên Trang */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              5. Các Nút Bấm Hành Động Trên Trang
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Các nút điều hướng ở cuối nội dung trang
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nút 1 */}
          <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
            <span className="text-xs font-extrabold text-[#0284C7] block">
              Nút hành động chính 1
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút
              </label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                placeholder="VD: Gửi câu hỏi cho chúng tôi"
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
                placeholder="/contact"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Nút 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-extrabold text-slate-700 block">
              Nút hành động phụ 2
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút
              </label>
              <input
                type="text"
                value={secondaryButtonLabel}
                onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                placeholder="VD: Tra cứu chứng nhận"
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
                placeholder="/certificate"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

