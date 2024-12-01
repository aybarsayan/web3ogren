---
title: Giriş
description: Bu sayfa, Yönetici'deki Kurumsal Sürüme ait özelliklerin tanıtımını ve yeni özelliklerin entegrasyonu hakkında bilgi sunmaktadır. Kullanıcıların, Strapi'de Ekstra Özellikler'e nasıl erişebileceğine dair detaylar içerir.
keywords: [kurumsal sürüm, Strapi, EE özellikleri, yönetici, geliştirme]
---

# Yönetici Kurumsal Sürümü

Bu bölüm, Yönetici'deki Kurumsal Sürüme ait tüm özelliklerin genel bir bakışını sunmaktadır:

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items} />
```

---

# EE özelliklerini CE projelerinde tanıtma

:::info
Strapi'de yeni bir EE özelliği eklendiğinde, bu özelliğin ayarlar menüsünde kendini tanıttığından emin olunmalıdır. Aşağıdaki koşul, bu erişimi sağlamak için gerekli adımları içermektedir.
:::

Strapi'de yeni bir EE özelliği eklendiğinde, ayarlar menüsünde bu özelliğin CE'de kendini tanıttığından emin olmak için aşağıdaki koşulu eklemelisiniz:

`packages/core/admin/admin/src/hooks/useSettingsMenu/index.js`

```js
...

 ...(!window.strapi.features.isEnabled(window.strapi.features.NEW_EE_FEATURE) &&
    window.strapi?.flags?.promoteEE
      ? [
          {
            intlLabel: {
              id: 'Settings.new-ee-feature.page.title',
              defaultMessage: 'YENİ EE ÖZELLİĞİ',
            },
            to: '/settings/purchase-new-ee-feature',
            id: 'new-ee-feature',
            licenseOnly: true,
          },
        ]
      : []),
...
```

:::tip
Kurumsal özelliklerin etkinliğini sağlamak için, yukarıdaki kod üzerinde belirtilen koşulları dikkatlice kontrol edin. Böylece kullanıcı deneyimini iyileştirmiş olursunuz.
:::

---