---
title: Kullanım
description: Node.js `stream.Transform` API'sini uygulayan CSV ayrıştırma. Bu belge, kullanıcıların CSV verilerini kolayca ayrıştırmalarını sağlayacak yöntemleri ve özellikleri kapsamaktadır.
keywords: [csv, ayrıştır, parser, tsv, node.js, stream, özellikler, kullanım]
sort: 1
---

# Node.js için CSV Ayrıştırıcı

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv-parse)](https://www.npmjs.com/package/csv-parse)
[![NPM](https://img.shields.io/npm/v/csv-parse)](https://www.npmjs.com/package/csv-parse)

Bu paket, CSV metin girişini dizilere veya nesnelere dönüştüren bir ayrıştırıcıdır. Node.js `stream API'sini` uygular. Ayrıca, kullanım kolaylığı için `callback API'si` ve `sync API` gibi alternatif API'ler sunar. Hem son derece kullanımı kolay hem de güçlüdür. İlk olarak 2010 yılında yayınlanmıştır ve büyük veri setleriyle çalışmakta olan geniş bir topluluk tarafından kullanılmaktadır.

Bu projenin kaynak kodu [GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse)'da mevcuttur.

## Ana özellikler

* Node.js akış API'sini takip eder
* Opsiyonel callback ve sync API ile basitlik
* Ayırıcılar, alıntılar, kaçış karakterleri ve yorumları destekler
* Satır kırılması keşfi
* Büyük veri setlerini destekler
* İlham almak için tam test kapsamı ve örnekler
* Harici bağımlılık yok
* `csv-generate`, `stream-transform` ve `csv-stringify` paketleriyle uyumlu çalışır
* MIT Lisansı

---

## Kullanım

Tam CSV paketini yüklemek için `npm install csv` komutunu çalıştırın veya sadece CSV ayrıştırıcısına ilginiz varsa `npm install csv-parse` komutunu çalıştırın.

:::tip
Ölçeklenebilirlik için akış tabanlı API'yi kullanın, **basitlik** için sync veya karışık API'leri tercih edin.
:::

Kaynak kod modern JavaScript özelliklerini kullanır ve Node 7.6+ üzerinde çalışır. Daha eski tarayıcılar veya Node'un daha eski sürümleri için "./lib/es5" içindeki modülleri kullanın, yani `require("csv-parse")` ifadesi `require("csv-parse/lib/es5")` haline gelecektir.

## Ek yardım

Kullanım ve örnekler için
`örnekler sayfasına`,
["samples" klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/samples) ve ["test" klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/test) başvurabilirsiniz.

:::info
Daha fazla bilgi ve gelişmiş kullanım senaryoları için belgeleri inceleyin.
:::