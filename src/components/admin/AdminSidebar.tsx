import React, { useState } from 'react';
import {
  FileText,
  BarChart2,
  Building,
  Layers,
  Award,
  Copy,
  Layout,
  Palette,
  Settings,
  ExternalLink,
  ChevronDown,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Check,
  PenTool,
  MessageSquare,
  UserCheck,
  Mail,
} from 'lucide-react';

export type AdminTab =
  | 'layout'        // Bố cục
  | 'programs'      // Chương trình
  | 'units'         // Đơn vị
  | 'posts'         // Bài đăng
  | 'pages'         // Trang
  | 'comments'      // Bình luận
  | 'registrations' // Đăng ký
  | 'contacts'      // Liên hệ
  | 'settings';     // Cài đặt

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  counts?: {
    news?: number;
    units?: number;
    programs?: number;
    certs?: number;
    pages?: number;
  };
  onNavigateWebsite: () => void;
  onCreateNew?: () => void;
  createButtonLabel?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  counts = {},
  onNavigateWebsite,
  onCreateNew,
  createButtonLabel = 'TẠO MỚI',
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'layout',
      label: 'Bố cục',
      icon: <Layout size={18} />,
    },
    {
      id: 'programs',
      label: 'Chương trình',
      icon: <Layers size={18} />,
      count: counts.programs,
    },
    {
      id: 'units',
      label: 'Đơn vị',
      icon: <Building size={18} />,
      count: counts.units,
    },
    {
      id: 'posts',
      label: 'Bài đăng',
      icon: <PenTool size={18} />,
      count: counts.news,
    },
    {
      id: 'pages',
      label: 'Trang',
      icon: <FileText size={18} />,
      count: counts.pages,
    },
    {
      id: 'comments',
      label: 'Bình luận',
      icon: <MessageSquare size={18} />,
    },
    {
      id: 'registrations',
      label: 'Đăng ký',
      icon: <UserCheck size={18} />,
    },
    {
      id: 'contacts',
      label: 'Liên hệ',
      icon: <Mail size={18} />,
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col shrink-0 transition-all duration-200 z-30 sticky top-0 h-screen select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Nhận diện trang quản trị website */}
      <div className="pt-4 px-4 pb-2">
        <div className={`flex items-center ${collapsed?'justify-center':'gap-3'} px-2 py-1.5`}>
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
            <img src="/favicon.png" alt="Sky First Network" className="w-full h-full object-contain" />
          </div>
          {!collapsed && <div className="truncate"><span className="text-[14px] font-bold text-slate-900 block">Quản trị website</span><span className="text-[11px] text-slate-500">Sky First Network</span></div>}
        </div>
      </div>

      {/* 2. Prominent "+ BÀI ĐĂNG MỚI" / "+ TẠO MỚI" Button (Blogger style) */}
      <div className="px-4 py-3">
        {!collapsed ? (
          <button
            type="button"
            onClick={onCreateNew}
            className="w-full bg-white hover:bg-slate-50 text-[#E37400] hover:text-[#D36300] border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-150 rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <Plus size={18} className="text-[#E37400] stroke-[2.5]" />
            <span>{createButtonLabel}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCreateNew}
            className="w-10 h-10 mx-auto rounded-full bg-white hover:bg-orange-50 border border-slate-200 text-[#E37400] flex items-center justify-center shadow-2xs transition"
            title={createButtonLabel}
          >
            <Plus size={20} className="stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* 3. Navigation List (Blogger items) */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'text-[#E37400] font-bold bg-orange-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              } ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
              title={item.label}
            >
              <span className={`shrink-0 ${isActive ? 'text-[#E37400]' : 'text-slate-500'}`}>
                {item.icon}
              </span>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.2 rounded-full ${
                        isActive ? 'bg-orange-100 text-[#E37400]' : 'text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="pt-2 pb-1">
          <div className="border-t border-slate-200/80" />
        </div>

        {/* Xem blog link */}
        <button
          type="button"
          onClick={onNavigateWebsite}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors ${
            collapsed ? 'justify-center px-0' : 'justify-start'
          }`}
          title="Xem blog / trang web công khai"
        >
          <ExternalLink size={18} className="text-slate-500 shrink-0" />
          {!collapsed && <span>Xem blog</span>}
        </button>
      </nav>

      {/* 4. Footer Legal Links (Blogger Style) */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 leading-normal">
          <div className="flex items-center gap-1.5 flex-wrap">
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-600 transition">
              Điều khoản dịch vụ
            </a>
            <span>•</span>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-600 transition">
              Bảo mật
            </a>
          </div>
          <div className="mt-0.5">
            <a href="#policy" onClick={(e) => e.preventDefault()} className="hover:text-slate-600 transition">
              Chính sách nội dung
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};
