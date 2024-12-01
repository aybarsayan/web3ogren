---
title: Sync API
description: Senk API'si, bir tam veri kümesini metin olarak girdi olarak bekleyen ve tam sonuç kümesini bir dizi veya nesne olarak döndüren bir işlevi açığa çıkarır. Bu, CSV içeriğini işlemek için basit ve etkili bir yöntem sunar.
keywords: [csv, parse, api, sync, memory, function]
sort: 3.3
---

# Senk API

Senk API'si, bir tam veri kümesini metin olarak girdi olarak bekleyen ve tam sonuç kümesini bir dizi veya nesne olarak döndüren bir işlevi açığa çıkarır.

Özetlemek gerekirse, bu, bir işleve yapılan normal doğrudan senkron çağrıdır: CSV içeriğini geçirirsiniz ve kayıtları döndürür. Basitliği nedeniyle, bu, ölçeklenebilirliğe ihtiyaç duymuyorsanız ve veri kümeniz belleğe sığıyorsa önerilen yaklaşımdır.

:::note
Basitlik, okunabilirlik ve rahatlık için senk API'sini seçin, ancak ölçeklenebilirlikten ödün vermiş olursunuz.
:::

Kullanmak için `csv-parse/sync` modülünü içe aktarın veya talep edin. Dışa aktarılan işlev imzası `const records = parse(data, [options])` şeklindedir.

> Bu [senkron örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/api.sync.js),  
> senkron modülün nasıl kullanılacağını göstermektedir.  
> — GitHub Repository

Bu örnek `node samples/api.sync.js` komutuyla kullanılabilir.


Ek Bilgiler

`embed:packages/csv-parse/samples/api.sync.js`

