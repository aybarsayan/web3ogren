---
title: API
description: CSV Üret - akış, geri çağırma ve senkron API'ler. Bu belgede, çeşitli API türleri ve nasıl kullanılacakları açıklanmaktadır. Her bir API, kullanım durumuna göre farklı avantajlar sunar.
keywords: [csv, üret, api, geri çağırma, akış, senkron, söz]
sort: 3
---

# CSV Üret API

## Giriş

Birden fazla API mevcuttur. Arka planda, aynı uygulamayı paylaşırlar. **Akış API'si** kullanması en hoş API olmayabilir ama ölçeklenebilirdir. Verisetlerinizin bellek içinde sığdığından eminseniz, basitlik, okunabilirlik ve kullanım kolaylığı için geri çağırma stilli API veya senkron API kullanın.

:::info
**Not:** API seçiminde, uygulamanızın gereksinimlerini göz önünde bulundurmalısınız.
:::

## Senkron API

Üretilen çıkış döndürülür. Geri çağırma API'si ile olduğu gibi, bu mod genel verisetinin bellekte saklanacağını ima eder.

İçe aktarılacak veya gerekecek modül `csv-generate/sync` dir ve imza `const records = generate([options])` şeklindedir.

> Senkron API, hızlı ve basit kullanım sunar.  
> — CSV Üretim Kılavuzu

[Senkron örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-generate/samples/api.sync.js) 2 kayıtlı bir dizi döndürür.

`embed:packages/csv-generate/samples/api.sync.js`

## Akış API'si

Bu paketin ana modülü yerel Node.js [okunabilir akış API'sini](http://nodejs.org/api/stream.html#stream_class_stream_transform) uygular. Maksimum güç gerektiğinde önerilen yaklaşımdır. Verilerinizi bir giriş akışı olarak ele alarak ölçeklenebilirlik sağlar. Ancak daha ayrıntılıdır ve kullanımı daha zordur.

İmza `const stream = generate([options])` dir.

:::tip
**İpucu:** Akış API'si, büyük veri setleriyle çalışırken en iyi performansı sağlar.
:::

[Akış örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-generate/samples/api.stream.js) dinlenmesi gereken çeşitli olayları göstermektedir.

`embed:packages/csv-generate/samples/api.stream.js`

## Geri Çağırma API'si

Üretilen çıkış, ikinci argümanda geri çağırmaya geçer. Bu mod, genel verisetinin bellekte saklanacağını ima eder.

İmza `const stream = generate([options], callback)` şeklindedir.

:::warning
Dikkat: Geri çağırma API'si, büyük veri setleri için bellek sorunlarına yol açabilir.
:::

[Geri çağırma örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-generate/samples/api.callback.js) 2 kayıtlı bir verisetini üretir.

`embed:packages/csv-generate/samples/api.callback.js`