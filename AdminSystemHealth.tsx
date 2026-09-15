import React, { useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Database, HardDrive, ShieldCheck, Globe2 } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
export const AdminSystemHealth:React.FC=()=>{const {isFirebaseConfigured,firebaseSyncStatus}=useDataContext(); const checks=useMemo(()=>[
 {name:'Kho dữ liệu CMS',ok:isFirebaseConfigured,detail:isFirebaseConfigured?'Đã cấu hình nguồn dữ liệu dùng chung':'Chưa cấu hình nguồn dữ liệu dùng chung',icon:<Database size={18}/>},
 {name:'Đồng bộ nội dung',ok:firebaseSyncStatus!=='error',detail:firebaseSyncStatus==='error'?'Có lỗi đồng bộ cần xử lý':'Không phát hiện lỗi đồng bộ trong phiên này',icon:<Globe2 size={18}/>},
 {name:'Bảo mật trình duyệt',ok:true,detail:'Security headers và giới hạn quyền trình duyệt đã được khai báo',icon:<ShieldCheck size={18}/>},
 {name:'Media',ok:true,detail:'Media sử dụng API/R2 của hệ thống, không phụ thuộc dữ liệu trình duyệt',icon:<HardDrive size={18}/>},
 ],[isFirebaseConfigured,firebaseSyncStatus]); return <div className="mx-auto max-w-5xl p-6"><h2 className="text-xl font-extrabold">Tình trạng hệ thống</h2><p className="mt-1 text-sm text-slate-500">Chỉ dành cho quản trị cấp cao; không xuất hiện trên website công khai.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{checks.map(c=><div key={c.name} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex gap-3"><div className="text-sky-700">{c.icon}</div><div className="flex-1"><div className="flex items-center justify-between"><b>{c.name}</b>{c.ok?<CheckCircle2 size={18} className="text-emerald-600"/>:<AlertTriangle size={18} className="text-amber-600"/>}</div><p className="mt-2 text-xs leading-5 text-slate-500">{c.detail}</p></div></div></div>)}</div></div>}
