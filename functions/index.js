const {onRequest}=require('firebase-functions/v2/https');
const {defineSecret}=require('firebase-functions/params');
const admin=require('firebase-admin');
admin.initializeApp(); const db=admin.firestore();
const CERT_API_SECRET=defineSecret('CERT_API_SECRET');
const safe=s=>String(s||'').trim();
exports.certificateApi=onRequest({cors:true,secrets:[CERT_API_SECRET]},async(req,res)=>{
 try{
  if(req.method==='GET'){
   const code=safe(req.query.code).toUpperCase(); if(!code)return res.status(400).json({ok:false,error:'missing_code'});
   const snap=await db.collection('certificates').where('code','==',code).limit(1).get(); if(snap.empty)return res.status(404).json({ok:false,status:'not_found'});
   const d=snap.docs[0].data(); return res.json({ok:true,certificate:{code:d.code,recipientName:d.recipientName||d.full_name||'',title:d.title||d.programTitle||d.content||'',issuer:d.issuer||d.source||'',issueDate:d.issueDate||d.issued_at||'',expiryDate:d.expiryDate||'',status:d.status||'valid',source:d.source||''}});
  }
  if(req.method!=='POST')return res.status(405).end();
  if(req.get('x-sfn-cert-secret')!==CERT_API_SECRET.value())return res.status(401).json({ok:false,error:'unauthorized'});
  const {action='issued',source,certificate={}}=req.body||{}; const code=safe(certificate.code).toUpperCase(); const sourceId=safe(certificate.source_id||certificate.sourceId); if(!source||!code||!sourceId)return res.status(400).json({ok:false,error:'missing_fields'});
  const idem=`${source}:${sourceId}`; const idemRef=db.collection('certificate_source_ids').doc(Buffer.from(idem).toString('base64url'));
  const result=await db.runTransaction(async tx=>{
   const idemDoc=await tx.get(idemRef); if(idemDoc.exists){const ref=db.collection('certificates').doc(idemDoc.data().certificateId);return {id:ref.id,data:(await tx.get(ref)).data(),duplicate:true};}
   const q=await db.collection('certificates').where('code','==',code).limit(1).get(); if(!q.empty)throw Object.assign(new Error('duplicate_code'),{status:409});
   const ref=db.collection('certificates').doc(); const data={...certificate,code,source,source_id:sourceId,status:action==='revoked'?'revoked':(certificate.status||'valid'),centralLocked:action==='revoked',updatedAt:admin.firestore.FieldValue.serverTimestamp(),createdAt:admin.firestore.FieldValue.serverTimestamp()}; tx.set(ref,data);tx.set(idemRef,{certificateId:ref.id,source,sourceId});return {id:ref.id,data,duplicate:false};
  }); return res.json({ok:true,...result});
 }catch(e){return res.status(e.status||500).json({ok:false,error:e.message||'server_error'});}
});
