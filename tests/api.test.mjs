import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {onRequest} from '../functions/api/[[path]].js';
const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));const env={ADMIN_PASSWORD_HASH:createHash('sha256').update('test-password-only').digest('hex'),SESSION_SECRET:'test-session-secret-not-production',DB:{prepare(sql){return{bind(...args){return{async first(){return db.prepare(sql).get(...args)},async run(){return db.prepare(sql).run(...args)},async all(){return{results:db.prepare(sql).all(...args)}}}},async all(){return{results:db.prepare(sql).all()}}}}}};
let ip=0;async function call(path,body,cookie='',origin='https://alimiran.pages.dev'){return onRequest({env,request:new Request('https://alimiran.pages.dev/api/'+path,{method:body?'POST':'GET',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie,'CF-Connecting-IP':String(ip++)},...(body?{body:JSON.stringify(body)}:{})})});}
assert.equal((await call('registrations')).status,401);
assert.equal((await call('registrations',{child:'Deneme Çocuk'})).status,400);
const sample={child:'Deneme Çocuk',mother:'Deneme Anne',phone:'0555 000 00 00',consent:true};
assert.equal((await call('registrations',sample,'','https://other.example')).status,403);
assert.equal((await call('registrations',{...sample,phone:'123'})).status,400);
assert.equal((await call('registrations',{...sample,consent:false})).status,400);
assert.equal((await call('registrations',sample)).status,200);
assert.equal((await call('registrations',sample)).status,200);assert.equal(db.prepare('SELECT count(*) n FROM registrations').get().n,1);
assert.equal((await call('login',{password:'wrong'})).status,401);
const login=await call('login',{password:'test-password-only'});assert.equal(login.status,200);const cookie=login.headers.get('Set-Cookie');assert.match(cookie,/HttpOnly; Secure; SameSite=Strict/);
const list=await call('registrations',null,cookie);assert.equal(list.status,200);assert.equal((await list.json()).records[0].mother,'Deneme Anne');
assert.equal((await call('registrations',null,'admin=9999999999999.bad')).status,401);
assert.match((await call('logout',{},cookie)).headers.get('Set-Cookie'),/Max-Age=0/);
console.log('12 API/security assertions passed; test database is in memory only.');
