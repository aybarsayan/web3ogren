---
title: Hedef
description: Bu belge, yerel Strapi hedef sağlayıcısının veri transferi işlemleri için kullanılan yapılandırma seçeneklerini ve stratejilerini açıklamaktadır. Ayrıca geri alma mekanizması ve strateji detaylarıyla ilgili bilgi vermektedir.
keywords: [Strapi, veri transferi, yerel sağlayıcı, geri alma, çakışma yönetimi]
---

# Yerel Strapi Hedef Sağlayıcısı

Bu sağlayıcı, verileri başlatılmış bir `strapi` örneğine, Entity Service ve Sorgu Motoru kullanarak ekleyecektir.

## Sağlayıcı Seçenekleri

Kabul edilen seçenekler `ILocalFileSourceProviderOptions` içinde tanımlanmıştır.

```typescript
  getStrapi(): Strapi.Strapi | Promise<Strapi.Strapi>; // başlatılmış bir Strapi örneği döner
  autoDestroy?: boolean; // transferin sonunda getStrapi() tarafından döndürülen örneği kapatır
  restore?: restore.IRestoreOptions; // strateji 'restore' olduğunda kullanılacak seçenekler
  strategy: 'restore'; // çakışma yönetim stratejisi; şu anda yalnızca restore stratejisi mevcuttur
```

`strategy`, kullanılan çakışma yönetim stratejisini tanımlar. Şu anda, yalnızca `"restore"` seçeneği mevcuttur.

### Restore

> "Restore" çakışma yönetim stratejisi, transferden önce mevcut Strapi verilerini siler ve böylece herhangi bir çakışmayı önler.  
> — Strapi Dokümantasyonu

Aşağıdaki restore seçenekleri mevcuttur:

```typescript
export interface IRestoreOptions {
  assets?: boolean; // transferden önce medya kütüphanesi dosyalarını sil
  configuration?: {
    webhook?: boolean; // transferden önce webhooks'u sil
    coreStore?: boolean; // transferden önce çekirdek depolama alanını sil
  };
  entities?: {
    include?: string[]; // yalnızca bu aşama varlıklarını transferden önce sil
    exclude?: string[]; // bu aşama varlıklarını silme kapsamından çıkar
    filters?: ((contentType: ContentTypeSchema) => boolean)[]; // bir içerik türünü silme kapsamından çıkarmak için özel filtreler
    params?: { [uid: string]: unknown }; // özel silme işlemleri için transferden önce deleteMany'ye geçirilen params nesnesi
  };
}
```

### Rollbacks

Bu yerel Strapi hedef sağlayıcısı, hata durumunda otomatik olarak bir geri alma mekanizması sağlar.

:::info
Strapi verileri için bu, restore ve veri ekleme işlemini içeren bir veritabanı işlemi ile gerçekleştirilir; başarıyla tamamlandığında onaylanır, başarısızlıkta ise geri alınır.
:::

Strapi varlıkları (örneğin, medya kütüphanesi dosyaları) için bu işlem, mevcut varlıkları `uploads_backup_{timestamp}` adlı bir yedek dizine geçici olarak taşımaya çalışarak yapılır. Başarılı olduğunda silinir veya başarısızlık durumunda, başarısız aktarım dosyaları silinir ve yedek yerinde geri getirilir. Bazı başarısızlık durumlarında, yedek dosyaları geri yerine koymak mümkün olmayabilir, bu nedenle yedek varlık dosyalarını manuel olarak geri yüklemeniz gerekebilir.

:::warning
Yazma erişimi gerekliliği nedeniyle, varlık klasörünü taşıma yetkisi olmayan ortamlar (okuma-yazma olarak montelenmiş /uploads gibi sanal ortamlar için yaygındır) transferde varlıkları dahil edemeyecek ve varlık aşaması dışarıda bırakılmalıdır.
:::