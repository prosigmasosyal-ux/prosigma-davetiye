# Ali Miran davetiyesi

Canlı adres: https://alimiran.aktar-drive.workers.dev/
Yönetim: https://alimiran.aktar-drive.workers.dev/yonetim.html
Düzenleyici: https://alimiran.aktar-drive.workers.dev/editor.html

Cloudflare Pages + D1. Kaynak GitHub'da, kayıtlar yalnızca D1'da bulunur. GitHub Pages eski adresi yeni adrese yönlendirir.

Katılım formunda çocuk adı, anne adı, Türkiye cep telefonu ve veli onayı zorunludur. Sunucu doğrulaması, sorgu parametreleme, aynı çocuk/telefon için tekrar kayıt engeli, IP özetiyle istek sınırlama, yönetici şifresi özeti ve HttpOnly/Secure/SameSite oturum çerezi bulunur. Telefon doğrulama SMS'i yoktur; numara biçimi kontrol edilir. QR kullanılmaz.

Yönetici sırları Pages secrets içindedir, kaynakta bulunmaz. Yerel giriş dosyası repo dışında saklanır. Yayına yalnızca build.mjs izin listesindeki dosyalar çıkar; şema ve testler statik sunulmaz. D1 kayıtları etkinlik sonrasında sahibi tarafından silinmelidir.

Bilgiler config.json'dan yüklenir. Editör #v bağlantıları üretir; bu kişisel bağlantılar sabittir, düzenlemeden sonra yeni bağlantı paylaşılır. Katılım kayıtları bu tek Ali Miran etkinliğine aittir.

Yaş, tarih ve mekân kullanıcı tarafından henüz teyit edilmemiş referans örnekleridir. Kayıt açmadan önce kontrol edin.

Geliştirme: node build.mjs; node tests/api.test.mjs. Yayın: wrangler pages deploy dist --project-name alimiran --branch main.

Tabler Icons (MIT), lisans assets/icons/LICENSE. Görseller kullanıcı fotoğrafları ve referans yönlendirmesiyle üretilmiş çizgi roman dekorlarıdır.
