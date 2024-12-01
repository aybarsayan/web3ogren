---
title: Kaynak
description: Strapi uzaktan kaynak sağlayıcısı, uzaktaki bir Strapi websocket sunucusuna bağlanarak veri aktarımı yapar. Bu doküman, uzaktan kaynak sağlayıcısının yapılandırma seçeneklerini ve kullanımını açıklamaktadır.
keywords: [Strapi, uzaktan kaynak, websocket, veri aktarımı, sağlayıcılar]
---

# Strapi Uzaktan Kaynak Sağlayıcısı

Strapi uzaktan kaynak sağlayıcısı, uzaktaki bir Strapi websocket sunucusuna bağlanır ve aşamalar arasında geçiş yapmak ve veri çekmek için mesajlar gönderir.

## Sağlayıcı Seçenekleri

Uzaktan kaynak sağlayıcısı, aşağıda açıklanan `url`, `auth` ve `retryMessageOptions`'ı kabul eder.

```typescript
interface ITransferTokenAuth {
  type: 'token';
  token: string;
}

export interface IRemoteStrapiDestinationProviderOptions
  extends Pick<ILocalStrapiDestinationProviderOptions, 'restore' | 'strategy'> {
  url: URL;
  auth?: ITransferTokenAuth;
  retryMessageOptions?: {
    retryMessageTimeout: number; // bir mesaj için yanıt beklemeye yönelik milisaniye
    retryMessageMaxRetries: number; // aktarımı iptal etmeden önce bir mesaj için maksimum tekrar sayısı
  };
}
```

:::note
Not: `url`, bağlantıyı sağlamak için `wss` veya `ws`'ye dönüştürülecek olan `https` veya `http` protokolünü içermelidir. 
:::

:::warning
Aktarım tokeninin sağladığı yüksek erişim seviyesi göz önüne alındığında, güvenli bir bağlantı önerilir.
:::