---
title: Genel Bakış
description: Uzaktan Strapi sağlayıcıları hakkında bilgi sağlayan bu içerik, websocket kullanarak nasıl bağlanacaklarını ve uzaktan transferlerin devre dışı bırakılmasını ele alıyor. Strapi ile entegre olabilecek sağlayıcılar hakkında bilgilerinizi artırın.
keywords: [Strapi, uzaktan sağlayıcılar, websocket, transfer, veri aktarımı]
---

# Uzaktan Strapi Sağlayıcıları

Uzaktan Strapi sağlayıcıları, bir websocket kullanarak Strapi'nin bir örneğine ağa bağlı olarak bağlanır.

Dahili olarak, uzaktan Strapi sağlayıcıları websocket isteklerini çalıştıkları örneğin yerel Strapi sağlayıcısına eşler.

:::info
Uzaktan transfer sağlayıcılarını kullanmak için, uzaktan Strapi sunucusunun `config/admin.js` dosyasında `transfer.token.salt` için bir değere sahip olması gerekir ve uzaktan transfer özelliği devre dışı bırakılmamalıdır.
:::

## Uzaktan Transferleri Devre Dışı Bırakma

Bir sunucunun uzaktan transfer özelliği, sunucu yapılandırma değerini ayarlayarak tamamen devre dışı bırakılabilir:

```javascript
// in config/server.js
{
  transfer: {
    remote: {
      enabled: false;
    }
  }
  // ...sunucu yapılandırmanızın geri kalanı
}
```

:::tip
Uzaktan transfer özelliğini devre dışı bırakmak, veri güvenliğini artırabilir. Ancak, uzaktan erişim gereksinimlerinizi göz önünde bulundurmalısınız.
:::