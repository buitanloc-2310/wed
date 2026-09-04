export const isEmail=v=>/^\S+@\S+\.\S+$/.test(String(v||''));
export const safeSlug=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function pick(input,fields){const out={};for(const f of fields)if(Object.prototype.hasOwnProperty.call(input,f))out[f]=input[f];return out}
export function asBool(v){return v===true||v===1||v==='1'?1:0}
