---
title: ECMAScript modülleri
description: Geri çağırma API'si, tüm kayıtları dönüştürür ve sonuçları kullanıcı tarafından sağlanan bir işleve iletilen tek bir veri kümesine tamponlar. Bu belge, ESM'yi kullanarak `csv-parse` paketinin nasıl entegre edileceğini açıklamaktadır.
keywords: [csv, parse, esm, node.js, ECMAScript, modüller, paket]
sort: 2.1
---

# Node.js ECMAScript modülleri (ESM)

`csv-parse` paketi [ECMAScript modülleri](https://nodejs.org/api/esm.html) olarak yazılmıştır. Kodunuzda şu şekilde kullanılabilir:

* Akış ve geri çağırma API'si: `import {parse} from 'csv-parse';`
* Senkron API: `import {parse} from 'csv-parse/sync';`

:::info
Bu yöntemler, modülleri içe aktarmak için standart ECMAScript sözdizimini kullanır. Ek bilgiler için `csv` ESM` belgelerine bakabilirsiniz.
:::

## Uygulama

İçsel olarak, `package.json` dosyasındaki `export` özelliği [`./lib` klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/lib) içindeki modülleri açığa çıkarmaktadır. 

> **Önemli Not**: `export` özelliğinin doğru bir şekilde ayarlandığından emin olun. 
> — Dikkat edilmesi gereken bir konudur.

## Desteklenen Node.js sürümleri

Testlerimize göre, ECMAScript modülleri bu paketle ve `--experimental-modules` bayrağı etkinleştirildiğinde Node.js sürüm 12.16 ile çalışmaya başladı. 12.17 sürümünden itibaren `--experimental-modules` bayrağının kullanılması gerekmemektedir.

:::tip
Her zaman en güncel Node.js sürümünü kullanmanız önerilir. Bu, ESM desteğinden en iyi şekilde yararlanmanıza yardımcı olacaktır.
:::

`CommonJS dağıtımı` Node.js'in 8.3 sürümünden itibaren eski sürümlerini desteklemektedir.

## Bu paketin eski sürümleri

ECMAScript modülleri desteği `csv-parse`'in 3.0.0 sürümüyle geldi. Önceki sürümler için CommonJS belgelerine başvurulmalıdır.


Eski Sürümler Hakkında Daha Fazla Bilgi

* `csv-parse` 3.0.0 ve sonrası ECMAScript modül desteği sunar.
* Eski sürümler için [CommonJS belgelerine](https://github.com/adaltas/node-csv) bakılmalıdır, zira bu sürümler farklı kullanım talimatları içerebilir.

