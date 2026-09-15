import React, { useEffect, useState } from 'react';
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
  EyeOff,
  KeyRound,
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
import { listAdminAccounts, createAdminAccount, updateAdminAccount, deleteAdminAccount, resetAdminPassword } from '../../lib/firebase';

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
    adminUsers: contextAdminUsers,
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
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(contextAdminUsers);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const refreshAdminUsers = async () => { setAdminUsersLoading(true); try { const rows = await listAdminAccounts(); setAdminUsers(rows as AdminUser[]); } catch (e:any) { onShowToast(e?.message || 'Không tải được danh sách quản trị.'); } finally { setAdminUsersLoading(false); } };
  useEffect(() => { refreshAdminUsers(); }, []);

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
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showUserPasswordConfirm, setShowUserPasswordConfirm] = useState(false);
  const [userSaving, setUserSaving] = useState(false);

  const generateAdminPassword = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%_-';
    const bytes = new Uint32Array(18);
    crypto.getRandomValues(bytes);
    const generated = Array.from(bytes, (n) => alphabet[n % alphabet.length]).join('');
    setUserPassword(generated); setUserPasswordConfirm(generated); setShowUserPassword(true); setShowUserPasswordConfirm(true); setEmailError('');
  };
  const passwordChecks = {
    length: userPassword.length >= 10,
    upper: /[A-Z]/.test(userPassword), lower: /[a-z]/.test(userPassword), digit: /[0-9]/.test(userPassword),
  };
  const passwordStrong = passwordChecks.length && passwordChecks.upper && passwordChecks.lower && passwordChecks.digit;

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
  const handleSaveBrand = async () => {
    const ok = await updateSiteConfig({
      logoUrl: logoUrl.trim(),
      siteName: siteName.trim(),
      siteDescription: siteDescription.trim(),
      tagline: tagline.trim() || siteDescription.trim(),
    });
    onShowToast(ok ? 'Đã lưu nhận diện thương hiệu và đồng bộ lên website.' : 'Đã cập nhật trên trình duyệt nhưng chưa ghi được lên máy chủ. Hãy kiểm tra quyền hoặc kết nối.');
  };

  // Handler: Tải ảnh logo từ máy
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        onShowToast('Ảnh logo tải trực tiếp nên nhỏ hơn 500 KB để tránh vượt giới hạn tài liệu máy chủ. Có thể dùng URL ảnh thay thế.');
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
    setUserPassword('');
    setUserPasswordConfirm(''); setShowUserPassword(false); setShowUserPasswordConfirm(false);
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
    setUserPassword('');
    setUserPasswordConfirm(''); setShowUserPassword(false); setShowUserPasswordConfirm(false);
    setUserModalOpen(true);
  };

  // Handler: Lưu tài khoản thật trên Firebase Auth + D1
  const handleSaveUser = async () => {
    if (userSaving) return;
    const trimmedEmail = userEmail.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setEmailError('Địa chỉ email không hợp lệ'); return; }
    if (!editingUser && !passwordStrong) { setEmailError('Mật khẩu cần ít nhất 10 ký tự, có chữ hoa, chữ thường và số.'); return; }
    if (editingUser && userPassword && !passwordStrong) { setEmailError('Mật khẩu mới cần ít nhất 10 ký tự, có chữ hoa, chữ thường và số.'); return; }
    if (userPassword && userPassword !== userPasswordConfirm) { setEmailError('Xác nhận mật khẩu chưa trùng khớp.'); return; }
    setUserSaving(true); setEmailError('');
    try {
      if (editingUser) {
        await updateAdminAccount(editingUser.id,{name:userName.trim()||trimmedEmail.split('@')[0],role:userRole,status:userStatus,note:userNote.trim()});
        if (userPassword) await resetAdminPassword(editingUser.id,userPassword);
        onShowToast(userPassword ? `Đã cập nhật tài khoản và đặt lại mật khẩu ${trimmedEmail}.` : `Đã cập nhật tài khoản ${trimmedEmail}.`);
      } else {
        await createAdminAccount({email:trimmedEmail,password:userPassword,name:userName.trim()||trimmedEmail.split('@')[0],role:userRole,status:userStatus,note:userNote.trim()});
        onShowToast(`Đã tạo tài khoản quản trị ${trimmedEmail}.`);
      }
      await refreshAdminUsers(); setUserModalOpen(false); setUserPassword(''); setUserPasswordConfirm('');
    } catch(e:any) { setEmailError(e?.message || 'Không thể lưu tài khoản quản trị.'); } finally { setUserSaving(false); }
  };

  // Handler: Xóa tài khoản
  const handleConfirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    try { await deleteAdminAccount(deleteConfirmUser.id); onShowToast(`Đã xóa tài khoản ${deleteConfirmUser.email}`); await refreshAdminUsers(); setDeleteConfirmUser(null); }
    catch(e:any){ onShowToast(e?.message || 'Không thể xóa tài khoản quản trị.'); }
  };

  // Handler: Lưu cấu hình Trạng thái Website
  const handleSaveSiteStatus = async () => {
    const ok = await updateSiteConfig({
      siteStatus,
      closedReason,
      closedReasonText: closedReasonText.trim(),
      closedMessage: closedMessage.trim(),
      closedEstimatedReopen: closedEstimatedReopen.trim(),
      closedNoticeType,
    });
    if (!ok) { onShowToast('Thay đổi chưa ghi được lên máy chủ. Website công khai có thể chưa nhận cài đặt mới.'); return; }
    if (siteStatus === 'closed') {
      onShowToast('Đã đóng website công khai và đồng bộ cài đặt.');
    } else {
      onShowToast('Đã mở website công khai và đồng bộ cài đặt.');
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
              Cấu hình logo, tên website và mô tả thương hiệu. Logo được dùng trên thanh điều hướng; tên và mô tả cũng được dùng cho tiêu đề trình duyệt, metadata và các khu vực hệ thống liên quan.
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
                        <span>Xóa URL logo</span>
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
                  Được dùng làm tên website trong tiêu đề trình duyệt, mô tả hệ thống và các khu vực có hiển thị tên thương hiệu.
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
                  Được dùng làm mô tả website/metadata và tại các khu vực có sử dụng mô tả thương hiệu.
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
                  Xem trước nhận diện
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
                        Chưa có logo
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
                  Xem trước trên nền tối
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
                      <span className="text-[10px] font-bold">Chưa có logo</span>
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
      {/* 2. KHỐI THIẾT LẬP CÁC TÀI KHOẢN (LẬP TRÌNH VIÊN, QUẢN TRỊ VIÊN, BIÊN TẬP VIÊN)              */}
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
                Quản lý tài khoản theo phân cấp <strong>Chủ sở hữu hệ thống → Lập trình viên → Quản trị viên → Biên tập viên</strong>. Chủ sở hữu hệ thống được bảo vệ ở máy chủ.
              </p>
            </div>

            <button
              type="button"
              id="btn-add-admin-user"
              onClick={handleOpenAddUser}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-sky-600/25 transition shrink-0"
            >
              <Plus size={16} />
              <span>Thêm tài khoản quản trị</span>
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
                Quản lý nội dung và cấu hình nghiệp vụ theo phạm vi được cấp; không thể tác động Chủ sở hữu hệ thống.
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
                placeholder="Tìm theo email hoặc Họ tên..."
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
                  <th className="py-3 px-4">Email quản trị</th>
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
                      Không tìm thấy tài khoản quản trị nào phù hợp.
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
                      <td className="py-3.5 px-4">{user.is_root_owner ? (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-800 border border-violet-200"><ShieldCheck size={13}/><span>Chủ sở hữu hệ thống</span></span>) : getRoleBadge(user.role)}</td>
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
                          {!user.is_root_owner && (<button
                            type="button"
                            onClick={() => setDeleteConfirmUser(user)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={14} />
                          </button>)}
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
              <span>Đồng bộ dữ liệu website</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý kết nối, tự động lưu trữ và đồng bộ hóa hai chiều giữa trang quản trị và máy chủ dữ liệu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              firebaseSyncStatus === 'synced' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Máy chủ đã kết nối & đồng bộ</span>
                </span>
              ) : firebaseSyncStatus === 'syncing' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  <RefreshCw size={14} className="animate-spin text-sky-600" />
                  <span>Đang Đồng Bộ Dữ Liệu...</span>
                </span>
              ) : firebaseSyncStatus === 'error' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle size={14} className="text-rose-600" />
                  <span>Lỗi kết nối máy chủ</span>
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
                <span>Chưa kết nối máy chủ</span>
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
                Cấu hình kết nối máy chủ cần được thực hiện trong môi trường triển khai bởi người phụ trách kỹ thuật.
              </div>
            )}
          </div>
        </div>

        {/* Danh sách bảng dữ liệu máy chủ */}
        <div>
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Các Bộ Sưu Tập Dữ Liệu (nhóm dữ liệu)
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
                <span>Chương trình Sky First Network</span>
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
                <span>Tài khoản quản trị</span>
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
              <span>Đẩy toàn bộ dữ liệu lên máy chủ</span>
            </button>

            <button
              type="button"
              id="btn-fetch-all-firestore"
              onClick={handleManualFetchFromFirestore}
              disabled={isFirebaseSyncing}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <CloudDownload size={16} />
              <span>Tải lại dữ liệu từ máy chủ</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            * Mọi thao tác Thêm / Sửa / Xóa trong Admin sẽ tự động ghi trực tiếp lên máy chủ dữ liệu.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL THÊM / SỬA TÀI KHOẢN QUẢN TRỊ                                         */}
      {/* ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto overscroll-contain">
          <div className="bg-white rounded-2xl max-w-lg w-full my-2 sm:my-4 max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain p-5 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {editingUser ? 'Chỉnh sửa tài khoản quản trị' : 'Thêm tài khoản phân quyền'}
                  </h3>
                  <span className="text-[11px] text-slate-400 block">
                    Chỉ định địa chỉ email và phân cấp vai trò
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa Chỉ email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="modal-input-user-email"
                  value={userEmail}
                  onChange={(e) => {
                    if (!editingUser) setUserEmail(e.target.value);
                    setEmailError('');
                  }}
                  readOnly={!!editingUser}
                  placeholder="ten@example.com"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
                />
                {emailError && (
                  <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
                    {emailError}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Có thể sử dụng địa chỉ email hợp lệ từ bất kỳ nhà cung cấp nào.
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
                  placeholder="Ví dụ: Nguyễn Văn A (Ban Chấp hành)"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Mật khẩu */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-700">{editingUser ? 'Đặt Lại Mật Khẩu' : 'Mật Khẩu Ban Đầu'} {!editingUser && <span className="text-rose-500">*</span>}</label>
                  <button type="button" onClick={generateAdminPassword} className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900"><KeyRound size={13}/>Tạo mật khẩu mạnh</button>
                </div>
                <div className="relative">
                  <input type={showUserPassword ? 'text' : 'password'} value={userPassword} onChange={(e)=>{setUserPassword(e.target.value);setEmailError('')}} autoComplete="new-password" placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : 'Ít nhất 10 ký tự'} className="w-full text-xs sm:text-sm px-3.5 py-2.5 pr-11 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"/>
                  <button type="button" onClick={()=>setShowUserPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label={showUserPassword?'Ẩn mật khẩu':'Hiện mật khẩu'}>{showUserPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                </div>
                <div className="relative">
                  <input type={showUserPasswordConfirm ? 'text' : 'password'} value={userPasswordConfirm} onChange={(e)=>{setUserPasswordConfirm(e.target.value);setEmailError('')}} autoComplete="new-password" placeholder="Nhập lại mật khẩu để xác nhận" className="w-full text-xs sm:text-sm px-3.5 py-2.5 pr-11 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"/>
                  <button type="button" onClick={()=>setShowUserPasswordConfirm(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label={showUserPasswordConfirm?'Ẩn xác nhận mật khẩu':'Hiện xác nhận mật khẩu'}>{showUserPasswordConfirm?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                </div>
                {userPassword && <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className={passwordChecks.length?'text-emerald-700':'text-slate-400'}>• Tối thiểu 10 ký tự</span><span className={passwordChecks.upper?'text-emerald-700':'text-slate-400'}>• Có chữ hoa</span>
                  <span className={passwordChecks.lower?'text-emerald-700':'text-slate-400'}>• Có chữ thường</span><span className={passwordChecks.digit?'text-emerald-700':'text-slate-400'}>• Có chữ số</span>
                </div>}
                <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-[11px] text-slate-600"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600"/><span>Quản trị hệ thống có thể đặt mật khẩu mới mà không cần mật khẩu cũ. Mật khẩu chỉ được gửi tới Firebase Authentication qua kết nối bảo mật, không lưu trong D1 và không ghi vào nhật ký.</span></div>
              </div>

              {/* Vai trò */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vai Trò Phân Quyền <span className="text-rose-500">*</span>
                </label>
                <select
                  id="modal-select-user-role"
                  value={userRole}
                  disabled={Boolean(editingUser?.is_root_owner)}
                  onChange={(e) => setUserRole(e.target.value as AdminUserRole)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="admin">Quản trị viên (Administrator) - Toàn quyền quản lý</option>
                  <option value="developer">Lập trình viên (Developer) - Kỹ thuật, mã nguồn, bảo trì</option>
                  <option value="editor">Biên tập viên (Editor) - Soạn thảo & biên tập nội dung</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {userRole === 'admin' && '• Có toàn quyền xem, sửa, xóa tất cả các mục trên hệ thống CMS.'}
                  {editingUser?.is_root_owner ? '• Tài khoản Chủ sở hữu hệ thống được bảo vệ ở máy chủ: không thể hạ quyền hoặc khóa.' : userRole === 'developer' && '• Quyền kỹ thuật cấp cao; chỉ Chủ sở hữu hệ thống được cấp mới vai trò này.'}
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
                  disabled={Boolean(editingUser?.is_root_owner)}
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
                disabled={userSaving}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                {userSaving ? 'Đang xử lý...' : editingUser ? 'Cập Nhật Tài Khoản' : 'Tạo Tài Khoản Quản Trị'}
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
              Bạn có chắc chắn muốn xóa quyền truy cập của tài khoản quản trị <strong>{deleteConfirmUser.email}</strong> ({deleteConfirmUser.name})?
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
