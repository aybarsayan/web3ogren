---
title: Giriş
seoTitle: Vue 3 Giriş
sidebar_position: 1
description: Vue 3 belgelerine hoş geldiniz! Bu belgeler, Vuenun temellerini anlamanızı sağlayacak ve çeşitli kullanım durumlarını ele alacaktır.
tags: 
  - Vue
  - JavaScript
  - Framework
  - Frontend Geliştirme
keywords: 
  - Vue 3
  - JavaScript Framework
  - Frontend
  - Reactive Programming
---
## Giriş {#introduction}

:::info Vue 3 belgelerini okuyorsunuz!

- Vue 2 desteği **31 Aralık 2023**'te sona ermiştir. Daha fazla bilgi için [Vue 2 EOL](https://v2.vuejs.org/eol/) sayfasını inceleyin.
- Vue 2'den güncellemeyi mi düşünüyorsunuz? [Geçiş Kılavuzu](https://v3-migration.vuejs.org/)na göz atın.
:::



  
    
![](https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png)
    
    Video eğitimlerle Vue öğrenin VueMastery.com
    
![](https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png)
    
  


## Vue Nedir? {#what-is-vue}

Vue (/vjuː/, **görünüm** olarak telaffuz edilir) kullanıcı arayüzleri oluşturmak için kullanılan bir JavaScript framework'üdür. Standart HTML, CSS ve JavaScript'in üzerine inşa edilmiş ve karmaşık kullanıcı arayüzlerini verimli bir şekilde geliştirmeye yardımcı olan açıklayıcı, bileşen tabanlı bir programlama modeli sunmaktadır.

İşte minimal bir örnek:



```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```




```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```



```vue-html
<div id="app">
  <button @click="count++">
    Sayım: {{ count }}
  </button>
</div>
```

**Sonuç**
  
    Sayım: {{ count }}
  


Yukarıdaki örnek, Vue'nun iki temel özelliğini göstermektedir:

- **Açıklayıcı Renderleme**: Vue, JavaScript durumuna dayalı HTML çıktısını açıklayıcı şekilde tanımlamamıza olanak tanıyan bir şablon sözdizimi ile standart HTML'yi genişletir.

- **Reaktivite**: Vue, JavaScript durumundaki değişiklikleri otomatik olarak takip eder ve değişiklikler gerçekleştiğinde DOM'u verimli bir şekilde günceller.

Belki bazı sorularınız vardır - endişelenmeyin. Belgelerin geri kalanında her küçük detayı ele alacağız. Şimdilik, Vue'nun sunduklarını yüksek düzeyde anlamak için okumaya devam edin.

:::tip Ön Koşullar
Belgelerin geri kalanında temel HTML, CSS ve JavaScript bilgisine sahip olduğunuz varsayılmaktadır. Eğer frontend geliştirmeye tamamen yeniyseniz, bir framework'e hemen atlamak en iyi fikir olmayabilir - önce temelleri kavrayın ve sonra geri dönün! Gerekirse [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) ve [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) konularında bilgi seviyenizi kontrol edebilirsiniz. Diğer framework'lerdeki önceki deneyim faydalıdır, ancak gerekli değildir.
:::

## İlerici Framework {#the-progressive-framework}

Vue, frontend geliştirme sırasında ihtiyaç duyulan çoğu ortak özelliği kapsayan bir framework ve ekosistemdir. Ancak web son derece çeşitlidir - web üzerinde inşa ettiğimiz şeyler biçim ve ölçek açısından keskin bir şekilde farklılık gösterebilir. Bu göz önüne alındığında, Vue esnek ve aşamalı olarak benimsenebilir şekilde tasarlanmıştır. Kullanım durumunuza bağlı olarak, Vue farklı şekillerde kullanılabilir:

- Yapı adımı olmadan statik HTML'i geliştirmek
- Herhangi bir sayfada Web Bileşeni olarak gömmek
- Tek Sayfa Uygulaması (SPA)
- Fullstack / Sunucu Tarafı Renderleme (SSR)
- Jamstack / Statik Site Üretimi (SSG)
- Masaüstü, mobil, WebGL ve hatta terminal hedefleme

