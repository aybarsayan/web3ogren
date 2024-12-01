---
title: Yeniden Deneme
description: Bu belge, Listr2 kütüphanesinde görevlerin yeniden deneme özelliğini nasıl kullanacağınızı anlatmaktadır. Yeniden deneme mekanizması, gecikmeler ve hata durumları hakkında bilgiler sunmaktadır.
keywords: [yeniden deneme, Listr2, görev, retry özelliği, hata yönetimi, birimi test etme, asenkron görevler]
order: 70
tag:
  - ileri
  - akış
category:
  - görev
---



Eğer birkaç kez başarısız olmuş bir görevi yeniden denemek istiyorsanız, `Task` içindeki `retry` özelliğini kullanabilirsiniz.



::: info Önemli Bilgi
Yeniden deneme süreci, bazı durumlarda kullanışlı olabilir. Başarısız bir görevle karşılaştığınızda, görevi yeniden denemek için bu özelliği değerlendirebilirsiniz.
:::

## Kullanım



Yeniden deneme eyleminin denemeler arasında bir gecikmesi olabilir. Bu davranışı etkinleştirmek için, verilen göreve bir nesne olarak `retry` ile geçebilirsiniz.


Bu özelliklerin nasıl çalıştığını anlamak için dökümantasyonun detaylarına göz atın.
:::