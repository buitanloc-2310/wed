import React from 'react';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { useDataContext } from '../context/DataContext';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { NewsArticle, PageRoute } from '../types';

interface NewsPageProps {
  onSelectArticle: (article: NewsArticle) => void;
  onNavigate: (page: PageRoute) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({
  onSelectArticle,
  onNavigate,
}) => {
  const { newsArticles, siteConfig } = useDataContext();
  const publicArticles = newsArticles.filter((article) => article.isPublished !== false);
  const featuredArticle = publicArticles[0];
  const regularArticles = publicArticles.slice(1);

  return (
    <div className="space-y-10 py-6 sm:py-10">
      
      {/* Main Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7]">
            <Sparkles size={13} />
            <span>{siteConfig.newsLabel || 'Tin tức & hoạt động'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {siteConfig.newsHeading || 'Tin tức & hoạt động'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {siteConfig.siteDescription || 'Cập nhật tin tức và hoạt động đang được công bố.'}
          </p>
        </div>
      </section>

      {/* 1. BÀI VIẾT NỔI BẬT */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
                Bản Tin Nổi Bật
              </h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-150 shadow-2xs hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-6">
                  <ImagePlaceholder
                    sizeText={featuredArticle.imageSizeText}
                    description={featuredArticle.imageDescription}
                    aspectRatio="video"
                    theme={featuredArticle.theme}
                    imageUrl={featuredArticle.imageUrl}
                  />
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="bg-sky-50 text-[#0284C7] font-extrabold px-3 py-1 rounded-full border border-sky-200">
                      {featuredArticle.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Calendar size={14} className="text-[#0284C7]" />
                      {featuredArticle.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Clock size={14} className="text-[#0284C7]" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {featuredArticle.summary}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => onSelectArticle(featuredArticle)}
                      className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-sm shadow-sky-500/20"
                    >
                      <span>Đọc toàn bộ bài viết</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 2. DANH SÁCH BÀI VIẾT GỌN GÀNG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0284C7] tracking-tight">
              Danh Sách Bản Tin
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {publicArticles.length} bài viết
          </span>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {regularArticles.map((article, nIdx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: (nIdx % 3) * 0.08 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                  <ImagePlaceholder
                    sizeText={article.imageSizeText}
                    description={article.imageDescription}
                    aspectRatio="video"
                    theme={article.theme}
                    imageUrl={article.imageUrl}
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-extrabold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {article.categoryLabel}
                    </span>
                    <span className="font-medium text-slate-500">{article.date}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectArticle(article)}
                  className="w-full py-2.5 rounded-xl border border-sky-200 text-[#0284C7] hover:bg-sky-50 hover:border-sky-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                >
                  <span>Đọc chi tiết</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
