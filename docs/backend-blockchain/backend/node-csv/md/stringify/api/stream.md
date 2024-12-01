---
title: Akış API'si
description: Akış API'si kullanmak için en hoş API olmayabilir ama ölçeklenebilir. Bu doküman, Node.js akış API'sinin kullanımı ve örnek uygulamaları hakkında bilgi sunmaktadır.
keywords: [csv, stringify, api, stream, async, pipe, native, write, events]
sort: 3.1
---

# Node.js Akış API'si

Paketin ana modülü, hem okunabilir hem de yazılabilir olan yerel Node.js [dönüştürme akışını](https://nodejs.org/api/stream.html#stream_object_mode_duplex_streams) uygular. 

:::tip
Eğer maksimum güç gerekiyorsa bu önerilen yaklaşımdır. Verilerinizi kaynaktan hedefe bir akış olarak ele alarak ölçeklenebilirliği sağlar.
:::

İmza `const stream = stringify([options])` şeklindedir.

:::info
[Akış örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/api.stream.js) 2 kayıt yazar ve oluşturulan CSV çıktısını okumak için birden fazla olayı kaydeder, ayrıca serileştirme tamamlandığında bildirim almak için kullanılır.
:::

`embed:packages/csv-stringify/samples/api.stream.js`

> Projeyi klonladıktan sonra, bu örneği `node samples/api.stream.js` komutuyla çalıştırın.
— Node.js Akış API'si ile çalışırken önemli bir noktadır.