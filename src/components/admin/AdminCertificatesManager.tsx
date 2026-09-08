import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  Save,
  Send,
  Calendar,
  User,
  ShieldCheck,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Certificate, PageRoute } from '../../types';

interface AdminCertificatesManagerProps {
  certificates: Certificate[];
  onUpdateCertificate: (code: string, updates: Partial<Certificate>) => void;
  onAddCertificate: (certificate: Certificate) => void;
  onDeleteCertificate: (code: string) => void;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const AdminCertificatesManager: React.FC<AdminCertificatesManagerProps> = ({
  certificates,
  onUpdateCertificate,
  onAddCertificate,
  onDeleteCertificate,
  onNavigate,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [selectedCertCode, setSelectedCertCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  const activeCert = certificates.find((c) => c.code === selectedCertCode) || certificates[0];

  const publishedCount = certificates.filter((c) => c.isPublished !== false).length;
  const draftCount = certificates.filter((c) => c.isPublished === false).length;

  const handleCreateNew = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCode = `SKY-2026-${randomNum}`;

    const newCert: Certificate = {
      code: newCode,
      recipientName: '',
      recipientEmail: '',
      recipientPhone: '',
      programTitle: '',
      programType: 'Khóa Đào Tạo',
      issueDate: new Date().toLocaleDateString('vi-VN'),
      expiryDate: '',
      status: 'valid',
      issuer: 'Sky First Network',
      verificationUrl: `https://skyfirst.io.vn/certificate?code=${newCode}`,
      signatory: {
        name: '',
        title: ''
      },
      isPublished: false
    };

    onAddCertificate(newCert);
    setSelectedCertCode(newCode);
    setViewMode('edit');
    onShowToast(`Đã tạo hồ sơ chứng nhận ${newCode}. Vui lòng hoàn thiện thông tin.`);
  };

  const handleEditClick = (cert: Certificate) => {
    setSelectedCertCode(cert.code);
    setViewMode('edit');
  };

  const handleConfirmDelete = () => {
    if (!certToDelete) return;
    onDeleteCertificate(certToDelete.code);
    onShowToast(`Đã xóa chứng nhận: ${certToDelete.code}`);
    setCertToDelete(null);
    if (selectedCertCode === certToDelete.code) {
      setSelectedCertCode(null);
      setViewMode('list');
    }
  };

  const filteredCerts = certificates.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.programTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'published') return c.isPublished !== false;
    if (statusFilter === 'draft') return c.isPublished === false;
    return true;
  });

  // ----------------------------------------------------
  // LIST VIEW
  // ----------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award size={20} className="text-[#0284C7]" />
              Danh Sách Giấy chứng nhận ({certificates.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống lưu trữ và tra cứu chứng nhận trực tuyến Sky First Certificate Authority.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onNavigate('certificate');
                window.history.pushState({}, '', '/certificate');
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>Xem Trang hệ thống Giấy chứng nhận</span>
            </button>

            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus size={16} />
              <span>Cấp Chứng Nhận Mới</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({certificates.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Hiệu lực ({publishedCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                statusFilter === 'draft'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Bản nháp ({draftCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã hệ thống Giấy chứng nhận, tên người nhận, chương trình..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCerts.map((cert) => {
            const isDraft = cert.isPublished === false;
            return (
              <div
                key={cert.code}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-sky-50 text-[#0284C7] border border-sky-200 rounded-lg text-xs font-mono font-bold">
                      {cert.code}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        isDraft
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isDraft ? 'Bản nháp' : 'Đã xác thực & Đăng'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {cert.recipientName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {cert.programTitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {cert.issueDate}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="truncate">{cert.issuer}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateCertificate(cert.code, { isPublished: isDraft ? true : false });
                      onShowToast(
                        isDraft
                          ? `Đã đăng chứng nhận ${cert.code}!`
                          : `Đã chuyển chứng nhận ${cert.code} về bản nháp!`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isDraft
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDraft ? 'Đăng công khai' : 'Hạ xuống nháp'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditClick(cert)}
                      className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Edit size={13} />
                      <span>Chỉnh sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCertToDelete(cert)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                      title="Xóa chứng nhận"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Modal */}
        {certToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Xác Nhận Xóa Chứng Nhận?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có chắc muốn xóa chứng nhận <strong>{certToDelete.code}</strong> cấp cho <strong>{certToDelete.recipientName}</strong>? Người dùng sẽ không thể tra cứu chứng nhận này nữa.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCertToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
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

  // ----------------------------------------------------
  // EDIT VIEW
  // ----------------------------------------------------
  const isDraft = activeCert.isPublished === false;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 sticky top-16 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Quay lại danh sách</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <h2 className="text-base font-black text-slate-900 truncate">
              Chỉnh Sửa Chứng Nhận: {activeCert.code}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isDraft
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {isDraft ? 'Trạng thái: Bản nháp (Chưa công khai)' : 'Trạng thái: Đã đăng & Cho phép tra cứu'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onUpdateCertificate(activeCert.code, { isPublished: false });
              onShowToast('Đã lưu chứng nhận dưới dạng Bản nháp');
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Lưu Bản Nháp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onUpdateCertificate(activeCert.code, { isPublished: true });
              onShowToast(`Đã lưu và ĐĂNG CÔNG KHAI chứng nhận ${activeCert.code}!`);
            }}
            className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Send size={14} />
            <span>{isDraft ? 'Đăng Chứng Nhận' : 'Cập Nhật & Đăng'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('certificate');
              window.history.pushState({}, '', '/certificate');
            }}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition"
            title="Xem cổng tra cứu chứng nhận"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Mã Giấy chứng nhận <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={activeCert.code}
              onChange={(e) => onUpdateCertificate(activeCert.code, { code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Họ Và Tên Người Được Cấp <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={activeCert.recipientName}
              onChange={(e) => onUpdateCertificate(activeCert.code, { recipientName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Chương Trình / Dự Án Được Chứng Nhận <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={activeCert.programTitle}
            onChange={(e) => onUpdateCertificate(activeCert.code, { programTitle: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Ngày Cấp
            </label>
            <input
              type="text"
              value={activeCert.issueDate}
              onChange={(e) => onUpdateCertificate(activeCert.code, { issueDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Thời Hạn Hiệu Lực
            </label>
            <input
              type="text"
              value={activeCert.expiryDate || 'Vô thời hạn'}
              onChange={(e) => onUpdateCertificate(activeCert.code, { expiryDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Trạng Thái Xác Thực
            </label>
            <select
              value={activeCert.status}
              onChange={(e) => onUpdateCertificate(activeCert.code, { status: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
            >
              <option value="valid">Hợp lệ (Đã xác thực)</option>
              <option value="test">Thử nghiệm / Chờ kiểm tra</option>
              <option value="revoked">Đã thu hồi</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Đơn Vị Cấp Chứng Nhận
            </label>
            <input
              type="text"
              value={activeCert.issuer}
              onChange={(e) => onUpdateCertificate(activeCert.code, { issuer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Người Ký & Chức Danh
            </label>
            <input
              type="text"
              value={activeCert.signatory?.name || ''}
              onChange={(e) =>
                onUpdateCertificate(activeCert.code, {
                  signatory: {
                    name: e.target.value,
                    title: activeCert.signatory?.title || 'Đại diện Ban Điều Phối'
                  }
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Quay lại danh sách
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateCertificate(activeCert.code, { isPublished: false });
                onShowToast('Đã lưu bản nháp chứng nhận');
                setViewMode('list');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition"
            >
              Lưu nháp & Thoát
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdateCertificate(activeCert.code, { isPublished: true });
                onShowToast(`Đã xuất bản chứng nhận ${activeCert.code}`);
                setViewMode('list');
              }}
              className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Đăng & Hoàn Tất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
