import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Program } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';

interface ProgramModalProps {
  program: Program | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({
  program,
  onClose,
  onShowToast,
}) => {
  if (!program) return null;

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
    onShowToast(`Đăng ký thành công chương trình "${program.title}"!`);
  };

  const isVolunteer = program.category === 'volunteer';
  const theme = isVolunteer ? 'emerald' : program.category === 'recruitment' ? 'amber' : 'sky';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white flex items-center justify-center transition"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Embedded Image Placeholder */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <ImagePlaceholder
            sizeText={program.imageSizeText}
            description={program.imageDescription}
            aspectRatio="video"
            theme={theme}
            imageUrl={program.imageUrl}
          />
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Header info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                program.category === 'volunteer'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-sky-50 text-[#0284C7] border-sky-200'
              }`}>
                {program.categoryLabel}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white">
                {program.statusLabel}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {program.title}
            </h2>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-[#0284C7]" />
              <span><strong>Thời gian:</strong> {program.date}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[#0284C7]" />
              <span><strong>Địa điểm:</strong> {program.location}</span>
            </div>
            <div className="flex items-center gap-2.5 sm:col-span-2">
              <Users size={16} className="text-[#0284C7]" />
              <span><strong>Đối tượng:</strong> {program.targetAudience}</span>
            </div>
          </div>

          {/* Full description */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Nội dung chi tiết chương trình
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {program.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
              Quyền lợi khi tham gia:
            </h3>
            <div className="space-y-1.5">
              {program.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Sub-form */}
          <div className="pt-4 border-t border-slate-200">
            {!registered ? (
              <form onSubmit={handleSubmit} className="space-y-3.5 bg-sky-50/70 p-5 rounded-2xl border border-sky-200">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Đăng Ký Tham Gia Ngay (Miễn Phí)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Họ và tên *"
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="Số điện thoại *"
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                </div>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Địa chỉ Email nhận thông báo *"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20"
                >
                  <Send size={15} />
                  <span>Xác Nhận Đăng Ký</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <div className="font-bold text-base text-emerald-900">Đăng ký thành công!</div>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Thông tin xác nhận đã được gửi đến <strong>{registerEmail}</strong>.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
