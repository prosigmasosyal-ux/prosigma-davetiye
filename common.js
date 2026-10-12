/* Shared validation; no credentials or server-side writes in the browser. */
(function(root){
'use strict';
const text=(s,n)=>typeof s==='string'?s.trim().slice(0,n):'';
function normalize(c){
 if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Davetiye verisi geçersiz.');
 const date=text(c.date,10),time=text(c.time,5),d=new Date(date+'T12:00:00Z');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==date)throw Error('Geçerli bir tarih seçin.');
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw Error('Geçerli bir saat seçin.');
 const age=Number(c.age);if(!Number.isInteger(age)||age<1||age>120)throw Error('Yaş 1–120 arasında olmalı.');
 let phone=text(c.phone,25).replace(/[\s()+-]/g,'');if(phone&& !/^[1-9]\d{7,14}$/.test(phone))throw Error('WhatsApp numarasını ülke koduyla yazın: 905…');
 let photo=text(c.photo,1500);if(photo){let u;try{u=new URL(photo)}catch{throw Error('Fotoğraf için geçerli HTTPS adresi yazın.')};if(u.protocol!=='https:'||u.username||u.password)throw Error('Fotoğraf adresi HTTPS olmalı.');photo=u.href;}
 const name=text(c.name,60),venue=text(c.venue,120);if(!name||!venue)throw Error('İsim ve mekân alanlarını doldurun.');
 const schedule=(Array.isArray(c.schedule)?c.schedule:[]).slice(0,8).map(s=>({time:text(s.time,5),title:text(s.title,80),detail:text(s.detail,140)}));
 if(schedule.some(s=>!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time)||!s.title))throw Error('Program satırlarında saat ve başlık olmalı.');
 return {name,age,date,time,venue,address:text(c.address,180),message:text(c.message,350),dress:text(c.dress,160),phone,photo,schedule};
}
function encode(c){const bytes=new TextEncoder().encode(JSON.stringify(normalize(c)));let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function decode(s){if(!/^[\w-]+$/.test(s)||s.length>16000)throw Error('Davetiye bağlantısı geçersiz.');return normalize(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)))));}
function invitationURL(c){const u=new URL('index.html',location.href);u.hash='v='+encode(c);return u.href;}
function escapeICS(s){return s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function calendar(c){c=normalize(c);const start=new Date(c.date+'T'+c.time+':00+03:00');const end=new Date(start.getTime()+3*3600000);const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//PROSIGMA//Davet//TR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+c.date+'-'+c.time.replace(':','')+'-'+encodeURIComponent(c.name)+'@prosigma-davetiye','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+escapeICS(c.name+' · '+c.age+' yaş partisi'),'LOCATION:'+escapeICS(c.venue+', '+c.address),'DESCRIPTION:'+escapeICS(c.message),'END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';}
const api={normalize,encode,decode,invitationURL,calendar};if(typeof module!=='undefined')module.exports=api;else root.Invite=api;
})(typeof window==='undefined'?{}:window);
