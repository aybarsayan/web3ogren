---
title: Tek Dosya Bileşenleri
seoTitle: Vue Tek Dosya Bileşenleri Nedir?
sidebar_position: 1
description: Vue Tek Dosya Bileşenleri (SFC), bileşenlerin görünüm, mantık ve stilini tek bir dosyada toplayan özel bir yapıdır. Bu sayfada SFClerin avantajlarından ve kullanımından bahsedilmektedir.
tags: 
  - Vue
  - Tek Dosya Bileşenleri
  - Bileşen Geliştirme
keywords: 
  - Vue
  - SFC
  - Bileşen Geliştirme
---
## Tek Dosya Bileşenleri {#single-file-components}

## Giriş {#introduction}

Vue Tek Dosya Bileşenleri (veya `*.vue` dosyaları, kısaca **SFC**) bir Vue bileşeninin şablonunu, mantığını **ve** stilini tek bir dosyada kapsayan özel bir dosya formatıdır. İşte bir SFC örneği:



```vue
<script>
export default {
  data() {
    return {
      greeting: 'Merhaba Dünya!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```





```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Merhaba Dünya!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```



Görüldüğü gibi, Vue SFC, klasik HTML, CSS ve JavaScript üçlüsünün doğal bir uzantısıdır. ``, `` ve `` blokları bir bileşenin görünümünü, mantığını ve stilini aynı dosyada kapsar ve birleştirir. Tam sözdizimi `SFC Sözdizimi Spesifikasyonu` ile tanımlanmıştır.

## Neden SFC {#why-sfc}

SFC'ler bir derleme aşaması gerektirirken, karşılığında birçok fayda sunar:

- Tanıdık HTML, CSS ve JavaScript sözdizimi kullanarak modüler bileşenler yazma
- `Birbirine bağlı endişelerin bir arada bulunması`
- Çalışma zamanı derleme maliyeti olmadan önceden derlenmiş şablonlar
- `Bileşen kapsamlı CSS`
- `Composition API ile çalışırken daha ergonomik sözdizimi`
- Şablon ve betiği birbirine bağlayarak daha fazla derleme zamanı optimizasyonu
- `IDE desteği` ile şablon ifadeleri için otomatik tamamlama ve tür kontrolü
- Kutudan çıktığı gibi Hot-Module Replacement (HMR) desteği

:::tip
SFC, Vue'nun bir çerçeve olarak tanımlayıcı bir özelliğidir ve aşağıdaki senaryolar için Vue kullanımında önerilen yaklaşımdır:
- Tek Sayfa Uygulamaları (SPA)
- Statik Site Üretimi (SSG)
- Daha iyi bir geliştirme deneyimi (DX) için bir derleme adımının haklı çıkarılabileceği herhangi bir önemsiz ön yüz.
:::

Bu bağlamda, SFC'lerin aşırı gibi görünebileceği bazı senaryolar olduğunu anlıyoruz. Bu yüzden Vue, hala bir derleme aşaması olmadan düz JavaScript ile kullanılabilir. Eğer yalnızca büyük ölçüde statik HTML'i hafif etkileşimlerle geliştirmek istiyorsanız, [petite-vue](https://github.com/vuejs/petite-vue) adlı, ilerleyici geliştirme için optimize edilmiş 6 kB'lik bir Vue alt kümesine de göz atabilirsiniz.

## Nasıl Çalışır {#how-it-works}

Vue SFC, çerçeveye özgü bir dosya formatıdır ve [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) tarafından standart JavaScript ve CSS'e önceden derlenmelidir. Derlenmiş bir SFC, standart bir JavaScript (ES) modülüdür - bu, uygun bir derleme kurulumu ile bir SFC'yi bir modül gibi içe aktarabileceğiniz anlamına gelir:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC'ler içindeki `` etiketleri genellikle gelişim sırasında sıcak güncellemeleri desteklemek için yerel `` etiketleri olarak enjekte edilir. Üretimde, bunlar çıkarılabilir ve tek bir CSS dosyasında birleştirilebilir.

SFC'ler ile oynayabilir ve nasıl derlendiğini [Vue SFC Oyun Alanı](https://play.vuejs.org/) ile keşfedebilirsiniz.

Gerçek projelerde, genellikle SFC derleyicisini [Vite](https://vitejs.dev/) veya [Vue CLI](http://cli.vuejs.org/) gibi bir derleme aracıyla entegre ederiz (bu, [webpack](https://webpack.js.org/) tabanlıdır) ve Vue, SFC'lerle hızlıca başlamanızı sağlamak için resmi iskelet araçları sunar. Daha fazla detayı `SFC Araçları` bölümünde bulabilirsiniz.

## Endişe Ayrımı Ne Olacak? {#what-about-separation-of-concerns}

Geleneksel web geliştirme arka planına sahip bazı kullanıcıların, SFC'lerin farklı endişeleri aynı yerde birleştirdiğine yönelik bir endişesi olabilir - bu, HTML/CSS/JS'nin ayrı olması gereken bir alandır!

:::warning
Bu soruya cevap vermek için, **endişe ayrımının dosya türlerinin ayrılmasına eşit olmadığını** kabul etmemiz önemlidir. Mühendislik ilkelerinin nihai amacı kod tabanlarının sürdürülebilirliğini artırmaktır.
:::

Endişe ayrımı, dosya türlerinin ayrılması olarak dogmatik bir şekilde uygulandığında, giderek karmaşıklaşan ön yüz uygulamaları bağlamında bizi bu amaca ulaştırmaz.

Modern arayüz geliştirmede, kod tabanını birbirine iç içe geçmiş üç büyük katmana bölmek yerine, gevşek bağlı bileşenlere ayırmanın çok daha mantıklı olduğunu bulduk ve bunları birleştirdik. Bir bileşenin içinde, şablonu, mantığı ve stilleri doğal olarak birbirine bağlıdır ve bunları bir arada bulundurmak bileşeni daha uyumlu ve sürdürülebilir hale getirir.

Tek Dosya Bileşenleri fikrini sevmeseniz bile, JavaScript ve CSS'inizi `Src Imports` kullanarak ayrı dosyalara ayırarak sıcak yeniden yükleme ve ön derleme özelliklerinden yararlanabilirsiniz.