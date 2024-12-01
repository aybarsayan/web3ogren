---
description: Arka uç uygulamaları oluşturmak için modern modüllerin ve ara katmanların bir listesi.
keywords: [backend, middleware, web uygulamaları, Node.js, şablon motoru, günlük kayıt, CSRF]
---

# Ara Katmanı

Web uygulamaları geliştirirken, genelde bir web çerçevesi yeterli değildir. Aşağıda arka uç uygulamaları oluşturmak için modern modüllerin ve ara katmanların bir listesi bulunmaktadır.

## Statik sunucu

- [sirv](https://github.com/lukeed/sirv) - Statik dosyaları sunmak için optimize edilmiş ara katman ve CLI uygulaması.

## Şablon motoru

- [Eta](https://eta.js.org/) - Node, Deno ve tarayıcı için gömülü JS şablon motoru. Hafif, hızlı ve eklentili. TypeScript ile yazılmıştır.
- [Edge.js](https://github.com/edge-js/edge) - Fresh air ile Node.js şablon motoru.
- [micromustache](https://github.com/userpixel/micromustache) - JavaScript için {{mustache}} şablon motorunun son derece hızlı ve küçük alt uygulaması.
- [Squirelly](https://github.com/squirrellyjs/squirrelly) - Yardımcılar, filtreler, kısımlar ve şablon kalıtımını destekleyen yarı gömülü JS şablon motoru. 4KB minziplenmiş, TypeScript ile yazılmıştır.
- [sprightly](https://github.com/obadakhalili/sprightly) - Çok hafif JS şablon motoru.

:::tip
**İpucu:** Şablon motorunu seçerken, projenizin gereksinimlerine uygun özellikleri göz önünde bulundurun.
:::

## Günlük kayıt

- [@tinyhttp/logger](https://github.com/tinyhttp/logger) - Tinyhttp için basit HTTP günlük kaydedici.
- [Pino HTTP](https://github.com/pinojs/pino-http) - Node.js için yüksek hızlı HTTP günlük kaydedici.
- [chrona](https://github.com/xambassador/chrona) - express.js için bir koa-logger'dan ilham alınarak yazılmış basit HTTP istek günlük kaydedici ara katmanı.

## Oturum

- [micro-session](https://github.com/meyer9/micro-session) - Micro için oturum ara katmanı.
- [next-session](https://github.com/hoangvvo/next-session) - Next.js, micro, Express ve daha fazlası için basit promise tabanlı oturum ara katmanı.
- [iron-session](https://github.com/vvo/iron-session) - Verileri depolamak için imzalı ve şifrelenmiş çerezler kullanan Next.js durum yönetim yardımcı aracı. Ayrıca Express ve Node.js HTTP sunucuları ile de çalışır.

:::info
**Not:** Oturum yönetimi için en iyi uygulamaları uygulayarak, uygulamanızın güvenliğini artırabilirsiniz.
:::

## CSRF

- [malibu](https://github.com/tinyhttp/malibu) - Modern Node.js için çerçeve bağımsız CSRF ara katmanı.

## Gövde ayrıştırıcı

- [milliparsec](https://github.com/tinyhttp/milliparsec) - Evrenin en küçük gövde ayrıştırıcısı. Modern Node.js için inşa edilmiştir.

## Çerezler

- [cookie-parser](https://github.com/tinyhttp/cookie-parser) - Node.js için çerez ayrıştırma ara katmanı.

## Metrikler

- [ping](https://github.com/tinyhttp/ping) - Yanıt süresi kontrolü yapan ara katman.

## CORS

- [cors](https://github.com/tinyhttp/cors) - Modern Node.js için CORS ara katmanı.

## Swagger

- [swagger](https://github.com/tinyhttp/swagger) - Tinyhttp için Swagger entegrasyonu.

## Diğerleri

- [unless](https://github.com/tinyhttp/unless) - Tinyhttp için unless ara katmanı.