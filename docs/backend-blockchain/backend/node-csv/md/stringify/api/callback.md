---
title: Akış ve geri çağırma API'lerini birleştirme
description: Yazılabilir akışı bir dize veya tampon ile ve okunabilir akışı bir geri çağırma işlevi ile değiştirin. Bu içerik, geri çağırma API'sinin nasıl kullanılacağını ve örneklerini sunmaktadır.
keywords: ['csv', 'stringify', 'api', 'akış', 'geri çağırma', 'işlev', 'mixin']
sort: 3.3
---

# Geri Çağırma API'si

İmza `stringify(records, [options], callback)` şeklindedir.

:::info
Bu API, özellikle verilerinizi kolayca işlemenizi ve yapılandırmanızı sağlar. Aşağıdaki örnek, bu işlevin nasıl çalıştığını gösterir.
:::

[Geri çağırma örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/api.callback.js) bir dizi ve bir geri çağırma işlevi alır. Girdi, bir hata meydana gelmedikçe bir dizeye serileştirilir.

> **Önemli Not:** Aşağıdaki kod parçasını çalıştırmak için `node samples/api.callback.js` komutunu kullanmayı unutmayın.  
> — Node.js Örnek Çalıştırma

`embed:packages/csv-stringify/samples/api.callback.js`

:::tip
Geri çağırma API'sini kullanırken, seçeneklerinizi doğru bir şekilde ayarlamak önemlidir. Bu, çıktınızın yapısını etkileyecektir.
:::

_Bu örneği `node samples/api.callback.js` komutuyla çalıştırın._