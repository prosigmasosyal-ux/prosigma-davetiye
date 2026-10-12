(function(root){
 const cell=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
 root.InviteExport={csv(rows){const values=[['Çocuğun adı','Annesinin adı','Cep telefonu','Kayıt tarihi (Türkiye)'],...rows.map(r=>[r.child,r.mother,'+'+r.phone,new Date(r.created).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'})])];return '\ufeff'+values.map(row=>row.map(cell).join(';')).join('\r\n');}};
})(typeof window==='undefined'?globalThis:window);
