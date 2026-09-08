import React from 'react';
import { ArrowRight, Handshake, Mail, Phone, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface SponsorPageProps {
  onNavigate: (page: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const SponsorPage: React.FC<SponsorPageProps> = ({ onNavigate }) => {
  const { customPages } = useDataContext();
  const pageData = customPages.find(p => p.slug === 'sponsor' || p.id === 'page-sponsor');
  const title = pageData?.title || 'Hợp tác & Đồng hành cùng Sky First Network';
  const summary = pageData?.summary || 'Sky First Network tiếp nhận các đề xuất hợp tác phù hợp với định hướng giáo dục, phát triển người trẻ và cộng đồng.';

  return (
    <main className="bg-white">
      <section className="bg-[#071B3A] text-white py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-sky-200">
            <Handshake size={16}/> Hợp tác & Đồng hành
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl lg:text-6xl font-black tracking-[-.045em]">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{summary}</p>
          <button onClick={() => onNavigate('contact')} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#071B3A]">
            Gửi đề xuất hợp tác <ArrowRight size={17}/>
          </button>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-5">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-extrabold text-xl">Giáo dục & chuyên môn</h2>
            <p className="mt-3 text-slate-500 leading-7">Trao đổi về chương trình học tập, nội dung giáo dục, chia sẻ chuyên môn hoặc hoạt động phát triển năng lực phù hợp.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-extrabold text-xl">Truyền thông & sự kiện</h2>
            <p className="mt-3 text-slate-500 leading-7">Đề xuất phối hợp truyền thông, sự kiện hoặc các hoạt động cộng đồng có mục tiêu và phạm vi rõ ràng.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-extrabold text-xl">Nguồn lực & đồng hành</h2>
            <p className="mt-3 text-slate-500 leading-7">Các đề xuất hỗ trợ nguồn lực được xem xét theo từng chương trình. Website không mặc định công bố tài khoản tiếp nhận, cam kết tài chính hoặc quyền lợi khi chưa có thông tin được xác nhận.</p>
          </article>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 lg:p-9 grid lg:grid-cols-[1fr_.8fr] gap-8">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0B5FB4] grid place-items-center"><ShieldCheck/></div>
              <h2 className="mt-5 text-3xl font-black">Nguyên tắc minh bạch</h2>
              <p className="mt-3 text-slate-600 leading-7">Sky First Network hiện chưa có tư cách pháp lý độc lập. Nội dung hợp tác chỉ được mô tả theo phạm vi thực tế và không được trình bày theo cách tạo hiểu nhầm về tư cách pháp nhân, quan hệ đối tác hoặc cam kết chưa được xác nhận.</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <div className="flex gap-3"><Mail className="text-[#0B5FB4]" size={20}/><div><div className="text-xs text-slate-400">Email Hợp tác</div><a className="font-bold" href="mailto:hoptac.sfn@gmail.com">hoptac.sfn@gmail.com</a></div></div>
              <div className="flex gap-3"><Phone className="text-[#0B5FB4]" size={20}/><div><div className="text-xs text-slate-400">Điện thoại/Zalo</div><a className="font-bold" href="tel:0924910210">0924 910 210</a></div></div>
              <button onClick={() => onNavigate('contact')} className="w-full rounded-xl bg-[#0B5FB4] px-5 py-3 text-white font-bold">Đến trang Liên hệ</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
