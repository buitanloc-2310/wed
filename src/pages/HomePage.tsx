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
import { useDataContext } from '../context/DataContext';

interface HomePageProps {
  onNavigate: (page: PageRoute, slug?: string) => void;
  onSelectProgram?: (program: Program) => void;
  onSelectArticle?: (article: NewsArticle) => void;
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
    .slice(0, 3);

  const visible = siteConfig.homeSections || {};

  const saved = (siteConfig.homeSectionOrder || []).filter(
    (x): x is Key =>
      DEFAULT_ORDER.includes(x as Key) &&
      x !== 'direction'
  );

  const order = [
    ...saved,
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
      <section className="relative overflow-hidden bg-white">
        {/* nền trang trí */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef9ff_0%,#f7fbff_38%,#ffffff_100%)]" />

          <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-cyan-200/30 blur-[95px]" />

          <div className="absolute right-[-100px] top-[-60px] h-[520px] w-[520px] rounded-full bg-blue-200/30 blur-[110px]" />

          <div className="absolute left-[38%] top-[220px] h-[260px] w-[260px] rounded-full bg-emerald-100/30 blur-[90px]" />

          <div
            className="absolute inset-0 opacity-[0.26]"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(11,95,180,.16) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage:
                'linear-gradient(to bottom, black, transparent 78%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black, transparent 78%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          {/* badge đầu */}
          <div className="mb-7 flex justify-center lg:justify-start">
            <div className="group inline-flex max-w-full items-center gap-3 rounded-full border border-sky-200/90 bg-white/90 px-4 py-2.5 shadow-[0_10px_35px_rgba(14,116,180,.10)] backdrop-blur-xl">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>

              <span className="truncate text-[11px] font-black uppercase tracking-[.13em] text-[#0571B9] sm:text-xs">
                {siteConfig.heroBadge ||
                  'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First'}
              </span>

              <Sparkles
                size={15}
                className="hidden shrink-0 text-sky-500 sm:block"
              />
            </div>
          </div>

          {/* Hero chính */}
          <div className="grid items-center gap-12 lg:grid-cols-[1.18fr_.82fr] lg:gap-14">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-extrabold text-[#0B5FB4] ring-1 ring-inset ring-sky-100">
                <BookOpen size={15} />
                Giáo dục · Phát triển · Kết nối · Cộng đồng
              </div>

              <h1 className="max-w-5xl text-[44px] font-black leading-[.98] tracking-[-.055em] text-[#07162E] sm:text-6xl lg:text-[72px] xl:text-[78px]">
                Giáo dục để
                <span className="relative mx-2 inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#057BC1] via-[#0B67C9] to-[#0560AA] bg-clip-text text-transparent">
                    phát triển.
                  </span>

                  <span className="absolute bottom-[5px] left-0 right-0 -z-0 h-[11px] rounded-full bg-sky-200/55 sm:bottom-[8px] sm:h-[14px]" />
                </span>

                <br />

                Kết nối để
                <span className="relative ml-2 inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#059A75] via-[#008FA8] to-[#0B67C9] bg-clip-text text-transparent">
                    tạo giá trị.
                  </span>

                  <span className="absolute bottom-[5px] left-0 right-0 -z-0 h-[11px] rounded-full bg-emerald-200/55 sm:bottom-[8px] sm:h-[14px]" />
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                {siteConfig.heroSubtext ||
                  'Sky First Network là mạng lưới hoạt động theo định hướng giáo dục, phát triển con người và kết nối cộng đồng; tạo môi trường để người trẻ học tập, phát triển năng lực, tham gia hoạt động xã hội và cùng tạo ra những giá trị tích cực.'}
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => onNavigate('about')}
                  className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0787C8] to-[#0871B7] px-6 py-3.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(5,120,185,.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(5,120,185,.32)]"
                >
                  <BadgeCheck size={18} />
                  Giới thiệu về Sky First Network
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() => onNavigate('certificate')}
                  className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50/80 px-6 py-3.5 text-sm font-black text-[#00795F] shadow-[0_8px_25px_rgba(5,150,110,.08)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-100"
                >
                  <Search size={18} />
                  Tra cứu Giấy chứng nhận
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  onClick={() => onNavigate('join')}
                  className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-6 py-3.5 text-sm font-black text-slate-800 shadow-[0_8px_28px_rgba(15,23,42,.07)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:text-[#0B5FB4]"
                >
                  <UserRoundPlus size={18} />
                  Tham gia Sky First Network
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* hàng nhỏ phía dưới */}
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200/80 pt-6 text-xs font-semibold text-slate-500 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-50 text-[#0B5FB4]">
                    <GraduationCap size={14} />
                  </span>
                  Giáo dục & học tập
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Users size={14} />
                  </span>
                  Phát triển người trẻ
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-violet-50 text-violet-600">
                    <HeartHandshake size={14} />
                  </span>
                  Kết nối cộng đồng
                </span>
              </div>
            </div>

            {/* khu trang trí bên phải - KHÔNG DÙNG ẢNH */}
            <div className="relative hidden min-h-[510px] lg:block">
              <div className="absolute inset-8 rounded-[42px] border border-sky-100 bg-white/60 shadow-[0_30px_80px_rgba(15,84,140,.12)] backdrop-blur-xl" />

              <div className="absolute left-0 top-8 w-[78%] rounded-[32px] border border-white/80 bg-gradient-to-br from-[#0B5FB4] via-[#0787C8] to-[#00A98F] p-[1px] shadow-[0_24px_55px_rgba(6,100,165,.20)]">
                <div className="rounded-[31px] bg-white/95 p-7 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 text-[#0B5FB4]">
                      <GraduationCap size={27} />
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-emerald-600">
                      Sky First
                    </span>
                  </div>

                  <div className="mt-7 text-xs font-black uppercase tracking-[.16em] text-[#0B5FB4]">
                    Giáo dục & phát triển
                  </div>

                  <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-.035em] text-slate-950">
                    Học tập để trưởng thành.
                    <br />
                    Trải nghiệm để phát triển.
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    Tạo môi trường để người trẻ học hỏi, thử sức,
                    rèn luyện kỹ năng và tham gia những hoạt động
                    mang giá trị tích cực.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-8 right-0 w-[71%] rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_55px_rgba(15,23,42,.11)]">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Network size={23} />
                  </div>

                  <div>
                    <div className="text-xs font-black uppercase tracking-[.15em] text-emerald-600">
                      Kết nối
                    </div>

                    <div className="mt-1 text-lg font-black text-slate-900">
                      Cùng tạo ra giá trị cho cộng đồng
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-sky-50 p-3 text-center">
                    <GraduationCap
                      size={19}
                      className="mx-auto text-[#0B5FB4]"
                    />
                    <div className="mt-2 text-[10px] font-bold text-slate-600">
                      Học tập
                    </div>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                    <HeartHandshake
                      size={19}
                      className="mx-auto text-emerald-600"
                    />
                    <div className="mt-2 text-[10px] font-bold text-slate-600">
                      Cộng đồng
                    </div>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-3 text-center">
                    <Megaphone
                      size={19}
                      className="mx-auto text-violet-600"
                    />
                    <div className="mt-2 text-[10px] font-bold text-slate-600">
                      Lan tỏa
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 top-12 h-20 w-20 rounded-full border-[14px] border-sky-100/80" />

              <div className="absolute left-[40%] top-[47%] h-5 w-5 rounded-full bg-emerald-400 shadow-[0_0_0_10px_rgba(52,211,153,.12)]" />

              <div className="absolute right-24 top-[42%] h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_0_8px_rgba(56,189,248,.12)]" />
            </div>
          </div>
        </div>

        {/* đường phân cách */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
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

          <div className="grid gap-5 lg:grid-cols-3">
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
                    <div className="text-[11px] font-black uppercase tracking-[.14em] text-[#0B5FB4]">
                      {p.categoryLabel || 'Hoạt động'}
                    </div>

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
                {siteConfig.newsLabel || 'Tin tức'}
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-5xl">
                {siteConfig.newsHeading}
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
                  <div className="text-xs font-bold text-slate-400">
                    {n.publishedAt}
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
          <React.Fragment key={k}>{section[k]}</React.Fragment>
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
    window.location.href = url;
  }
}
