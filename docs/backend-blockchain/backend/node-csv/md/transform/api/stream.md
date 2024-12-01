---
title: Akış API'si
description: Akış API'si kullanması en hoş API olmayabilir ama ölçeklenebilir. Diğer tüm uygulamaların temelini oluşturan budur.
keywords: ['akış', 'dönüştür', 'api', 'asenkron', 'boru', 'yerel', 'yaz', 'olaylar']
sort: 3.1
---

# Node.js Akış API'si

Paket tarafından dışa aktarılan ana modül, yerel Node.js [Dönüştürme akışı](https://nodejs.org/api/stream.html#stream_class_stream_transform)dır. Dönüştürme akışları hem Okunabilir hem de Yazılabilir arayüzleri uygular.

:::tip
**Önerilen yaklaşım:** Verilerinizi kaynaktan hedefe bir akış olarak ele alarak ölçeklenebilirliği sağlar ve mevcut tüm seçenekleri destekler.
:::

```
İmza `const stream = transform(records, [options], handler, [options], [callback])` şeklindedir.
```

## Hem okunabilir hem de yazılabilir bir akış

[Akış örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/api.stream.js), dizi biçiminde kayıtlar `write` fonksiyonu aracılığıyla gönderilir ve dönüştürülmüş kayıtlar "okunabilir" olayı içinde `read` fonksiyonunu çağırarak elde edilir.

> "Dönüştürme akışları, hem okunabilir hem de yazılabilir arayüzleri destekler." — Node.js Akış Dokümantasyonu

`embed:packages/stream-transform/samples/api.stream.js`

:::info
_Bu örnek `node samples/api.stream.js` komutuyla mevcuttur. Uygulamanızda örneği çalıştırarak daha fazla anlayış kazanabilirsiniz._
:::