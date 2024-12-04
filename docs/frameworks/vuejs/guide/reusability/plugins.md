---
title: Eklentiler
seoTitle: Vue.js Eklentileri Giriş ve Yazma
sidebar_position: 1
description: Eklentiler, Vue uygulamalarına işlevsellik eklemeye yarayan bileşenlerdir. Bu içerikte eklentilerin nasıl yazılacağı ve kullanılacağı hakkında bilgiler bulacaksınız.
tags: 
  - vue
  - eklenti
  - uygulama geliştirici
  - vuejs
  - javascript
keywords: 
  - eklenti
  - vue
  - uygulama geliştirici
  - javascript
---
## Eklentiler {#plugins}

## Giriş {#introduction}

Eklentiler, genellikle Vue'ye uygulama düzeyinde işlevsellik ekleyen, kendine ait koda sahip bileşenlerdir. Bir eklentiyi nasıl kurduğumuzu görelim:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* isteğe bağlı seçenekler */
})
```

Bir eklenti, `install()` yöntemini açığa çıkaran bir nesne ya da sadece kendisi kurulum işlevi olarak hareket eden bir fonksiyon olarak tanımlanır. Kurulum işlevi, `app.use()` metoduna eklenen opsiyonlarla birlikte `uygulama örneğini` alır:

```js
const myPlugin = {
  install(app, options) {
    // uygulamayı yapılandır
  }
}
```

Bir eklenti için kesin bir kapsam tanımlanmasa da, eklentilerin faydalı olabileceği yaygın senaryolar şunlardır:

1. `app.component()` ve `app.directive()` ile bir veya daha fazla global bileşen veya özel direktifi kaydetmek.

2. Bir kaynağı `enjekte edilebilir` hale getirmek için `app.provide()` metodunu çağırmak.

3. `app.config.globalProperties` aracılığıyla bazı global örnek özellikleri veya yöntemleri eklemek.

4. Yukarıdakilerin bir kombinasyonunu gerçekleştirmesi gereken bir kütüphane (örn. [vue-router](https://github.com/vuejs/vue-router-next)).

## Eklenti Yazma {#writing-a-plugin}

Kendi Vue.js eklentilerinizi yaratmayı daha iyi anlamak için, `i18n` (Uluslararasılaşma anlamına gelen [Internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization)) dizelerini görüntüleyen çok basit bir eklenti versiyonu oluşturacağız.

Eklenti nesnesini ayarlayarak başlayalım. Mantığı kapsüllemek ve ayırmak için bunu ayrı bir dosyada oluşturup aşağıdaki gibi dışa aktarmak önerilir.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // Eklenti kodu buraya gelecek
  }
}
```

Bir çeviri işlevi oluşturmak istiyoruz. Bu işlev, kullanıcı tarafından sağlanan seçeneklerdeki çevrilmiş dizini bulmak için kullanacağımız nokta ile ayrılmış `key` dizisini alacaktır. Bu, şablonlardaki beklenen kullanım şeklidir:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Bu işlevin tüm şablonlarda global olarak mevcut olması gerektiğinden, eklentimizde `app.config.globalProperties` üzerinde kuracağız:

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // global olarak erişilebilir bir $translate() yöntemi enjekte et
    app.config.globalProperties.$translate = (key) => {
      // `options` içindeki iç içe bir özelliği almak için `key` kullanarak
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

`$translate` işlevimiz, `greetings.hello` gibi bir diziyi alacak, kullanıcı tarafından sağlanan yapılandırmanın içinde bakacak ve çevrilmiş değeri döndürecektir.

Çevrilmiş anahtarları içeren nesne, kurulum sırasında `app.use()` metoduna ek parametreler olarak eklentiye iletilmelidir:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Artık, başlangıç ifademiz `$translate('greetings.hello')`, çalışma zamanında `Bonjour!` ile değiştirilecektir.

Ayrıca bakınız: `Global Özellikleri Artırma` 

:::tip
Global özellikleri dikkatli kullanın, çünkü farklı eklentiler tarafından enjekte edilen çok fazla global özellik kullanılması durumunda karışıklık oluşabilir.
:::

### Eklentiler ile Sağlama / Enjekte Etme {#provide-inject-with-plugins}

Eklentiler ayrıca, kullanıcılara bir fonksiyon veya özellik sağlamak için `inject` kullanmamıza da olanak tanır. Örneğin, uygulamanın çeviri nesnesini kullanabilmesi için `options` parametresine erişmesine izin verebiliriz.

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Eklenti kullanıcıları şimdi `i18n` anahtarını kullanarak eklenti seçeneklerini bileşenlerine enjekte edebilecekler:



```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```




```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```



### NPM İçin Paketleme

Eklentinizin başkalarının da kullanabilmesi için daha fazla derlenmesine ve yayımlanmasına ihtiyaç duyuyorsanız, [Vite'nin Kütüphane Modu bölümüne](https://vitejs.dev/guide/build.html#library-mode) bakın.