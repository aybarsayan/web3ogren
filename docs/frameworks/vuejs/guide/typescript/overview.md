---
title: Vueyi TypeScript ile Kullanma
seoTitle: Vue and TypeScript A Comprehensive Guide
sidebar_position: 1
description: Bu belge, Vue ile TypeScript kullanarak geliştiricilerin karşılaşabileceği yaygın hataları en aza indirmek ve uygulama geliştirme sürecini iyileştirmek için gerekli bilgileri sunmaktadır. Ayrıca, IDE desteği ve yapılandırma ayarları hakkında da ayrıntılı bilgi bulunmaktadır.
tags: 
  - Vue
  - TypeScript
  - Geliştirici
  - geliştirme araçları
  - Vite
keywords: 
  - Vue
  - TypeScript
  - Geliştirici
  - geliştirme araçları
  - Vite
---
## Vue'yi TypeScript ile Kullanma {#using-vue-with-typescript}

TypeScript gibi bir tip sistemi, derleme zamanında statik analiz ile birçok yaygın hatayı tespit edebilir. Bu, üretimde çalışma zamanı hatalarını azaltır ve büyük ölçekli uygulamalarda kodu daha güvenle yeniden düzenlememize olanak tanır. TypeScript ayrıca IDE'lerde tip tabanlı otomatik tamamlama aracılığıyla geliştirici ergonomisini artırır.

Vue, kendisi TypeScript ile yazılmıştır ve birinci sınıf TypeScript desteği sunar. Tüm resmi Vue paketleri, kutudan çıkar çıkmaz çalışması gereken toplu tip bildirimleri ile birlikte gelir.

## Proje Ayarları {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), resmi proje iskeletleme aracı, [Vite](https://vitejs.dev/)-tabanlı, TypeScript uyumlu bir Vue projesi oluşturma seçenekleri sunar.

### Genel Bakış {#overview}

Vite tabanlı bir ayar ile, geliştirici sunucusu ve paketleyici sadece dönüştürme işlemi yapmaktadır ve herhangi bir tip kontrolü gerçekleştirmemektedir. Bu, Vite geliştirici sunucusunun TypeScript kullanırken bile hızını korumasını sağlar.

- Geliştirme sırasında tip hataları hakkında anında geri bildirim almak için iyi bir `IDE ayarı` kullanmanızı öneririz.

- SFC'ler kullanıyorsanız, komut satırı tip kontrolü ve tip bildirimleri oluşturma için [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) yardımcı aracını kullanın. `vue-tsc`, TypeScript'in kendi komut satırı arayüzü olan `tsc` etrafında bir sargıdır. Çoğunlukla `tsc` ile aynı şekilde çalışır, ancak TypeScript dosyalarının yanı sıra Vue SFC'lerini de destekler. `vue-tsc`'yi Vite geliştirici sunucusuna paralel olarak izleme modunda çalıştırabilir veya kontrolleri ayrı bir iş parçacığında yürüten [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) gibi bir Vite eklentisi kullanabilirsiniz.

- Vue CLI de TypeScript desteği sağlamaktadır, ancak artık önerilmemektedir. `Aşağıdaki notlara` bakın.

### IDE Desteği {#ide-support}

:::info
[Visual Studio Code](https://code.visualstudio.com/) (VS Code), TypeScript için harika kutudan çıkar çıkmaz desteği nedeniyle güçlü bir şekilde önerilir.
:::

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (önceden Volar), Vue SFC'leri içerisinde TypeScript desteği sağlayan resmi VS Code uzantısıdır, bununla birlikte birçok başka harika özellik sunar.

    :::tip
    Vue - Official uzantısı, Vue 2 için önceki resmi VS Code uzantımız olan [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)'u değiştirmektedir. Eğer şuan Vetur kuruluysa, onu Vue 3 projelerinde devre dışı bırakmayı unutmayın.
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) da hem TypeScript hem de Vue için kutudan çıkar çıkmaz destek sunar. Diğer JetBrains IDE'leri de ya kutudan çıkar çıkmaz ya da [ücretsiz bir eklenti](https://plugins.jetbrains.com/plugin/9442-vue-js) aracılığıyla destekler. 2023.2 sürümünden itibaren WebStorm ve Vue Eklentisi, Vue Language Server için yerleşik destekle gelir. Vue servisinin, Ayarlar > Diller ve Çerçeveler > TypeScript > Vue altında tüm TypeScript sürümlerinde Volar entegrasyonunu kullanacak şekilde ayarlanabilir. Varsayılan olarak, 5.0 ve üzeri TypeScript sürümleri için Volar kullanılacaktır.

### `tsconfig.json`'ı Yapılandırma {#configuring-tsconfig-json}

