---
title: Async iterator API
description: Async iterator API, hem ölçeklenebilir hem de şıktır. Ayrıştırıcı üzerinde inşa edilen yerel Readable Stream API'sinin avantajlarından yararlanarak ayrıştırılan kayıtlar üzerinde yineleme yapar. Bu özellikler, asenkron programlamada verimliliği artırır ve uygulamaların performansını optimize eder.
keywords: [csv, parse, api, async, iterator, streams, performance]
sort: 3.4
---

# Async iterator API

Async iterator API, hem ölçeklenebilir hem de şıktır. Ayrıştırıcı üzerinde inşa edilen yerel Readable Stream API'sinin avantajlarından yararlanarak ayrıştırılan kayıtlar üzerinde yineleme yapar.

:::tip
Asenkron işlemlerle çalışırken, bu API'nin sağladığı verimlilikten yararlanabilirsiniz.
:::

Aşağıdaki [async iterator örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/async.iterator.js), bir CSV akışı oluşturarak ardından ayrıştırılır ve yineleme yapılır. Her kayıt için yavaş bir asenkron işlemi simüle ediyoruz. Bu örneği `node samples/async.iterator.js` komutuyla bulabilirsiniz.

```
embed:packages/csv-parse/samples/async.iterator.js
```

:::info
Bu örneği çalıştırmak için uygun bir Node.js ortamına sahip olmalısınız.
:::

### Önemli Notlar
- Async iterator kullanımı, **verimliliği artırır** ve uygulamaların daha az bellek tüketmesi sağlar.
- Bu API ile yapılan işlemler, asenkron işlem mantığını kullanarak paralel çalışmayı optimize eder.

:::warning
Asenkron işlemler sırasında hata ayıklama yaparken, callback'lerinizi dikkatli kullanmalısınız. Beklenmeyen hatalar performans sorunlarına yol açabilir.
:::

> **"Asenkron programlamada kullanılan araçlar, performans üzerinde büyük etki yaratabilir."**  
> — Uzman Geliştirici


Ek Bilgi
Async iterator, geleneksel iterator yapılarının asenkron ortamda nasıl çalıştığını gösteren güçlü bir örnektir. Kurulumdan sonra, akışın hemen hemen her aşamasında işlem yapmanıza imkan tanır.


--- 

Bu API'yi kullanarak, akış üzerinden kayıtlara erişimi kolaylaştırabilir ve asenkron işlemler arasında daha iyi bir yönetim sağlayabilirsiniz.