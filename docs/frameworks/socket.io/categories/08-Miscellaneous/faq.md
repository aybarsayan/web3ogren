---
title: SSS
seoTitle: Socket.IO SSS - Sıkça Sorulan Sorular
sidebar_position: 1
description: Bu bölümde, Socket.IO ile ilgili sıkça sorulan soruları ve yanıtlarını bulacaksınız. Sorun gidermeden, WebSocket ve WebTransporta kadar çeşitli konular ele alınmaktadır.
tags: 
  - Socket.IO
  - WebSocket
  - WebTransport
  - Geliştirme
keywords: 
  - Socket.IO
  - WebSocket
  - WebTransport
  - Geliştirme
---

Here is a list of common questions about Socket.IO:



## Bir şey düzgün çalışmıyor, lütfen yardım edin?

Lütfen `Sorun Giderme kılavuzunu` kontrol edin.

## Arkada nasıl çalışıyor?

Socket.IO bağlantısı, farklı düşük seviyeli taşıma yöntemleri ile kurulabilir:

- HTTP uzun süreli anket
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API)

Socket.IO, en iyi mevcut seçeneği otomatik olarak seçecektir, buna bağlı olarak:

- tarayıcının yetenekleri (bakınız [burada](https://caniuse.com/websockets) ve [burada](https://caniuse.com/webtransport))
- ağ (bazı ağlar WebSocket ve/veya WebTransport bağlantılarını engeller)

Bununla ilgili daha fazla detayı `"Nasıl çalıştığı" bölümünde` bulabilirsiniz.

## Socket.IO'nun WebSocket üzerinde sağladığı özellikler nelerdir?

> WebSocket'lar harika! Gerçekten. Müşteri ve sunucu arasında veri aktarımı için verimli bir yol sağlarlar. Avantajlarından bazıları:
> 
> - sunucudan veri almak için periyodik anket yapmaya ihtiyaç duymazsınız
> - verileri sunucuya göndermek için tüm HTTP başlıklarını tekrar tekrar göndermeniz gerekmez
> 
> Bu da onları oyunlar, sohbetler, işbirlikçi çözümler gibi düşük gecikme süresine ve veri yoğun uygulamalar için mükemmel hale getirir...

Bununla birlikte, WebSocket'lar da oldukça düşük seviyelidir ve gerçek zamanlı uygulamalar geliştirmek sıklıkla onların üzerine ek bir katman gerektirir:

- WebSocket bağlantısı kurulamazsa, HTTP uzun süreli anket yöntemine geçiş
- WebSocket bağlantısı kapandığında otomatik yeniden bağlantı
- bazı verileri göndermek ve karşı taraftan yanıt almak için onaylar
- tüm bağlı istemcilere veya bir alt kümesine yayın yapma
- sunucu örneklerini çoğaltma
- kısa süreli bağlantı kesilmesi için bağlantı kurtarma

Tahmin edebileceğiniz gibi, bu ek katman Socket.IO kütüphanesi tarafından uygulanmaktadır.

## WebTransport nedir?

Kısacası, WebTransport WebSocket'a alternatif bir yöntemdir ve WebSocket'ları etkileyen [baş sıra engellemesi](https://en.wikipedia.org/wiki/Head-of-line_blocking) gibi çeşitli performans sorunlarını çözer.

Bu yeni web API'si hakkında daha fazla bilgi isterseniz (Ocak 2022'de Chrome'a ve Haziran 2023'te Firefox'a dahil edildi), lütfen bu bağlantılara göz atın:

- https://w3c.github.io/webtransport/
- https://developer.mozilla.org/en-US/docs/Web/API/WebTransport
- https://developer.chrome.com/articles/webtransport/

:::note
Socket.IO'da WebTransport desteği varsayılan olarak etkin değildir, çünkü güvenli bir bağlam (HTTPS) gerektirir. WebTransport ile oynamak istiyorsanız lütfen `özgü eğitimi` kontrol edin.
:::

## Socket.IO mesajları saklar mı?

Socket.IO sunucusu herhangi bir mesaj saklamaz.

Bağlı olmayan istemciler için bu mesajları *bir yere* kalıcı olarak saklamak uygulamanızın sorumluluğundadır.

:::tip
Bununla birlikte, Socket.IO, `Bağlantı durumu kurtarma özelliğini` etkinleştirirseniz mesajları kısa bir süre saklayacaktır.
:::

## Socket.IO'nun teslimat garantileri nelerdir?

Socket.IO **mesaj sıralamasını garanti eder**, hangi düşük seviyeli taşıma yöntemi kullanıldığına bakılmaksızın (iki taşıma arasında geçiş yapıldığında bile).

Ayrıca, varsayılan olarak Socket.IO, **en fazla bir kez** teslimat garantisi sağlar (aynı zamanda "gönder ve unut" olarak da bilinir), bu da belirli koşullar altında bir mesajın kaybolabileceği ve tekrar deneme yapılmayacağı anlamına gelir.

Daha fazla bilgi `burada` bulunmaktadır.

## Belirli bir kullanıcıyı nasıl tanımlayabilirim?

Socket.IO'da kullanıcı kavramı yoktur.

Verilen bir Socket.IO bağlantısını bir kullanıcı hesabına bağlamak uygulamanızın sorumluluğundadır.

Node.js uygulamaları için örneğin:

- [Passport](https://www.passportjs.org/) tarafından sağlanan kullanıcı bağlamını yeniden kullanabilirsiniz (bu `eğitime` göz atın)
- veya istemci tarafında kullanıcı kimlik bilgilerini göndermek ve bunları `middleware` içinde doğrulamak için `auth` seçeneğini kullanabilirsiniz.

## Değişiklik günlüğünü nerede bulabilirim?

Lütfen `buraya` bakın.