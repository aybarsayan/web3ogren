---
title: Vanity Adresi Nasıl Oluşturulur
sidebarSortOrder: 6
description:
  "Solana'da özel adresler oluşturmak, kamu anahtarınızı eşsiz hale getirmenin eğlenceli bir yoludur. Solana'da vanity adresleri nasıl oluşturacağınızı öğrenin."
---

Vanity publickey'leri veya özel adresler, belirli karakterlerle başlayan anahtarlardır.

Örneğin, bir kişi bir publickey'in `elv1s` ile başlamasını veya belki de `cook` ile başlamasını isteyebilir. Bu, anahtarın kime ait olduğunu başkalarının hatırlamasına yardımcı olabilir ve anahtarı daha kolay tanınır hale getirebilir.

:::note
**Not**: Vanity adresinizdeki karakter sayısı arttıkça, oluşturma süresi de uzayacaktır.
:::

Bir vanity adresini `Solana CLI` kullanarak oluşturabilirsiniz:

```bash
solana-keygen grind --starts-with e1v1s:1
```

:::tip
Vanity adresleri oluştururken, benzersiz ve hatırlanabilir karakterler seçmek önemlidir. Bu, adresinizin diğerleriyle karışmamasını sağlar.
:::


Vanity adresleri hakkında daha fazla bilgi

Vanity adresleri genellikle kullanıcıların kimliklerini ya da markalarını yansıtan özel karakter dizilerini içerir. Adresinizi yaratırken, belirli bir tema ya da isim düşünmek, işinizi kolaylaştırabilir.



---

:::warning
Vanity adresleri oluştururken, seçtiğiniz karakter kombinasyonunun mümkün olan en kısa sürede oluşturulmasını sağlamak için karakter sayısını dengede tutmalısınız.
:::

Bu süreç, daha uzun adresler oluşturdukça daha karmaşık hale gelebilir. Gerçekleştirdiğiniz her işlemde, adresin güvenliğine dikkat etmek önemlidir.