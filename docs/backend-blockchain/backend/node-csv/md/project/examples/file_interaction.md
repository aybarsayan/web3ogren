---
title: Dosya sistemi etkileşimi
description: Borular ile dosya okuma ve yazma. Bu içerik, Node.js'in `fs` modülü ile dosya etkileşimlerinin nasıl yapılacağını açıklamaktadır.
keywords: ['csv', 'örnek', 'tarif', 'dosya', 'fs', 'oku', 'yaz']
---

# Dosya sistemi etkileşimi

Node.js'in yerel `fs` adlı Dosya Sistemi modülü, bir dosyanın içeriğini okumak ve yazmak için kullanılır.

:::info
Aşağıda verilen dosya sistemi tarifi, pipe fonksiyonunun nasıl kullanılacağını göstermektedir.
:::

Bu [dosya sistemi tarifi](https://github.com/adaltas/node-csv/blob/master/packages/csv/samples/example.fs.js), pipe işlevinin nasıl kullanılacağını göstermektedir.

> **Anahtar Alıntı:**  
> "Node.js'in `fs` modülü, dosya etkileşimleri için güçlü bir araçtır."  
> — Belirtilen Kaynak

```javascript
// Örnek kod
const fs = require('fs');
const csv = require('csv-parser');
const results = [];

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });
```


Detaylar için tıklayın

Node.js ile dosya okuma ve yazma işlemleri için bazı temel bilgileri aşağıdaki gibi özetleyebiliriz:

- **Dosya Okuma:** `fs.readFile` veya alt akışlar kullanarak dosya içeriğini okuyabilirsiniz.
- **Dosya Yazma:** `fs.writeFile` işlemi ile dosyanıza veri yazabilirsiniz.

:::tip
Her zaman dosya yollarını doğru belirlemeye dikkat edin!
:::
  


`embed:packages/csv/samples/example.fs.js`