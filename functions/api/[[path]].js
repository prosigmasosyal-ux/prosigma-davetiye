const enc=new TextEncoder();
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
async function key(secret){return crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function sign(s,secret){return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret),enc.encode(s))),b=>b.toString(16).padStart(2,'0')).join('');}
async function session(req,env){const value=(req.headers.get('Cookie')||'').match(/(?:^|;\s*)admin=([^;]+)/)?.[1]||'';const [exp,sig]=value.split('.');if(!/^\d+$/.test(exp)||!sig||!/^([a-f0-9]{64})$/.test(sig)||Number(exp)<Date.now()||Number(exp)>Date.now()+9*3600000)return false;return crypto.subtle.verify('HMAC',await key(env.SESSION_SECRET),Uint8Array.from(sig.match(/../g),x=>parseInt(x,16)),enc.encode(exp));}
async function limited(req,env,type,max){const now=Date.now(),bucket=Math.floor(now/900000);const id=await hash(env.SESSION_SECRET+':'+(req.headers.get('CF-Connecting-IP')||'local')+':'+type+':'+bucket);const row=await env.DB.prepare('INSERT INTO limits(key,n,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET n=n+1 RETURNING n').bind(id,now+900000).first();await env.DB.prepare('DELETE FROM limits WHERE expires < ?').bind(now).run();return row.n>max;}
export async function onRequest({request:req,env}){try{
 const path=new URL(req.url).pathname,method=req.method;
 if(!env.DB||!env.SESSION_SECRET||!env.ADMIN_PASSWORD_HASH)return json({error:'Kayıt sistemi hazırlanıyor. Lütfen biraz sonra tekrar deneyin.'},503);
 if(method==='POST'){
  if(req.headers.get('Origin')!==new URL(req.url).origin)return json({error:'Geçersiz kaynak.'},403);
  if(!req.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Geçersiz istek.'},415);
  if(Number(req.headers.get('Content-Length')||0)>4096)return json({error:'İstek çok büyük.'},413);
 }
 if(path==='/api/login'&&method==='POST'){
  if(await limited(req,env,'login',5))return json({error:'Çok fazla deneme. 15 dakika sonra tekrar deneyin.'},429);
  const raw=await req.text();if(raw.length>4096)return json({error:'İstek çok büyük.'},413);const b=JSON.parse(raw);
  const supplied=await hash(String(b.password||''));let diff=0;for(let i=0;i<64;i++)diff|=supplied.charCodeAt(i)^env.ADMIN_PASSWORD_HASH.charCodeAt(i);
  if(diff)return json({error:'Şifre hatalı.'},401);
  const exp=String(Date.now()+8*3600000),token=exp+'.'+await sign(exp,env.SESSION_SECRET);
  return json({ok:true},200,{'Set-Cookie':'admin='+token+'; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800'});
 }
 if(path==='/api/logout'&&method==='POST')return json({ok:true},200,{'Set-Cookie':'admin=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0'});
 if(path==='/api/registrations'&&method==='GET'){
  if(!await session(req,env))return json({error:'Giriş gerekli.'},401);
  const {results}=await env.DB.prepare('SELECT id,child,mother,phone,created FROM registrations ORDER BY created DESC LIMIT 2000').all();return json({records:results});
 }
 if(path==='/api/registrations'&&method==='POST'){
  if(await limited(req,env,'register',12))return json({error:'Çok fazla deneme. 15 dakika sonra tekrar deneyin.'},429);
  const raw=await req.text();if(raw.length>4096)return json({error:'İstek çok büyük.'},413);const b=JSON.parse(raw);
  const child=typeof b.child==='string'?b.child.trim().replace(/\s+/g,' '):'',mother=typeof b.mother==='string'?b.mother.trim().replace(/\s+/g,' '):'';
  let phone=typeof b.phone==='string'?b.phone.replace(/[\s()+-]/g,''):'';if(phone.startsWith('0090'))phone=phone.slice(2);if(/^05\d{9}$/.test(phone))phone='9'+phone;else if(/^5\d{9}$/.test(phone))phone='90'+phone;
  if(!/^[\p{L}\p{M} .’'\-]{2,80}$/u.test(child)||!/^[\p{L}\p{M} .’'\-]{2,80}$/u.test(mother)||!/^905\d{9}$/.test(phone)||b.consent!==true)return json({error:'Çocuğun adını, annenin adını ve geçerli Türkiye cep telefonunu girip bilgilendirmeyi onaylayın.'},400);
  if(b.website)return json({error:'Kayıt doğrulanamadı.'},400);
  await env.DB.prepare('INSERT INTO registrations(id,child,mother,phone,created) VALUES(?,?,?,?,?) ON CONFLICT(child,phone) DO NOTHING').bind(crypto.randomUUID(),child,mother,phone,Date.now()).run();
  return json({ok:true,message:'Katılım kaydınız alındı. Sizi bekliyoruz!'});
 }
 return json({error:'Bulunamadı.'},404);
 }catch{return json({error:'İşlem tamamlanamadı. Lütfen tekrar deneyin.'},500);}}
