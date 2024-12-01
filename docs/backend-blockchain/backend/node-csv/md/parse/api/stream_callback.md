---
title: Bir akışı bir tüm veri kümesiyle birleştirmek
description: Yazılabilir akışı bir dize veya tampon ile ve okunabilir akışı bir geri çağırma fonksiyonu ile değiştirin. Bu içerik, akış dönüştürme API'sini ve CSV veri kümeleriyle etkileşimleri ele alır.
keywords: ['csv', 'parse', 'api', 'stream', 'callback', 'function', 'mixin']
sort: 3.3
---

# Bir akışı bir tüm veri kümesiyle birleştirmek

Paket tarafından dışa aktarılan ana modül, Node.js [akış dönüştürme API'sini](https://nodejs.org/api/stream.html) kullanır. Ancak, girdi okunabilir bir akış olmak zorunda değildir. Bunun yerine, bir **CSV dizesi** ve bir **Buffer** olabilir. Ayrıca, çıktı yazılabilir bir akış olmak zorunda değildir; kullanıcı **geri çağırma fonksiyonu** olabilir.

:::tip
Zaten bir okunabilir akış veya yazılabilir akışla etkileşimde bulunuyorsanız, kolaylık sağlamak için kullanılır.
:::

Bu, ya tüm CSV veri kümesine bellekte sahip olduğunuz ve üretilen kayıtları bir akış yazarına yönlendirmek istediğiniz ya da bir akış okuyucusunun bir CSV veri akışı ürettiği ve tüm kayıtları içeren bir tam veri kümesi almak istediğiniz durumunu ifade ettiğinden **ölçeklenebilir değildir**.

**Çıktı akışı örneğinin** [imzası](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/mixed.output_stream.js) `const stream = parse(input, [options])` şeklindedir. Bir girdi dizesi ve bir seçenek nesnesi olarak argüman alır ve bir okunabilir akış döndürür.

```javascript
embed:packages/csv-parse/samples/mixed.output_stream.js
```

Tersi olarak, **Girdi akışı örneğinin** [imzası](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/mixed.input_stream.js) `const stream = parse([options], callback)` şeklindedir. Bir seçenek nesnesi ve bir geri çağırma fonksiyonu olarak argüman alır ve bir yazılabilir akış döndürür.

```javascript
embed:packages/csv-parse/samples/mixed.input_stream.js
``` 