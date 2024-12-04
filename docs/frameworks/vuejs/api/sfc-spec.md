---
title: SFC Sözdizimi Özellikleri
seoTitle: Vue Tek Dosya Bileşeni Sözdizimi Özellikleri
sidebar_position: 1
description: Vue Tek Dosya Bileşenlerinin sözdizimi özelliklerini ve yapılarını keşfedin. Bu belgede , ,  ve özel bloklar hakkında bilgi bulunur.
tags: 
  - Vue
  - SFC
  - Sözdizimi
  - Web Geliştirme
keywords: 
  - Vue
  - Tek Dosya Bileşeni
  - SFC
  - Web Geliştirici
---
## SFC Sözdizimi Özellikleri {#sfc-syntax-specification}

## Genel Bakış {#overview}

Bir Vue Tek Dosya Bileşeni (SFC), geleneksel olarak `*.vue` dosya uzantısı kullanarak, bir Vue bileşenini tanımlamak için HTML benzeri bir sözdizimi kullanan özel bir dosya formatıdır. Bir Vue SFC, sözdizimsel olarak HTML ile uyumludur.

Her `*.vue` dosyası, üç tür üst düzey dil bloğu içerir: ``, ``, ve ``, ayrıca isteğe bağlı olarak ek özel bloklar:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  Bu, örneğin bileşen için belgelendirme olabilir.
</custom1>
```

## Dil Blokları {#language-blocks}

### `` {#template}

- Her `*.vue` dosyası en fazla bir üst düzey `` bloğu içerebilir.

- İçerikler `@vue/compiler-dom`'a çıkarılacak, JavaScript render fonksiyonlarına ön işlem yapılacak ve dışa aktarılan bileşene `render` seçeneği olarak eklenir.

### `` {#script}

- Her `*.vue` dosyası en fazla bir `` bloğu içerebilir (`` hariç).

- Script bir ES Modülü olarak çalıştırılır.

- **Varsayılan ihracat**, bir Vue bileşeni seçenek nesnesi olmalıdır, ister sade bir nesne olarak, ister `defineComponent` dönüş değeri olarak.

### `` {#script-setup}

- Her `*.vue` dosyası en fazla bir `` bloğu içerebilir (normal `` hariç).

- Script ön işlenir ve bileşenin `setup()` fonksiyonu olarak kullanılır, bu da her bileşen örneği için çalıştırılacağı anlamına gelir. `` içindeki üst düzey bağlamalar otomatik olarak şablona açığa çıkar. Daha fazla bilgi için ``'a özel belgelere` bakın.

### `` {#style}

- Tek bir `*.vue` dosyası birden fazla `` etiketi içerebilir.

- Bir `` etiketi `scoped` veya `module` nitelikleri alabilir (daha fazla bilgi için `SFC Stil Özellikleri` bölümüne bakın) ve stilleri mevcut bileşene kapsüllemeye yardımcı olur. Farklı kapsülleme modlarına sahip birden fazla `` etiketi aynı bileşende karıştırılabilir.

### Özel Bloklar {#custom-blocks}

Herhangi bir proje özel ihtiyacı için `*.vue` dosyasında ek özel bloklar dahil edilebilir, örneğin bir `` bloğu. Özel blokların bazı gerçek dünya örnekleri şunlardır:

- [Gridsome: ``](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: ``](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: ``](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#i18n-custom-block)

Özel Blokların işlenmesi araçlara bağlı olacaktır - kendi özel blok entegrasyonlarınızı oluşturmak istiyorsanız, daha fazla detay için `SFC özel blok entegrasyonları araçları bölümüne` bakın.

## Otomatik İsim Çıkartma {#automatic-name-inference}

Bir SFC, bileşenin adını aşağıdaki durumlarda **dosya adından** otomatik çıkarır:

- Geliştirici uyarı biçimlendirmesi
- Geliştirici Araçları incelemesi
- Kendine referans verme, örneğin `FooBar.vue` adlı bir dosya şablonunda kendisine `` olarak atıfta bulunabilir. Bu, açıkça kaydedilmiş/ithal edilmiş bileşenlerden daha düşük önceliğe sahiptir.

## Ön İşlemciler {#pre-processors}

Bloklar `lang` niteliğini kullanarak ön işlemci dillerini belirtebilir. En yaygın durum, `` bloğu için TypeScript kullanmaktır:

```vue-html
<script lang="ts">
  // TypeScript kullan
</script>
```

`lang`, herhangi bir bloğa uygulanabilir - örneğin `` için [Sass](https://sass-lang.com/) ve `` için [Pug](https://pugjs.org/api/getting-started.html) kullanabiliriz:

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Çeşitli ön işleyicilerle entegrasyon, araç zincirine bağlı olarak farklılık gösterebilir. Örnekler için ilgili belgelere göz atın:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## `src` İthalatları {#src-imports}

`*.vue` bileşenlerinizi birden fazla dosyaya ayırmayı tercih ediyorsanız, bir dil bloğu için dış bir dosyayı içe aktarmak amacıyla `src` niteliğini kullanabilirsiniz:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Dikkat edin ki `src` ithalatları webpack modül istekleri ile aynı yol çözümleme kurallarını izler, bu da demektir ki:

- Göreli yollar `./` ile başlamalıdır
- npm bağımlılıklarından kaynakları içe aktarabilirsiniz:

```vue
<!-- kurulmuş "todomvc-app-css" npm paketinden bir dosyayı içe aktar -->
<style src="todomvc-app-css/index.css"/>
```

`src` ithalatları ayrıca özel bloklarla da çalışır, örneğin:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

:::warning Not
`src` içerisinde takma adlar kullanırken, `~` ile başlamayın, çünkü onun sonrasındaki her şey bir modül isteği olarak yorumlanır. Bu, node modülleri içindeki varlıklara referans verebileceğiniz anlamına gelir:
```vue
<img src="~some-npm-package/foo.png">
```
:::

## Yorumlar {#comments}

Her blok içerisinde, kullanılan dilin yorum sözdizimini (HTML, CSS, JavaScript, Pug vb.) kullanmalısınız. Üst düzey yorumlar için HTML yorum sözdizimini kullanın: ``