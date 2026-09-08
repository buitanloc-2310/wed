import React from 'react';
import {
  Compass,
  Sparkles,
  Building2,
  Layers,
  Award,
  Milestone,
  Users,
  Megaphone,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { CorePillar, TimelineMilestone, TeamMember, CoreValueItem } from '../../../types';
import { CORE_PILLARS, CORE_VALUES, TIMELINE_DATA, TEAM_DATA } from '../../../data/mockData';

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
      role: 'Chức vụ / Vai trò Ban Điều Phối',
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
            placeholder="VD: HỆ SINH THÁI GIÁO DỤC SFN 2026"
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
                    placeholder="Chuẩn hóa & Vận hành Hệ thống số SFN"
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
                  placeholder="Ban hành Quy chuẩn Giao diện & Thương hiệu SFN 2026&#10;Ra mắt Website và Cổng TNV"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. KHỐI BAN LÃNH ĐẠO & ĐỘI NGŨ SFN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối 6: Ban Lãnh Đạo & Đội Ngũ SFN
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
              placeholder="Ban Sáng lập & Thường trực SFN"
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
                        placeholder="VD: Sáng lập & Chủ tịch SFN"
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[#0284C7] font-bold"
                      />
                    </div>
                  </div>

                  {customTeam.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(mIdx)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                      title="Xóa thành viên này"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Đường dẫn URL ảnh chân dung (imageUrl)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={member.imageUrl || ''}
                      onChange={(e) => handleUpdateMember(mIdx, { imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

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
              placeholder="5 Đơn Vị Chuyên Môn Của SFN"
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
              placeholder="Cùng SFN Đồng Hành Phụng Sự Xã Hội"
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
