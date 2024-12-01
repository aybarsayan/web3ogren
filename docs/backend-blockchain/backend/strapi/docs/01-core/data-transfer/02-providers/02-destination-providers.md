---
description: Hedef sağlayıcılar, veri transferi süreçlerinde önemli bir rol oynar. Bu belge, hedef sağlayıcı yapısını ve işlevselliğini detaylı bir şekilde ele almaktadır.
keywords: [hedef sağlayıcıları, veri transferi, yazılım, arayüz, akış yönetimi]
---

# Hedef Sağlayıcılar

## Hedef sağlayıcı yapısı

Bir hedef sağlayıcısı, `packages/core/data-transfer/types/providers.d.ts` dosyasında bulunan IDestinationProvider arayüzünü uygulamalıdır. 

:::tip
Hedef sağlayıcıları, veri transferi süreçlerinde akış yönetimi için kritik öneme sahiptir. 
:::

Kısaca, her aşama için bir Writable akış sağlayan `create{_stage_}WriteStream()` yöntemlerinin bir setini sağlar; bu akış, okunabilir kaynak sağlayıcı akışından geçirilmiş her varlık, bağlantı (ilişki), varlık (dosya), yapılandırma varlığı veya içerik türü şemasını alacaktır. 

> "Hedef sağlayıcıları, yazılım mimarisinin ayrılmaz bir parçasıdır."  
> — Teknik Dokümantasyon Uzmanı

---