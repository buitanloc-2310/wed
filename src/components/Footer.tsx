import React from 'react';
import { Mail, Phone, Facebook, Instagram, ExternalLink, Users, Globe2, GraduationCap, HeartHandshake, MessageCircle } from 'lucide-react';
import { PageRoute } from '../types';

interface FooterProps { onNavigate: (page: PageRoute, slug?: string) => void; }

const quickLinks = [
  ['Giới thiệu Sky First Network','/page/sky-first-network-la-gi'],
  ['Tầm nhìn & Sứ mệnh','/page/tam-nhin-su-menh'],
  ['Giá trị cốt lõi','/page/gia-tri-cot-loi'],
  ['Cơ cấu tổ chức','/page/co-cau-to-chuc'],
  ['Lĩnh vực hoạt động','/page/linh-vuc-hoat-dong'],
  ['Hợp tác & Đồng hành','/contact'],
  ['Đơn vị trực thuộc','/units'],
  ['Tin tức & Hoạt động','/news'],
  ['Tra cứu Giấy chứng nhận','/certificate'],
  ['Tham gia Sky First Network','/join'],
];

const contacts = [
  ['Email liên hệ chính','skyfirst.ec@gmail.com','mailto:skyfirst.ec@gmail.com', Mail],
  ['Email Nhân sự','nhansu.sfn@gmail.com','mailto:nhansu.sfn@gmail.com', Mail],
  ['Email Hỗ trợ','hotro.sfn@gmail.com','mailto:hotro.sfn@gmail.com', Mail],
  ['Email Hợp tác','hoptac.sfn@gmail.com','mailto:hoptac.sfn@gmail.com', Mail],
  ['Email Truyền thông','truyenthong.sfn@gmail.com','mailto:truyenthong.sfn@gmail.com', Mail],
  ['Điện thoại liên hệ','0924 910 210','tel:0924910210', Phone],
  ['Facebook','skyfirstnetwork','https://facebook.com/skyfirstnetwork', Facebook],
  ['Instagram','sfn.network','https://instagram.com/sfn.network', Instagram],
  ['TikTok','@sfn.network','https://tiktok.com/@sfn.network', MessageCircle],
  ['Zalo','0924 910 210','https://zalo.me/0924910210', MessageCircle],
];

const portals = [
  ['Cổng Thành viên','member.skyfirst.io.vn','https://member.skyfirst.io.vn/', Users],
  ['Cổng Tình nguyện viên','tnv.skyfirst.io.vn','https://tnv.skyfirst.io.vn/', HeartHandshake],
  ['Cổng Thông tin','ctt.skyfirst.io.vn','https://ctt.skyfirst.io.vn/', Globe2],
  ['Cổng Học thuật','academic.skyfirst.io.vn','https://academic.skyfirst.io.vn/', GraduationCap],
];

export const Footer: React.FC<FooterProps> = () => (
  <footer className="bg-[#06152F] text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid xl:grid-cols-[.8fr_1.05fr_1.35fr] gap-10 xl:gap-14">
        <div>
          <img src="/brand/sky-first-network.png" alt="Sky First Network" className="h-20 w-auto object-contain object-left" />
        </div>

        <div>
          <h4 className="text-white text-lg font-extrabold mb-5">Liên kết nhanh</h4>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {quickLinks.map(([label,url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">{label}</a>)}
          </div>
        </div>

        <div>
          <h4 className="text-white text-lg font-extrabold mb-5">Liên hệ & Kết nối</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {contacts.map(([label,value,url,Icon]: any) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2.5 hover:bg-white/[.075] hover:border-sky-400/30 transition">
                <span className="w-9 h-9 shrink-0 rounded-lg border border-sky-300/20 bg-sky-400/10 text-sky-300 grid place-items-center"><Icon size={17}/></span>
                <span className="min-w-0"><span className="block text-sm font-bold text-white group-hover:text-sky-200">{label}</span><span className="block text-xs text-slate-400 truncate">{value}</span></span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/10">
        <h4 className="text-white text-lg font-extrabold mb-5">Các cổng Sky First</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {portals.map(([label,domain,url,Icon]: any) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-white/[.04] p-4 hover:bg-white/[.08] hover:border-sky-400/40 transition"><div className="flex items-center justify-between"><span className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-300 grid place-items-center"><Icon size={19}/></span><ExternalLink size={15} className="text-slate-500 group-hover:text-sky-300"/></div><div className="mt-3 text-sm font-bold text-white">{label}</div><div className="mt-1 text-xs text-slate-400">{domain}</div></a>)}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between text-xs text-slate-400">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="/phap-ly-minh-bach" target="_blank" rel="noopener noreferrer" className="hover:text-white">Pháp lý & Minh bạch</a>
          <a href="/page/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer" className="hover:text-white">Chính sách bảo mật</a>
          <a href="/page/dieu-khoan-su-dung" target="_blank" rel="noopener noreferrer" className="hover:text-white">Điều khoản sử dụng</a>
          <a href="/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white">Liên hệ</a>
          <a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-white">Đăng nhập quản trị</a>
        </div>
        <p>© 2026. Bản quyền nội dung thuộc Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.</p>
      </div>
    </div>
  </footer>
);
