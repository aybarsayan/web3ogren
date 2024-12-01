---
title: API
description: Akış Dönüşümü - akış, geri çağırma ve senkron API'leri. Bu belgede, farklı API türlerinin özellikleri ve kullanım alanları hakkında bilgi bulacaksınız.
keywords: [akış, dönüşüm, csv, api, geri çağırma, senkron, söz]
sort: 3
---

# Akış Dönüşüm API'si

Bu paket, farklı modüller aracılığıyla mevcut olan farklı API çeşitleri önerir. Altında, hepsi aynı uygulamayı paylaşır.

:::tip
Daha iyi kullanım için, uygun modülü projenizin ihtiyaçlarına göre seçin.
:::

* `Senkron API`  
  Senkron API, basitlik, okunabilirlik ve kullanım kolaylığı sağlar. **Ancak**, hem giriş hem de çıkış veri setleri belleğe sığmalı ve yalnızca senkron işleyiciler desteklenmektedir.
* `Akış API'si`  
  Akış API'si ölçeklenebilir ve diğer API'lerin oluşturulduğu varsayılan uygulamadır. **Daha ayrıntılıdır** fakat esneklik sunar.
* `Geri Çağırma API'si`  
  Dönüştürülen veri seti belleğe sığarsa, bir kullanıcı tanımlı işlevden kayıtlar elde edebilirsiniz. **Bu genellikle tavsiye edilmez**, bunun yerine Senkron API'yi kullanın. Bu, akış API'si ile aynı işlevde uygulanmıştır. Kolaydır ve işleyiciler asenkron yazılabilir.
* `Akış + geri çağırma API'si`  
  Eğer ihtiyacınız varsa, akış ve geri çağırma API'leri bir araya getirilebilir.

## Ek bilgi

Her iki modül de ECMAScript Edition 6 (ES6 veya ES2015), Node.js sürümü 7.6 ve üzerini hedefler. Daha eski JavaScript sürümleri için her modül, "lib/es5" klasörü içinde ECMAScript Edition 5 (ES5) formatına dönüştürülmüştür. **ES5 modülleri**, ES6 ile tam olarak aynı API'yi paylaşır. Örneğin, ES5 ile uyumlu `sync` modülü `require('stream-transform/lib/es5/sync')` kullanılarak mevcuttur.

:::info
Ek kullanım ve örnekler için şu kaynaklara başvurabilirsiniz:
:::

* `Seçenek sayfası`
* [“örnekler” klasörü](https://github.com/adaltas/node-stream-transform/tree/master/samples)
* [“test” klasörü](https://github.com/adaltas/node-stream-transform/tree/master/test).

:::note
Dönüşüm API'leri hakkında daha fazla bilgi almak için belgeleri dikkatlice inceleyin. 
:::