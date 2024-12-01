---
title: Hedef
description: Strapi uzaktan hedef sağlayıcısı, uzaktaki bir Strapi websocket sunucusuna bağlanarak veri aktarım süreçlerini yönetir. Bu içerik, uzaktan hedef sağlayıcısının yapılandırılması ve kullanımına dair çeşitli ayrıntıları sunmaktadır.
keywords: [Strapi, uzaktan hedef, websocket, veri aktarımı, sağlayıcı seçenekleri, API entegrasyonu]
---

# Strapi Uzaktan Hedef Sağlayıcısı

Strapi uzaktan hedef sağlayıcısı, uzaktaki bir Strapi websocket sunucusuna bağlanır ve aşamalar arasında **hareket etmek** için mesaj gönderir ve veri aktarır.

## Sağlayıcı Seçenekleri

Uzaktan hedef sağlayıcısı, yerel Strapi hedef sağlayıcısından alınan aynı `restore` ve `strategy` seçeneklerini kabul eder. Ayrıca, aşağıda açıklanan `url`, `auth` ve `retryMessageOptions` parametreleri eklenir.

```typescript
interface ITransferTokenAuth {
  type: 'token'; // kimlik doğrulama stratejisinin adı
  token: string; // aktarma token'ı
}

export interface IRemoteStrapiDestinationProviderOptions
  extends Pick<ILocalStrapiDestinationProviderOptions, 'restore' | 'strategy'> {
  url: URL; // uzaktaki Strapi yönetim panelinin url'si
  auth?: ITransferTokenAuth;
  retryMessageOptions?: {
    retryMessageTimeout: number; // bir mesaj için yanıt beklemek üzere beklenen milisaniye
    retryMessageMaxRetries: number; // aktarımı sonlandırmadan önce bir mesaj için maksimum tekrar sayısı
  };
}
```

:::tip
**Bağlantı Notu:** `url`, bağlantıyı sağlamak için `https` veya `http` protokolünü içermelidir; ardından bu bağlantı `wss` veya `ws`'ye dönüştürülecektir.
:::

:::warning
**Güvenlik Uyarısı:** Aktarma token'ının sağladığı yüksek erişim seviyesi göz önüne alındığında, güvenli bir bağlantı kuvvetle önerilmektedir.
:::