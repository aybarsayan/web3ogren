---
title: API
description: CSV Stringify - akış, geri çağırma ve senkron API'leri. Bu belgede, farklı API türlerinin kendi avantajları ve dezavantajları açıklanmaktadır. Ayrıca, kullanım örnekleri ve referans bağlantıları ile desteklenmektedir.
keywords: ['csv', 'stringify', 'api', 'geri çağırma', 'akış', 'senkron', 'vaat']
sort: 3
---

# CSV Stringify API

## Giriş

Birçok API mevcuttur, her birinin kendi avantajları ve dezavantajları vardır. Temelde aynı uygulamayı paylaşırlar.

:::info
Aşağıda belirtilen API'lerin her biri belirli durumlar için daha uygun olabilir, bu nedenle amacınıza en uygun olanı seçmek önemlidir.
:::

* `Senkron API`  
  Senkron API, **basitlik**, **okunabilirlik** ve **kullanım kolaylığı** sunar. Geri çağırma API'sinde olduğu gibi, belleğe sığan küçük veri setleri için tasarlanmıştır ve son kaydın beklenmesini tolere edebilir.
  
* `Akış API`  
  Akış API'si kullanması en zevkli API olmayabilir ama **ölçeklenebilir**.

* `Geri Çağırma API`  
  Geri çağırma API'si, akış API'sinden yayımlanan tüm kayıtları tek bir diziye tamponlar ve bu dizi kullanıcı tarafından sağlanan bir işlevle geçirilir. **Bir işlevi geçirmek, akış olayları işlevini uygulamaktan daha kolaydır, ancak bu tüm veri kümesinin mevcut belleğe sığması gerektiği** ve yalnızca son kayıt işlemden sonra kullanılabilir olacağı anlamına gelir. Bu genellikle önerilmez, bunun yerine Senkron API kullanılmalıdır.

:::warning
Geri çağırma API'sinin kullanılmasının bazı sınırlamaları vardır. Bellek sınırlarını aşmak, performans sorunlarına yol açabilir.
:::

* `Akış API + veri seti`  
  Yazılabilir akışı kayıtlarla veya okunabilir akışı bir geri çağırma işlevi ile değiştirin.

* `Asenkron yineleyici API`  
  Asenkron yineleyici API, hem **ölçeklenebilir** hem de **şıktır**. Parçalanmış veri üzerine inşa edilen yerel Okunabilir Akış API'sinin avantajlarından yararlanarak, stringify edilmiş veri parçaları üzerinde yinelemeyi sağlar.
  
Ek kullanım durumları ve örnekler için şunlara referans verebilirsiniz:

* `API sayfası`,
* [örnekler klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/samples)
* [test klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify/test).