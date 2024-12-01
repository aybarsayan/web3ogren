---
title: 'Express ile Önbellekleme Nasıl Uygulanır'
description: Express ile önbellekleme uygulamasının nasıl gerçekleştirileceğini açıklayan kapsamlı bir rehber. Önbellekleme, verimlilik ve performansı artırmak için yüksek hızlı veri depolama katmanı sağlar.
keywords: [Express, caching, Keyv, Cacheable, Node.js, web uygulama, veri depolama]
---

# Express ile Önbellekleme Nasıl Uygulanır

## Express Nedir?
Express, minimal bir Node.js web uygulama çerçevesidir. API'leri web ve mobil uygulama işlevselliği sağlar. Basitliği, kullanıcıların tanıdık bir ortamda, **sağlam** bir API oluşturmasını hızlı bir şekilde sağlarken, *Robust yönlendirme*, yüksek performans, HTTP yardımcıları, 14+ görünüm şablonu motoru desteği, içerik müzakeresi ve uygulamaları hızlı bir şekilde oluşturmak için bir yürütülebilir dosya gibi geliştirilmiş özellikler sunar.

---

## Önbellek Nedir?
Önbellek, bir alt küme veriyi saklayan, yüksek hızlı kısa süreli bir veri depolama katmanıdır. Bu, verilerin birincil depolama konumuna erişimden daha hızlı bir şekilde geri alınmasını sağlar. Önbellekleme, **daha önce alınmış verileri** verimli bir şekilde yeniden kullanmanıza olanak tanır.

---

## Keyv'de Cacheable Üzerinden Önbellek Desteği

:::tip
Önbelleklemek için [Cacheable](https://npmjs.org/package/cacheable) kullanılabilir. Bu, Keyv üzerine kurulmuş yüksek performanslı bir katman 1 / katman 2 önbellekleme çerçevesidir.
:::

Birden fazla depolama arka planını destekler ve önbellekleme için basit, tutarlı bir API sağlar.

### Örnek - Express için Önbellek Desteği Ekleme

```js
import express from 'express';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';

const secondary = createKeyv('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary, ttl: '4h' });

const app = express();

app.get('/test-cache/:id', async (req, res) => {
    if(!req.params.id) return res.status(400).send('Eksik id param');
    const id = req.params.id;
    const cached = await cache.get(id);
    if(cached) {
        return res.send(cached);
    } else {
        const data = await getData(id);
        await cache.set(id, data);
        return res.send(data);
    }
});
```

:::info
Bu örnek, Express uygulamanıza önbellekleme desteği eklemek için temel bir uygulamadır. Önbellekleme, uygulamanızın performansını artırabilir.
:::