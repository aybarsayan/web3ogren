---
title: Özel Yerleşik Nitelikler
seoTitle: Özel Yerleşik Nitelikler - Vue
sidebar_position: 4
description: Bu belgede özel yerleşik nitelikler ve bunların Vuedeki kullanımları ele alınmaktadır. Anahtar, ref ve is gibi nitelikler hakkında detaylı bilgi edinin.
tags: 
  - Vue
  - Özel Nitelikler
  - Component
  - Programlama
keywords: 
  - özel nitelikler
  - Vue
  - ref
  - dinamik bileşenler
---
## Özel Yerleşik Nitelikler {#built-in-special-attributes}

## key {#key}

`key` özel niteliği, Vue'nun sanal DOM algoritmasına, yeni düğüm listesini eski listeye göre karşılaştırırken vnod'ları tanımlamak için bir ipucu olarak kullanılır.

- **Beklentiler:** `sayı | dize | sembol`

- **Ayrıntılar**

  Anahtarlar olmadan, Vue bir algoritma kullanır; bu algoritma öğe hareketlerini en aza indirir ve mümkün olduğunca aynı türdeki öğeleri yerinde tamir/yeniden kullanmaya çalışır. Anahtarlarla birlikte, anahtarların sıralama değişikliklerine dayanarak öğeleri yeniden sıralar ve mevcut olmayan anahtarlarla ilgili öğeler her zaman kaldırılacak / yok edilecektir.

  Aynı ortak üst öğenin çocuklarının **eşsiz anahtarları** olmalıdır. Çift anahtarlar render hatalarına neden olacaktır.

  En yaygın kullanım durumu `v-for` ile birleştirildiğinde ortaya çıkar:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Ayrıca bir öğe/bileşenin yeniden kullanılması yerine değiştirilmesini zorlamak için de kullanılabilir. Bu, şu durumlarda faydalı olabilir:

  - Bir bileşenin yaşam döngüsü kancalarını doğru bir şekilde tetiklemek
  - Geçişleri tetiklemek

  Örneğin:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  `text` değiştiğinde, `` her zaman tamir edilmek yerine değiştirilecektir, bu nedenle bir geçiş tetiklenecektir.

- **Ayrıca bakınız** `Kılavuz - Liste Renderlama - `key` ile Durumu Koruma`

## ref {#ref}

Bir `şablon referansı` belirtir.

- **Beklentiler:** `dize | Fonksiyon`

- **Ayrıntılar**

  `ref`, bir öğeye veya çocuk bileşene bir referans kaydetmek için kullanılır.

  Options API'de, referans bileşenin `this.$refs` nesnesi altında kaydedilecektir:

  ```vue-html
  <!-- this.$refs.p olarak saklandı -->
  <p ref="p">merhaba</p>
  ```

  Composition API'de, referans eşleşen adla bir ref içinde saklanacaktır:

  ```vue
  <script setup>
  import { useTemplateRef } from 'vue'

  const pRef = useTemplateRef('p')
  </script>

  <template>
    <p ref="p">merhaba</p>
  </template>
  ```

  Eğer düz bir DOM öğesi üzerinde kullanılıyorsa, referans o öğe olacaktır; eğer bir çocuk bileşen üzerinde kullanılıyorsa, referans çocuk bileşen örneği olacaktır.

  Ayrıca `ref`, referansı nerede saklayacağınız üzerinde tam kontrol sağlayan bir fonksiyon değerini de kabul edebilir:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  Referans kaydı zamanlaması hakkında önemli bir not: çünkü referanslar kendileri render fonksiyonu sonucu oluşturulurlar, onlara erişmeden önce bileşenin monte olmasını beklemelisiniz.

  `this.$refs` de reaktif değildir, bu nedenle verileri bağlamak için şablonlarda kullanılmaması gerektiği unutulmamalıdır.

- **Ayrıca bakınız**
  - `Kılavuz - Şablon Referansları`
  - `Kılavuz - Şablon Referanslarını Türlendirme` 
  - `Kılavuz - Bileşen Şablon Referanslarını Türlendirme` 

## is {#is}

`Dinamik bileşenleri` bağlamak için kullanılır.

- **Beklentiler:** `dize | Bileşen`

- Yerel öğeler üzerindeki kullanım 
  
  - Sadece 3.1+ sürümlerde desteklenmektedir.

  `is` niteliği bir yerel HTML öğesinde kullanıldığında, bir [Özelleştirilmiş yerleşik öğe](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) olarak yorumlanacaktır ki bu, yerel web platformu özelliğidir.

  Ancak, Vue'nun bir yerel öğeyi bir Vue bileşeni ile değiştirmesini gerektiren bir kullanım durumu vardır; bu kullanım durumu `DOM İçindeki Şablon Analizi Uyarıları` başlığı altında açıklanmıştır. `is` niteliğinin değerini `vue:` ile ön eklediğinizde, Vue öğeyi bir Vue bileşeni olarak render edecektir:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **Ayrıca bakınız**

  - `Yerleşik Özel Öğeler - ``
  - `Dinamik Bileşenler`