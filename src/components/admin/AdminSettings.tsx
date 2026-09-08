import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Users,
  Power,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Shield,
  Code2,
  PenTool,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Eye,
  Wrench,
  Edit3,
  RefreshCw,
  Clock,
  Phone,
  ShieldCheck,
  Check,
  Search,
  Filter,
  Database,
  Cloud,
  CloudUpload,
  CloudDownload,
  AlertCircle,
  Info
} from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import {
  SiteConfig,
  AdminUser,
  AdminUserRole,
  SiteClosedReason,
  PageRoute
} from '../../types';

interface AdminSettingsProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (page: PageRoute) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const {
    siteConfig,
    updateSiteConfig,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    customPages,
    programs,
    networkUnits,
    newsArticles,
    isFirebaseConfigured,
    isFirebaseSyncing,
    firebaseSyncStatus,
    firebaseSyncMessage,
    uploadAllDataToFirestore,
    fetchDataFromFirestore,
  } = useDataContext();

  const handleManualUploadToFirestore = async () => {
    const res = await uploadAllDataToFirestore();
    onShowToast(res.message);
  };

  const handleManualFetchFromFirestore = async () => {
    const res = await fetchDataFromFirestore();
    onShowToast(res.message);
  };

  // ==========================================
  // KHỐI 1: NHẬN DIỆN THƯƠNG HIỆU DRAFT STATE
  // ==========================================
  const [logoUrl, setLogoUrl] = useState(siteConfig.logoUrl || '');
  const [siteName, setSiteName] = useState(siteConfig.siteName || '');
  const [siteDescription, setSiteDescription] = useState(
    siteConfig.siteDescription || siteConfig.tagline || ''
  );
  const [tagline, setTagline] = useState(siteConfig.tagline || '');

  // ==========================================
  // KHỐI 2: TÀI KHOẢN DRAFT & MODAL STATE
  // ==========================================
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminUserRole>('all');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);

  // User Form fields
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<AdminUserRole>('admin');
  const [userStatus, setUserStatus] = useState<'active' | 'inactive'>('active');
  const [userNote, setUserNote] = useState('');
  const [emailError, setEmailError] = useState('');

  // ==========================================
  // KHỐI 3: TRẠNG THÁI WEBSITE DRAFT STATE
  // ==========================================
  const [siteStatus, setSiteStatus] = useState<'active' | 'closed'>(
    siteConfig.siteStatus || 'active'
  );
  const [closedReason, setClosedReason] = useState<SiteClosedReason>(
    siteConfig.closedReason || 'maintenance'
  );
  const [closedReasonText, setClosedReasonText] = useState(
    siteConfig.closedReasonText || 'Bảo trì & Nâng cấp hệ thống định kỳ'
  );
  const [closedMessage, setClosedMessage] = useState(
    siteConfig.closedMessage ||
      'Website Sky First Network đang tạm thời đóng để nâng cấp và biên tập nội dung mới. Chúng tôi sẽ sớm quay trở lại!'
  );
  const [closedEstimatedReopen, setClosedEstimatedReopen] = useState(
    siteConfig.closedEstimatedReopen || 'Dự kiến hoàn tất trong ngày'
  );
  const [closedNoticeType, setClosedNoticeType] = useState<'banner' | 'lockscreen'>(
    siteConfig.closedNoticeType || 'lockscreen'
  );

  // Handler: Lưu nhận diện thương hiệu
  const handleSaveBrand = () => {
    updateSiteConfig({
      logoUrl: logoUrl.trim(),
      siteName: siteName.trim(),
      siteDescription: siteDescription.trim(),
      tagline: tagline.trim() || siteDescription.trim(),
      footerSlogan: siteDescription.trim() || siteConfig.footerSlogan,
    });
    onShowToast('Đã lưu thiết lập Logo, Tên gọi & Miêu tả thành công!');
  };

  // Handler: Tải ảnh logo từ máy
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onShowToast('Ảnh logo nên nhỏ hơn 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          onShowToast('Đã tải ảnh logo lên thành công!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler: Mở modal thêm tài khoản
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserEmail('');
    setUserName('');
    setUserRole('admin');
    setUserStatus('active');
    setUserNote('');
    setEmailError('');
    setUserModalOpen(true);
  };

  // Handler: Mở modal sửa tài khoản
  const handleOpenEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserEmail(user.email);
    setUserName(user.name);
    setUserRole(user.role);
    setUserStatus(user.status);
    setUserNote(user.note || '');
    setEmailError('');
    setUserModalOpen(true);
  };

  // Handler: Lưu tài khoản
  const handleSaveUser = () => {
    const trimmedEmail = userEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError('Vui lòng nhập địa chỉ email');
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Định dạng email không hợp lệ');
      return;
    }


    // Kiểm tra trùng lặp email khi thêm mới
    if (!editingUser) {
      const isDuplicate = adminUsers.some(
        (u) => u.email.toLowerCase() === trimmedEmail
      );
      if (isDuplicate) {
        setEmailError('Địa chỉ email này đã tồn tại trong danh sách');
        return;
      }
    }

    if (editingUser) {
      updateAdminUser(editingUser.id, {
        email: trimmedEmail,
        name: userName.trim() || trimmedEmail.split('@')[0],
        role: userRole,
        status: userStatus,
        note: userNote.trim(),
      });
      onShowToast(`Đã cập nhật tài khoản ${trimmedEmail} thành công!`);
    } else {
      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        email: trimmedEmail,
        name: userName.trim() || trimmedEmail.split('@')[0],
        role: userRole,
        status: userStatus,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        note: userNote.trim(),
      };
      addAdminUser(newUser);
      onShowToast(`Đã thêm tài khoản ${trimmedEmail} thành công!`);
    }

    setUserModalOpen(false);
  };

  // Handler: Xóa tài khoản
  const handleConfirmDeleteUser = () => {
    if (deleteConfirmUser) {
      deleteAdminUser(deleteConfirmUser.id);
      onShowToast(`Đã xóa tài khoản ${deleteConfirmUser.email}`);
      setDeleteConfirmUser(null);
    }
  };

  // Handler: Lưu cấu hình Trạng thái Website
  const handleSaveSiteStatus = () => {
    updateSiteConfig({
      siteStatus,
      closedReason,
      closedReasonText: closedReasonText.trim(),
      closedMessage: closedMessage.trim(),
      closedEstimatedReopen: closedEstimatedReopen.trim(),
      closedNoticeType,
    });
    if (siteStatus === 'closed') {
      onShowToast('Đã thiết lập ĐÓNG WEBSITE. Khách xem trang sẽ thấy thông báo bảo trì/biên tập!');
    } else {
      onShowToast('Đã MỞ LẠI WEBSITE. Toàn bộ trang đã hoạt động công khai!');
    }
  };

  // Filtered Users
  const filteredUsers = adminUsers.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.name.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: AdminUserRole) => {
    switch (role) {
      case 'developer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Code2 size={13} />
            <span>Lập trình viên</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Shield size={13} />
            <span>Quản trị viên</span>
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <PenTool size={13} />
            <span>Biên tập viên</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. KHỐI THIẾT LẬP LOGO, TÊN GỌI, MIÊU TẢ (BÊN DƯỚI TÊN GỌI)            */}
      {/* ========================================================================= */}
      <section
        id="section-brand"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 scroll-mt-6"
      >
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="text-sky-600" size={18} />
              <span>Thiết lập Nhận Diện Thương Hiệu</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cấu hình Logo biểu trưng, Tên gọi chính thức và Dòng miêu tả xuất hiện trực tiếp bên dưới tên gọi ở Header & Footer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột Trái: Form thiết lập */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Logo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Logo Thương Hiệu
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    id="input-logo-url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Nhập đường dẫn URL ảnh logo (ví dụ: https://...)"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  />

                  {/* Nút upload file hoặc chọn mẫu */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition">
                      <ImageIcon size={14} />
                      <span>Tải ảnh từ thiết bị</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                    </label>

                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <RotateCcw size={13} />
                        <span>Xóa logo (Dùng chữ S mặc định)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Tên gọi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tên Gọi Website / Hệ Thống <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Ví dụ: Sky First Network"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 font-bold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Xuất hiện in đậm ở góc trên thanh điều hướng và đầu trang.
                </span>
              </div>

              {/* 3. Miêu tả (bên dưới tên gọi) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Miêu Tả (Bên Dưới Tên Gọi) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-site-description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Ví dụ: Mạng lưới Giáo dục & Phát triển Cộng đồng"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Dòng chữ này hiển thị ngay dưới Tên Gọi ở thanh Navbar và phần đầu chân trang (Footer).
                </span>
              </div>

              {/* Nút lưu */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  id="btn-save-brand-settings"
                  onClick={handleSaveBrand}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-sky-600/25 transition inline-flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Lưu Nhận Diện Thương Hiệu</span>
                </button>
              </div>
            </div>

            {/* Cột Phải: Xem trước trực quan (Preview Header & Footer) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} className="text-sky-600" />
                <span>Xem Trước Hiển Thị Thực Tế</span>
              </h4>

              {/* 1. Preview trên thanh điều hướng trắng (Navbar) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Hiển thị trên Thanh Điều Hướng (Navbar)
                </span>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A3FF] via-[#0284C7] to-[#2563EB] p-0.5 shadow-md shadow-sky-400/25 overflow-hidden flex-shrink-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 rounded-[10px] flex items-center justify-center text-white font-black text-lg">
                        S
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">
                      {siteName || 'TÊN GỌI HỆ THỐNG'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
                      {siteDescription || 'Miêu tả bên dưới tên gọi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Preview trên Chân trang tối màu (Footer) */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Hiển thị trên Chân Trang (Footer)
                </span>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00A3FF] to-[#2563EB] flex items-center justify-center font-black text-xl text-white shadow-md shadow-sky-500/25 overflow-hidden flex-shrink-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>S</span>
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-tight block text-white">
                      {siteName || 'TÊN GỌI HỆ THỐNG'}
                    </span>
                    <span className="text-[11px] text-sky-300 font-medium block -mt-1">
                      {siteDescription || 'Miêu tả bên dưới tên gọi'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. KHỐI THIẾT LẬP CÁC TÀI KHOẢN (DEV, ADMIN, EDITOR - GMAIL)              */}
      {/* ========================================================================= */}
      <section
        id="section-users"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-6"
      >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-sky-600" size={18} />
                <span>Thiết Lập Tài Khoản Phân Quyền</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ định và quản lý các tài khoản Gmail cho 3 vai trò: <strong>Lập trình viên</strong>, <strong>Quản trị viên</strong> và <strong>Biên tập viên</strong>.
              </p>
            </div>

            <button
              type="button"
              id="btn-add-admin-user"
              onClick={handleOpenAddUser}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-sky-600/25 transition shrink-0"
            >
              <Plus size={16} />
              <span>Thêm Tài Khoản Gmail</span>
            </button>
          </div>

          {/* Role Cards Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Shield size={16} />
                </div>
                <span className="text-lg font-black text-amber-900">
                  {adminUsers.filter((u) => u.role === 'admin').length}
                </span>
              </div>
              <h4 className="text-xs font-bold text-amber-900">Quản Trị Viên (Admin)</h4>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Toàn quyền quản lý website, tài khoản và cấu hình hệ thống.
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Code2 size={16} />
                </div>
                <span className="text-lg font-black text-indigo-900">
                  {adminUsers.filter((u) => u.role === 'developer').length}
                </span>
              </div>
              <h4 className="text-xs font-bold text-indigo-900">Lập Trình Viên (Developer)</h4>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Quản trị mã nguồn, tối ưu bố cục và bảo trì hệ thống.
              </p>
            </div>

            <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <PenTool size={16} />
                </div>
                <span className="text-lg font-black text-sky-900">
                  {adminUsers.filter((u) => u.role === 'editor').length}
                </span>
              </div>
              <h4 className="text-xs font-bold text-sky-900">Biên Tập Viên (Editor)</h4>
              <p className="text-[11px] text-sky-700 mt-0.5">
                Soạn thảo, kiểm duyệt và xuất bản tin tức, chương trình.
              </p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo Gmail hoặc Họ tên..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  roleFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                Tất cả ({adminUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  roleFilter === 'admin'
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                Quản trị viên
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('developer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  roleFilter === 'developer'
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                Lập trình viên
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  roleFilter === 'editor'
                    ? 'bg-sky-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                Biên tập viên
              </button>
            </div>
          </div>

          {/* Table list of admin users */}
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tài khoản Gmail</th>
                  <th className="py-3 px-4">Họ tên / Tên hiển thị</th>
                  <th className="py-3 px-4">Vai trò phân quyền</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày cấp</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Không tìm thấy tài khoản Gmail nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-sky-50/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-[10px] font-black shrink-0">
                            M
                          </div>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        {user.note && (
                          <div className="text-[10px] text-slate-400">{user.note}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3.5 px-4">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>Tạm khóa</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {user.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(user)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmUser(user)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KHỐI ĐÓNG / MỞ WEBSITE & THIẾT LẬP BANNER THÔNG BÁO                     */}
      {/* ========================================================================= */}
      <section
        id="section-status"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 scroll-mt-6"
      >
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Power className="text-sky-600" size={18} />
              <span>Thiết Lập Đóng / Mở Website & Banner Thông Báo</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Khi đóng website, khách truy cập công khai sẽ thấy Banner hoặc Màn hình thông báo trạng thái. <strong>Ngay cả khi website đóng, trang /admin vẫn hoạt động bình thường 100%.</strong>
            </p>
          </div>

          {/* Master Switch: Đóng / Mở website */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              siteStatus === 'closed'
                ? 'bg-rose-50/60 border-rose-300'
                : 'bg-emerald-50/60 border-emerald-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    siteStatus === 'closed'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  }`}
                >
                  <Power size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      Trạng thái hiện tại: {siteStatus === 'closed' ? 'ĐANG ĐÓNG WEBSITE' : 'ĐANG MỞ HOẠT ĐỘNG'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        siteStatus === 'closed'
                          ? 'bg-rose-200 text-rose-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {siteStatus === 'closed' ? 'Tạm Dừng Công Khai' : 'Công Khai Trực Tuyến'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {siteStatus === 'closed'
                      ? 'Website đang được đóng đối với người dùng công khai. Chỉ các đường dẫn /admin là vẫn truy cập bình thường.'
                      : 'Người dùng và cộng đồng có thể truy cập mọi trang thông tin bình thường.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="btn-toggle-site-open"
                  onClick={() => setSiteStatus('active')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    siteStatus === 'active'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>Mở Website</span>
                </button>

                <button
                  type="button"
                  id="btn-toggle-site-close"
                  onClick={() => setSiteStatus('closed')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    siteStatus === 'closed'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle size={14} />
                  <span>Đóng Website</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cấu hình chi tiết khi website đóng */}
          <div className="space-y-6 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cấu hình Nội dung Banner & Thông Báo Khi Đóng Website
            </h4>

            {/* 1. Chọn lý do đóng */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Lý do Đóng Trang (Trạng thái)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setClosedReason('maintenance');
                    setClosedReasonText('Bảo trì & Nâng cấp hệ thống định kỳ');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                    closedReason === 'maintenance'
                      ? 'border-rose-400 bg-rose-50/80 text-rose-900 shadow-2xs font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Wrench size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">1. Đang Bảo Trì</span>
                    <span className="text-[11px] opacity-80 block mt-0.5">
                      Bảo dưỡng máy chủ & cập nhật hạ tầng
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setClosedReason('editing');
                    setClosedReasonText('Đang biên tập & chuẩn hóa dữ liệu nội dung');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                    closedReason === 'editing'
                      ? 'border-amber-400 bg-amber-50/80 text-amber-900 shadow-2xs font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Edit3 size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">2. Đang Biên Tập</span>
                    <span className="text-[11px] opacity-80 block mt-0.5">
                      Ban biên tập cập nhật bài viết & trang
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setClosedReason('upgrading');
                    setClosedReasonText('Nâng cấp các tính năng trải nghiệm mới');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                    closedReason === 'upgrading'
                      ? 'border-sky-400 bg-sky-50/80 text-sky-900 shadow-2xs font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <RefreshCw size={18} className="text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">3. Đang Nâng Cấp</span>
                    <span className="text-[11px] opacity-80 block mt-0.5">
                      Cải tiến giao diện và tiện ích
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Tiêu đề hiển thị */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tiêu đề hiển thị trên Banner / Màn hình
                </label>
                <input
                  type="text"
                  id="input-closed-reason-text"
                  value={closedReasonText}
                  onChange={(e) => setClosedReasonText(e.target.value)}
                  placeholder="Ví dụ: Bảo trì & Nâng cấp hệ thống định kỳ"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Thời gian dự kiến hoàn thành
                </label>
                <input
                  type="text"
                  id="input-closed-estimated-reopen"
                  value={closedEstimatedReopen}
                  onChange={(e) => setClosedEstimatedReopen(e.target.value)}
                  placeholder="Ví dụ: Dự kiến hoàn tất trong ngày / 18:00 hôm nay"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* 3. Thông điệp chi tiết */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Thông điệp chi tiết gửi đến cộng đồng
              </label>
              <textarea
                id="input-closed-message"
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                rows={3}
                placeholder="Nhập thông điệp thông báo..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* 4. Hình thức hiển thị khi đóng */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Hình thức hiển thị khi Đóng Website
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    closedNoticeType === 'lockscreen'
                      ? 'border-sky-500 bg-sky-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="noticeType"
                    checked={closedNoticeType === 'lockscreen'}
                    onChange={() => setClosedNoticeType('lockscreen')}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Màn hình Thông báo Đóng trang (Lockscreen Toàn diện)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Khóa các trang công khai bằng một màn hình thông báo hiện đại, có thông điệp và thời gian dự kiến hoàn thành.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    closedNoticeType === 'banner'
                      ? 'border-sky-500 bg-sky-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="noticeType"
                    checked={closedNoticeType === 'banner'}
                    onChange={() => setClosedNoticeType('banner')}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Thanh Banner Cảnh Báo Trên Đầu Trang (Top Banner)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Ghim một thanh Banner màu sắc nổi bật ở trên cùng mọi trang để báo cho người dùng biết trang đang được bảo trì/biên tập.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Nút lưu thiết lập trạng thái */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                id="btn-save-site-status"
                onClick={handleSaveSiteStatus}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-sky-600/25 transition inline-flex items-center gap-2"
              >
                <Save size={16} />
                <span>Lưu Thiết Lập Trạng Thái Website</span>
              </button>

              <div className="text-[11px] text-slate-400 font-medium">
                * Trang /admin luôn hoạt động bình thường kể cả khi đóng trang.
              </div>
            </div>
          </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KHỐI ĐỒNG BỘ CƠ SỞ DỮ LIỆU FIREBASE DATABASE (CLOUD FIRESTORE)        */}
      {/* ========================================================================= */}
      <section
        id="section-firebase-sync"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="text-amber-500" size={18} />
              <span>Đồng Bộ Cơ Sở Dữ Liệu Firebase (Cloud Firestore)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý kết nối, tự động lưu trữ và đồng bộ hóa hai chiều giữa trang quản trị và Firebase Firestore Database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              firebaseSyncStatus === 'synced' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Firebase Đã Kết Nối & Đồng Bộ</span>
                </span>
              ) : firebaseSyncStatus === 'syncing' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  <RefreshCw size={14} className="animate-spin text-sky-600" />
                  <span>Đang Đồng Bộ Dữ Liệu...</span>
                </span>
              ) : firebaseSyncStatus === 'error' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle size={14} className="text-rose-600" />
                  <span>Lỗi Kết Nối Firebase</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
                  <Cloud size={14} className="text-slate-500" />
                  <span>Sẵn Sàng Kết Nối</span>
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertTriangle size={14} className="text-amber-600" />
                <span>Chưa Cấu Hình .env</span>
              </span>
            )}
          </div>
        </div>

        {/* Thông báo trạng thái chi tiết */}
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
          isFirebaseConfigured 
            ? 'bg-slate-50 border border-slate-200 text-slate-700'
            : 'bg-amber-50/70 border border-amber-200 text-amber-900'
        }`}>
          <Info size={16} className={`shrink-0 mt-0.5 ${isFirebaseConfigured ? 'text-sky-600' : 'text-amber-600'}`} />
          <div className="space-y-1">
            <div className="font-bold">Trạng thái đồng bộ hệ thống:</div>
            <div>{firebaseSyncMessage}</div>
            {!isFirebaseConfigured && (
              <div className="text-[11px] text-amber-700 mt-1">
                Để kích hoạt đồng bộ đám mây thật, bạn hãy mở tệp <code>.env</code> trên máy và điền các khóa cấu hình từ Firebase Console theo mẫu trong tệp <code>.env.example</code>.
              </div>
            )}
          </div>
        </div>

        {/* Danh sách bảng dữ liệu Firestore */}
        <div>
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Các Bộ Sưu Tập Dữ Liệu (Firestore Collections)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Trang Tùy Biến</span>
                <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold rounded-md text-[11px]">
                  {customPages.length} trang
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Collection: custom_pages
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Chương Trình SFN</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[11px]">
                  {programs.length} chương trình
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Collection: programs
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Đơn Vị Thành Viên</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md text-[11px]">
                  {networkUnits.length} đơn vị
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Collection: network_units
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Tin Tức & Bài Viết</span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded-md text-[11px]">
                  {newsArticles.length} bài viết
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Collection: news_articles
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Quản Trị Viên Gmail</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded-md text-[11px]">
                  {adminUsers.length} tài khoản
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Collection: admin_users
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Cấu Hình Website</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[11px]">
                  Đang hoạt động
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Collection: site_config
              </span>
            </div>
          </div>
        </div>

        {/* Thao tác đồng bộ */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-upload-all-firestore"
              onClick={handleManualUploadToFirestore}
              disabled={isFirebaseSyncing}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
            >
              <CloudUpload size={16} />
              <span>Đẩy Tất Cả Dữ Liệu Lên Firebase Database</span>
            </button>

            <button
              type="button"
              id="btn-fetch-all-firestore"
              onClick={handleManualFetchFromFirestore}
              disabled={isFirebaseSyncing}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <CloudDownload size={16} />
              <span>Tải Lại Dữ Liệu Từ Firebase Database</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            * Mọi thao tác Thêm / Sửa / Xóa trong Admin sẽ tự động ghi trực tiếp lên Firebase Firestore.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL THÊM / SỬA TÀI KHOẢN GMAIL                                         */}
      {/* ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {editingUser ? 'Chỉnh Sửa Tài Khoản Gmail' : 'Thêm Tài Khoản Gmail Phân Quyền'}
                  </h3>
                  <span className="text-[11px] text-slate-400 block">
                    Chỉ định địa chỉ Gmail và phân cấp vai trò
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa Chỉ Gmail <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="modal-input-user-email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="vidu@gmail.com"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
                />
                {emailError && (
                  <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
                    {emailError}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Định dạng bắt buộc phải kết thúc bằng <strong>@gmail.com</strong>
                </span>
              </div>

              {/* Họ tên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ Tên / Tên Người Đại Diện
                </label>
                <input
                  type="text"
                  id="modal-input-user-name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A (Ban Điều Phối)"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Vai trò */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vai Trò Phân Quyền <span className="text-rose-500">*</span>
                </label>
                <select
                  id="modal-select-user-role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as AdminUserRole)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="admin">Quản trị viên (Administrator) - Toàn quyền quản lý</option>
                  <option value="developer">Lập trình viên (Developer) - Kỹ thuật, mã nguồn, bảo trì</option>
                  <option value="editor">Biên tập viên (Editor) - Soạn thảo & biên tập nội dung</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {userRole === 'admin' && '• Có toàn quyền xem, sửa, xóa tất cả các mục trên hệ thống CMS.'}
                  {userRole === 'developer' && '• Chuyên trách cấu hình kỹ thuật, giao diện và chức năng bảo trì.'}
                  {userRole === 'editor' && '• Chuyên trách duyệt và xuất bản tin tức, bài đăng, chương trình.'}
                </span>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trạng Thái Hoạt Động
                </label>
                <select
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="active">Đang hoạt động (Được phép đăng nhập)</option>
                  <option value="inactive">Tạm khóa (Tạm ngưng quyền truy cập)</option>
                </select>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi Chú Phân Công Nhiệm Vụ
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Ví dụ: Phụ trách mảng tin tức dự án năm 2026"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-confirm-save-user"
                onClick={handleSaveUser}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                {editingUser ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL XÁC NHẬN XÓA TÀI KHOẢN                                             */}
      {/* ========================================================================= */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 size={20} />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Xác nhận xóa tài khoản?
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa quyền truy cập của tài khoản Gmail <strong>{deleteConfirmUser.email}</strong> ({deleteConfirmUser.name})?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-confirm-delete-user"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
