---
title: 'Koa ile Önbellekleme Nasıl Uygulanır'
sidebarTitle: 'Koa ile Önbellekleme'
parent: 'Önbellekleme'
description: Koa ile önbelleklemenin nasıl uygulanacağını keşfedin. Bu içerik, Koa'nın temellerinden başlayarak önbellek sistemi kurulumu ve kullanımı ile ilgili detaylar sunmaktadır.
keywords: [Koa, önbellekleme, Cacheable, Keyv, performans, web uygulamaları, API]
---

# Koa ile Önbellekleme Nasıl Uygulanır

## Koa Nedir?
Koa, Express ekibi tarafından geliştirilen bir web çerçevesidir ve API'ler ile web uygulamaları için daha küçük, daha ifade edici ve daha sağlam bir temel sunar. 

> **"Koa'nın asenkron fonksiyon kullanımı, geri çağrılara olan ihtiyacı ortadan kaldırır ve hata yönetimini artırır."**  
— Koa Dokümantasyonu

Bir Koa Bağlamı, bir node isteği ve yanıt nesnesini tek bir nesnede birleştirerek API'ler ve web uygulamaları yazmak için birçok yararlı yöntem sağlar.

## Önbellek Nedir?
Önbellek, bir veri alt kümesini depolayan kısa süreli, yüksek hızlı bir veri depolama katmanıdır ve bu sayede ana depolama konumundan daha hızlı bir şekilde erişim sağlanır. Önbellekleme, daha önce alınan verileri verimli bir şekilde tekrar kullanmanıza olanak tanır.

:::info
Önbellekleme, özellikle yüksek trafikli uygulamalarda performansı artırarak yanıt sürelerini önemli ölçüde azaltır.
:::

## Keyv ile Önbellek Desteği ve Cacheable

Önbellekleme uygulamak için [Cacheable](https://npmjs.org/package/cacheable) kullanarak Keyv'i kullanabiliriz. Cacheable, Keyv üzerine inşa edilmiş yüksek performanslı bir katman 1 / katman 2 önbellek çerçevesidir. Birden fazla depolama arka ucu destekler ve önbellekleme için basit, tutarlı bir API sunar.

### Örnek - Koa Kullanarak Önbellek Desteği Ekleyin

```js
import Koa from 'koa';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

// varsayılan olarak katman 1 önbelleği bellektedir. Katman 2 önbelleği eklemek istiyorsanız, KeyvRedis'i kullanabilirsiniz
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary, ttl: '4h' }); // varsayılan süre 4 saat olarak ayarlandı

const app = new Koa();

app.use(async ctx => {
    // bu yanıt `true` dönerse zaten önbelleğe alınmıştır,
    // bu nedenle bu ara yazılım otomatik olarak bu yanıtı önbellekten sunacaktır
    if (await cache.get(ctx.url)) {
        return cache.get(ctx.url);
    }

    // yanıt gövdesini burada ayarlayın
    ctx.body = 'merhaba dünya!';
    // yanıtı önbelleğe al
    await cache.set(ctx.url, ctx.body. cacheTTL);
});
```

:::tip
Koa ile önbellekleme uygularken, önbelleğin süresini doğru bir şekilde ayarlamak önemlidir. Optimal süreyi belirlemek için uygulamanızın kullanım senaryolarını değerlendirin.
:::
