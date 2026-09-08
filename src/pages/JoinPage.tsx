import React from 'react';
import { ArrowRight, HeartHandshake, UserRoundPlus, Users, Building2 } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface JoinPageProps { onShowToast: (msg: string) => void; onNavigate: (page: PageRoute) => void; }

export const JoinPage: React.FC<JoinPageProps> = ({ onNavigate }) => {
  const { customPages } = useDataContext();
  const pageData = customPages.find(p => p.slug === 'join' || p.id === 'page-join');
  const title = pageData?.title || 'Tham gia Sky First Network';
  const summary = pageData?.summary || 'Tìm hiểu các hình thức tham gia được công bố theo từng chương trình, hoạt động và nhu cầu nhân sự.';

  const groups = [
    {icon: UserRoundPlus, title:'Core Team', text:'Tham gia các vai trò vận hành, tổ chức hoặc hỗ trợ chuyên môn theo từng đợt tuyển và mô tả công việc được công bố.'},
    {icon: HeartHandshake, title:'Tình nguyện viên', text:'Đăng ký tham gia các hoạt động cộng đồng theo từng chương trình, thời gian và yêu cầu cụ thể.'},
    {icon: Users, title:'Thành viên & người học', text:'Tham gia các lớp học, chương trình giáo dục, hoạt động trải nghiệm hoặc cộng đồng phù hợp.'},
    {icon: Building2, title:'Hợp tác & đồng hành', text:'Gửi đề xuất hợp tác về giáo dục, truyền thông, sự kiện, chuyên môn hoặc nguồn lực theo phạm vi thực tế.'},
  ];

  return <main className="bg-white">
    <section className="bg-[#071B3A] text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-[.18em] text-sky-200 font-black">Tham gia</div>
        <h1 className="mt-4 text-5xl lg:text-6xl font-black tracking-[-.045em]">{title}</h1>
        <p className="mt-5 max-w-3xl text-slate-300 leading-8">{summary}</p>
      </div>
    </section>

    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-5">
          {groups.map(({icon:Icon,title,text}) => <article key={title} className="rounded-2xl border border-slate-200 p-6">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0B5FB4] grid place-items-center"><Icon size={21}/></div>
            <h2 className="mt-5 text-2xl font-extrabold">{title}</h2>
            <p className="mt-3 text-slate-600 leading-7">{text}</p>
          </article>)}
        </div>
        <div className="mt-8 rounded-[26px] bg-slate-50 border border-slate-200 p-7 flex flex-col lg:flex-row gap-5 lg:items-center">
          <div className="flex-1"><h2 className="text-2xl font-black">Thông tin tuyển và đăng ký</h2><p className="mt-2 text-slate-600 leading-7">Chỉ những đợt tuyển, quyền lợi, thời hạn hoặc Giấy chứng nhận đã được xác nhận mới được công bố trên website.</p></div>
          <button onClick={() => onNavigate('contact')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5FB4] text-white px-5 py-3 font-bold">Liên hệ / đăng ký <ArrowRight size={17}/></button>
        </div>
      </div>
    </section>
  </main>;
};
