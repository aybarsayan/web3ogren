---
title: Örnekler
description: CSV veri setleri ve akışları oluşturma ile ilgili örnekler
keywords: [csv, oluştur, örnek, örnek veri, akış, boru, geri çağırma, senkron, asenkron]
sort: 4
---

# CSV Oluşturma Örnekleri

Bu paket, farklı API tatları öneriyor. Her örnek [GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate/samples) üzerinde mevcuttur.

## Boru Fonksiyonunu Kullanma

:::info
Stream API'sinin bir parçası olan kullanışlı bir fonksiyon `pipe`, birden fazla akış arasında etkileşim sağlamak için kullanılır.
:::

Bu fonksiyonu bir `stream.Readable` kaynağını bir `stream.Writable` hedefine yönlendirmek için kullanabilirsiniz. 

> **Not:** [boru örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-generate/samples/pipe.js), 2 sütunlu 2 satırlık bir veri seti oluşturur. İlk sütun tamsayı değerlerini, ikinci sütun ise boolean değerlerini içerir. Oluşturulan veri setini stdout'a yazdırır. 
>
> — `generate` fonksiyonu, daha sonra `process.stdout` adlı yazılabilir bir akışa yönlendirilmiş okunabilir bir akış döndürür.


Ekstra Bilgiler

Aşağıdaki komut ile akışın nasıl çalıştığına dair örnek bir kod bulabilirsiniz:

```javascript
const csv = require('csv-generate');
const { pipeline } = require('stream');

pipeline(
  csv({ objectMode: true, length: 2 }),
  process.stdout,
  (err) => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```


`embed:packages/csv-generate/samples/pipe.js`