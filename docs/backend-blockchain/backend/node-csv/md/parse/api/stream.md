---
title: Akış API'si
description: Akış API'si, veri işleme konusunda ölçeklenebilir bir yaklaşım sunar. Bu belge, Akış API'sinin kullanımını ve içindeki önemli kavramları ele alır.
keywords: [csv, ayrıştır, api, akış, asenkron, boru, yerel, yaz, olaylar]
sort: 3.1
---

# Node.js Akış API'si

Bu paketin dışa aktardığı ana modül, yerel Node.js [dönüştürme akışı](http://nodejs.org/api/stream.html#stream_class_stream_transform) uygular. Dönüştürme akışları hem Okunabilir hem de Yazılabilir arayüzleri uygular.

:::tip
Akış API'si, veriminizi artırmak için ölçeklenebilir bir çözüm sunar. Akışlar, verilerinizi kaynaklardan hedeflere taşımada en pratik yoldur.
:::

Bu, maksimum güç gereken durumlar için önerilen yaklaşımdır. Akış API'si kullanması en keyifli API olmayabilir, ancak verilerinizi kaynaktan hedefe bir akış olarak ele alarak ölçeklenebilirliği garanti eder.

**İmza** şu şekildedir: `const stream = parse([options])`.

## Hem okunabilir hem de yazılabilir bir akış

[akış örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/api.stream.js), CSV verileri `write` fonksiyonu aracılığıyla gönderilir ve elde edilen veri `readable` olayı içinde `read` fonksiyonu çağrılarak alınır.

`embed:packages/csv-parse/samples/api.stream.js`

## Boru fonksiyonunu kullanma

Akış API'si geniştir ve birden fazla akışı birbirine bağlamak, yeni başlayanlar için karmaşık bir görevdir. :::info
Boru fonksiyonu, akışları birleştirmenin en etkili yoludur.
:::

Akış API'sinin bir parçası olan boru fonksiyonu bunu yapar. `boru tarifi` kullanımı açıklamakta ve bir örnek sunmaktadır.

:::warning
Boru fonksiyonunu kullanırken, akışların doğru sırayla bağlandığından emin olun. Yanlış sıralama verilerin kaybolmasına neden olabilir.
:::