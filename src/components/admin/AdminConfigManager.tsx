import React, { useState } from 'react';
import {
  Layout,
  Save,
  RotateCcw,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  Share2,
  CheckCircle2,
  PanelBottom
} from 'lucide-react';
import { SiteConfig, PageRoute } from '../../types';
import { ImageUrlInput } from '../ImageUrlInput';

interface AdminConfigManagerProps {
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (updates: Partial<SiteConfig>) => void;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const AdminConfigManager: React.FC<AdminConfigManagerProps> = ({
  siteConfig,
  onUpdateSiteConfig,
  onNavigate,
  onShowToast,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'branding' | 'hero' | 'stats' | 'contact' | 'footer'>('branding');

  const handleSave = () => {
    onShowToast('Đã lưu cấu hình chung của website thành công!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layout size={20} className="text-[#0284C7]" />
            Cấu Hình Chung & Nhận Diện Thương Hiệu SFN
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tên tổ chức, khẩu hiệu, banner đầu trang, chỉ số thống kê và thông tin liên hệ.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              window.history.pushState({}, '', '/home');
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            title="Xem hiển thị trên trang chủ"
          >
            <ExternalLink size={14} />
            <span>Xem Trang Chủ</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Lưu Cấu Hình</span>
          </button>
        </div>
      </div>

      {/* Sub-section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubSection('branding')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubSection === 'branding'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={14} />
          <span>1. Thương Hiệu & Khẩu Hiệu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('hero')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubSection === 'hero'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layout size={14} />
          <span>2. Banner Đầu Trang (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('stats')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubSection === 'stats'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 size={14} />
          <span>3. Chỉ Số Mạng Lưới (Stats)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('contact')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubSection === 'contact'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Phone size={14} />
          <span>4. Thông Tin Liên Hệ & Hotline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('footer')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubSection === 'footer'
              ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PanelBottom size={14} />
          <span>5. Chân Trang (Footer)</span>
        </button>
      </div>

      {/* 1. BRANDING SECTION */}
      {activeSubSection === 'branding' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-[#0284C7]" />
              Nhận Diện Thương Hiệu & Khẩu Hiệu Mạng Lưới
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tên chính thức và thông điệp cốt lõi xuất hiện trên toàn bộ tiêu đề trang web.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tên Tổ Chức / Mạng Lưới <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={siteConfig.siteName}
                onChange={(e) => onUpdateSiteConfig({ siteName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Huy Hiệu Nhãn Đầu Trang (Hero Badge)
              </label>
              <input
                type="text"
                value={siteConfig.heroBadge || ''}
                onChange={(e) => onUpdateSiteConfig({ heroBadge: e.target.value })}
                placeholder="Mạng Lưới Giáo Dục & Phát Triển..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Khẩu Hiệu Chính (Tagline) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={siteConfig.tagline}
              onChange={(e) => onUpdateSiteConfig({ tagline: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Khẩu hiệu xuất hiện trên thanh tiêu đề và chân trang (Footer).
            </p>
          </div>

          <ImageUrlInput
            label="Đường Dẫn Logo Tổ Chức (URL)"
            value={siteConfig.logoUrl || ''}
            onChange={(url) => onUpdateSiteConfig({ logoUrl: url })}
            helperText="Nhập URL ảnh logo (định dạng PNG hoặc SVG trong suốt để hiển thị sắc nét nhất)"
            category="general"
            placeholder="https://skyfirst.io.vn/logo.png"
          />
        </div>
      )}

      {/* 2. HERO SECTION */}
      {activeSubSection === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layout size={18} className="text-[#0284C7]" />
              Phần Banner Đầu Trang Chủ (Hero Section)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nội dung chính đập vào mắt người dùng đầu tiên khi truy cập trang web.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tiêu Đề Lớn Banner (Hero Heading) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={siteConfig.heroHeading}
              onChange={(e) => onUpdateSiteConfig({ heroHeading: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Đoạn Giới Thiệu Ngắn Đầu Trang (Hero Subtext)
            </label>
            <textarea
              rows={4}
              value={siteConfig.heroSubtext}
              onChange={(e) => onUpdateSiteConfig({ heroSubtext: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <ImageUrlInput
            label="Ảnh Nền Banner Đầu Trang (Hero Background URL)"
            value={siteConfig.heroImageUrl || ''}
            onChange={(url) => onUpdateSiteConfig({ heroImageUrl: url })}
            helperText="Nhập đường dẫn URL ảnh thật (tỉ lệ 16:9, tối thiểu 1920x1080px) để hiển thị phông nền ấn tượng"
            category="general"
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>
      )}

      {/* 3. STATS SECTION */}
      {activeSubSection === 'stats' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#0284C7]" />
              Chỉ Số Hoạt Động & Quy Mô Mạng Lưới
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị trên dải số liệu thống kê trang chủ để khẳng định uy tín và quy mô.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat 1 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-black text-[#0284C7] block">Chỉ số 1: Thành viên kết nối</span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Con số hiển thị</label>
                <input
                  type="text"
                  value={siteConfig.stats?.membersCount || '0'}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, membersCount: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dòng chú thích</label>
                <input
                  type="text"
                  value={siteConfig.stats?.membersSubtext || ''}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, membersSubtext: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-black text-[#0284C7] block">Chỉ số 2: Tỉnh thành hiện diện</span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Con số hiển thị</label>
                <input
                  type="text"
                  value={siteConfig.stats?.provincesCount || '0'}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, provincesCount: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dòng chú thích</label>
                <input
                  type="text"
                  value={siteConfig.stats?.provincesSubtext || ''}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, provincesSubtext: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-black text-[#0284C7] block">Chỉ số 3: Giờ cống hiến</span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Con số hiển thị</label>
                <input
                  type="text"
                  value={siteConfig.stats?.volunteerHours || '0'}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, volunteerHours: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dòng chú thích</label>
                <input
                  type="text"
                  value={siteConfig.stats?.hoursSubtext || ''}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, hoursSubtext: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                />
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-black text-[#0284C7] block">Chỉ số 4: Dự án cộng đồng</span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Con số hiển thị</label>
                <input
                  type="text"
                  value={siteConfig.stats?.communityProjects || '0'}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, communityProjects: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dòng chú thích</label>
                <input
                  type="text"
                  value={siteConfig.stats?.projectsSubtext || ''}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      stats: { ...siteConfig.stats!, projectsSubtext: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTACT SECTION */}
      {activeSubSection === 'contact' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Phone size={18} className="text-[#0284C7]" />
              Thông Tin Liên Hệ, Hotline & Kênh Truyền Thông
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Địa chỉ trụ sở, số điện thoại tiếp nhận thông tin và liên kết mạng xã hội chính thức.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Tiếp Nhận Chính <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={siteConfig.email}
                onChange={(e) => onUpdateSiteConfig({ email: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Hotline Ban Điều Phối <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={siteConfig.hotline}
                onChange={(e) => onUpdateSiteConfig({ hotline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Địa Chỉ Trụ Sở / Văn Phòng Làm Việc
            </label>
            <input
              type="text"
              value={siteConfig.address}
              onChange={(e) => onUpdateSiteConfig({ address: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Đường Dẫn Fanpage Facebook
              </label>
              <input
                type="text"
                value={siteConfig.contact?.facebookUrl || ''}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    contact: { ...siteConfig.contact!, facebookUrl: e.target.value }
                  })
                }
                placeholder="https://facebook.com/skyfirstnetwork"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Đường dẫn Instagram
              </label>
              <input
                type="text"
                value={siteConfig.contact?.linkedinUrl || ''}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    contact: { ...siteConfig.contact!, linkedinUrl: e.target.value }
                  })
                }
                placeholder="https://linkedin.com/company/skyfirstnetwork"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER SECTION (Bố cục -> Chân trang) */}
      {activeSubSection === 'footer' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <PanelBottom size={18} className="text-[#0284C7]" />
              Điều Chỉnh Bố Cục & Nội Dung Chân Trang (Footer)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tùy biến khẩu hiệu chân trang, thông điệp giới thiệu, nhãn các nút tra cứu nhanh và bản quyền website.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Khẩu Hiệu Phụ Dưới Logo Chân Trang
              </label>
              <input
                type="text"
                value={siteConfig.footerSlogan || ''}
                onChange={(e) => onUpdateSiteConfig({ footerSlogan: e.target.value })}
                placeholder="Ví dụ: Mạng lưới Giáo dục & Phát triển Cộng đồng"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Đoạn Văn Bản Giới Thiệu Chân Trang
              </label>
              <textarea
                rows={3}
                value={siteConfig.footerAboutText || ''}
                onChange={(e) => onUpdateSiteConfig({ footerAboutText: e.target.value })}
                placeholder="Hệ sinh thái phi lợi nhuận kết nối tri thức, đào tạo kỹ năng thực hành và kiến tạo các giải pháp phụng sự cộng đồng bền vững cho thế hệ trẻ Việt Nam."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhãn Nút Tra Cứu Chứng Nhận
                </label>
                <input
                  type="text"
                  value={siteConfig.footerCertBadgeText || ''}
                  onChange={(e) => onUpdateSiteConfig({ footerCertBadgeText: e.target.value })}
                  placeholder="Tra cứu Giấy chứng nhận"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhãn Nút Đơn Vị Mạng Lưới
                </label>
                <input
                  type="text"
                  value={siteConfig.footerUnitsBadgeText || ''}
                  onChange={(e) => onUpdateSiteConfig({ footerUnitsBadgeText: e.target.value })}
                  placeholder="Đơn vị trực thuộc"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dòng Chữ Bản Quyền Chân Trang (Copyright)
              </label>
              <input
                type="text"
                value={siteConfig.footerCopyright || ''}
                onChange={(e) => onUpdateSiteConfig({ footerCopyright: e.target.value })}
                placeholder="© 2026 Sky First Network & Trung tâm SFEC. Bản quyền thuộc về tổ chức."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-mono"
              />
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-200/70 rounded-2xl flex items-start gap-3">
              <PanelBottom size={18} className="text-[#0284C7] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Liên kết mạng xã hội và kênh liên hệ:</span>
                <p>Thông tin Email, Hotline và Văn phòng ở chân trang tự động đồng bộ theo cấu hình ở tab <strong>4. Thông Tin Liên Hệ</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Mọi thay đổi sẽ được lưu vào hệ thống và có hiệu lực ngay lập tức.
        </span>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
        >
          <Save size={15} />
          <span>Lưu Toàn Bộ Cấu Hình</span>
        </button>
      </div>
    </div>
  );
};
