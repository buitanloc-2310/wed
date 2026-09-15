import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
  CalendarDays,
} from 'lucide-react';
import { TeamMember, CorePillar, TimelineMilestone, PageRoute, CoreValueItem } from '../../types';
import { ImageUrlInput } from '../ImageUrlInput';
import { useDataContext } from '../../context/DataContext';

interface AdminAboutManagerProps {
  teamMembers: TeamMember[];
  corePillars: CorePillar[];
  timeline: TimelineMilestone[];
  onUpdateTeamMember: (index: number, updates: Partial<TeamMember>) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (index: number) => void;
  onUpdateCorePillar: (index: number, updates: Partial<CorePillar>) => void;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

type TabKey = 'content' | 'timeline' | 'team' | 'pillars';

type DeleteTarget =
  | { type: 'team'; index: number; label: string }
  | { type: 'timeline'; index: number; label: string }
  | { type: 'pillar'; index: number; label: string }
  | null;

const DEFAULT_VALUES: CoreValueItem[] = [
  { name: 'Giáo dục', desc: 'Đặt học tập và phát triển tri thức làm một trong những nền tảng chính.' },
  { name: 'Cộng đồng', desc: 'Khuyến khích tinh thần tham gia, sẻ chia và tạo giá trị chung.' },
  { name: 'Trách nhiệm', desc: 'Đề cao sự minh bạch, nghiêm túc và trách nhiệm trong hoạt động.' },
  { name: 'Chủ động và phát triển', desc: 'Khuyến khích người trẻ chủ động trải nghiệm và tiến bộ.' },
  { name: 'Kết nối và hợp tác', desc: 'Tạo cơ hội liên kết phù hợp giữa cá nhân và các nhóm hoạt động.' },
  { name: 'Bền vững', desc: 'Ưu tiên các định hướng có khả năng duy trì và tạo giá trị lâu dài.' },
];

export const AdminAboutManager: React.FC<AdminAboutManagerProps> = ({
  teamMembers,
  corePillars,
  timeline,
  onUpdateTeamMember,
  onAddTeamMember,
  onDeleteTeamMember,
  onUpdateCorePillar,
  onNavigate,
  onShowToast,
}) => {
  const { customPages, updateCustomPage } = useDataContext();

  const aboutPage = useMemo(
    () => customPages.find((p) => p.slug === 'about' || p.id === 'page-about'),
    [customPages]
  );

  const [activeTab, setActiveTab] = useState<TabKey>('content');
  const [searchMember, setSearchMember] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  /*
   * QUAN TRỌNG:
   * Nếu customTeam/customTimeline/customPillars tồn tại (kể cả []),
   * phải dùng đúng mảng đó. Không kiểm tra length > 0 vì khi Admin xóa hết,
   * dữ liệu mặc định cũ sẽ không được phép tự xuất hiện trở lại.
   */
  const activeTeam: TeamMember[] = Array.isArray(aboutPage?.customTeam)
    ? aboutPage!.customTeam!
    : teamMembers;

  const activeTimeline: TimelineMilestone[] = Array.isArray(aboutPage?.customTimeline)
    ? aboutPage!.customTimeline!
    : timeline;

  const activePillars: CorePillar[] = Array.isArray(aboutPage?.customPillars)
    ? aboutPage!.customPillars!
    : corePillars;

  const activeValues: CoreValueItem[] = Array.isArray(aboutPage?.customValues)
    ? aboutPage!.customValues!
    : DEFAULT_VALUES;

  const updateAbout = (updates: Record<string, unknown>, message?: string) => {
    if (!aboutPage) {
      onShowToast('Không tìm thấy dữ liệu trang Giới thiệu (slug: about).');
      return;
    }
    updateCustomPage(aboutPage.id, updates as any);
    if (message) onShowToast(message);
  };

  const updateTeam = (index: number, updates: Partial<TeamMember>) => {
    if (aboutPage) {
      const next = activeTeam.map((member, i) => (i === index ? { ...member, ...updates } : member));
      updateAbout({ customTeam: next });
    } else {
      onUpdateTeamMember(index, updates);
    }
  };

  const addTeam = () => {
    const member: TeamMember = {
      name: 'Thành viên mới',
      role: 'Chức danh',
      bio: '',
      theme: 'sky',
      imageSizeText: '1:1 (400x400px)',
      imageDescription: 'Ảnh chân dung thành viên',
      imageUrl: '',
    };

    if (aboutPage) updateAbout({ customTeam: [...activeTeam, member] });
    else onAddTeamMember(member);

    onShowToast('Đã thêm thành viên mới. Bạn có thể sửa thông tin và tải ảnh ngay bên dưới.');
  };

  const deleteTeam = (index: number) => {
    if (aboutPage) updateAbout({ customTeam: activeTeam.filter((_, i) => i !== index) });
    else onDeleteTeamMember(index);
  };

  const updateTimelineItem = (index: number, updates: Partial<TimelineMilestone>) => {
    if (!aboutPage) {
      onShowToast('Cần dữ liệu trang Giới thiệu để sửa Hành trình phát triển.');
      return;
    }
    const next = activeTimeline.map((item, i) => (i === index ? { ...item, ...updates } : item));
    updateAbout({ customTimeline: next });
  };

  const addTimelineItem = () => {
    const milestone: TimelineMilestone = {
      year: '2026',
      title: 'Cột mốc mới',
      description: '',
      highlights: [],
      isCurrent: false,
    };
    updateAbout({ customTimeline: [...activeTimeline, milestone] }, 'Đã thêm cột mốc mới.');
  };

  const deleteTimelineItem = (index: number) => {
    updateAbout({ customTimeline: activeTimeline.filter((_, i) => i !== index) });
  };

  const updatePillar = (index: number, updates: Partial<CorePillar>) => {
    if (aboutPage) {
      const next = activePillars.map((pillar, i) => (i === index ? { ...pillar, ...updates } : pillar));
      updateAbout({ customPillars: next });
    } else {
      onUpdateCorePillar(index, updates);
    }
  };

  const addPillar = () => {
    const number = String(activePillars.length + 1).padStart(2, '0');
    const pillar: CorePillar = {
      number,
      title: 'Trụ cột mới',
      shortDesc: '',
      fullDesc: '',
      iconName: 'GraduationCap',
      activities: [],
      imageUrl: '',
    };
    updateAbout({ customPillars: [...activePillars, pillar] }, 'Đã thêm trụ cột mới.');
  };

  const deletePillar = (index: number) => {
    const next = activePillars
      .filter((_, i) => i !== index)
      .map((pillar, i) => ({ ...pillar, number: String(i + 1).padStart(2, '0') }));
    updateAbout({ customPillars: next });
  };

  const updateValue = (index: number, updates: Partial<CoreValueItem>) => {
    const next = activeValues.map((value, i) => (i === index ? { ...value, ...updates } : value));
    updateAbout({ customValues: next });
  };

  const addValue = () => {
    updateAbout({ customValues: [...activeValues, { name: 'Giá trị mới', desc: '' }] });
  };

  const deleteValue = (index: number) => {
    updateAbout({ customValues: activeValues.filter((_, i) => i !== index) });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'team') deleteTeam(deleteTarget.index);
    if (deleteTarget.type === 'timeline') deleteTimelineItem(deleteTarget.index);
    if (deleteTarget.type === 'pillar') deletePillar(deleteTarget.index);
    onShowToast(`Đã xóa: ${deleteTarget.label}`);
    setDeleteTarget(null);
  };

