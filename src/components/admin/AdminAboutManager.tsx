import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TeamMember, CorePillar, TimelineMilestone, PageRoute } from '../../types';
import { ImageUrlInput } from '../ImageUrlInput';

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
  const [activeTab, setActiveTab] = useState<'team' | 'pillars'>('team');
  const [searchMember, setSearchMember] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<{ index: number; name: string } | null>(null);

  const filteredMembers = teamMembers.map((m, idx) => ({ ...m, originalIndex: idx })).filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.role.toLowerCase().includes(searchMember.toLowerCase())
  );

  const handleCreateMember = () => {
    onAddTeamMember({
      name: 'Thành Viên Mới',
      role: 'Thành viên Ban Chấp hành',
      bio: 'Tiểu sử tóm tắt năng lực và đóng góp của thành viên trong mạng lưới.',
      theme: 'sky',
      imageSizeText: '1:1 (400x400px)',
      imageDescription: 'Chân dung thành viên',
      imageUrl: ''
    });
    onShowToast('Đã thêm thành viên mới vào danh sách. Vui lòng cập nhật thông tin.');
  };

  const handleConfirmDelete = () => {
    if (memberToDelete !== null) {
      onDeleteTeamMember(memberToDelete.index);
      onShowToast(`Đã xóa thành viên: ${memberToDelete.name}`);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users size={20} className="text-[#0284C7]" />
            Quản lý Giới thiệu, Ban Chấp hành & Trụ cột Sky First Network
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý đội ngũ nhân sự lãnh đạo, ban điều hành và các giá trị trụ cột cốt lõi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onNavigate('about');
              window.history.pushState({}, '', '/about');
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            <span>Xem Trang Giới Thiệu</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'team'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={15} />
          <span>Ban Lãnh Đạo & Điều Hành ({teamMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'pillars'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck size={15} />
          <span>4 Trụ Cột Hoạt Động Cốt Lõi</span>
        </button>
      </div>

      {/* TAB 1: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Tìm thành viên theo tên, chức vụ..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
              {searchMember && (
                <button
                  type="button"
                  onClick={() => setSearchMember('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCreateMember}
              className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Thêm Thành Viên Mới</span>
            </button>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map((member) => {
              const idx = member.originalIndex;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 p-5 shadow-xs transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Users size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider block">
                          Thành viên #{idx + 1}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 leading-tight">
                          {member.name}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMemberToDelete({ index: idx, name: member.name })}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                      title="Xóa thành viên"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Form inputs */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Họ & Tên</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => onUpdateTeamMember(idx, { name: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Chức vụ / Ban</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => onUpdateTeamMember(idx, { role: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tiểu sử tóm tắt</label>
                      <textarea
                        rows={2}
                        value={member.bio}
                        onChange={(e) => onUpdateTeamMember(idx, { bio: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Đường dẫn ảnh chân dung (URL)</label>
                      <input
                        type="text"
                        value={member.imageUrl || ''}
                        onChange={(e) => onUpdateTeamMember(idx, { imageUrl: e.target.value })}
                        placeholder="/media/... hoặc https://..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CORE PILLARS */}
      {activeTab === 'pillars' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#0284C7]" />
                06 Giá trị cốt lõi Sky First Network
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các định hướng chiến lược hiển thị trên trang Giới thiệu và Trang chủ.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Đã lưu 4 trụ cột cốt lõi!')}
              className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Lưu Trụ Cột</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {corePillars.map((pillar, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => onUpdateCorePillar(idx, { title: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    placeholder="Tên trụ cột"
                  />
                </div>

                <textarea
                  rows={3}
                  value={pillar.fullDesc || pillar.shortDesc || ''}
                  onChange={(e) => onUpdateCorePillar(idx, { fullDesc: e.target.value, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed"
                  placeholder="Mô tả ý nghĩa và cam kết hành động..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {memberToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle size={26} />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Xác Nhận Xóa Thành Viên?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn có chắc muốn xóa <strong>{memberToDelete.name}</strong> khỏi danh sách Ban Lãnh đạo & Điều hành của mạng lưới?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Xóa thành viên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
