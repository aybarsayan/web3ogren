---
title: API
description: CSV - akış, geri çağırma ve senkron API'leri. Bu belgedeki API'ler, veri işleme için çeşitli yöntemler sunarak geliştiricilere esneklik sağlar.
keywords: [csv, parse, parser, api, callback, stream, sync, promise]
sort: 3
---

# CSV API

Birçok API ve stil mevcuttur, her birinin kendi avantajları ve dezavantajları vardır. Temelde, hepsi aynı uygulama üzerine kurulmuştur.

:::info
Aşağıdaki API türleri, uygulama ihtiyaçlarınıza uygun olarak seçilebilir.
:::

* `Senkron API`   
  Senkron API, **basitlik**, **okunabilirlik** ve **kullanım kolaylığı** sağlar. Geri çağırma API'sinde olduğu gibi, bellek içinde sığan küçük veri setleri için tasarlanmıştır.
  
* `Akış API`   
  Akış API'si kullanmak için en keyifli API olmayabilir ama **ölçeklenebilir**.

* `Geri Çağırma API`   
  Geri çağırma API'si, akış API'sinden yayımlanan tüm verileri tek bir nesneye yavaşça toplar ve bu nesneyi kullanıcıdan sağlanan bir işlevle geçirir. Bir işlev geçmek, akış olayları işlevini uygulamaktan daha kolaydır ama **tüm veri setinin mevcut belleğe sığması** gerektiği anlamına gelir ve yalnızca son kayıt işlendiğinde kullanılabilir hale gelecektir. 

> Bu genellikle önerilmez, bunun yerine Senkron API kullanın.  
> — CSV API Belgesi

Ekstra kullanım ve örnekler için şu kaynaklara başvurabilirsiniz:

* `parser API sayfaları`,
* `stringifier API sayfaları`,
* 
  Örnekler
  * [“örnekler” klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv/samples)

* 
  Testler
  * [“test” klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv/test)
