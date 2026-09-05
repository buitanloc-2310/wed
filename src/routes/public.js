import { all, one, settings } from '../data/db.js';
import { html } from '../core/http.js';
import { localeFrom, layout } from '../views/layout.js';
import { home, standard, topics, units } from '../views/public.js';
import { contact, join, news, article, systems, library, verify, donate } from '../views/features.js';
const labels={ '/home':['Trang chủ','Home'],'/gioi-thieu':['Giới thiệu về Sky First','About Sky First'],'/hoat-dong':['Chương trình hoạt động','Programmes'],'/don-vi':['Các đơn vị trực thuộc','Member units'],'/tham-gia':['Gia nhập & Hợp tác','Join & Partner'],'/hop-tac':['Hợp tác','Partnership'],'/tin-tuc':['Tin tức & Hoạt động','News & Activities'],'/thu-vien':['Thư viện','Library'],'/he-thong':['Hệ thống Sky First','Sky First system'],'/tra-cuu':['Tra cứu tại Sky First','Verify at Sky First'],'/tai-tro-dong-hanh':['Tài trợ & Đồng hành','Support & Partnership'],'/lien-he':['Liên hệ','Contact'] };
const pageForPath={ '/gioi-thieu':'gioi-thieu','/hoat-dong':'hoat-dong','/don-vi':'don-vi' };
export async function publicRoute(request, env) {
  const u=new URL(request.url), path=u.pathname==='/'?'/home':u.pathname.replace(/\/$/,'')||'/home', locale=localeFrom(request), s=await settings(env.DB), wrap=(title,content,desc='')=>html(layout({locale,path,title,content,settings:s,description:desc}),200,{'content-security-policy':"default-src 'self'; img-src 'self' https://img.vietqr.io data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"});
  if(path==='/home') { const posts=await all(env.DB,"SELECT id,title,excerpt,published_at FROM sky_posts WHERE locale=? AND status='published' ORDER BY published_at DESC LIMIT 3",locale); return wrap(labels[path][locale==='en'?1:0],home(locale,posts)); }
  if(path==='/noi-dung'||path.startsWith('/noi-dung/')) { const slug=path.split('/')[2]; const list=await all(env.DB,'SELECT slug,number,question FROM sky_topics WHERE locale=? ORDER BY number',locale); const selected=slug?await one(env.DB,'SELECT * FROM sky_topics WHERE slug=? AND locale=?',slug,locale):null; return wrap(selected?.question|| (locale==='en'?'Official content':'Nội dung chính thức'),topics(locale,list,selected)); }
  if(path==='/tham-gia'||path==='/hop-tac') return wrap(labels[path][locale==='en'?1:0],join(locale));
  if(path==='/lien-he') return wrap(labels[path][locale==='en'?1:0],contact(locale,u.searchParams.get('sent')?'success':''));
  if(path==='/tin-tuc') { const posts=await all(env.DB,"SELECT id,title,excerpt,published_at FROM sky_posts WHERE locale=? AND status='published' ORDER BY published_at DESC",locale); return wrap(labels[path][locale==='en'?1:0],news(locale,posts)); }
  if(path.startsWith('/tin-tuc/')) { const post=await one(env.DB,"SELECT * FROM sky_posts WHERE id=? AND locale=? AND status='published'",path.split('/')[2],locale); return post?wrap(post.title,article(locale,post)):notFound(locale,s,path); }
  if(path==='/thu-vien') return wrap(labels[path][locale==='en'?1:0],library(locale));
  if(path==='/he-thong') { const portals=await all(env.DB,'SELECT * FROM sky_portals ORDER BY sort_order'); return wrap(labels[path][locale==='en'?1:0],systems(locale,portals)); }
  if(path==='/tai-tro-dong-hanh') return wrap(labels[path][locale==='en'?1:0],donate(locale,s));
  if(path==='/tra-cuu') { const code=(u.searchParams.get('code')||'').trim().toUpperCase(), record=code?await one(env.DB,"SELECT code,holder_name,achievement,issuer_name,issued_at,status,public_note FROM sky_certificates WHERE code=? AND status IN ('valid','expired','revoked','test')",code):null; const msg=code&&!record?(locale==='en'?'No published record found for this code.':'Không tìm thấy kết quả đã công bố cho mã này.'):''; return wrap(labels[path][locale==='en'?1:0],verify(locale,record,msg)); }
  if(pageForPath[path]) { const page=await one(env.DB,'SELECT * FROM sky_pages WHERE slug=? AND locale=?',pageForPath[path],locale); if(path==='/don-vi') return wrap(labels[path][locale==='en'?1:0],units(locale)); return page?wrap(page.title,standard(locale,page),page.summary):notFound(locale,s,path); }
  return notFound(locale,s,path);
}
function notFound(locale,s,path) { return html(layout({locale,path,title:'404',settings:s,content:`<section class="section"><p class="eyebrow">404</p><h1>${locale==='en'?'Page not found':'Không tìm thấy trang'}</h1><a class="button" href="/home">${locale==='en'?'Back home':'Về trang chủ'}</a></section>`}),404); }
