---
description: Bu içerik, tarayıcıların aralık bağlam sorgularını desteklemediği için neden .02px değerini çıkardığımızı açıklamaktadır. Kesirli genişliklerin sınırlamalarını telafi etmenin önemine değinmektedir.
keywords: [aralık bağlam sorguları, min- önekleri, max- önekleri, kesirli genişlik, yüksek dpi cihazlar]
---

**Neden .02px çıkarıyoruz?**

:::info
Tarayıcılar şu anda [aralık bağlam sorgularını](https://www.w3.org/TR/mediaqueries-4/#range-context) desteklemiyor. Bu nedenle, `min-` ve `max-` öneklerinin sınırlamalarını aşmak için bazı stratejiler geliştirmek gerekiyor.
:::

Bu durumda, nasıl daha yüksek hassasiyet değerleri kullanarak **kesirli genişliklere sahip görünüm alanlarının** sınırlamalarını telafi edebiliriz? Örneğin, yüksek dpi cihazlarda belirli koşullar altında meydana gelebilir.

> "Yüksek hassasiyet değerleri kullanmak, tarayıcıların sınırlamalarını aşmamıza yardımcı olur."  
> — Uzman Görüşü

---

:::tip
Kesirli genişlikler kullanırken, her zaman tarayıcı uyumluluğunu kontrol etmek ve gerektiğinde alternatif çözümler düşünmek önemlidir.
:::

Tarayıcıların desteklemediği bu özelliği aşmanın birkaç etkili yolu bulunmaktadır. 


Detaylar için tıklayın

1. **Yüksek DPI Cihazlarına Dikkat:** Kesirli genişliklerin bazı uygulamalarda yararlı olabileceği yerler vardır.
2. **Test Süreci:** Oluşabilecek olumsuzlukları test ederek daima geçerli tutun.
   


Tarayıcıların özellikleri ve sınırlamaları hakkında daha fazla bilgi için [mediaqueries-4](https://www.w3.org/TR/mediaqueries-4) belgelerine göz atabilirsiniz.