  const filteredMembers = activeTeam
    .map((member, index) => ({ ...member, originalIndex: index }))
    .filter((member) => {
      const q = searchMember.trim().toLowerCase();
      if (!q) return true;
      return member.name.toLowerCase().includes(q) || member.role.toLowerCase().includes(q);
    });

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100';

  const textareaClass = `${inputClass} leading-relaxed resize-y`;

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-900">
            <Sparkles size={20} className="text-[#0284C7]" />
            Quản lý toàn bộ trang Giới thiệu
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-500">
            Sửa trực tiếp nội dung, hành trình phát triển, đội ngũ, trụ cột và ảnh. Dữ liệu tại đây được ghi vào chính trang <b>/about</b> thay vì chỉ sửa dữ liệu mẫu cũ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onNavigate('about');
            window.history.pushState({}, '', '/about');
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <ExternalLink size={14} />
          Xem trang công khai
        </button>
      </div>

      {!aboutPage && (
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          Không tìm thấy bản ghi trang có slug <b>about</b> hoặc id <b>page-about</b>. Đội ngũ vẫn có thể sửa bằng dữ liệu cũ, nhưng Hành trình/Nội dung trang cần bản ghi trang Giới thiệu để lưu chính xác.
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<FileText size={15} />}>
          Nội dung trang
        </TabButton>
        <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<CalendarDays size={15} />}>
          Hành trình ({activeTimeline.length})
        </TabButton>
        <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={15} />}>
          Đội ngũ ({activeTeam.length})
        </TabButton>
        <TabButton active={activeTab === 'pillars'} onClick={() => setActiveTab('pillars')} icon={<ShieldCheck size={15} />}>
          Trụ cột & Giá trị
        </TabButton>
      </div>

      {/* CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          <EditorCard title="Phần mở đầu" description="Các dòng đầu tiên xuất hiện trên trang Giới thiệu.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nhãn nhỏ / Badge">
                <input className={inputClass} value={aboutPage?.badge || ''} onChange={(e) => updateAbout({ badge: e.target.value })} />
              </Field>
              <Field label="Tiêu đề trang">
                <input className={inputClass} value={aboutPage?.title || ''} onChange={(e) => updateAbout({ title: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả giới thiệu">
              <textarea rows={4} className={textareaClass} value={aboutPage?.summary || ''} onChange={(e) => updateAbout({ summary: e.target.value })} />
            </Field>
          </EditorCard>

          <div className="grid gap-5 lg:grid-cols-3">
            <MiniContentCard
              title="Tầm nhìn"
              badge={aboutPage?.visionBadge || ''}
              heading={aboutPage?.visionTitle || ''}
              content={aboutPage?.visionContent || ''}
              onBadge={(value) => updateAbout({ visionBadge: value })}
              onHeading={(value) => updateAbout({ visionTitle: value })}
              onContent={(value) => updateAbout({ visionContent: value })}
            />
            <MiniContentCard
              title="Sứ mệnh"
              badge={aboutPage?.missionBadge || ''}
              heading={aboutPage?.missionTitle || ''}
              content={aboutPage?.missionContent || ''}
              onBadge={(value) => updateAbout({ missionBadge: value })}
              onHeading={(value) => updateAbout({ missionTitle: value })}
              onContent={(value) => updateAbout({ missionContent: value })}
            />
            <MiniContentCard
              title="Triết lý"
              badge={aboutPage?.philosophyBadge || ''}
              heading={aboutPage?.philosophyTitle || ''}
              content={aboutPage?.philosophyContent || ''}
              onBadge={(value) => updateAbout({ philosophyBadge: value })}
              onHeading={(value) => updateAbout({ philosophyTitle: value })}
              onContent={(value) => updateAbout({ philosophyContent: value })}
            />
          </div>

          <EditorCard title="Tên các khu vực" description="Có thể đổi toàn bộ chữ tiêu đề đang hiện trên trang.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Tiêu đề Trụ cột"><input className={inputClass} value={aboutPage?.pillarsSectionTitle || ''} onChange={(e) => updateAbout({ pillarsSectionTitle: e.target.value })} /></Field>
              <Field label="Nhãn Trụ cột"><input className={inputClass} value={aboutPage?.pillarsSectionBadge || ''} onChange={(e) => updateAbout({ pillarsSectionBadge: e.target.value })} /></Field>
              <Field label="Tiêu đề Giá trị"><input className={inputClass} value={aboutPage?.valuesSectionTitle || ''} onChange={(e) => updateAbout({ valuesSectionTitle: e.target.value })} /></Field>
              <Field label="Tiêu đề Hành trình"><input className={inputClass} value={aboutPage?.timelineSectionTitle || ''} onChange={(e) => updateAbout({ timelineSectionTitle: e.target.value })} /></Field>
              <Field label="Nhãn thời gian Hành trình"><input className={inputClass} value={aboutPage?.timelineSectionBadge || ''} onChange={(e) => updateAbout({ timelineSectionBadge: e.target.value })} placeholder="2025 - 2026" /></Field>
              <Field label="Tiêu đề Đội ngũ"><input className={inputClass} value={aboutPage?.teamSectionTitle || ''} onChange={(e) => updateAbout({ teamSectionTitle: e.target.value })} /></Field>
              <Field label="Dòng phụ Đội ngũ"><input className={inputClass} value={aboutPage?.teamSectionSubtitle || ''} onChange={(e) => updateAbout({ teamSectionSubtitle: e.target.value })} /></Field>
              <Field label="Nhãn Hệ sinh thái"><input className={inputClass} value={aboutPage?.unitsSectionBadge || ''} onChange={(e) => updateAbout({ unitsSectionBadge: e.target.value })} /></Field>
              <Field label="Tiêu đề Hệ sinh thái"><input className={inputClass} value={aboutPage?.unitsSectionTitle || ''} onChange={(e) => updateAbout({ unitsSectionTitle: e.target.value })} /></Field>
            </div>
          </EditorCard>

          <EditorCard title="Nút Hệ sinh thái & CTA cuối trang" description="Sửa chữ và đường dẫn nút mà không cần vào code.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nút Hệ sinh thái"><input className={inputClass} value={aboutPage?.unitsButtonLabel || ''} onChange={(e) => updateAbout({ unitsButtonLabel: e.target.value })} /></Field>
              <Field label="Link Hệ sinh thái"><input className={inputClass} value={aboutPage?.unitsButtonUrl || ''} onChange={(e) => updateAbout({ unitsButtonUrl: e.target.value })} /></Field>
              <Field label="Tiêu đề CTA"><input className={inputClass} value={aboutPage?.ctaTitle || ''} onChange={(e) => updateAbout({ ctaTitle: e.target.value })} /></Field>
              <Field label="Mô tả CTA"><textarea rows={3} className={textareaClass} value={aboutPage?.ctaDescription || ''} onChange={(e) => updateAbout({ ctaDescription: e.target.value })} /></Field>
              <Field label="Nút chính"><input className={inputClass} value={aboutPage?.buttonLabel || ''} onChange={(e) => updateAbout({ buttonLabel: e.target.value })} /></Field>
              <Field label="Link nút chính"><input className={inputClass} value={aboutPage?.buttonUrl || ''} onChange={(e) => updateAbout({ buttonUrl: e.target.value })} /></Field>
              <Field label="Nút phụ"><input className={inputClass} value={aboutPage?.secondaryButtonLabel || ''} onChange={(e) => updateAbout({ secondaryButtonLabel: e.target.value })} /></Field>
              <Field label="Link nút phụ"><input className={inputClass} value={aboutPage?.secondaryButtonUrl || ''} onChange={(e) => updateAbout({ secondaryButtonUrl: e.target.value })} /></Field>
            </div>
          </EditorCard>
        </div>
      )}

      {/* TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Hành trình phát triển</h3>
              <p className="mt-1 text-xs text-slate-500">Sửa, thêm hoặc xóa hoàn toàn từng mốc. Các điểm nổi bật nhập mỗi dòng một ý.</p>
            </div>
            <button type="button" onClick={addTimelineItem} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0284C7] px-4 py-2 text-xs font-bold text-white hover:bg-[#0369A1] sm:self-auto">
              <Plus size={15} /> Thêm cột mốc
            </button>
          </div>

          {activeTimeline.length === 0 ? (
            <EmptyState text="Chưa có cột mốc nào. Bấm “Thêm cột mốc” để tạo mới." />
          ) : (
            activeTimeline.map((item, index) => (
              <div key={`${item.year}-${index}`} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#0284C7]">Cột mốc #{index + 1}</div>
                    <div className="mt-1 text-sm font-black text-slate-900">{item.title || 'Chưa đặt tiêu đề'}</div>
                  </div>
                  <button type="button" onClick={() => setDeleteTarget({ type: 'timeline', index, label: item.title || item.year })} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50" title="Xóa cột mốc">
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                  <Field label="Năm / Tháng">
                    <input className={inputClass} value={item.year} onChange={(e) => updateTimelineItem(index, { year: e.target.value })} placeholder="2025 hoặc 08/2026" />
                  </Field>
                  <Field label="Tiêu đề">
                    <input className={inputClass} value={item.title} onChange={(e) => updateTimelineItem(index, { title: e.target.value })} />
                  </Field>
                </div>

                <Field label="Mô tả">
                  <textarea rows={4} className={textareaClass} value={item.description} onChange={(e) => updateTimelineItem(index, { description: e.target.value })} />
                </Field>

                <Field label="Điểm nổi bật (mỗi dòng = 1 ý)">
                  <textarea
                    rows={4}
                    className={textareaClass}
                    value={(item.highlights || []).join('\n')}
                    onChange={(e) =>
                      updateTimelineItem(index, {
                        highlights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </Field>

                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isCurrent)}
                    onChange={(e) => updateTimelineItem(index, { isCurrent: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#0284C7]"
                  />
                  Đánh dấu “Đang vận hành”
                </label>
              </div>
            ))
          )}
        </div>
      )}

      {/* TEAM */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Tìm thành viên theo tên, chức danh..."
                className={`${inputClass} pl-9 pr-9`}
              />
              {searchMember && (
                <button type="button" onClick={() => setSearchMember('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <button type="button" onClick={addTeam} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0284C7] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0369A1] sm:self-auto">
              <Plus size={15} /> Thêm thành viên
            </button>
          </div>

          {activeTeam.length === 0 ? (
            <EmptyState text="Danh sách đội ngũ đang trống. Nội dung cũ đã được xóa và sẽ không tự quay lại nếu AboutPage dùng customTeam đúng cách." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredMembers.map((member) => {
                const index = member.originalIndex;
                return (
                  <div key={`${member.name}-${index}`} className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-sky-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {member.imageUrl ? (
                            <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400"><Users size={20} /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7]">Thành viên #{index + 1}</div>
                          <h4 className="truncate text-sm font-black text-slate-900">{member.name}</h4>
                          <div className="truncate text-xs font-medium text-slate-500">{member.role}</div>
                        </div>
                      </div>

                      <button type="button" onClick={() => setDeleteTarget({ type: 'team', index, label: member.name })} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50" title="Xóa thành viên">
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <Field label="Họ & tên">
                        <input className={inputClass} value={member.name} onChange={(e) => updateTeam(index, { name: e.target.value })} />
                      </Field>
                      <Field label="Chức danh / Ban">
                        <input className={inputClass} value={member.role} onChange={(e) => updateTeam(index, { role: e.target.value })} />
                      </Field>
                    </div>

                    <Field label="Giới thiệu ngắn">
                      <textarea rows={4} className={textareaClass} value={member.bio} onChange={(e) => updateTeam(index, { bio: e.target.value })} />
                    </Field>

                    <ImageUrlInput
                      label="Ảnh chân dung"
                      value={member.imageUrl || ''}
                      onChange={(url) => updateTeam(index, { imageUrl: url })}
                      placeholder="/media/... hoặc https://..."
                      category="team"
                      helperText="Bấm “Tải ảnh lên” để chọn ảnh trực tiếp từ máy. Ảnh sẽ được tải lên Cloudflare R2 và URL được lưu tự động."
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PILLARS + VALUES */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          <EditorCard
            title="Trụ cột hoạt động"
            description="Sửa nội dung, hoạt động trọng tâm, ảnh; hoặc thêm/xóa trụ cột."
            action={
              <button type="button" onClick={addPillar} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0284C7] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0369A1]">
                <Plus size={14} /> Thêm trụ cột
              </button>
            }
          >
            {activePillars.length === 0 ? (
              <EmptyState text="Chưa có trụ cột nào." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {activePillars.map((pillar, index) => (
                  <div key={`${pillar.number}-${index}`} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#0284C7] px-1 text-xs font-black text-white">{pillar.number || index + 1}</span>
                      <input className={`${inputClass} flex-1 bg-white font-bold`} value={pillar.title} onChange={(e) => updatePillar(index, { title: e.target.value })} />
                      <button type="button" onClick={() => setDeleteTarget({ type: 'pillar', index, label: pillar.title })} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={14} /></button>
                    </div>

                    <Field label="Mô tả">
                      <textarea rows={4} className={`${textareaClass} bg-white`} value={pillar.fullDesc || pillar.shortDesc || ''} onChange={(e) => updatePillar(index, { fullDesc: e.target.value, shortDesc: e.target.value })} />
                    </Field>

                    <Field label="Hoạt động trọng tâm (mỗi dòng = 1 hoạt động)">
                      <textarea
                        rows={4}
                        className={`${textareaClass} bg-white`}
                        value={(pillar.activities || []).join('\n')}
                        onChange={(e) => updatePillar(index, { activities: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                      />
                    </Field>

                    <ImageUrlInput
                      label="Ảnh trụ cột (không bắt buộc)"
                      value={pillar.imageUrl || ''}
                      onChange={(url) => updatePillar(index, { imageUrl: url })}
                      category="education"
                    />
                  </div>
                ))}
              </div>
            )}
          </EditorCard>

          <EditorCard
            title="Giá trị cốt lõi"
            description="Sửa trực tiếp các giá trị đang xuất hiện trên trang Giới thiệu."
            action={
              <button type="button" onClick={addValue} className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100">
                <Plus size={14} /> Thêm giá trị
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeValues.map((value, index) => (
                <div key={`${value.name}-${index}`} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#0284C7]">{String(index + 1).padStart(2, '0')}</span>
                    <input className={`${inputClass} flex-1 bg-white font-bold`} value={value.name} onChange={(e) => updateValue(index, { name: e.target.value })} />
                    <button type="button" onClick={() => deleteValue(index)} className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50" title="Xóa giá trị"><Trash2 size={14} /></button>
                  </div>
                  <textarea rows={4} className={`${textareaClass} bg-white`} value={value.desc} onChange={(e) => updateValue(index, { desc: e.target.value })} />
                </div>
              ))}
            </div>
          </EditorCard>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertCircle size={26} /></div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Xác nhận xóa?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Bạn có chắc muốn xóa <strong>{deleteTarget.label}</strong>? Thay đổi sẽ được cập nhật vào dữ liệu trang Giới thiệu.
              </p>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">Hủy</button>
              <button type="button" onClick={confirmDelete} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ active, onClick, icon, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
      active
        ? 'border border-sky-200 bg-sky-50 text-[#0284C7]'
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    {icon}
    {children}
  </button>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block space-y-1.5">
    <span className="block text-[11px] font-semibold text-slate-600">{label}</span>
    {children}
  </label>
);

const EditorCard: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, action, children }) => (
  <section className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const MiniContentCard: React.FC<{
  title: string;
  badge: string;
  heading: string;
  content: string;
  onBadge: (value: string) => void;
  onHeading: (value: string) => void;
  onContent: (value: string) => void;
}> = ({ title, badge, heading, content, onBadge, onHeading, onContent }) => (
  <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
    <div className="text-sm font-black text-slate-900">{title}</div>
    <Field label="Nhãn"><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" value={badge} onChange={(e) => onBadge(e.target.value)} /></Field>
    <Field label="Tiêu đề"><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" value={heading} onChange={(e) => onHeading(e.target.value)} /></Field>
    <Field label="Nội dung"><textarea rows={6} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" value={content} onChange={(e) => onContent(e.target.value)} /></Field>
  </div>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-xs leading-relaxed text-slate-500">
    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-slate-400" />
    {text}
  </div>
);
