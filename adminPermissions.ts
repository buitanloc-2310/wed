import { AdminUserRole } from '../types';
export type AdminCapability='content.edit'|'content.publish'|'records.manage'|'media.manage'|'settings.manage'|'users.manage'|'system.manage'|'website.visualEdit';
const matrix:Record<AdminUserRole,ReadonlySet<AdminCapability>>={
 developer:new Set(['content.edit','content.publish','records.manage','media.manage','settings.manage','users.manage','system.manage','website.visualEdit']),
 admin:new Set(['content.edit','content.publish','records.manage','media.manage','settings.manage']),
 editor:new Set(['content.edit','media.manage'])
};
export const can=(role:AdminUserRole,cap:AdminCapability)=>matrix[role].has(cap);
export const canOpenAdminTab=(role:AdminUserRole,tab:string)=>{
 if(['visual-editor','system-health','logs'].includes(tab)) return can(role,'system.manage');
 if(tab==='settings') return can(role,'settings.manage');
 if(['certificates','partners','contributions','comments','contacts','registrations'].includes(tab)) return can(role,'records.manage');
 if(tab==='media') return can(role,'media.manage');
 return can(role,'content.edit');
};
