---
title: Üretim Dağıtımı
seoTitle: Vue Üretim Dağıtımı Kılavuzu
sidebar_position: 1
description: Bu kılavuzda Vue uygulamanızın üretim dağıtımı ile ilgili önemli bilgiler sunulmaktadır. Geliştirme ve üretim arasındaki farklar ile yapı araçları kullanımı hakkında detaylara ulaşabilirsiniz.
tags: 
  - üretim dağıtımı
  - Vue
  - geliştirme
  - uygulama geliştirme
keywords: 
  - üretim
  - Vue
  - geliştirici
  - hata izleme
  - yapı araçları
---
## Üretim Dağıtımı {#production-deployment}

## Geliştirme vs. Üretim {#development-vs-production}

Geliştirme sırasında, Vue geliştirme deneyimini iyileştirmek için bir dizi özellik sunar:

- Yaygın hatalar ve tuzaklar için uyarılar
- Props / olay doğrulama
- `Reaktivite hata ayıklama kancaları`
- Devtools entegrasyonu

Ancak, bu özellikler üretimde işe yaramaz hale gelir. Bazı uyarı kontrolleri ayrıca küçük bir performans yükü de getirebilir. 

:::warning
Üretime geçerken, daha küçük yük boyutu ve daha iyi performans için tüm kullanılmayan, yalnızca geliştirme için olan kod dallarını bırakmalıyız.
:::

## Yapı Araçları Olmadan {#without-build-tools}

Eğer Vue'yu bir CDN'den veya kendi sunucunuzdan yükleyerek yapı aracı olmadan kullanıyorsanız, üretime geçerken üretim yapısını (`.prod.js` ile biten dist dosyaları) kullanmaya dikkat edin. Üretim yapıları, tüm geliştirme için olan kod dalları kaldırılarak önceden küçültülmüştür.

- Global yapı kullanıyorsanız ( `Vue` global'i üzerinden erişim): `vue.global.prod.js` kullanın.
- ESM yapısı kullanıyorsanız (yerel ESM importları üzerinden erişim): `vue.esm-browser.prod.js` kullanın.

Daha fazla bilgi için [dist dosyası kılavuzuna](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) başvurun.

## Yapı Araçları ile {#with-build-tools}

`create-vue` (Vite tabanlı) veya Vue CLI (webpack tabanlı) ile oluşturulan projeler, üretim yapıları için önceden yapılandırılmıştır.

:::info
Özel bir kurulum kullanıyorsanız, şu noktalara dikkat edin:
:::

1. `vue` `vue.runtime.esm-bundler.js` olarak çözülmeli.
2. `derleme zamanı özellik bayrakları` düzgün bir şekilde yapılandırılmalı.
3. process.env.NODE_ENV derleme sırasında `"production"` ile değiştirilmelidir.

Ek referanslar:

- [Vite üretim yapısı kılavuzu](https://vitejs.dev/guide/build.html)
- [Vite dağıtım kılavuzu](https://vitejs.dev/guide/static-deploy.html)
- [Vue CLI dağıtım kılavuzu](https://cli.vuejs.org/guide/deployment.html)

## Çalışma Zamanı Hatalarını İzleme {#tracking-runtime-errors}

`Uygulama düzeyi hata işleyicisi`, hataları izleme hizmetlerine bildirmek için kullanılabilir:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // hatayı izleme hizmetlerine bildir
}
```

:::note
[Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) ve [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) gibi hizmetler, Vue için resmi entegrasyonlar da sunmaktadır.
:::