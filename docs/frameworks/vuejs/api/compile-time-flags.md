---
title: Derleme Zamanı Bayrakları
seoTitle: Compile-Time Flags in Vue
sidebar_position: 4
description: Bu belge, Vueda derleme zamanı bayraklarının nasıl yapılandırılacağını ve ne işe yaradığını özetlemektedir. Kullanıcıların bu bayrakları yapılandırarak daha etkili paketler oluşturmasına yardımcı olur.
tags: 
  - Vue
  - derleme zamanı bayrakları
  - yapılandırma
keywords: 
  - derleme zamanı
  - Vue yapılandırması
  - özellikler
  - paket boyutu
---
## Derleme Zamanı Bayrakları {#compile-time-flags}

:::tip
Derleme zamanı bayrakları yalnızca `esm-bundler` Vue yapılandırması kullanıldığında geçerlidir (yani `vue/dist/vue.esm-bundler.js`).
:::

Vue kullanırken bir yapı adımında, belirli özellikleri etkinleştirmek/devre dışı bırakmak için bir dizi derleme zamanı bayrağını yapılandırmak mümkündür. Derleme zamanı bayrakları kullanmanın avantajı, bu şekilde devre dışı bırakılan özelliklerin son paketlerden ağaç titizliği ile kaldırılabilmesidir.

Bu bayraklar açıkça yapılandırılmasa bile Vue çalışacaktır. Ancak, ilgili özelliklerin uygun bir şekilde kaldırılabilmesi için her zaman yapılandırılması önerilir.

Yapı aracınıza bağlı olarak bu bayrakları nasıl yapılandıracağınızı görmek için `Yapılandırma Kılavuzları` bölümüne bakabilirsiniz.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Varsayılan:** `true`

  Seçenekler API desteğini etkinleştirir/devre dışı bırakır. Bunu devre dışı bırakmak, daha küçük paketler oluşturur, ancak bu, 3. parti kütüphanelerle uyumluluğu etkileyebilir; eğer bunlar Seçenekler API'sine bağlıysa.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Varsayılan:** `false`

  Üretim yapılandırmalarında geliştirici araçları desteğini etkinleştirir/devre dışı bırakır. Bu, pakete daha fazla kod eklenmesine neden olur, bu yüzden yalnızca hata ayıklama amaçları için etkinleştirilmesi önerilir.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **Varsayılan:** `false`

  Üretim yapılandırmalarında hidratasyon uyumsuzlukları için ayrıntılı uyarıları etkinleştirir/devre dışı bırakır. Bu, pakette daha fazla kod eklenmesine neden olur, bu yüzden yalnızca hata ayıklama amaçları için etkinleştirilmesi önerilir.

- Sadece 3.4+ sürümleriinde mevcuttur

## Yapılandırma Kılavuzları {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` bu bayraklar için varsayılan değerleri otomatik olarak sağlar. Varsayılan değerleri değiştirmek için Vite'in [`define` yapılandırma seçeneğini](https://vitejs.dev/config/shared-options.html#define) kullanın:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // üretim yapılandırmasında hidratasyon uyumsuzluk detaylarını etkinleştir
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` bu bayrakların bazıları için varsayılan değerleri otomatik olarak sağlar. Değerleri yapılandırmak/değiştirmek için:

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Bayraklar, webpack'in [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) kullanılarak tanımlanmalıdır:

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Bayraklar, [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) kullanılarak tanımlanmalıdır:

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}