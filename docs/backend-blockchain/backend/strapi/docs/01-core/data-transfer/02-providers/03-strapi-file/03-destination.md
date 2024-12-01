---
title: Hedef
description: Bu belge, Strapi Dosya Hedef Sağlayıcısının işlevselliğini ve seçeneklerini açıklamaktadır. Dosya hedef sağlayıcısı ile veri dosyaları oluşturma sürecini ve yapılandırma seçeneklerini keşfedin.
keywords: [Strapi, dosya hedef sağlayıcısı, veri transferi, sağlayıcı seçenekleri, ILocalFileDestinationProviderOptions]
---

# Strapi Dosya Hedef Sağlayıcısı

Bu sağlayıcı, bir Strapi Veri Dosyası oluşturacaktır.

:::warning
Not: Bu hedef sağlayıcı bir şema veya meta veri sağlamaz, bu nedenle asla bir şema eşleşmesi hatası veya sürüm doğrulama hatası bildirmeyecektir.
:::

## Sağlayıcı Seçenekleri

Kabul edilen seçenekler `ILocalFileDestinationProviderOptions` içinde tanımlanmıştır.

```typescript
  encryption: {
    enabled: boolean; // dosyanın şifreleneceği durum
    key?: string; // encryption.enabled true olduğunda kullanılacak anahtar
  };

  compression: {
    enabled: boolean; // dosyanın gzip ile sıkıştırılıp sıkıştırılmayacağı durumu
  };

  file: {
    path: string; // oluşturulacak dosya adı
    maxSize?: number; // tek bir yedek dosyasının maksimum boyutu
    maxSizeJsonl?: number; // bir sonraki dosya oluşturulmadan önce her jsonl dosyasındaki maksimum satır sayısı
  };
```

:::tip
**En iyi uygulamalar:** Dosya hedef sağlayıcısını kullanırken, dosyanın boyutunu ve şifreleme seçeneklerini göz önünde bulundurmanız önerilir.
:::