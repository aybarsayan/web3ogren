---
title: API
description: CSV Parse - akış, geri çağırma ve senkron API'leri. Bu makale, CSV Parse kütüphanesindeki farklı API türlerini ve her birinin avantajlarını ve dezavantajlarını ele almaktadır.
keywords: [csv, parse, parser, api, callback, stream, sync, promise]
sort: 3
---

# CSV Parse API

Birçok API ve stil mevcuttur, bunların her birinin kendine özgü avantaj ve dezavantajları vardır. Temelde, aynı implementasyonu paylaşırlar.

:::info
API seçenekleri arasında seçim yaparken kullanım durumunuzu ve ihtiyaçlarınızı göz önünde bulundurun.
:::

* `Senkran API`   
  Senkron API, basitlik, okunabilirlik ve kullanım kolaylığı sağlar. Geri çağırma API'si gibi, belleğe sığan küçük veri kümesi için tasarlanmıştır ve son kaydın gelmesini bekleme toleransı vardır.
  
* `Akış API`   
  Akış API, kullanımı en keyifli API olmasa da ölçeklenebilir.

> "Asenkron API, yüksek hacimli verilerle çalışmak için en iyi seçenektir." — CSV Parse Belgelendirmesi

* `Geri Çağırma API`   
  Geri çağırma API'si, akış API'sinden yayımlanan tüm verileri tek bir nesne içinde tamponlar ve bu nesne bir kullanıcı tarafından sağlanan bir fonksiyona iletilir. Bir fonksiyon geçmek, akış olayları fonksiyonunu uygulamaktan daha kolaydır, ancak tüm veri kümesinin mevcut belleğe sığması gerektiğini ve yalnızca son kayıt işlendiğinde erişilebilir olacağını ima eder. Bu genellikle önerilmez; bunun yerine Senkron API'yi kullanın. 
  
* `Akış API + veri kümesi`  
  Yazılabilir akışı bir dize veya tampon ile veya okunabilir akışı bir geri çağırma fonksiyonu ile değiştirin.

:::tip
Eğer büyük veri kümesiyle çalışıyorsanız, Senkron API yerine Akış API kullanmayı düşünün.
:::

* `Asenkron yineleyici API`   
  Asenkron yineleyici API hem ölçeklenebilir hem de şıktır. Ayrıştırılmış kayıtlar üzerinde yineleme yapmak için, üzerinde ayrıştırıcı inşa edilen yerel Okunabilir Akış API'sinin avantajlarından yararlanır.

Ek kullanım ve örnekler için, şu kaynaklara başvurabilirsiniz:

* `API sayfası`,
* [“örnekler” klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/samples)
* [“test” klasörü](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/test).