`create-vue` aracılığıyla oluşturulan projeler, önceden yapılandırılmış `tsconfig.json` içermektedir. Temel yapılandırma, [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) paketinde soyutlanmıştır. Projede, farklı ortamlarda (örneğin, uygulama kodu ve test kodu, farklı global değişkenlere sahip olmalıdır) doğru tiplerin sağlanmasını sağlamak için [Proje Referansları](https://www.typescriptlang.org/docs/handbook/project-references.html) kullanıyoruz.

`tsconfig.json`'ı manuel olarak yapılandırırken, bazı dikkate değer seçenekler şunlardır:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) değeri `true` olarak ayarlanmıştır çünkü Vite, TypeScript'i dönüştürmek için [esbuild](https://esbuild.github.io/) kullanır ve tek dosya dönüştürme sınırlamalarına tabi olabilir. [`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) , [`isolatedModules`](https://github.com/microsoft/TypeScript/issues/53601) 'in bir üst kümesidir ve iyi bir seçimdir - bunu [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) kullanmaktadır.

- Eğer Seçenekler API'si kullanıyorsanız, `this`'in bileşen seçeneklerindeki tip kontrolünü sağlamak için [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) değerini `true` olarak ayarlamanız (veya en azından [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) özelliğini aktif etmeniz, bu `strict` bayrağının bir parçasıdır) gerekir. Aksi takdirde `this`, `any` olarak değerlendirilecektir.

- Eğer yapılandırma aracınızda `@/*` gibi resolver takma adları ayarladıysanız, bunu TypeScript için de [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) aracılığıyla ayarlamanız gerekir.

- Vue ile TSX kullanmayı planlıyorsanız, [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) değerini `"preserve"` olarak ayarlayın ve [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) değerini `"vue"` olarak ayarlayın.

Ayrıca bakın:

- [Resmi TypeScript derleyici seçenekleri belgeleri](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript derleme sorunları](https://esbuild.github.io/content-types/#typescript-caveats)

### Vue CLI ve `ts-loader` Hakkında Not {#note-on-vue-cli-and-ts-loader}

:::warning
Vue CLI gibi webpack tabanlı ayarlarda, modül dönüştürme hattı bağlamında, örneğin `ts-loader` ile tip kontrolü yapması yaygındır. Ancak bu temiz bir çözüm değildir çünkü tip sistemi, tip kontrollerini gerçekleştirmek için tüm modül grafiği hakkında bilgiye ihtiyaç duyar.
:::

Bu, aşağıdaki sorunlara yol açar:

- `ts-loader` yalnızca dönüştürme sonrası kodu tip kontrol edebilir. Bu, IDE'lerde veya `vue-tsc`'den görülen hatalarla örtüşmez; zira bu hatalar doğrudan kaynak koda geri döner.

- Tip kontrolü yavaş olabilir. Kod dönüşümleri ile aynı iş parçacığında / süreçte gerçekleştirildiğinde, bu, tüm uygulamanın derleme hızını önemli ölçüde etkiler.

- Zaten IDE'mizde ayrı bir süreçte çalışan bir tip kontrolümüz var, bu nedenle geliştirici deneyimini yavaşlatmanın maliyeti, iyi bir denge değildir.

Eğer şu anda Vue 3 + TypeScript'i Vue CLI aracılığıyla kullanıyorsanız, Vite'ye geçiş yapmanızı kuvvetle öneriyoruz. Ayrıca sadece dönüştürme işlemi yapan TS desteği etkinleştirmek için CLI seçenekleri üzerinde çalışıyoruz, böylelikle tip kontrolü için `vue-tsc`'ye geçiş yapabilirsiniz.

## Genel Kullanım Notları {#general-usage-notes}

### `defineComponent()` {#definecomponent}

TypeScript'in bileşen seçenekleri içindeki tipleri doğru bir şekilde çıkarmasını sağlamak için, bileşenleri `defineComponent()` ile tanımlamamız gerekiyor:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // tip çıkarımı etkin
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // tip: string | undefined
    this.msg // tip: string
    this.count // tip: number
  }
})
```

`defineComponent()` ayrıca `` olmadan Composition API kullanırken `setup()`'a geçirilen props'ların çıkarımını destekler:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // tip çıkarımı etkin
  props: {
    message: String
  },
  setup(props) {
    props.message // tip: string | undefined
  }
})
```

Ayrıca bakın:

- `webpack Treeshaking Notu`
- [`defineComponent` için tip testleri](https://github.com/vuejs/core/blob/main/packages-private/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` ayrıca düz JavaScript ile tanımlanan bileşenler için tip çıkarımını da etkinleştirir.
:::

### Tek Dosya Bileşenlerinde Kullanım {#usage-in-single-file-components}

SFC'lerde TypeScript kullanmak için, `` etiketlerine `lang="ts"` özelliğini ekleyin. `lang="ts"` mevcut olduğunda, tüm şablon ifadeleri daha sıkı tip kontrolünden faydalanır.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- tip kontrolü ve otomatik tamamlama etkin -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` ayrıca `` ile de kullanılabilir:

```vue
<script setup lang="ts">
// TypeScript etkin
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- tip kontrolü ve otomatik tamamlama etkin -->
  {{ count.toFixed(2) }}
</template>
```

### Şablonlarda TypeScript {#typescript-in-templates}

`` ayrıca `` veya `` kullanıldığında bağlama ifadelerinde TypeScript'i destekler. Bu, şablon ifadelerinde tip dönüşümü yapmanız gerektiğinde kullanışlıdır.

İşte bir örnek:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- hata çünkü x bir string olabilir -->
  {{ x.toFixed(2) }}
</template>
```

Bu, çevrimiçi bir tip dönüşümü ile aşılabilir:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Eğer Vue CLI veya webpack tabanlı bir yapı kullanıyorsanız, şablon ifadelerinde TypeScript kullanmak için `vue-loader@^16.8.0` gerekmektedir.
:::

### TSX ile Kullanım {#usage-with-tsx}

Vue, bileşenleri JSX / TSX ile yazmayı da destekler. Detaylar `Render Fonksiyonu ve JSX` kılavuzunda ele alınmaktadır.

## Genel Bileşenler {#generic-components}

Genel bileşenlerin desteklendiği iki durum vardır:

- SFC'lerde: `` ile `generic` özelliği`
- Render fonksiyonu / JSX bileşenleri: `defineComponent()`'ın fonksiyon imzacı`

## API'ye Özel Tarifler {#api-specific-recipes}

- `Composition API ile TS`
- `Options API ile TS`