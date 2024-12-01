---
description: Yerel Strapi kaynak sağlayıcısı hakkında bilgi ve kullanım seçenekleri.
keywords: [Strapi, kaynak sağlayıcı, veri transferi, ILocalFileSourceProviderOptions, Entity Service, Query Engine]
---

# Yerel Strapi Kaynak Sağlayıcı

Bu sağlayıcı, yapılandırılmış bir `strapi` örneğinden Entity Service ve Query Engine kullanarak veri alacaktır.

## Sağlayıcı Seçenekleri

Kabul edilen seçenekler `ILocalFileSourceProviderOptions` içinde tanımlanmıştır.

:::info Ek bilgi: Aşağıda yer alan seçenekler, `Strapi` ile entegrasyon sürecinizi kolaylaştırmak için tasarlanmıştır.

```typescript
  getStrapi(): Strapi.Strapi | Promise<Strapi.Strapi>; // yapılandırılmış bir Strapi örneğini döndürür

  autoDestroy?: boolean; // transferin sonunda getStrapi() tarafından döndürülen örneği kapatır
```

:::tip İpuçları: `autoDestroy` seçeneğini kullanarak kaynakları otomatik olarak yönetebilir ve bellek sızıntılarının önüne geçebilirsiniz.

---

## Kullanım Örnekleri

**Örnek 1:** Basit kullanım

```typescript
const strapiInstance = await yourProvider.getStrapi();
```

**Örnek 2:** Otomatik yok etme

```typescript
const strapiInstance = await yourProvider.getStrapi();
if (yourProvider.autoDestroy) {
    // kaynakları temizle
}
```

:::note İlginç not: `ILocalFileSourceProviderOptions` kullanarak, özel veri akışlarınızı yönetebilir ve optimize edebilirsiniz. 

--- 

## Daha Fazla Bilgi


Daha fazla bilgi için tıklayınız

`Entity Service` ve `Query Engine` hakkında daha derinlemesine bilgiye ihtiyacınız varsa, lütfen [Strapi dokümantasyonu](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html) adresini ziyaret edin.

