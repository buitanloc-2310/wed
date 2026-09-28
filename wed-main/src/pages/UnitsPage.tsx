import React from 'react';
import { ArrowRight, Building2, Mail, Phone } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface UnitsPageProps { onNavigate: (page: PageRoute) => void; }

export const UnitsPage: React.FC<UnitsPageProps> = ({ onNavigate }) => {
  const { networkUnits, siteConfig } = useDataContext();
  const units = networkUnits.filter(u => u.isPublished !== false);

  return <main className="bg-white">
    <section className="bg-[#071B3A] text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-[.18em] text-sky-200 font-black">{siteConfig.unitsLabel || 'Đơn vị trực thuộc'}</div>
        <h1 className="mt-4 text-5xl lg:text-6xl font-black tracking-[-.045em]">{siteConfig.unitsHeading || 'Đơn vị trực thuộc'}</h1>
        <p className="mt-5 max-w-3xl text-slate-300 leading-8">{siteConfig.unitsIntro || 'Các đơn vị trực thuộc có phạm vi hoạt động và thông tin riêng, được cập nhật theo dữ liệu chính thức trên website.'}</p>
      </div>
    </section>

    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {units.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500">Chưa có đơn vị được công bố.</div>}
        {units.map(unit => <article key={unit.id} className="rounded-[28px] border border-slate-200 p-6 lg:p-8 grid md:grid-cols-[120px_1fr] gap-6 items-start">
          <div className="w-28 h-28 rounded-2xl border border-slate-200 bg-white overflow-hidden grid place-items-center">
            {unit.imageUrl ? <img src={unit.imageUrl} alt={`Logo ${unit.name}`} className="w-full h-full object-contain"/> : <Building2 size={34} className="text-slate-400"/>}
          </div>
          <div>
            <div className="text-xs uppercase tracking-[.14em] font-black text-[#0B5FB4]">{unit.categoryLabel}</div>
            <h2 className="mt-2 text-3xl font-black">{unit.name}</h2>
            {unit.tagline && <p className="mt-2 text-slate-500">{unit.tagline}</p>}
            <p className="mt-5 leading-7 text-slate-600">{unit.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
              {unit.contact.email && <a className="inline-flex items-center gap-2" href={`mailto:${unit.contact.email}`}><Mail size={16}/> {unit.contact.email}</a>}
              {unit.contact.phone && <a className="inline-flex items-center gap-2" href={`tel:${unit.contact.phone.replace(/\s/g,'')}`}><Phone size={16}/> {unit.contact.phone}</a>}
            </div>
          </div>
        </article>)}
        <button onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 rounded-xl bg-[#0B5FB4] text-white px-5 py-3 font-bold">{siteConfig.ctaSecondaryButtonText || 'Liên hệ'} <ArrowRight size={17}/></button>
      </div>
    </section>
  </main>;
};
