import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, User, Auth, deleteUser, Unsubscribe } from 'firebase/auth';

const firebaseConfig={
 apiKey:import.meta.env.VITE_FIREBASE_API_KEY||'AIzaSyCnsxTv6kDiIp_5KIUlnPcJznnZxYFvN9U',authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN||'skyfirstnetwork.firebaseapp.com',projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID||'skyfirstnetwork',storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET||'skyfirstnetwork.firebasestorage.app',messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID||'34327270246',appId:import.meta.env.VITE_FIREBASE_APP_ID||'1:34327270246:web:3fa54fbdb2a3d1bf326ea7'};
export const isFirebaseConfigured=Boolean(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId);
let app:FirebaseApp|null=null; let auth:Auth|null=null;
if(isFirebaseConfigured){try{app=getApps().length?getApp():initializeApp(firebaseConfig);auth=getAuth(app);}catch(e){console.error('Không thể khởi tạo dịch vụ đăng nhập.',e)}}
export {app,auth};
// Compatibility marker: CMS is Cloudflare D1, not Firestore.
export const db=true;

async function authHeaders(){const h=new Headers({'content-type':'application/json'});if(auth?.currentUser){try{h.set('authorization',`Bearer ${await auth.currentUser.getIdToken()}`)}catch{}}return h;}
export function sanitizeForFirestore<T>(data:T):T{if(data==null)return data;if(Array.isArray(data))return data.map(sanitizeForFirestore) as unknown as T;if(typeof data==='object'){const o:any={};for(const[k,v]of Object.entries(data as any))if(v!==undefined)o[k]=sanitizeForFirestore(v);return o}return data;}
export async function syncDocumentToFirestore(collection:string,id:string,data:any){try{const r=await fetch('/api/cms',{method:'PUT',headers:await authHeaders(),body:JSON.stringify({collection,id,data:sanitizeForFirestore(data)}),cache:'no-store'});return r.ok}catch{return false}}
export async function deleteDocumentFromFirestore(collection:string,id:string){try{const r=await fetch(`/api/cms?collection=${encodeURIComponent(collection)}&id=${encodeURIComponent(id)}`,{method:'DELETE',headers:await authHeaders(),cache:'no-store'});return r.ok}catch{return false}}
export async function fetchCollectionFromFirestore<T>(collection:string):Promise<T[]>{try{const r=await fetch(`/api/cms?collection=${encodeURIComponent(collection)}`,{headers:await authHeaders(),cache:'no-store'});if(!r.ok)return[];const d=await r.json();return Array.isArray(d?.items)?d.items:[]}catch{return[]}}
export async function fetchDocumentFromFirestore<T>(collection:string,id:string):Promise<T|null>{try{const r=await fetch(`/api/cms?collection=${encodeURIComponent(collection)}&id=${encodeURIComponent(id)}`,{headers:await authHeaders(),cache:'no-store'});if(!r.ok)return null;const d=await r.json();return d?.item||null}catch{return null}}
export async function testFirestoreConnection(){try{const r=await fetch('/api/cms?collection=site_config&id=current',{cache:'no-store'});return r.ok?{ok:true,message:'Dịch vụ dữ liệu D1 hoạt động bình thường.'}:{ok:false,message:'Dịch vụ dữ liệu chưa sẵn sàng.'}}catch{return{ok:false,message:'Không thể kết nối dịch vụ dữ liệu.'}}}

export async function createInitialAdminAccount(email:string,password:string,displayName?:string):Promise<User>{if(!auth)throw new Error('Dịch vụ đăng nhập chưa sẵn sàng.');const r=await createUserWithEmailAndPassword(auth,email.trim(),password);if(displayName?.trim())await updateProfile(r.user,{displayName:displayName.trim()});return r.user}
export async function signInWithEmailPasswordReal(email:string,password:string){if(!auth)throw new Error('Dịch vụ đăng nhập chưa sẵn sàng.');return(await signInWithEmailAndPassword(auth,email.trim(),password)).user}
export async function logoutFirebase(){if(auth)await signOut(auth)}
export function subscribeToAuthChanges(cb:(u:User|null)=>void):Unsubscribe{if(!auth){cb(null);return()=>{}}return onAuthStateChanged(auth,cb)}
export async function getBootstrapStatus(){try{const r=await fetch('/api/admin-auth/bootstrap',{cache:'no-store'});if(!r.ok)return true;return Boolean((await r.json())?.completed)}catch{return true}}
async function d1AdminRequest(path:string,user:User,init:RequestInit={}){const h=new Headers(init.headers||{});h.set('authorization',`Bearer ${await user.getIdToken(true)}`);if(init.body)h.set('content-type','application/json');const r=await fetch(path,{...init,headers:h,cache:'no-store'});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||'Không thể kết nối dịch vụ quản trị.');return d}
export async function bootstrapFirstAdmin(user:User,name:string){return(await d1AdminRequest('/api/admin-auth/bootstrap',user,{method:'POST',body:JSON.stringify({name})})).user}
export async function bootstrapNewFirstAdmin(user:User,name:string){try{return await bootstrapFirstAdmin(user,name)}catch(e){try{await deleteUser(user)}catch{}throw e}}
export async function activateInvitedAdmin(){throw new Error('Kích hoạt tài khoản mới đã được tắt. Liên hệ quản trị hệ thống.')}
export async function getAdminProfile(_uid:string){if(!auth?.currentUser)return null;return(await d1AdminRequest('/api/admin-auth/profile',auth.currentUser)).user||null}

async function currentAdminApi(path:string,init:RequestInit={}){if(!auth?.currentUser)throw new Error('Phiên quản trị đã hết hạn.');const h=new Headers(init.headers||{});h.set('authorization',`Bearer ${await auth.currentUser.getIdToken(true)}`);if(init.body)h.set('content-type','application/json');const r=await fetch(path,{...init,headers:h,cache:'no-store'});const text=await r.text();let d:any={};try{d=text?JSON.parse(text):{}}catch{}if(!r.ok||d?.ok===false){if(d?.error)throw new Error(String(d.error));if(r.status===404)throw new Error('Chức năng quản trị chưa được triển khai đúng trên máy chủ.');if(r.status===403)throw new Error('Tài khoản hiện tại không có quyền thực hiện thao tác này.');throw new Error(`Máy chủ chưa xử lý được yêu cầu (mã ${r.status}).`)}return d}
export async function listAdminAccounts(){return(await currentAdminApi('/api/admin-users')).items||[]}
export async function createAdminAccount(input:{email:string;password:string;name:string;role:string;status:string;note?:string}){return(await currentAdminApi('/api/admin-users',{method:'POST',body:JSON.stringify(input)})).user}
export async function updateAdminAccount(uid:string,input:any){return currentAdminApi('/api/admin-users',{method:'PATCH',body:JSON.stringify({uid,...input})})}
export async function deleteAdminAccount(uid:string){return currentAdminApi(`/api/admin-users?uid=${encodeURIComponent(uid)}`,{method:'DELETE'})}
export async function resetAdminPassword(uid:string,password:string){return currentAdminApi('/api/admin-users/password',{method:'POST',body:JSON.stringify({uid,password})})}
