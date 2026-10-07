import React,{useEffect,useState} from 'react';
import {CheckCircle2,AlertTriangle,Loader2,RefreshCw,XCircle,ExternalLink} from 'lucide-react';
import {testFirestoreConnection} from '../../lib/firebase';
import {listMedia} from '../../lib/mediaApi';
import {adminApi} from '../../lib/adminApi';
import {useDataContext} from '../../context/DataContext';

type Health={name:string;level:'ok'|'warn'|'error';detail:string;href?:string};
const cleanPath=(v:any)=>('/'+String(v||'').replace(/^\/+|\/+$/g,'')).replace(/\/{2,}/g,'/');
export const AdminSystemHealth:React.FC=()=>{
 const {firebaseSyncStatus,firebaseSyncMessage,siteConfig,customPages,programs,newsArticles,networkUnits}=useDataContext();
 const [results,setResults]=useState<Health[]>([]),[loading,setLoading]=useState(false);
 const check=async()=>{setLoading(true);try{
   const [cms,media,forms,redirects]=await Promise.allSettled([
     testFirestoreConnection(),listMedia(),adminApi('/api/forms?admin=1'),adminApi('/api/admin-records?kind=redirects')
   ]);
   const out:Health[]=[];
   out.push({name:'Kết nối dữ liệu D1',level:cms.status==='fulfilled'&&cms.value.ok?'ok':'error',detail:cms.status==='fulfilled'?cms.value.message:'Không kết nối được dịch vụ dữ liệu.',href:'/admin/tinh-trang-he-thong'});
   const globalConfigIssues=[] as string[];
   if(!String(siteConfig.email||'').includes('@'))globalConfigIssues.push('email liên hệ chính');
   if(!String(siteConfig.hotline||'').trim())globalConfigIssues.push('hotline');
   if(!(siteConfig.taxonomyCategories||[]).some(x=>x.visible!==false))globalConfigIssues.push('taxonomy');
   if(!(siteConfig.navigationGroups||[]).length)globalConfigIssues.push('menu');
   out.push({name:'Cấu hình Global',level:globalConfigIssues.length?'error':'ok',detail:globalConfigIssues.length?`Thiếu hoặc sai cấu hình: ${globalConfigIssues.join(', ')}.`:'Email, hotline, taxonomy và menu global đã có cấu hình.',href:'/admin/chinh-sua-website'});
   const mediaItems=media.status==='fulfilled'?(media.value.items||[]):[];
   out.push({name:'Thư viện Media / R2',level:media.status==='fulfilled'?'ok':'error',detail:media.status==='fulfilled'?`Đã kết nối. ${mediaItems.length} tệp trong trang đầu được kiểm tra.`:String((media as any).reason?.message||'Không kết nối được thư viện.'),href:'/admin/media'});

   const publishedPages=customPages.filter(x=>x.isPublished!==false),publishedNews=newsArticles.filter(x=>x.isPublished!==false),publishedPrograms=programs.filter(x=>x.isPublished!==false);
   const slugRows=[...publishedPages.map(x=>({slug:x.slug,type:'Trang',title:x.title})),...publishedNews.map(x=>({slug:x.slug,type:'Tin',title:x.title})),...publishedPrograms.map(x=>({slug:x.slug,type:'Chương trình',title:x.title}))].filter(x=>x.slug);
   const seen=new Map<string,number>(); for(const x of slugRows){const k=String(x.slug).trim().toLowerCase();seen.set(k,(seen.get(k)||0)+1)}
   const dup=[...seen.entries()].filter(([,n])=>n>1).map(([k])=>k);
   out.push({name:'Slug trùng lặp',level:dup.length?'error':'ok',detail:dup.length?`Phát hiện ${dup.length} slug trùng: ${dup.slice(0,5).join(', ')}${dup.length>5?'…':''}`:'Không phát hiện slug trùng trong nội dung đang xuất bản.',href:'/admin/trang'});
   const badSlug=slugRows.filter(x=>/^https?:\/\//i.test(String(x.slug))||String(x.slug).includes('?')||String(x.slug).includes('#'));
   out.push({name:'Định dạng đường dẫn',level:badSlug.length?'error':'ok',detail:badSlug.length?`${badSlug.length} nội dung có slug chứa URL/query không hợp lệ.`:'Slug đang dùng định dạng đường dẫn nội bộ hợp lệ.',href:'/admin/trang'});

   const pageSlugs=new Set(customPages.filter(x=>x.isPublished!==false).map(x=>String(x.slug||'').trim()).filter(Boolean));
   const navItems=(siteConfig.navigationGroups||[]).flatMap((g:any)=>Array.isArray(g.items)?g.items:[]);
   const brokenNav=navItems.filter((x:any)=>x?.page==='custom-page'&&x?.slug&&!pageSlugs.has(String(x.slug)));
   out.push({name:'Liên kết menu nội bộ',level:brokenNav.length?'error':'ok',detail:brokenNav.length?`${brokenNav.length} liên kết menu đang trỏ tới trang chưa tồn tại/chưa xuất bản: ${brokenNav.slice(0,4).map((x:any)=>x.label||x.slug).join(' • ')}`:'Các liên kết custom-page trong menu đang có trang công khai tương ứng.',href:'/admin/menu'});

   const missingSeo=[...publishedPages.filter(x=>!x.seoTitle?.trim()||!x.seoDescription?.trim()).map(x=>x.title),...publishedNews.filter(x=>!x.seoTitle?.trim()||!x.seoDescription?.trim()).map(x=>x.title)];
   out.push({name:'SEO nội dung',level:missingSeo.length?'warn':'ok',detail:missingSeo.length?`${missingSeo.length} trang/bài đang xuất bản thiếu SEO title hoặc description. Ví dụ: ${missingSeo.slice(0,3).join(' • ')}`:'Các trang/bài kiểm tra đều có SEO title và description.',href:'/admin/trang'});
   const missingAlt=publishedNews.filter(x=>x.imageUrl&&!String(x.imageAlt||x.imageDescription||'').trim());
   out.push({name:'ALT hình ảnh',level:missingAlt.length?'warn':'ok',detail:missingAlt.length?`${missingAlt.length} bài viết có ảnh nhưng chưa có ALT/mô tả ảnh.`:'Không phát hiện bài viết có ảnh thiếu ALT trong dữ liệu đang xuất bản.',href:'/admin/bai-dang'});

   const formItems=forms.status==='fulfilled'?((forms.value as any).items||[]):[];
   const now=Date.now(); const expired=formItems.filter((f:any)=>f.status==='open'&&f.settings?.closeAt&&new Date(f.settings.closeAt).getTime()<now);
   out.push({name:'Biểu mẫu hết hạn',level:forms.status!=='fulfilled'?'error':expired.length?'warn':'ok',detail:forms.status!=='fulfilled'?'Không tải được Form Builder để kiểm tra.':expired.length?`${expired.length} biểu mẫu vẫn để trạng thái Đang mở dù đã qua thời gian đóng.`:'Không có biểu mẫu mở quá hạn.',href:'/admin/dang-ky'});

   const redirectItems=redirects.status==='fulfilled'?((redirects.value as any).items||[]).filter((x:any)=>String(x.active).toLowerCase()==='true'):[];
   const edges=new Map<string,string>(); for(const r of redirectItems){if(r.fromPath&&r.toPath)edges.set(cleanPath(r.fromPath),cleanPath(r.toPath))}
   let loops=0; for(const start of edges.keys()){const visited=new Set<string>();let cur=start;while(edges.has(cur)){if(visited.has(cur)){loops++;break}visited.add(cur);cur=edges.get(cur)!;if(visited.size>50){loops++;break}}}
   out.push({name:'Redirect 301',level:redirects.status!=='fulfilled'?'error':loops?'error':'ok',detail:redirects.status!=='fulfilled'?'Không tải được danh sách redirect.':loops?`Phát hiện ${loops} đường dẫn nằm trong vòng lặp chuyển hướng.`:`${redirectItems.length} redirect đang hoạt động; chưa phát hiện vòng lặp.`,href:'/admin/redirect'});

   const allContent=JSON.stringify({siteConfig,customPages,programs,newsArticles,networkUnits});
   const orphan=mediaItems.filter(m=>m.url&&!allContent.includes(m.url));
   const oversized=mediaItems.filter(m=>(m.size||0)>20*1024*1024);
   out.push({name:'Media không được tham chiếu',level:orphan.length?'warn':'ok',detail:orphan.length?`${orphan.length}/${mediaItems.length} tệp ở trang Media đầu chưa được tìm thấy trong dữ liệu nội dung hiện tại. Đây là cảnh báo rà soát, không tự xóa.`:'Các tệp Media trong trang đầu đều có tham chiếu trong nội dung.',href:'/admin/media'});
   out.push({name:'Dung lượng Media',level:oversized.length?'error':'ok',detail:oversized.length?`${oversized.length} tệp vượt 20 MB.`:'Không phát hiện tệp vượt giới hạn 20 MB trong trang Media đầu.',href:'/admin/media'});

   const badInternal=JSON.stringify({siteConfig,customPages,programs,newsArticles}).match(/(?:href|url|Url)\"?:\"?\s*\"?\/\/+/gi)||[];
   out.push({name:'Liên kết nội bộ',level:badInternal.length?'warn':'ok',detail:badInternal.length?`Phát hiện ${badInternal.length} dấu hiệu đường dẫn nội bộ có nhiều dấu /. Nên rà trước khi publish.`:'Không phát hiện mẫu liên kết nội bộ bất thường trong dữ liệu đã nạp.',href:'/admin/trang'});
   setResults(out);
 }finally{setLoading(false)}};
 useEffect(()=>{void check()},[]);
 const icon=(x:Health)=>x.level==='ok'?<CheckCircle2 className="text-emerald-600" size={20}/>:x.level==='error'?<XCircle className="text-rose-600" size={20}/>:<AlertTriangle className="text-amber-600" size={20}/>;
 return <section className="max-w-6xl"><header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5"><div><h2 className="text-2xl font-bold">Site Health</h2><p className="text-sm text-slate-500 mt-2">Kiểm tra kết nối, nội dung, SEO, media, biểu mẫu, slug và chuyển hướng trước khi đưa website vào vận hành.</p></div><button type="button" disabled={loading} onClick={()=>void check()} className="inline-flex items-center justify-center gap-2 border rounded-xl px-4 py-2 text-xs font-semibold"><RefreshCw size={15}/>Kiểm tra lại</button></header>{loading&&<p role="status" className="flex items-center gap-2 mt-6 text-sm"><Loader2 size={17} className="animate-spin"/>Đang kiểm tra toàn hệ thống…</p>}<div className="grid md:grid-cols-2 gap-4 mt-6">{results.map(item=><article key={item.name} className={`border rounded-2xl bg-white p-5 ${item.level==='error'?'border-rose-200':item.level==='warn'?'border-amber-200':'border-slate-200'}`}><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{item.name}</h3>{icon(item)}</div><p className="text-xs text-slate-500 mt-3 leading-5">{item.detail}</p>{item.href&&item.level!=='ok'&&<a href={item.href} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0B66C3]">Mở khu vực xử lý <ExternalLink size={12}/></a>}</article>)}</div><div className="border rounded-2xl mt-4 p-5"><h3 className="font-semibold">Trạng thái lưu nội dung</h3><p className={`text-xs mt-2 ${firebaseSyncStatus==='error'?'text-rose-700':'text-slate-500'}`}>{firebaseSyncMessage}</p></div></section>;
};