Bu kavramlar sizi korkutmuşsa endişelenmeyin! Öğretici ve kılavuz yalnızca temel HTML ve JavaScript bilgisi gerektirir ve herhangi bir konuda uzman olmasanız bile takip edebilmelisiniz.

Eğer Vue'yu yığınınıza en iyi nasıl entegre edeceğiniz konusunda deneyimli bir geliştiriciyseniz veya bu terimlerin ne anlama geldiği konusunda meraklıysanız, bunlarla ilgili daha fazla ayrıntıyı `Vue Kullanım Yolları` bölümünde tartışıyoruz.

Esnekliğe rağmen, Vue'nun nasıl çalıştığına dair temel bilgi tüm bu kullanım durumlarında paylaşıldığı için önemlidir. Şu anda sadece bir acemi olsanız bile, bu süreçte kazandığınız bilgiler gelecekte daha iddialı hedeflerle başa çıkarken faydalı olacaktır. Eğer bir tecrübeliseniz, karşılaşmakta olduğunuz sorunlara dayalı olarak Vue'yu en iyi şekilde kullanmanın optimal yolunu seçebilirsiniz ve aynı zamanda aynı verimliliği koruyabilirsiniz. Bu yüzden Vue'ya "İlerici Framework" diyoruz: sizinle birlikte büyüyebilen ve ihtiyaçlarınıza uyum sağlayabilen bir framework'dür.

## Tek Dosya Bileşenleri {#single-file-components}

Çoğu build araçları ile entegre edilmiş Vue projelerinde, Vue bileşenlerini **Tek Dosya Bileşeni** (aynı zamanda `*.vue` dosyaları olarak da bilinir, kısaca **SFC** olarak adlandırılır) adı verilen HTML benzeri bir dosya formatı kullanarak yazarız. Bir Vue SFC, adı üstünde, bileşenin mantığını (JavaScript), şablonunu (HTML) ve stillerini (CSS) tek bir dosya içinde kapsar. İşte önceki örnek, SFC formatında yazılmıştır:



```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Sayım: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```




```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Sayım: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```



