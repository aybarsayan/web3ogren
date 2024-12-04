---
title: 2.xten 3.0a Geçiş
seoTitle: Socket.IO 2.xten 3.0a Geçiş Rehberi
sidebar_position: 1
description: Bu belge, Socket.IO kütüphanesinin 2.x versiyonundan 3.0 versiyonuna geçiş yaparken dikkate almanız gereken önemli değişiklikleri ve bilgilere ulaşmanıza yardımcı olmayı amaçlamaktadır.
tags: 
  - Socket.IO
  - Geçiş
  - API Değişiklikleri
  - CORS
  - Yapılandırma
keywords: 
  - socket.io
  - 2.x
  - 3.0
  - geçiş
  - api değişiklikleri
---
Bu sürüm, Socket.IO kütüphanesinin çoğu tutarsızlığını düzeltmeli ve son kullanıcılar için daha sezgisel bir davranış sağlamalıdır. Bu, yıllar boyunca topluluk geri bildirimlerinin bir sonucudur. Yer alan herkese büyük teşekkürler!

**TL;DR:** ~~birçok kırıcı değişiklik nedeniyle, v2 istemcisi bir v3 sunucusuna (ve tersine) bağlanamayacaktır~~

:::info
Güncelleme: `Socket.IO 3.1.0` itibarıyla, v3 sunucusu şimdi v2 istemcileriyle iletişim kurabiliyor. Daha fazla bilgi `aşağıda`. Ancak, v3 istemcisi hâlâ bir v2 sunucusuna bağlanamayacaktır.
:::

Daha düşük seviyeli detaylar için lütfen şunlara bakın:

- [Engine.IO protokolü v4](https://github.com/socketio/engine.io-protocol#difference-between-v3-and-v4)
- [Socket.IO protokolü v5](https://github.com/socketio/socket.io-protocol#difference-between-v5-and-v4)

İşte değişikliklerin tam listesi:

- `Yapılandırma`
  - `Daha mantıklı varsayılan değerler`
  - `CORS yönetimi`
  - `Varsayılan olarak artık çerez yok`
- `API değişikliği`
  - `io.set() kaldırıldı`
  - `Varsayılan ad alana artık örtük bağlantı yok`
  - `Namespace.connected Namespace.sockets olarak yeniden adlandırıldı ve artık bir Map`
  - `Socket.rooms artık bir Set`
  - `Socket.binary() kaldırıldı`
  - `Socket.join() ve Socket.leave() artık senkron`
  - `Socket.use() kaldırıldı`
  - `Bir ara katman hatası artık bir Error nesnesi yayar`
  - `Yönetici sorgu seçeneği ve Socket sorgu seçeneği arasında net bir ayrım eklenmesi`
  - `Socket örneği artık yöneticisi tarafından yayımlanan olayları iletmez`
  - `Namespace.clients() Namespace.allSockets() olarak yeniden adlandırıldı ve artık bir Promise döner`
  - `İstemci paketleri`
  - `Artık gecikmeyi almak için "pong" olayı yok`
  - `ES modülleri sözdizimi`
- `Yeni özellikler`
  - `Catch-all dinleyicileri`
  - `Volatile olaylar (istemci)`
  - `msgpack ayrıştırıcı ile resmi paket`
- `Diğer`
  - `Socket.IO kod tabanı TypeScript'e yeniden yazıldı`
  - `IE8 ve Node.js 8 desteği resmi olarak kaldırıldı`

- `Mevcut bir üretim dağıtımını nasıl yükseltirsiniz`
- `Bilinen geçiş sorunları`