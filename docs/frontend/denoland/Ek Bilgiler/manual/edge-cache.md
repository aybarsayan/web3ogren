---
title: "Edge Cache"
description: "Bu belge, Deno Deploy'de Cache API'sinin kullanımı ve sınırlarını detaylandırmaktadır. Önbellek mekanizması, verimliliği artırmak ve veri tutarlılığını sağlamak için kullanılır."
keywords: [Deno Deploy, Cache API, önbellek, HTTP yanıt, veri tutarlılığı, performans, sınırlamalar]
---

:::caution Beta özelliği

Deno Deploy'de Cache API desteği şu anda kapalı beta aşamasındadır ve henüz tüm kullanıcılara sunulmamaktadır.

:::

[Web Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache), Deno Deploy'de desteklenmektedir. Önbellek, **mikro saniye düzeyinde** okuma gecikmesi, **çok GB/s** yazma çıktısı ve sınırsız depolama sağlamak üzere tasarlanmıştır; fakat bunun karşılığında en iyi çaba ile **tutarlılık** ve **dayanıklılık** sunmaktadır.

```ts
const cache = await caches.open("my-cache");

Deno.serve(async (req) => {
  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }

  const res = new Response("cached at " + new Date().toISOString());
  await cache.put(req, res.clone());
  return res;
});
```

Önbellekte depolanan veriler, kodunuzu çalıştıran Deno Deploy bölgesinde saklanmaktadır. Genellikle, izole ortamınız, **aynı bölgede yazdıktan sonra okumaya** (RAW) ve **yazdıktan sonra yazmaya** (WAW) tutarlılık sağlar; ancak nadir durumlarda son yazmalar kaybolabilir, sıralama dışı olabilir veya geçici olarak görünmeyebilir.

---

## Süre Dolumu

Varsayılan olarak, önbelleğe alınan veriler belirsiz bir süre boyunca saklanmaktadır. Dönem dönem etkin olmayan nesneleri tarayıp silsek de, bir nesne genellikle en az **30 gün** boyunca önbellekte tutulur.

Edge Cache, standart HTTP yanıt başlıklarını `Expires` ve `Cache-Control` anlayabilmektedir. Her önbelleğe alınan nesne için bir süre dolum zamanı belirlemek üzere bunları kullanabilirsiniz, örneğin:

```
Expires: Thu, 22 Aug 2024 01:22:31 GMT
```

veya:

```
Cache-Control: max-age=86400
```

---

## Sınırlamalar

:::warning Önemli Not

- Eğer bir yanıt `Uint8Array` veya `string` gövdesinden oluşturulmamışsa, `Content-Length` başlığının manuel olarak ayarlanması gerekmektedir.
- **Silme** henüz desteklenmemektedir.

:::