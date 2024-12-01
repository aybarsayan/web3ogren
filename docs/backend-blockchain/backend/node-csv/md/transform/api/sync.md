---
title: Senkron API
description: Asenkron yineleyici API, hem ölçeklenebilir hem de şıktır. Ayrıştırıcının inşa edildiği yerel Okunabilir Akış API'sinden yararlanarak ayrıştırılan kayıtlar üzerinde yineleme yapar.
keywords: [akış, dönüştür, api, senkron, bellek, fonksiyon]
sort: 3.4
---

# Senkron API

Eğer giriş ve çıkış veri setleriniz çok büyük değilse ve belleğe sığabiliyorsa, **senkron API**, verilerinizi dönüştürmek için kullanışlı bir işlev sunar.

İmza `const records = transform(records, [options], handler)` şeklindedir.

:::warning
Senkron doğası nedeniyle, tüm seçenekler dikkate alınmaz. Kullanıcı işlemci fonksiyonu yalnızca senkron modda yazılmalı ve ikinci argümanında bir geri çağırma beklenmelidir.
:::

## Örnek

[Senkran örneği](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/api.sync.js), bu API'nin nasıl kullanılacağını göstermektedir.

:::tip
Ayrıca, işlemcinin geri çağırma yöntemini doğru bir şekilde yapılandırmak için [bu kılavuza](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/README.md) göz atabilirsiniz.
:::

`embed:packages/stream-transform/samples/api.sync.js`