SFC, Vue'nun tanımlayıcı bir özelliğidir ve eğer kullanım durumunuz bir build kurulumu gerektiriyorsa Vue bileşenlerini yazmanın önerilen yoludur. `SFC'nin nasıl olduğu ve nedenine` dair daha fazla bilgi edinebilirsiniz, ancak şimdilik sadece Vue'nun sizin için tüm build araçları kurulumu ile ilgileneceğini bilmek yeterlidir.

## API Stillleri {#api-styles}

Vue bileşenleri, iki farklı API stili ile yazılabilir: **Options API** ve **Composition API**.

### Options API {#options-api}

Options API ile, bir bileşenin mantığını `data`, `methods` ve `mounted` gibi seçenekler nesnesi kullanarak tanımlarız. Seçeneklerle tanımlanan özellikler, işlevler içinde `this` üzerinde görünür hale gelir; bu da bileşen örneğini işaret eder:

```vue
<script>
export default {
  // data()'dan dönen özellikler reaktif durum haline gelir
  // ve `this` üzerinde erişilebilir.
  data() {
    return {
      count: 0
    }
  },

  // Yöntemler durumu değiştiren ve güncellemeleri tetikleyen işlevlerdir.
  // Şablonlarda olay işleyicisi olarak bağlanabilirler.
  methods: {
    increment() {
      this.count++
    }
  },

  // Yaşam döngüsü kancaları, bir bileşenin yaşam döngüsünün farklı aşamalarında çağrılır.
  // Bu işlev bileşen yüklendiğinde çağrılacaktır.
  mounted() {
    console.log(`İlk sayım: ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Sayım: {{ count }}</button>
</template>
```

[Playground'da deneyin](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### Composition API {#composition-api}

Composition API ile, bir bileşenin mantığını içe aktarılan API işlevleri kullanarak tanımlarız. SFC'lerde, Composition API genellikle `` ile birlikte kullanılır. `setup` niteliği, Vue'nun derleme zamanında dönüşümler gerçekleştirmesini sağlayan bir ipucudur; bu, Composition API'sinin daha az boilerplate ile kullanılmasına olanak tanır. Örneğin, `` içinde tanımlanan içe aktarımlar ve üst seviye değişkenler / işlevler doğrudan şablonda kullanılabilir.

İşte aynı bileşen, aynı şablon ile birlikte, ancak Composition API ve `` kullanılarak yazılmıştır:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reaktif durum
const count = ref(0)

// durumu değiştiren işlevler
function increment() {
  count.value++
}

// yaşam döngüsü kancaları
onMounted(() => {
  console.log(`İlk sayım: ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Sayım: {{ count }}</button>
</template>
```

[Playground'da deneyin](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### Hangisini Seçmeli? {#which-to-choose}

Her iki API stili de yaygın kullanım durumlarını kapsamak için tam olarak yetkilidir. Farklı arayüzler, aynı alt sistem tarafından desteklenmektedir. Aslında, Options API, Composition API'nin üstünde uygulanmıştır! Vue ile ilgili temel kavramlar ve bilgiler, iki stil arasında paylaşılır.

Options API, genellikle OOP dil geçmişinden gelen kullanıcılar için sınıf tabanlı zihinsel modelle daha iyi örtüşen "bileşen örneği" kavramı etrafında döner (`this` örnekte görüldüğü gibi). Ayrıca, reaktivite detaylarını soyutlayarak ve seçenek grupları aracılığıyla kod organizasyonunu zorunlu kılarak yeni başlayanlar için daha dostça bir yaklaşım sunar.

Composition API, reaktif durum değişkenlerini doğrudan bir işlev kapsamı içinde tanımlama ve karmaşıklığı ele almak için birden fazla işlevden durumu bir araya getirme konusunda merkezidir. Daha serbest biçimlidir ve etkili bir şekilde kullanılabilmesi için Vue'daki reaktiviteyi anlama gerektirir. Karşılığında, esnekliği, mantığı organize etme ve yeniden kullanma için daha güçlü kalıplar oluşturmayı mümkün kılar.

İki stil arasındaki karşılaştırma ve Composition API'nin potansiyel faydalarını öğrenmek için `Composition API SSS` bölümüne göz atabilirsiniz.

Eğer Vue'ya yeniyseniz, şu genel önerimizi dikkate alın:

- Öğrenim amaçlı olarak, sizin için daha kolay görünen tarzı seçin. Yine de, çoğu temel kavramın iki stil arasında paylaşıldığını unutmayın. Her zaman başka bir tarzı daha sonra benimseyebilirsiniz.

- Üretim kullanımı için:

  - Eğer build araçları kullanmıyorsanız veya Vue'yu öncelikle düşük karmaşıklık senaryolarında kullanmayı planlıyorsanız, Options API'yi seçin, örneğin ilerleyici geliştirme için.

  - Eğer Vue ile tam uygulamalar inşa etmeyi planlıyorsanız, Composition API + Tek Dosya Bileşenlerini seçin.

Öğrenme aşamasında yalnızca bir tarza bağlı kalmanız gerekmez. Belgelerin geri kalanında, uygulanabilir olduğunda her iki stil için de kod örnekleri sunulacaktır ve istediğiniz zaman sol yan çubuktaki **API Tercih anahtarları** ile bunlar arasında geçiş yapabilirsiniz.

## Hala Sorularınız mı Var? {#still-got-questions}

`SSS` bölümüne göz atın.

## Öğrenme Yolunuzu Seçin {#pick-your-learning-path}

Farklı geliştiricilerin farklı öğrenme stilleri vardır. Tercihinize uygun bir öğrenme yolu seçmekten çekinmeyin - fakat mümkünse tüm içerikleri gözden geçirmenizi öneririz!


  
    Dersinize Başlayın
    Ellerinizle öğrenmeyi tercih edenler için.
  
  
    Kılavuzu Okuyun
    Kılavuz, framework'ün her yönünü detaylı bir şekilde anlatmaktadır.
  
  
    Örnekleri İnceleyin
    Temel özellikler ve yaygın UI görevleri örneklerini keşfedin.