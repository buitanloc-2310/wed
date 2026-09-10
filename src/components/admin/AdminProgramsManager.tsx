import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Users,
  Copy,
  Save,
  Send,
  Link as LinkIcon,
  Sparkles,
  Award,
  FileText,
  Image as ImageIcon,
  Check,
  ChevronRight
} from 'lucide-react';
import { Program, PageRoute, AdminManagerActionRef } from '../../types';
import { ImageUrlInput } from '../ImageUrlInput';
import { generateSlug, getProgramSlug } from '../../utils/slug';

interface AdminProgramsManagerProps {
  programs: Program[];
  onUpdateProgram: (id: string, updates: Partial<Program>) => void;
  onAddProgram: (program: Program) => void;
  onDeleteProgram: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
  actionRef?: React.MutableRefObject<AdminManagerActionRef | null>;
  onViewModeChange?: (mode: 'list' | 'edit') => void;
}

export const AdminProgramsManager: React.FC<AdminProgramsManagerProps> = ({
  programs,
  onUpdateProgram,
  onAddProgram,
  onDeleteProgram,
  onNavigate,
  onShowToast,
  actionRef,
  onViewModeChange,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [selectedProgId, setSelectedProgId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  // States for repeatable arrays in editor
  const [newTimelineItem, setNewTimelineItem] = useState('');
  const [newBenefitItem, setNewBenefitItem] = useState('');
  const [newRequirementItem, setNewRequirementItem] = useState('');

  const activeProg = programs.find((p) => p.id === selectedProgId) || programs[0];

  const publishedCount = programs.filter((p) => p.isPublished !== false).length;
  const draftCount = programs.filter((p) => p.isPublished === false).length;

  const handleCreateNew = () => {
    const newId = `prog-${Date.now()}`;
    const initialTitle = 'Chương Trình / Dự Án Mới';
    const initialSlug = generateSlug(initialTitle);

    const newProg: Program = {
      id: newId,
      slug: initialSlug,
      title: initialTitle,
      category: 'volunteer',
      categoryLabel: 'Tình nguyện & Cộng đồng',
      status: 'upcoming',
      statusLabel: 'Bản nháp',
      summary: '',
      description: '',
      imageSizeText: '16:9 (1200x675px)',
      imageDescription: 'Hình ảnh đại diện dự án',
      imageUrl: '',
      theme: 'emerald',
      date: '',
      location: '',
      targetAudience: '',
      spotsLeft: undefined,
      timeline: [],
      benefits: [],
      requirements: [],
      isPublished: false
    };

    onAddProgram(newProg);
    setSelectedProgId(newId);
    setViewMode('edit');
    onShowToast('Đã tạo chương trình mới! Đang mở trình chỉnh sửa chi tiết.');
  };

  // Expose handleCreateNew via actionRef
  React.useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        handleCreateNew,
      };
    }
    return () => {
      if (actionRef) actionRef.current = null;
    };
  }, [actionRef, programs]);

  // Notify parent of viewMode changes
  React.useEffect(() => {
    onViewModeChange?.(viewMode);
  }, [viewMode, onViewModeChange]);

  const handleEditClick = (program: Program) => {
    setSelectedProgId(program.id);
    setViewMode('edit');
  };

  const handleTogglePublish = (program: Program, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = program.isPublished === false;
    onUpdateProgram(program.id, { isPublished: nextState });
    onShowToast(
      nextState
        ? `Đã xuất bản dự án "${program.title}" lên website chính!`
        : `Đã chuyển dự án "${program.title}" về Bản nháp!`
    );
  };

  const handleConfirmDelete = () => {
    if (!programToDelete) return;
    onDeleteProgram(programToDelete.id);
    onShowToast(`Đã xóa chương trình: ${programToDelete.title}`);
    setProgramToDelete(null);
    if (selectedProgId === programToDelete.id) {
      setSelectedProgId(null);
      setViewMode('list');
    }
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'published') return p.isPublished !== false;
    if (statusFilter === 'draft') return p.isPublished === false;
    return true;
  });

  // =========================================================================
  // 1. CHẾ ĐỘ DANH SÁCH (LIST VIEW) - ĐỒNG BỘ CHUẨN XÁC VỚI MỤC TRANG
  // =========================================================================
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {/* Danh sách các chương trình */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <Layers size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Chưa có chương trình nào
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Bắt đầu tạo chương trình hoặc dự án cộng đồng đầu tiên cho mạng lưới.
            </p>
            <button
              type="button"
              id="programs-btn-create-first"
              onClick={handleCreateNew}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Thêm mới</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tiêu đề các cột trong bảng danh sách */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-12 sm:col-span-5">Tên chương trình & Dự án</div>
              <div className="hidden sm:block sm:col-span-2">Nhãn</div>
              <div className="hidden sm:block sm:col-span-2">Thời gian & Địa điểm</div>
              <div className="hidden sm:block sm:col-span-3 text-right">Trạng thái & Hành động</div>
            </div>

            {/* Các hàng dữ liệu chương trình */}
            <div className="divide-y divide-slate-100">
              {filteredPrograms.map((prog) => {
                const isDraft = prog.isPublished === false;
                const slug = getProgramSlug(prog);
                const displayUrl = `/du-an/${slug}`;

                return (
                  <div
                    key={prog.id}
                    id={`program-row-${prog.id}`}
                    onClick={() => handleEditClick(prog)}
                    className="group grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-sky-50/40 cursor-pointer transition relative"
                  >
                    {/* Cột 1: Tên chương trình & Đường dẫn slug */}
                    <div className="col-span-12 sm:col-span-5 pr-2">
                      <div className="flex items-center gap-2.5">
                        {/* Trạng thái Nháp / Đăng */}
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            !isDraft ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={!isDraft ? 'Đã xuất bản' : 'Bản nháp'}
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition truncate">
                            {prog.title || 'Chương trình chưa đặt tên'}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                            {displayUrl}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cột 2: Nhãn (Tách riêng biệt thành một cột) */}
                    <div className="hidden sm:flex sm:col-span-2 items-center flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
                        {prog.categoryLabel || 'Dự án'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                          prog.status === 'open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : prog.status === 'upcoming'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {prog.statusLabel || (prog.status === 'open' ? 'Đang mở đơn' : 'Đã đóng')}
                      </span>
                    </div>

                    {/* Cột 3: Thời gian & Địa điểm */}
                    <div className="hidden sm:block sm:col-span-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                        <MapPin size={12} className="text-[#0284C7] shrink-0" />
                        <span className="truncate">{prog.location || 'Toàn quốc'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5 truncate">
                        <Calendar size={12} className="shrink-0" />
                        <span className="truncate">{prog.date || 'Đang cập nhật'}</span>
                      </div>
                    </div>

                    {/* Cột 3: Trạng thái xuất bản & Cụm Action Icons khi hover */}
                    <div className="hidden sm:flex sm:col-span-3 items-center justify-end">
                      {/* Trạng thái bình thường */}
                      <div className="group-hover:hidden text-right">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            !isDraft
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {!isDraft ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {prog.spotsLeft ? `Còn ${prog.spotsLeft} chỉ tiêu` : 'Chỉ tiêu linh hoạt'}
                        </span>
                      </div>

                      {/* Khi rê chuột đến (group-hover): Hiện các icon thao tác */}
                      <div className="hidden group-hover:flex items-center gap-1">
                        {/* 1. Icon Chỉnh sửa */}
                        <button
                          type="button"
                          id={`btn-edit-prog-${prog.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(prog);
                          }}
                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition shadow-2xs border border-slate-200 cursor-pointer"
                          title="Chỉnh sửa chi tiết chương trình"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* 2. Icon Nháp hoặc Đăng */}
                        <button
                          type="button"
                          id={`btn-toggle-publish-prog-${prog.id}`}
                          onClick={(e) => handleTogglePublish(prog, e)}
                          className={`p-1.5 rounded-lg transition shadow-2xs border cursor-pointer ${
                            !isDraft
                              ? 'text-amber-600 hover:bg-amber-50 border-amber-200 bg-white'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200 bg-white'
                          }`}
                          title={!isDraft ? 'Chuyển về Bản nháp' : 'Xuất bản dự án công khai'}
                        >
                          {!isDraft ? <Clock size={15} /> : <CheckCircle2 size={15} />}
                        </button>

                        {/* 3. Icon Xem trang công khai */}
                        <button
                          type="button"
                          id={`btn-view-public-prog-${prog.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.history.pushState({}, '', displayUrl);
                            onNavigate('program-detail');
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#0284C7] hover:bg-white rounded-lg transition shadow-2xs border border-slate-200 cursor-pointer"
                          title="Xem trang dự án trên website"
                        >
                          <Eye size={15} />
                        </button>

                        {/* 4. Icon Xóa */}
                        <button
                          type="button"
                          id={`btn-delete-prog-${prog.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramToDelete(prog);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition shadow-2xs border border-slate-200 bg-white cursor-pointer"
                          title="Xóa chương trình"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
        {programToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Xác Nhận Xóa Chương Trình / Dự Án?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa <strong>{programToDelete.title}</strong>? Trang dự án này và biểu mẫu đăng ký liên kết sẽ bị gỡ bỏ khỏi website.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setProgramToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. CHẾ ĐỘ CHỈNH SỬA CHI TIẾT (EDIT VIEW) - ĐỘC LẬP THEO CẤU TRÚC TRANG CHÍNH
  // =========================================================================
  if (!activeProg) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Không tìm thấy dữ liệu chương trình.</p>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isDraft = activeProg.isPublished === false;
  const currentSlug = getProgramSlug(activeProg);
  const displayUrl = `/du-an/${currentSlug}`;

  const handleSave = (publishState?: boolean) => {
    const finalPublishState = publishState !== undefined ? publishState : !isDraft;
    onUpdateProgram(activeProg.id, { isPublished: finalPublishState });
    if (finalPublishState) {
      onShowToast(`Đã lưu và xuất bản chương trình "${activeProg.title}" lên website chính!`);
    } else {
      onShowToast(`Đã lưu các chỉnh sửa của chương trình "${activeProg.title}" (Bản nháp)!`);
    }
  };

  const handleAddTimeline = () => {
    if (!newTimelineItem.trim()) return;
    const updated = [...(activeProg.timeline || []), newTimelineItem.trim()];
    onUpdateProgram(activeProg.id, { timeline: updated });
    setNewTimelineItem('');
  };

  const handleRemoveTimeline = (index: number) => {
    const updated = (activeProg.timeline || []).filter((_, i) => i !== index);
    onUpdateProgram(activeProg.id, { timeline: updated });
  };

  const handleUpdateTimeline = (index: number, val: string) => {
    const updated = [...(activeProg.timeline || [])];
    updated[index] = val;
    onUpdateProgram(activeProg.id, { timeline: updated });
  };

  const handleAddBenefit = () => {
    if (!newBenefitItem.trim()) return;
    const updated = [...(activeProg.benefits || []), newBenefitItem.trim()];
    onUpdateProgram(activeProg.id, { benefits: updated });
    setNewBenefitItem('');
  };

  const handleRemoveBenefit = (index: number) => {
    const updated = (activeProg.benefits || []).filter((_, i) => i !== index);
    onUpdateProgram(activeProg.id, { benefits: updated });
  };

  const handleUpdateBenefit = (index: number, val: string) => {
    const updated = [...(activeProg.benefits || [])];
    updated[index] = val;
    onUpdateProgram(activeProg.id, { benefits: updated });
  };

  const handleAddRequirement = () => {
    if (!newRequirementItem.trim()) return;
    const updated = [...(activeProg.requirements || []), newRequirementItem.trim()];
    onUpdateProgram(activeProg.id, { requirements: updated });
    setNewRequirementItem('');
  };

  const handleRemoveRequirement = (index: number) => {
    const updated = (activeProg.requirements || []).filter((_, i) => i !== index);
    onUpdateProgram(activeProg.id, { requirements: updated });
  };

  const handleUpdateRequirement = (index: number, val: string) => {
    const updated = [...(activeProg.requirements || [])];
    updated[index] = val;
    onUpdateProgram(activeProg.id, { requirements: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] text-slate-900 flex flex-col font-sans overflow-y-auto">
      {/* 1. THANH TIÊU ĐỀ ĐỘC LẬP (STICKY HEADER) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="editor-btn-back-programs"
            onClick={() => setViewMode('list')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-2 text-xs font-bold cursor-pointer"
            title="Quay lại danh sách chương trình"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Quay lại danh sách</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                !isDraft
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {!isDraft ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Đã xuất bản</span>
                </>
              ) : (
                <>
                  <Clock size={13} className="text-amber-600" />
                  <span>Bản nháp</span>
                </>
              )}
            </span>

            <span className="text-xs text-sky-700 font-mono bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 font-bold hidden sm:inline">
              {displayUrl}
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút xem trang công khai */}
          <button
            type="button"
            id="editor-btn-view-program"
            onClick={() => {
              window.history.pushState({}, '', displayUrl);
              onNavigate('program-detail');
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="Xem trang dự án trên website"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Xem Trên Website</span>
          </button>

          {isDraft ? (
            <>
              {/* Trang đang ở trạng thái Bản nháp: Lưu chỉnh sửa hoặc Đăng bài */}
              <button
                type="button"
                id="editor-btn-save-draft-prog"
                onClick={() => handleSave(false)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Lưu lại các chỉnh sửa (giữ ở trạng thái Bản nháp)"
              >
                <Save size={15} className="text-[#0284C7]" />
                <span>LƯU CHỈNH SỬA</span>
              </button>

              <button
                type="button"
                id="editor-btn-publish-prog"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Xuất bản dự án để hiển thị chính thức trên website"
              >
                <CheckCircle2 size={15} />
                <span>ĐĂNG BÀI</span>
              </button>
            </>
          ) : (
            <>
              {/* Trang đã xuất bản: Có thể chuyển về Bản nháp hoặc Lưu các thay đổi */}
              <button
                type="button"
                id="editor-btn-unpublish-prog"
                onClick={() => handleSave(false)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                title="Chuyển dự án về trạng thái Bản nháp (gỡ khỏi website chính)"
              >
                <Clock size={14} className="text-amber-600" />
                <span>Chuyển về Nháp</span>
              </button>

              <button
                type="button"
                id="editor-btn-save-prog"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Lưu các thay đổi và áp dụng trực tiếp lên website chính"
              >
                <Save size={15} />
                <span>LƯU THAY ĐỔI</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. THÂN SOẠN THẢO VỚI CÁC KHỐI, CÁC Ô NHƯ CẤU TRÚC TRANG CHÍNH */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 flex-1">
        {/* KHỐI 1: CÀI ĐẶT ĐƯỜNG DẪN & THÔNG TIN CƠ BẢN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <LinkIcon size={15} className="text-[#0284C7]" />
              Khối 1: Cài Đặt Đường Dẫn & Nhận Diện Dự Án
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">/du-an/:slug</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Tiêu Đề Dự Án / Chương Trình <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={activeProg.title}
                onChange={(e) => {
                  const title = e.target.value;
                  onUpdateProgram(activeProg.id, {
                    title,
                    slug: activeProg.slug ? activeProg.slug : generateSlug(title)
                  });
                }}
                placeholder="Ví dụ: Chiến Dịch Mùa Hè Xanh 2026..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <LinkIcon size={13} className="text-[#0284C7]" />
                  Đường dẫn tĩnh (Slug)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-2 rounded-xl border border-slate-200 shrink-0">
                    /du-an/
                  </span>
                  <input
                    type="text"
                    value={activeProg.slug || generateSlug(activeProg.title)}
                    onChange={(e) =>
                      onUpdateProgram(activeProg.id, { slug: generateSlug(e.target.value) })
                    }
                    placeholder="duong-dan-tinh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#0284C7] focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Phân Loại Lĩnh Vực
                </label>
                <select
                  value={activeProg.category}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    const labels: Record<string, string> = {
                      volunteer: 'Tình nguyện & Xã hội',
                      education: 'Giáo dục & Đào tạo',
                      recruitment: 'Tuyển dụng & Nhân sự',
                      workshop: 'Hội thảo & Kỹ năng'
                    };
                    onUpdateProgram(activeProg.id, { category: val, categoryLabel: labels[val] || 'Dự án' });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="volunteer">Tình nguyện & Xã hội</option>
                  <option value="education">Giáo dục & Đào tạo</option>
                  <option value="recruitment">Tuyển dụng & Nhân sự</option>
                  <option value="workshop">Hội thảo & Kỹ năng</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Trạng Thái Tuyển Đơn
                </label>
                <select
                  value={activeProg.status}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    const labels: Record<string, string> = {
                      open: 'Đang mở đơn đăng ký',
                      upcoming: 'Sắp diễn ra',
                      closed: 'Đã đóng đơn'
                    };
                    onUpdateProgram(activeProg.id, { status: val, statusLabel: labels[val] || 'Trạng thái' });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="open">Đang mở đơn đăng ký (Màu xanh)</option>
                  <option value="upcoming">Sắp diễn ra (Màu vàng)</option>
                  <option value="closed">Đã đóng đơn (Màu xám)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Màu Sắc Chủ Đề (Theme)
                </label>
                <select
                  value={activeProg.theme}
                  onChange={(e) => onUpdateProgram(activeProg.id, { theme: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="sky">Xanh Da Trời (Sky)</option>
                  <option value="emerald">Xanh Lá (Emerald)</option>
                  <option value="amber">Cam Vàng (Amber)</option>
                  <option value="rose">Hồng Đỏ (Rose)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 2: THỜI GIAN, ĐỊA ĐIỂM & QUY MÔ TUYỂN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Calendar size={15} className="text-[#0284C7]" />
              Khối 2: Thời Gian, Địa Điểm & Chỉ Tiêu Tuyển
            </h2>
            <span className="text-[11px] text-slate-400">Khối thông số nhanh 4 ô trên trang chi tiết</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Calendar size={13} className="text-[#0284C7]" />
                Thời Gian Triển Khai
              </label>
              <input
                type="text"
                value={activeProg.date}
                onChange={(e) => onUpdateProgram(activeProg.id, { date: e.target.value })}
                placeholder="Ví dụ: Tháng 06/2026 - Tháng 08/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <MapPin size={13} className="text-[#0284C7]" />
                Địa Điểm Tổ Chức
              </label>
              <input
                type="text"
                value={activeProg.location}
                onChange={(e) => onUpdateProgram(activeProg.id, { location: e.target.value })}
                placeholder="Ví dụ: TP. Hồ Chí Minh & Các tỉnh lân cận"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Users size={13} className="text-[#0284C7]" />
                Đối Tượng Tham Gia
              </label>
              <input
                type="text"
                value={activeProg.targetAudience}
                onChange={(e) => onUpdateProgram(activeProg.id, { targetAudience: e.target.value })}
                placeholder="Ví dụ: Học sinh, Sinh viên từ 16 - 26 tuổi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Sparkles size={13} className="text-[#0284C7]" />
                Số Lượng Chỉ Tiêu (Suất còn lại)
              </label>
              <input
                type="number"
                value={activeProg.spotsLeft ?? 30}
                onChange={(e) =>
                  onUpdateProgram(activeProg.id, { spotsLeft: parseInt(e.target.value) || 0 })
                }
                placeholder="30"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 3: HÌNH ẢNH ĐẠI DIỆN & BANNER TRUYỀN THÔNG (16:9) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ImageIcon size={15} className="text-[#0284C7]" />
              Khối 3: Hình Ảnh Đại Diện & Banner Dự Án (Tỉ lệ 16:9)
            </h2>
            <span className="text-[11px] text-slate-400">1200x675px</span>
          </div>

          <div className="space-y-3">
            <ImageUrlInput
              label="Ảnh Bìa Dự Án (URL hoặc Tải ảnh lên)"
              value={activeProg.imageUrl || ''}
              onChange={(url) => onUpdateProgram(activeProg.id, { imageUrl: url })}
              helperText="Khuyên dùng: 1200x675px (Tỉ lệ 16:9)"
              category="volunteer"
              placeholder="https://images.unsplash.com/photo-..."
            />

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Chú Thích / Mô Tả Hình Ảnh
              </label>
              <input
                type="text"
                value={activeProg.imageDescription || ''}
                onChange={(e) => onUpdateProgram(activeProg.id, { imageDescription: e.target.value })}
                placeholder="Hình ảnh các tình nguyện viên đang triển khai hoạt động"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 4: TÓM TẮT & GIỚI THIỆU CHI TIẾT DỰ ÁN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FileText size={15} className="text-[#0284C7]" />
              Khối 4: Tóm Tắt & Giới Thiệu Chi Tiết Dự Án
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Tóm Tắt Mở Đầu / Sapo (Hiển thị đầu trang & ngoài danh sách)
              </label>
              <textarea
                rows={2}
                value={activeProg.summary}
                onChange={(e) => onUpdateProgram(activeProg.id, { summary: e.target.value })}
                placeholder="Tóm tắt thông điệp cốt lõi và mục tiêu của dự án trong 1-2 câu..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nội Dung Giới Thiệu Chi Tiết & Mục Tiêu Dự Án
              </label>
              <textarea
                rows={6}
                value={activeProg.description}
                onChange={(e) => onUpdateProgram(activeProg.id, { description: e.target.value })}
                placeholder="Trình bày đầy đủ bối cảnh, ý nghĩa, các hoạt động cụ thể và giá trị mang lại cho cộng đồng..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 leading-relaxed font-normal"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 5: LỘ TRÌNH & CÁC GIAI ĐOẠN TRIỂN KHAI (TIMELINE) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock size={15} className="text-[#0284C7]" />
              Khối 5: Lộ Trình & Các Giai Đoạn Triển Khai (Timeline)
            </h2>
            <span className="text-[11px] text-slate-400">
              {activeProg.timeline?.length || 0} giai đoạn
            </span>
          </div>

          {/* Danh sách các mốc giai đoạn */}
          <div className="space-y-2.5">
            {activeProg.timeline && activeProg.timeline.length > 0 ? (
              activeProg.timeline.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleUpdateTimeline(idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeline(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Xóa giai đoạn này"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa thiết lập mốc lộ trình nào.</p>
            )}
          </div>

          {/* Thêm giai đoạn mới */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newTimelineItem}
              onChange={(e) => setNewTimelineItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTimeline())}
              placeholder="Nhập giai đoạn mới (ví dụ: Giai đoạn 4: Tổng kết & Vinh danh)..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleAddTimeline}
              className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm Mốc</span>
            </button>
          </div>
        </div>

        {/* KHỐI 6: QUYỀN LỢI KHI THAM GIA (BENEFITS) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Award size={15} className="text-[#0284C7]" />
              Khối 6: Quyền Lợi Dành Cho Người Tham Gia (Benefits)
            </h2>
            <span className="text-[11px] text-slate-400">
              {activeProg.benefits?.length || 0} quyền lợi
            </span>
          </div>

          {/* Danh sách quyền lợi */}
          <div className="space-y-2.5">
            {activeProg.benefits && activeProg.benefits.length > 0 ? (
              activeProg.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold flex items-center justify-center shrink-0">
                    <Check size={13} />
                  </span>
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleUpdateBenefit(idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Xóa quyền lợi này"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa thiết lập quyền lợi nào.</p>
            )}
          </div>

          {/* Thêm quyền lợi mới */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newBenefitItem}
              onChange={(e) => setNewBenefitItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
              placeholder="Nhập quyền lợi mới (ví dụ: Cấp giấy chứng nhận hệ thống Giấy chứng nhận, hỗ trợ phụ cấp...)..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleAddBenefit}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm Quyền Lợi</span>
            </button>
          </div>
        </div>

        {/* KHỐI 7: TIÊU CHUẨN & YÊU CẦU ỨNG VIÊN (REQUIREMENTS) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Users size={15} className="text-[#0284C7]" />
              Khối 7: Tiêu Chuẩn & Yêu Cầu Ứng Viên (Requirements)
            </h2>
            <span className="text-[11px] text-slate-400">
              {activeProg.requirements?.length || 0} yêu cầu
            </span>
          </div>

          {/* Danh sách yêu cầu */}
          <div className="space-y-2.5">
            {activeProg.requirements && activeProg.requirements.length > 0 ? (
              activeProg.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Xóa yêu cầu này"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa thiết lập yêu cầu nào.</p>
            )}
          </div>

          {/* Thêm yêu cầu mới */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newRequirementItem}
              onChange={(e) => setNewRequirementItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
              placeholder="Nhập yêu cầu mới (ví dụ: Cam kết tham gia 80% thời gian hoạt động...)..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm Yêu Cầu</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
