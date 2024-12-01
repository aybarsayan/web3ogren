---
title: Kaynak
description: Bu belge, Strapi dosya kaynak sağlayıcısını ve seçeneklerini açıklamaktadır. Dosya yükleme, şifreleme ve sıkıştırma süreçleri hakkında bilgi verir.
keywords: [Strapi, veri sağlama, dosya yükleme, şifreleme, sıkıştırma, ILocalFileSourceProviderOptions, data transfer]
---

# Strapi Dosya Kaynak Sağlayıcısı

Bu sağlayıcı, bir Strapi Veri Dosyasını veri kaynağı olarak açar ve okur.

## Sağlayıcı Seçenekleri

Kabul edilen seçenekler `ILocalFileSourceProviderOptions` içinde tanımlanmıştır.

```typescript
  file: {
    path: string; // yüklenecek dosya
  };

  encryption: {
    enabled: boolean; // dosya şifrelenmişse (ve şifre çözülmesi gerekiyorsa)
    key?: string; // dosyayı şifre çözmek için anahtar
  };

  compression: {
    enabled: boolean; // dosya sıkıştırılmışsa (ve açılması gerekiyorsa)
  };
```

:::info
Not: Strapi CLI bir dosyayı içeri aktarmaya çalıştığında, yüklenen dosyanın uzantısına göre sıkıştırma ve şifreleme seçenekleri ayarlanır. Örneğin, `.gz` uzantısına sahip bir dosya "sıkıştır" seçeneğini ayarlayacak ve `.enc` uzantısına sahip bir dosya ise "şifrele" seçeneğini ayarlayacaktır.
:::

Transfer motorunu programlı olarak kullanırken, yüklenecek dosyanın şifrelenip şifrelenmeyeceğine veya sıkıştırılıp sıkıştırılmayacağına bu seçenekleri ayarlayarak karar verebilirsiniz.