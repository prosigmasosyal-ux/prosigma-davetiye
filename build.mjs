import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const f of ['index.html','style.css','common.js','app.js','config.json','editor.html','editor.js','editor.css','katilim.html','katilim.js','forms.css','yonetim.html','yonetim.js','_headers'])await copyFile(f,'dist/'+f);
await cp('assets','dist/assets',{recursive:true});
