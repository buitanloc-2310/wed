import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  UserRoundPlus,
} from 'lucide-react';

import { PageRoute, Program, NewsArticle } from '../types';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { EntityBadge } from '../components/EntityColorSystem';
import { useDataContext } from '../context/DataContext';

interface HomePageProps {
  onNavigate: (page: PageRoute, slug?: string) => void;
  onSelectProgram?: (program: Program) => void;
  onSelectArticle?: (article: NewsArticle) => void;
  /** Chỉ bật bên trong Admin > Chỉnh sửa Website. Public không bao giờ hiện nút sửa. */
  visualEditMode?: boolean;
  onEditSection?: (section: Key) => void;
}

type Key =
  | 'hero'
  | 'direction'
  | 'pillars'
  | 'programs'
  | 'units'
  | 'certificate'
  | 'values'
  | 'news'
  | 'transparency';

const DEFAULT_ORDER: Key[] = [
  'hero',
  'pillars',
  'programs',
  'units',
  'certificate',
  'values',
  'news',
  'transparency',
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProgram,
  onSelectArticle,
  visualEditMode = false,
  onEditSection,
}) => {
  const {
    programs,
    networkUnits,
    newsArticles,
    siteConfig,
    corePillars,
  } = useDataContext();

  const publishedPrograms = programs
    .filter((p) => p.isPublished !== false)
    .slice(0, 3);

  const publishedUnits = networkUnits
    .filter((u) => u.isPublished !== false)
    .slice(0, 2);

  const publishedNews = newsArticles
    .filter((n) => n.isPublished !== false)
    .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
    .slice(0, 6);

  const visible = siteConfig.homeSections || {};

  const saved = (siteConfig.homeSectionOrder || []).filter(
    (x): x is Key =>
      DEFAULT_ORDER.includes(x as Key) &&
      x !== 'direction'
  );

  const order = [
    ...new Set(saved),
    ...DEFAULT_ORDER.filter((x) => !saved.includes(x)),
  ];

  const pillarIcons = [
    GraduationCap,
    Users,
    HeartHandshake,
    Network,
    Megaphone,
  ];

  const pillars = corePillars
    .slice(0, 5)
    .map(
      (p, i) =>
        [
          p.title,
          p.shortDesc,
          pillarIcons[i] || GraduationCap,
        ] as const
    );

  const values = siteConfig.coreValues || [];

  const section: Record<Key, React.ReactNode> = {
    hero: (
      <section className="sf-home-hero relative overflow-hidden bg-[#071B3A] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20 grid lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-14 items-center">
          <div><p className="text-[10px] sm:text-xs uppercase tracking-[.16em] text-sky-200 font-bold mb-6">{siteConfig.heroBadge || siteConfig.siteName}</p>
            <h1 className="text-[38px] sm:text-5xl lg:text-[56px] font-bold leading-[1.2] tracking-[-.035em] whitespace-pre-line">{siteConfig.heroHeading || 'Kết nối tri thức. Phát triển người trẻ. Lan tỏa giá trị cộng đồng.'}</h1>
            <p className="mt-6 text-sm sm:text-base leading-8 text-slate-300 max-w-2xl">{siteConfig.heroSubtext}</p>
            <div className="mt-8 flex flex-wrap gap-3"><button onClick={()=>navigateUrl(siteConfig.heroButton1Url || '/about',onNavigate)} className="inline-flex items-center gap-3 rounded-xl bg-white text-[#071B3A] px-5 py-3.5 text-sm font-bold hover:bg-sky-100 transition">{siteConfig.heroButton1Text || 'Khám phá Sky First'}<ArrowUpRight size={18}/></button><button onClick={()=>navigateUrl(siteConfig.heroButton2Url || '/join',onNavigate)} className="inline-flex items-center gap-3 rounded-xl border border-slate-500 px-5 py-3.5 text-sm font-bold hover:bg-white/10 transition">{siteConfig.heroButton2Text || 'Cùng đồng hành'}<ArrowRight size={17}/></button></div>
            <div className="flex flex-wrap gap-x-5 gap-y-3 mt-9 pt-6 border-t border-white/15 text-[11px] text-slate-300"><span className="flex gap-2 items-center"><GraduationCap size={15}/>Giáo dục & học tập</span><span className="flex gap-2 items-center"><Users size={15}/>Phát triển người trẻ</span><span className="flex gap-2 items-center"><HeartHandshake size={15}/>Tình nguyện & cộng đồng</span></div>
          </div>
          <div className="sf-hero-visual relative"><ImagePlaceholder imageUrl={siteConfig.heroImageUrl} objectFit={siteConfig.heroImageFit||'cover'} aspectRatio="4/3" description={siteConfig.siteName+' — Giáo dục, người trẻ và cộng đồng'} theme="navy" className="rounded-[24px] border border-white/20"/>
            <div className="relative lg:-mt-8 lg:ml-8 mt-3 flex items-center gap-4 bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xl"><div className="rounded-xl bg-sky-50 p-3 text-sky-700"><HeartHandshake size={24}/></div><div><p className="text-[10px] uppercase tracking-widest text-sky-700 font-bold">Sky First Network</p><p className="font-bold mt-1">Cùng tạo giá trị cho cộng đồng.</p></div></div>
          </div>
        </div>
      </section>
    ),

    /* Giữ key direction để không phá dữ liệu/cấu hình cũ,
       nhưng KHÔNG hiển thị trên Trang chủ */
    direction: null,

    pillars: (
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="pointer-events-none absolute right-[-120px] top-[-80px] h-[360px] w-[360px] rounded-full bg-sky-100/40 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-6 lg:grid-cols-[.55fr_1.45fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[.17em] text-[#0B5FB4]">
                <Sparkles size={14} />
                {siteConfig.pillarsHeading || 'Lĩnh vực hoạt động'}
              </div>
            </div>

            <div>
              <h2 className="max-w-4xl text-4xl font-black tracking-[-.045em] text-slate-950 sm:text-5xl lg:text-[54px] lg:leading-[1.05]">
                {siteConfig.pillarsSubtext ||
                  'Những lĩnh vực Sky First Network tập trung phát triển.'}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500">
                Mỗi lĩnh vực là một hướng kết nối giữa học tập,
                trải nghiệm, kỹ năng và giá trị cộng đồng.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {pillars.map(([title, desc, Icon], i) => (
              <article
                key={String(title)}
                className="group relative min-h-[300px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(15,94,160,.11)]"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-50 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative flex items-start justify-between">
                  <span className="text-xs font-black tracking-[.14em] text-slate-400">
                    0{i + 1}
                  </span>

                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 text-[#0B5FB4] ring-1 ring-sky-100 transition group-hover:scale-105">
                    <Icon size={22} />
                  </span>
                </div>

                <div className="relative mt-20">
                  <h3 className="text-xl font-black tracking-[-.02em] text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {desc}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#0B5FB4] to-emerald-400 transition-all duration-300 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>
    ),

    programs: (
      <section className="relative overflow-hidden bg-[#F5F9FD] py-20 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-black uppercase tracking-[.18em] text-[#0B5FB4]">
                {siteConfig.programsLabel || 'Chương trình & hoạt động'}
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-5xl">
                {siteConfig.programsHeading ||
                  'Những hoạt động đang được cập nhật'}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('programs')}
              className="group inline-flex items-center gap-2 font-black text-[#0B5FB4]"
            >
              Xem tất cả
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publishedPrograms.length === 0 ? (
              <div className="lg:col-span-3 rounded-[26px] border border-dashed border-slate-300 bg-white/80 p-10 text-slate-500">
                Chưa có chương trình được công bố.
              </div>
            ) : (
              publishedPrograms.map((p: any) => (
                <article
                  key={p.id}
                  onClick={() => onSelectProgram?.(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      onSelectProgram?.(p);
                  }}
                  className="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-sky-50 to-slate-100">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sky-300">
                        <GraduationCap size={48} strokeWidth={1.3} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <EntityBadge
                      label={p.categoryLabel || 'Hoạt động'}
                      color={p.categoryColor}
                      className="uppercase tracking-[.08em]"
                    />

                    <h3 className="mt-3 text-xl font-black text-slate-950">
                      {p.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {p.summary}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0B5FB4]">
                      Xem chi tiết
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    ),

    units: (
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <div className="text-xs font-black uppercase tracking-[.18em] text-[#0B5FB4]">
                {siteConfig.unitsLabel || 'Đơn vị'}
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-5xl">
                {siteConfig.unitsHeading ||
                  'Những đơn vị đang cùng phát triển trong hệ sinh thái.'}
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-500">
                {siteConfig.unitsIntro}
              </p>
            </div>

            <div className="space-y-4">
              {publishedUnits.map((u: any) => (
                <article
                  key={u.id}
                  className="group flex items-center gap-5 rounded-[26px] border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-sky-200 hover:shadow-[0_14px_36px_rgba(15,94,160,.08)]"
                >
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2">
                    {u.code === 'SFEC' ? (
                      <img
                        src="/brand/the-sky-first-english-club-web.png"
                        alt="SFEC"
                        className="h-full w-full object-contain"
                      />
                    ) : u.code === 'NHN' ? (
                      <img
                        src="/brand/nha-han-ngu-web.jpg"
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building2 className="text-[#0B5FB4]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-slate-950">
                      {u.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {u.tagline}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="hidden text-slate-300 transition group-hover:text-[#0B5FB4] sm:block"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),

    certificate: (
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] bg-[#071B3A] px-7 py-10 text-white shadow-[0_24px_65px_rgba(5,40,85,.18)] sm:p-10 lg:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-[70px]" />

            <div className="absolute bottom-[-120px] left-[30%] h-72 w-72 rounded-full bg-emerald-400/15 blur-[90px]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_.55fr]">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-sky-300">
                  <ShieldCheck size={15} />
                  {siteConfig.certificateLabel || 'Hệ thống tra cứu'}
                </div>

                <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] sm:text-5xl">
                  {siteConfig.certificateHeading ||
                    'Tra cứu Giấy chứng nhận Sky First'}
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                  {siteConfig.certificateText}
                </p>
              </div>

              <button
                onClick={() =>
                  navigateUrl(
                    siteConfig.certificateButtonUrl || '/certificate',
                    onNavigate
                  )
                }
                className="group inline-flex min-h-[56px] items-center justify-center gap-2 justify-self-start rounded-2xl bg-white px-6 py-3.5 font-black text-[#0B5FB4] shadow-xl transition hover:-translate-y-0.5 lg:justify-self-end"
              >
                <Search size={18} />
                {siteConfig.certificateButtonText || 'Mở trang tra cứu'}
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    ),

    values: (
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[.18em] text-[#0B5FB4]">
              {siteConfig.valuesLabel || 'Giá trị cốt lõi'}
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-5xl">
              {siteConfig.valuesHeading}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={v.name}
                className="group rounded-[26px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0B5FB4]">
                    0{i + 1}
                  </span>

                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  {v.name}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    news: (
      <section className="bg-[#F5F9FD] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-black uppercase tracking-[.18em] text-[#0B5FB4]">
                {siteConfig.newsLabel || 'Nội dung nổi bật'}
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-5xl">
                {siteConfig.newsHeading || 'Bài đăng nổi bật & cập nhật mới'}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('news')}
              className="group inline-flex items-center gap-2 font-black text-[#0B5FB4]"
            >
              Xem tin tức
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {publishedNews.length === 0 ? (
              <div className="lg:col-span-3 rounded-[26px] border border-dashed border-slate-300 bg-white p-9 text-slate-500">
                Chưa có tin tức được công bố.
              </div>
            ) : (
              publishedNews.map((n: any) => (
                <article
                  key={n.id}
                  onClick={() => onSelectArticle?.(n)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      onSelectArticle?.(n);
                  }}
                  className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-400">
                    <span>{n.publishedAt}</span>{n.isFeatured && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">Nổi bật</span>}
                  </div>

                  <h3 className="mt-4 text-xl font-black leading-snug text-slate-950">
                    {n.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                    {n.summary}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0B5FB4]">
                    Đọc bài viết
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    ),

    transparency: (
      <section className="bg-white py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-[30px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 sm:p-9 lg:flex-row lg:items-center">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sky-50 text-[#0B5FB4] ring-1 ring-sky-100">
              <ShieldCheck size={25} />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-[-.025em] text-slate-950">
                {siteConfig.transparencyHeading}
              </h2>

              <p className="mt-2 max-w-3xl leading-7 text-slate-500">
                {siteConfig.transparencyText}
              </p>
            </div>

            <button
              onClick={() =>
                (window.location.href =
                  siteConfig.transparencyButtonUrl ||
                  '/phap-ly-minh-bach')
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-800 transition hover:border-sky-200 hover:text-[#0B5FB4]"
            >
              {siteConfig.transparencyButtonText || 'Tìm hiểu thêm'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main className="bg-white">
      {order
        .filter((k) => k !== 'direction' && visible[k] !== false)
        .map((k) => (
          <div key={k} className={visualEditMode ? 'relative visual-editor-section' : undefined}>
            {visualEditMode && (
              <button type="button" onClick={() => onEditSection?.(k)} className="absolute right-5 top-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-lg hover:bg-sky-50" title={`Chỉnh sửa ${k}`} aria-label={`Chỉnh sửa ${k}`}>✎</button>
            )}
            {section[k]}
          </div>
        ))}
    </main>
  );
};

function navigateUrl(
  url: string,
  onNavigate: (page: PageRoute, slug?: string) => void
) {
  const map: Record<string, PageRoute> = {
    '/': 'home',
    '/about': 'about',
    '/join': 'join',
    '/certificate': 'certificate',
    '/programs': 'programs',
    '/units': 'units',
    '/news': 'news',
    '/contact': 'contact',
  };

  if (map[url]) {
    onNavigate(map[url]);
  } else {
    try{const target=new URL(url,window.location.origin);if(!['http:','https:'].includes(target.protocol))return;if(target.origin===window.location.origin){const path=target.pathname.split('/').filter(Boolean);if(path[0]==='tin-tuc'&&path[1]){onNavigate('news-detail',decodeURIComponent(path[1]));return}if(path[0]==='du-an'&&path[1]){onNavigate('program-detail',decodeURIComponent(path[1]));return}if(path.length===1){onNavigate('custom-page',decodeURIComponent(path[0]));return}}window.location.assign(target.href);}catch{return;}
  }
}
