# PROSİGMA — Ali Miran dijital davetiyesi

Statik, mobil uyumlu, GitHub Pages üzerinde çalışan davetiye. Sunucu hesabı veya ücretli servis gerektirmez.

- `index.html`: davetlilere paylaşılacak sayfa; ana bilgiler `config.json` dosyasından gelir.
- `editor.html`: isim, yaş, tarih, Türkiye saati, mekân, program, mesaj, fotoğraf URL’si ve WhatsApp düzenleme ekranı.
- Düzenleyici yeni, kendi verisini taşıyan `#v=…` bağlantısı oluşturur. Eski kişisel bağlantılar değişmez. Yeni bilgileri paylaşmak için yeni bağlantıyı gönderin.
- Ana kısa adresi aynı tutarak değiştirmek için GitHub'da `config.json` güncellenir. Editör bu dosyayı indirebilir; GitHub hesabına erişim anahtarı tarayıcıda tutulmaz.
- Taslak yalnızca kullanılan tarayıcının localStorage alanında kalır. Düzenleyici herkese açık olsa da başkaları sizin GitHub dosyanızı değiştiremez; kendi linklerini oluşturabilir.
- Bilgiler link içinde şifrelenmeden bulunur; gizli/veri kasası değildir. Noindex talebi gizlilik veya erişim kontrolü değildir.
- Katılım WhatsApp’a hazır mesaj açar; mesajı kullanıcı gönderir. Sunucuda davetli listesi tutulmaz. Numara boşsa herhangi bir yere gönderim yapılmaz.
- Takvim dosyası Türkiye saati (UTC+3), üç saatlik etkinlik olarak üretilir.
- Varsayılan isim Ali Miran. Kullanıcı sadece isim verdiği için 8 yaş, 17 Ekim 2026 18.00, Escape Cafe/Antares AVM bilgileri referanstan alınmış düzenlenebilir örnektir. Gerçek bilgiler paylaşmadan önce kontrol edilmelidir.

Sayfa yapısı: fotoğraflı kapak, parti detayları/anılar, QR kodlu katılım ve etkinlik programı. Masaüstünde dört panel yan yana, telefonda sırayla alt alta görünür.

Görseller: üretilmiş çizgi roman şehir arka planı ve kullanıcının sağladığı Ali Miran fotoğrafları. Kapak için fotoğrafın arka planı kaldırıldı. Dış font/CDN/analitik yok.

QR: qrcode-generator 2.0.4 (Kazuhiko Arase, MIT), yerel assets/qrcode.js içinde lisans bildirimi korunmuştur. Numara varsa WhatsApp, yoksa davetiye bağlantısı kodlanır.
