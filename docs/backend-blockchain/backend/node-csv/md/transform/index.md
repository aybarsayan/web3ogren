---
title: Kullanım
description: Node.js `stream.Transform` API'sini uygulayan nesne dönüşümleri. Bu belge, dönüşüm işlemleri için gerekli olan temel bilgileri ve kullanım örneklerini içermektedir.
keywords: ['csv', 'dönüşüm', 'node.js', 'stream', 'özellikler', 'kullanım', 'API']
sort: 1
---

# Node.js için Stream Dönüşümü

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/stream-transform)](https://www.npmjs.com/package/stream-transform)
[![NPM](https://img.shields.io/npm/v/stream-transform)](https://www.npmjs.com/package/stream-transform)

Bu proje, Node.js `stream.Transform` API'sini uygulayan basit bir nesne dönüşüm çerçevesi sağlar. Dönüşümler, sağlanması gereken bir `kullanıcı işleyici fonksiyonu` üzerine kuruludur. İlk olarak Node.js [CSV paketi](https://github.com/adaltas/node-csv) (`npm install csv`) parçası olarak geliştirilmiştir ve bağımsız olarak kullanılabilir.

:::info
Bu projenin kaynak kodu [GitHub](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform) adresinde mevcuttur.
:::

## Ana özellikler

* Yerel Node.js [dönüşüm stream API'sini](http://nodejs.org/api/stream.html#stream_class_stream_transform) genişletir
* İsteğe bağlı geri çağırma ve senkron API ile basitlik
* Okunabilir ve yazılabilir stream'ler arasında dönüşümleri boru hattıyla yapma
* Senkron ve asenkron kullanıcı fonksiyonları
* Sıralı ve paralel yürütme
* Girdi ve çıktı olarak nesne, dizi veya JSON kabul eder
* Sıralı veya kullanıcı tanımlı eşzamanlı yürütme
* Kayıtları atla ve çoğalt
* Girdi kayıtlarını değiştir veya kopyala
* `csv-generate`, `csv-parse` ve `csv-stringify` paketleriyle iyi çalışır
* MIT Lisansı

## Kullanım

Tam CSV modülünü kurmak için `npm install csv` çalıştırın veya sadece bu pakete ilgi duyuyorsanız, `npm install stream-transform` çalıştırın.

> Kaynak kodu, modern JavaScript özelliklerini kullanır ve Node 7.6+ üzerinde yerel olarak çalışır. Daha eski tarayıcılar veya eski Node sürümleri için, "./lib/es5" içindeki modülleri kullanın.  
> — Node.js Kullanım Kılavuzu

Verilerin, kayıtların bir dizisi olarak beklenmesi gerekmektedir. Kayıtlar, bir dize, dizi veya nesne şeklinde sağlanabilir. Seçenekler herhangi bir konumda yerleştirilebilir.

## Ek yardım

Kullanım ve örnekler için [“örnekler” klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/samples) ve [“test” klasörüne](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform/test) başvurabilirsiniz.


Detaylı Bilgiler

Geri çağırmalar ve işlemler hakkında daha fazla bilgi edinmek isterseniz, kullanıcı dökümantasyonunu ziyaret edebilirsiniz. API'nin tüm özellikleri ve uygulanabilir yöntemleri burada mevcuttur.

