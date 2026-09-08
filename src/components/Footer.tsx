import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  ArrowRight, 
  HeartHandshake, 
  ShieldCheck, 
  Globe,
  Settings
} from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteConfig, customPages } = useDataContext();

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if a page is configured to show in footer
  const getPageInfo = (slug: string) => {
    return customPages.find(item => 
      item.slug === slug || 
      (slug === 'about' && item.id === 'page-about') || 
      (slug === 'contact' && item.id === 'page-contact')
    );
  };

  const isPageInFooter = (slug: string) => {
    const p = getPageInfo(slug);
    if (!p) return true;
    return p.showInFooter !== false;
  };

  // Additional custom pages marked for footer (chỉ hiển thị khi đã xuất bản)
  const additionalFooterPages = customPages.filter(p => 
    p.isPublished !== false &&
    p.showInFooter === true && 
    !['about', 'contact', 'programs', 'units', 'news', 'certificate', 'sponsor', 'join', 'cau-hoi-thuong-gap', 'dieu-khoan-su-dung', 'chinh-sach-bao-mat'].includes(p.slug)
  );

  return (
    <footer className="bg-gradient-to-b from-[#0A2558] via-[#081F4B] to-[#051433] text-white border-t border-sky-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00A3FF] to-[#2563EB] flex items-center justify-center font-black text-xl text-white shadow-md shadow-sky-500/25 overflow-hidden">
                {siteConfig.logoUrl ? (
                  <img src={siteConfig.logoUrl} alt={siteConfig.siteName} className="w-full h-full object-cover" />
                ) : (
                  <span>S</span>
                )}
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block text-white">{siteConfig.siteName || 'Sky First Network'}</span>
                <span className="text-[11px] text-sky-300 font-medium block -mt-1">
                  {siteConfig.footerSlogan || siteConfig.siteDescription || siteConfig.tagline || 'Mạng lưới Giáo dục & Phát triển Cộng đồng'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              {siteConfig.footerAboutText || 'Hệ sinh thái phi lợi nhuận kết nối tri thức, đào tạo kỹ năng thực hành và kiến tạo các giải pháp phụng sự cộng đồng bền vững cho thế hệ trẻ Việt Nam.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 text-xs">
              <button
                onClick={() => handleNav('certificate')}
                className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 font-bold transition flex items-center gap-2 border border-sky-400/30 shadow-2xs"
              >
                <Award size={15} className="text-[#38BDF8]" />
                <span>{siteConfig.footerCertBadgeText || 'Tra cứu Giấy chứng nhận'}</span>
              </button>

              <button
                onClick={() => handleNav('units')}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition border border-emerald-500/30"
              >
                <span>{siteConfig.footerUnitsBadgeText || 'Đơn vị trực thuộc'}</span>
              </button>
            </div>
          </div>

          {/* Nav Links Col */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-sky-400 uppercase tracking-wider">
              Chuyên Mục
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white hover:underline transition">
                  • Trang chủ
                </button>
              </li>

              {isPageInFooter('about') && (
                <li>
                  <button onClick={() => handleNav('about')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('about')?.title || 'Giới thiệu Sky First Network'}
                  </button>
                </li>
              )}

              {isPageInFooter('programs') && (
                <li>
                  <button onClick={() => handleNav('programs')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('programs')?.title || 'Chương trình hoạt động'}
                  </button>
                </li>
              )}

              {isPageInFooter('units') && (
                <li>
                  <button onClick={() => handleNav('units')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('units')?.title || 'Các đơn vị trực thuộc'}
                  </button>
                </li>
              )}

              {isPageInFooter('news') && (
                <li>
                  <button onClick={() => handleNav('news')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('news')?.title || 'Tin tức & Hoạt động'}
                  </button>
                </li>
              )}

              {isPageInFooter('certificate') && (
                <li>
                  <button onClick={() => handleNav('certificate')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('certificate')?.title || 'Tra cứu Giấy chứng nhận điện tử'}
                  </button>
                </li>
              )}

              {isPageInFooter('sponsor') && (
                <li>
                  <button onClick={() => handleNav('sponsor')} className="hover:text-white hover:underline transition text-amber-300 font-bold">
                    • {getPageInfo('sponsor')?.title || 'Tài trợ & Đồng hành'}
                  </button>
                </li>
              )}

              {isPageInFooter('contact') && (
                <li>
                  <button onClick={() => handleNav('contact')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('contact')?.title || 'Liên hệ & Văn phòng'}
                  </button>
                </li>
              )}

              {isPageInFooter('join') && (
                <li>
                  <button onClick={() => handleNav('join')} className="hover:text-white hover:underline transition">
                    • {getPageInfo('join')?.title || 'Gia nhập & Hợp tác'}
                  </button>
                </li>
              )}

              {/* Any additional custom pages with showInFooter = true */}
              {additionalFooterPages.map(page => (
                <li key={page.id}>
                  <button 
                    onClick={() => {
                      window.history.pushState({}, '', `/trang/${page.slug}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-white hover:underline transition"
                  >
                    • {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black text-sky-400 uppercase tracking-wider">
              Liên Hệ & Trụ Sở
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Mail size={15} className="text-[#38BDF8] mt-0.5 flex-shrink-0" />
                <span><strong>Email:</strong> {siteConfig.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Hotline:</strong> {siteConfig.hotline}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <span><strong>Văn phòng:</strong> {siteConfig.address}</span>
              </div>
            </div>

            {/* Social media links */}
            {(siteConfig.footerSocialFacebook || siteConfig.footerSocialLinkedin || siteConfig.footerSocialYoutube || siteConfig.footerSocialZalo) && (
              <div className="flex items-center gap-2 pt-1">
                {siteConfig.footerSocialFacebook && (
                  <a
                    href={siteConfig.footerSocialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 text-[11px] font-bold border border-sky-400/30 transition flex items-center gap-1"
                    title="Facebook SFN"
                  >
                    <span>Facebook</span>
                  </a>
                )}
                {siteConfig.footerSocialLinkedin && (
                  <a
                    href={siteConfig.footerSocialLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/35 text-sky-200 text-[11px] font-bold border border-sky-500/30 transition flex items-center gap-1"
                    title="Instagram Sky First Network"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}
                {siteConfig.footerSocialYoutube && (
                  <a
                    href={siteConfig.footerSocialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 text-[11px] font-bold border border-rose-400/30 transition flex items-center gap-1"
                    title="TikTok Sky First Network"
                  >
                    <span>YouTube</span>
                  </a>
                )}
                {siteConfig.footerSocialZalo && (
                  <a
                    href={siteConfig.footerSocialZalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 text-[11px] font-bold border border-emerald-400/30 transition flex items-center gap-1"
                    title="Zalo SFN"
                  >
                    <span>Zalo</span>
                  </a>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => handleNav('join')}
                className="w-full py-3 bg-gradient-to-r from-[#00A3FF] to-emerald-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
              >
                <span>Đăng ký Gia nhập / Hợp tác</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-sky-900/50 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-400">
          <p>{siteConfig.footerCopyright || `© 2026 ${siteConfig.siteName || 'Sky First Network'} & Trung tâm SFEC. Bản quyền thuộc về tổ chức.`}</p>
          <div className="flex items-center justify-center gap-4 mt-3 sm:mt-0">
            {isPageInFooter('chinh-sach-bao-mat') && (
              <>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/trang/chinh-sach-bao-mat');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer"
                >
                  Chính sách bảo mật
                </button>
                <span>•</span>
              </>
            )}
            {isPageInFooter('dieu-khoan-su-dung') && (
              <>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/trang/dieu-khoan-su-dung');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer"
                >
                  Quy chế hoạt động
                </button>
                <span>•</span>
              </>
            )}
            <button
              onClick={() => handleNav('admin')}
              className="hover:text-sky-300 flex items-center gap-1 font-semibold text-slate-400 hover:text-sky-200 transition cursor-pointer"
            >
              <Settings size={12} />
              <span>Quản trị</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
