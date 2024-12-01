---
title: 'Fastify ile Önbellek Uygulama Yöntemleri'
sidebarTitle: 'Fastify ile Önbellek'
parent: 'Önbellek'
description: Bu döküman, Fastify ile önbellekleme yöntemlerini açıklamaktadır. Ayrıca, Keyv kullanarak önbellek desteği eklemeyi ve örnek bir uygulamayı içermektedir.
keywords: [Fastify, önbellek, Keyv, caching, web çerçevesi, performans, geliştirme]
---

# Fastify ile Önbellek Uygulama Yöntemleri

## Fastify Nedir?
Fastify, minimum yük ile güçlü bir eklenti tabanlı geliştirici deneyimi sunan bir web çerçevesidir (Hapi ve Express'ten esinlenmiştir) ve saniyede 30.000 isteğe kadar hizmet verebilen en hızlı çerçevelerden biridir. *Fastify*, kancalar, eklentiler ve dekoratörler aracılığıyla tamamen genişletilebilir. Şemaya dayalı olduğundan, Fastify şemaları çok verimli bir şekilde derler. Büyüyen TypeScript topluluğunu desteklemek için bir TypeScript tür bildirim dosyası da korunmaktadır.

## Önbellek Nedir?
Önbellek, verilerin bir alt kümesini saklayan kısa vadeli, yüksek hızlı bir veri depolama katmanıdır; bu sayede veriye, birincil depolama konumundan daha hızlı erişim sağlanır. Önbellekleme, daha önce alınan verileri verimli bir şekilde yeniden kullanmanıza olanak tanır.

## Keyv'de Cacheable Aracılığıyla Önbellek Desteği

Önbellekleme için Keyv kullanarak [Cacheable](https://npmjs.org/package/cacheable) uygulayabiliriz; bu, Keyv üzerine inşa edilmiş yüksek performanslı bir katman 1 / katman 2 önbellek çerçevesidir. Birden fazla depolama arka planını destekler ve önbellekleme için basit, tutarlı bir API sağlar.

:::tip
Keyv ile önbellekleme uygularken, uygun veri yaşam süreleri belirlemeyi unutmayın. Bu, performansı artırmaya yardımcı olur.
:::

### Örnek - Fastify Kullanarak Önbellek Desteği Ekleme

```js
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import fastify from 'fastify';

// varsayılan olarak katman 1 önbelleği bellekte. Katman 2 önbellek eklemek isterseniz, KeyvRedis kullanabilirsiniz
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary, ttl: '4h' }); // varsayılan yaşam süresi 4 saat olarak ayarlandı

const fastify = fastify();
fastify
  .register(require('@fastify/caching'), {
    cache
  });

fastify.get('/', async (req, reply) => {
  const cachedResponse = await fastify.cache.get('hello');
  if (cachedResponse) {
    return reply.send(cachedResponse);
  }
  const data = { hello: 'world' };

  await fastify.cache.set('hello', data);
  
  reply.send({hello: 'world'})
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
```

:::info
Yukarıdaki örnekte, Fastify ile önbellekleme kullanımını görmektesiniz. Hem bellek içi hem de Redis tabanlı önbellek desteği sağlamaktadır.
:::

```markdown
---
:::warning
Önbellekleme yaparken dikkatli olun; geçerli verilerin güncel kalmasını sağlamak için uygun stratejiler geliştirin.
:::
```