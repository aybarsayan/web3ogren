---
title: ECMAScript modülleri
description: Geri çağırma API'si tüm kayıtları dönüştürür ve sonuçları bir kullanıcı tarafından sağlanan bir işleve aktarılan tek bir veri kümesine toplar. Bu sayfa, Node.js ECMAScript modülleri kullanımı hakkında bilgi sunmaktadır.
keywords: [stream, transform, esm, node.js, ECMAScript, modüller]
sort: 2.1
---

# Node.js ECMAScript modülleri (ESM)

`stream-transform` paketi [ECMAScript modülleri](https://nodejs.org/api/esm.html) olarak yazılmıştır. Kodunuzda şu şekilde kullanılabilir:

* Akış ve geri çağırma API'si: `import {transform} from 'stream-transform';`
* Senkron API: `import {transform} from 'stream-transform/sync';`

:::info
Ek bilgiler `csv` ESM` belgelerinde mevcuttur.
:::

## Uygulama

İçsel olarak, `package.json` dosyasındaki `export` özelliği, modülleri [`./lib` klasöründe](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/lib) açığa çıkarır.

## Desteklenen Node.js sürümleri

Yapılan testlere göre, ECMAScript modülleri bu paket ile birlikte, `--experimental-modules` bayrağı etkinleştirildiğinde Node.js sürüm 12.16 ile çalışmaya başladı. 

> Sürüm 12.17 ile birlikte `--experimental-modules` bayrağının kullanımı artık gerekli değildi.  
> — Node.js sürümü 12.17 Bilgisi

`CommonJS dağıtımı` sürüm 8.3 ile başlayan eski Node.js sürümlerini destekler.

## Bu paketin eski sürümleri

ECMAScript modülleri desteği `stream-transform` paketi 3.0.0 sürümü ile geldi. Önceki sürümler için CommonJS belgelerine başvurulmalıdır.


Daha Fazla Bilgi

`stream-transform` paketinin eski sürümleri ve kullanılan yöntemler hakkında ayrıntılı bilgilere CommonJS belgelerinden ulaşabilirsiniz.

