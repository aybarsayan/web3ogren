---
title: Giriş
description: Bu içerik, veri transfer sağlayıcıları ve bunların işlevleri hakkında bilgi sunmaktadır. Strapi'nin kaynak ve varış noktası sağlayıcıları ile kendi sağlayıcılarınızı oluşturma konusunda ipuçları verilmektedir.
keywords: [veri transferi, sağlayıcılar, Strapi, medya varlıkları, arayüzler]
---

# Veri Transfer Sağlayıcıları

Veri transfer sağlayıcıları, bir transfer sırasında veri akışı için arayüzlerdir.

`Kaynak sağlayıcıları`, transferin her aşaması için okuma akışları sağlar.

`Varış noktası sağlayıcıları`, transferin her aşaması için yazma akışları sağlar.

Strapi, aşağıdakiler için hem kaynak hem de varış noktası sağlayıcıları sunar:

- `Strapi dosyası`: transfer süreci için tasarlanmış standart bir dosya formatı
- `Yerel Strapi`: verileri yönetmek için yapılandırılmış veritabanı bağlantısını kullanan yerel bir Strapi projesine bağlantı
- `Uzak Strapi`: çalışan bir uzaktan (ağ) Strapi örneğine websocket arayüzü ekleyen yerel Strapi sağlayıcısının bir sarıcı

> **Önemli Nokta:** Her sağlayıcı, veri transferi için aynı arayüzü sağlamalıdır, ancak genellikle sağlayıcıyı başlatırken geçirilmesi gereken kendi benzersiz seçeneklerini içerecektir.  
> — Veritabanı Yönetimi Ekibi

## Kendi Sağlayıcılarınızı Oluşturma

Kendi sağlayıcılarınızı oluşturmak için, `packages/core/data-transfer/types/providers.d.ts` içinde tanımlanan `ISourceProvider` ve `IDestinationProvider` arayüz(ler)ini uygulamanız gerekir.

:::tip
Her iki sağlayıcıyı da oluşturmanız gerekli değildir, yalnızca kullanımınız için gerekli olan kısmı oluşturmanız yeterlidir.
:::

Örnekler için, yerel Strapi sağlayıcısı gibi mevcut sağlayıcılara bakın.

## Varlık Transferleri

Şu anda, tüm veri-transfer sağlayıcıları yalnızca yerel medya varlıklarını (`/upload` klasörü) işler. Sağlayıcı medyası şu anda geliştirme aşamasındadır. 

> **Dikkat:** Bu nedenle, varlık transferlerine ilişkin her şey - Strapi dosya yapısı, kurtarma stratejisi ve varlıklar için geri alma dahil - şu anda `unstable` olarak kabul edilmekte ve yakın bir gelecekte değişme olasılığı taşımaktadır.  
> — Geliştirme Takımı