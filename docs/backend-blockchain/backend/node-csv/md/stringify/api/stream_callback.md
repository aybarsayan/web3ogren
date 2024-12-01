---
title: Bir akış API'sini bir tam veri kümesi ile birleştirme
description: Bu içerik, bir akışın nasıl bir tam veri kümesine entegre edileceğini açıklamaktadır. Yazılabilir ve okunabilir akışların kullanımını detaylandırarak, daha verimli bir veri işleme yöntemi sunmaktadır.
keywords: ['csv', 'stringify', 'api', 'stream', 'callback', 'function', 'mixin']
sort: 3.3
---

# Bir akışı bir tam veri kümesi ile birleştirme

Bu, akış dönüştürme API'sini kullanır, ancak girdi **okunabilir bir akış** olmak zorunda değildir ve çıktı **yazılabilir bir akış** olmak zorunda değildir. Girdi, birinci argüman olarak geçirilen bir dize olabilir. Çıktı, son argüman olarak geçirilen geri çağırma fonksiyonu içinde elde edilebilir.

:::tip
Eğer daha önce okunabilir bir akış veya yazılabilir bir akış ile etkileşimde bulunduysanız, bu kullanım size kolaylık sağlayacaktır. 
:::

Daha önce okunabilir bir akış veya yazılabilir bir akış ile etkileşimde bulunuyorsanız, bu kullanım kolaylığı sağlar. Tüm kayıtlarınızı bellekte tutmanız ve üretilen CSV'yi bir akış yazarına yönlendirmek istemeniz veya bir akış okuyucu tarafından üretilen kayıtlarınızın olması ve tam CSV metnini temsil eden bir dize elde etmek istemeniz gerektiğinden **ölçeklenebilir değildir**.

---

> **Önemli Not:** Çıktı akışı örneğinin imzası `const stream = stringify(input, [options])`'dir. Bu, bir girdi dizesi ve bir seçenek nesnesi alır ve bir okunabilir akış döndürür.
> — Kaynak: [CSV Stringify Çıkış Örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/mixed.output_stream.js)

`embed:packages/csv-stringify/samples/mixed.output_stream.js`

Tersi olarak, girdi akışı örneğinin imzası `const stream = stringify([options], callback)`'dir. Bu, bir seçenek nesnesi ve bir geri çağırma fonksiyonu alır ve bir yazılabilir akış döndürür.

> **Kaynak:** [CSV Stringify Girdi Örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/mixed.input_stream.js)

`embed:packages/csv-stringify/samples/mixed.input_stream.js`