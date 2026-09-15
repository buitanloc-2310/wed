import React, { useState } from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  Layout,
  Sliders,
  Type,
  Sun,
  Moon
} from 'lucide-react';
import { PageRoute } from '../../types';

interface AdminThemeManagerProps {
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const AdminThemeManager: React.FC<AdminThemeManagerProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'sky' | 'blogger' | 'emerald' | 'indigo'>('sky');
  const [primaryFont, setPrimaryFont] = useState<'inter' | 'roboto' | 'merriweather'>('inter');
  const [radiusStyle, setRadiusStyle] = useState<'rounded' | 'pill' | 'minimal'>('rounded');

  const themes = [
    {
      id: 'sky' as const,
      name: 'Sky Blue (mặc định Sky First Network)',
      color: '#0284C7',
      bgClass: 'bg-sky-600',
      description: 'Tông màu xanh hòa bình, trẻ trung biểu trưng cho bầu trời và khát vọng vươn xa của Sky First Network.'
    },
    {
      id: 'blogger' as const,
      name: 'Blogger Orange (Phong cách Google)',
      color: '#E37400',
      bgClass: 'bg-[#E37400]',
      description: 'Sắc cam năng động, ấm áp đặc trưng của nền tảng xuất bản nội dung hệ thống quản trị nội dung.'
    },
    {
      id: 'emerald' as const,
      name: 'Cộng Đồng Xanh (Emerald)',
      color: '#059669',
      bgClass: 'bg-emerald-600',
      description: 'Màu xanh lá cây thiên nhiên, hướng tới phát triển bền vững và các dự án môi trường.'
    },
    {
      id: 'indigo' as const,
      name: 'Học Thuật Sang Trọng (Indigo)',
      color: '#4F46E5',
      bgClass: 'bg-indigo-600',
      description: 'Tông chàm trang nhã, chuyên nghiệp phù hợp cho các báo cáo thường niên và hội thảo khoa học.'
    }
  ];

  const handleApplyTheme = () => {
    onShowToast(`Đã áp dụng chủ đề ${selectedTheme.toUpperCase()} cho giao diện website!`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Palette size={22} className="text-[#E37400]" />
              Quản Trị Chủ Đề & Giao Diện (Chủ đề giao diện)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tùy biến bảng màu nhận diện, kiểu phông chữ hiển thị và phong cách bo góc các khối thẻ trên toàn trang web.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApplyTheme}
            className="px-4 py-2 bg-[#E37400] hover:bg-[#D36300] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <Check size={14} />
            <span>Áp Dụng Chủ Đề</span>
          </button>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white relative ${
                isSelected
                  ? 'border-[#E37400] shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#E37400] text-white flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-xl ${theme.bgClass} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{theme.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">{theme.color}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {theme.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <div className="h-4 flex-1 rounded-sm bg-slate-100 overflow-hidden flex">
                  <div style={{ backgroundColor: theme.color, width: '40%' }} className="h-full" />
                  <div className="h-full w-[25%] bg-slate-200" />
                  <div className="h-full w-[35%] bg-slate-50" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Mẫu màu</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Typography & Corner Radii Customization */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Type size={16} className="text-[#E37400]" />
          <span>Kiểu Chữ & Phong Cách Bo Góc Thẻ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Phông chữ giao diện chính
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'inter', label: 'Inter / Sans-serif Hiện Đại (Khuyên dùng)' },
                { id: 'roboto', label: 'Roboto / Phong cách Google Chuẩn' },
                { id: 'merriweather', label: 'Merriweather / Phong cách Tạp Chí Báo Chí' }
              ].map((font) => (
                <label key={font.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="font"
                    checked={primaryFont === font.id}
                    onChange={() => setPrimaryFont(font.id as any)}
                    className="text-[#E37400] focus:ring-[#E37400]"
                  />
                  <span>{font.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Phong cách bo góc khung bài viết
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'rounded', label: 'Bo tròn thanh lịch (16px) - Phong cách Blogger' },
                { id: 'pill', label: 'Siêu mềm mại (24px) - Trẻ trung hiện đại' },
                { id: 'minimal', label: 'Tối giản góc cạnh (8px) - Kỹ thuật chuyên sâu' }
              ].map((style) => (
                <label key={style.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="radius"
                    checked={radiusStyle === style.id}
                    onChange={() => setRadiusStyle(style.id as any)}
                    className="text-[#E37400] focus:ring-[#E37400]"
                  />
                  <span>{style.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
