---
title: Promislerin kullanımı
description: CSV Parse - en son Node.js Stream API ile nasıl promislerin kullanılacağını. Bu içerikte, Node.js için Stream Promises modülünün kullanımı ve bu modülün sunduğu faydalar ele alınmaktadır.
keywords: [csv, parse, parser, örnek, tarif, promisler, stream, pipe, oku, async]
---

# Promislerin kullanımı

Node.js sürüm 15 ile birlikte, Stream API yeni bir ["stream/promises" modülü](https://nodejs.org/api/stream.html#stream_streams_promises_api) vaad ediyor.

:::info
Stream Promises modülünün bir parçası olan `finished` fonksiyonu, bir akışa bağlanır ve akış artık okunabilir, yazılabilir olmadığında veya bir hata ya da beklenmeyen kapanma olayı yaşandığında bir promis çözülür.
:::

> **Anahtar Nokta:** `finished` fonksiyonu, akışın durumunu izler ve tamamlandığında veya hatayla karşılaştığında bir çözüm sağlar.  
> — Node.js Belgeleri

[Promises örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.promises.js), dosya sisteminden bir dosyayı okumak ve çıktısını parçalayıcıya aktarmak için `pipe` ile `finished` kullanarak kullanışlı bir çözüm sunar.

:::tip
Bu örneği çalıştırmak için, terminalde `node samples/recipe.promises.js` komutunu kullanabilirsiniz.
:::


Örnek Kod Detayı

```javascript
const fs = require('fs');
const { parse } = require('csv-parse');
const { finished } = require('stream/promises');

async function parseCSV(filePath) {
  const parser = fs.createReadStream(filePath).pipe(parse());
  await finished(parser);
  console.log('CSV dosyası başarıyla okundu.');
}

parseCSV('./data.csv');
```



---