---
title: Örnekler
description: Bu belge, CSV stringify kütüphanesinin kullanımına dair örnekler sunmaktadır. Ayrıca, Stream API'si ile nasıl çalıştığını gösteren faydalı bilgiler içermektedir.
keywords: [csv, stringify, örnek, örnekleme, akış, boru, geri çağırma, senkron, asenkron]
sort: 4
---

# CSV Stringify örnekleri

## Giriş

Bu paket çeşitli API çeşitlerini önerir. Her örnek [GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples) üzerinde mevcuttur.

## Pipe fonksiyonunu kullanma

Stream API'sinin bir parçası olan yararlı bir fonksiyon `pipe`dır. Birden fazla `stream.Readable` kaynağını `stream.Writable` hedeflerine bağlamak için kullanılır.

:::info
Pipe fonksiyonu, veri akışını yönetmekte etkili bir yöntemdir ve büyük veri setlerinin işlenmesinde önemli bir rol oynar.
:::

[Pipe örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/api.pipe.js) nesne kayıtları üretir, bunları stringify eder ve üretilen CSV'yi standart çıktıya yazdırır.

> **Önemli Not:** Bu örneği `node samples/api.pipe.js` komutunu kullanarak çalıştırın.  
> — Kütüphane Dokümantasyonu

`embed:packages/csv-stringify/samples/api.pipe.js`

_Bu örneği `node samples/api.pipe.js` komutunu kullanarak çalıştırın._