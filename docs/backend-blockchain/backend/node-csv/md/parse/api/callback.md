---
title: Callback API
description: Callback API, stream API'den yayılan tüm verileri tek bir nesnede tamponlar ve bu nesneyi kullanıcı tarafından sağlanan bir işleve geçirir. Bu özellik, veri akışlarını daha verimli bir şekilde işlemek için kullanılır ve kullanıcıların esnek geri çağırmalar tanımlamasına olanak tanır.
keywords: [csv, parse, api, callback, function, udf, stream]
sort: 3.2
---

# Callback API

İmza `parse(data, [options], callback)` şeklindedir.

:::info
Callback API, bir veri akışında işlenen verilerin kullanıcı tanımlı bir işlev aracılığıyla nasıl ele alınacağını gösterir.
:::

[callback örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/api.callback.js) ilk argümanda (`input`) CSV dizesini, ikinci argümanda seçenekleri ve üçüncü argümanda bir kullanıcı geri çağrısını alır. Geri çağırma, ilk parametrede (`err`) CSV ayrıştırıcısı tarafından fırlatılan hata veya ikinci argümanda (`output`) bir kayıtlar dizisi alır. 

> "**Callback API**, kullanıcıların verileri yönetmekteki esnekliğini artırır."  
> — Callback API Kullanım Kılavuzu

Bir dizi döndürür.


Örnek Kullanım

Aşağıda bir geri çağırma işlevinin nasıl yapıldığını gösteren basit bir örnek verilmiştir:

```javascript
parse(input, options, (err, output) => {
    if (err) {
        console.error('Hata:', err);
        return;
    }
    console.log('Çıktı:', output);
});
```


`embed:packages/csv-parse/samples/api.callback.js`