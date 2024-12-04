---
title: Bileşenler
seoTitle: Vue Bileşenleri ile Composition API Kullanımı
sidebar_position: 4
description: Bu bölümde Vuenun Composition APIsini kullanarak bileşenlerin nasıl oluşturulacağını ve yeniden kullanılabilir hale getirileceğini öğrenin. Temel bilgileri ve örnek uygulamaları keşfedin.
tags: 
  - Vue
  - Composition API
  - Bileşenler
  - Geliştirici
keywords: 
  - Vue.js
  - bileşen işlevleri
  - reaktivite
  - geliştirici
---
## Bileşenler {#composables}

:::tip
Bu bölüm, Composition API hakkında temel bilgiye sahip olunduğunu varsayar. Eğer sadece Options API ile Vue öğreniyorsanız, API Tercihini Composition API olarak ayarlayabilir (sol kenar çubuğundaki açma/kapama düğmesini kullanarak) ve `Reaktivite Temelleri` ve `Yaşam Döngüsü Kancaları` bölümlerini yeniden okuyabilirsiniz.
:::

## "Bileşen" Nedir? {#what-is-a-composable}

Vue uygulamaları bağlamında, "bileşen", Vue'nun Composition API'sını kullanarak **durumlu mantığı** kapsülleyen ve yeniden kullanılabilir hale getiren bir işlevdir.

Ön uç uygulamaları geliştirirken, genellikle yaygın görevler için mantığı yeniden kullanmamız gerekir. Örneğin, birçok yerde tarih formatlamamız gerekebilir, bu yüzden bunun için yeniden kullanılabilir bir işlev çıkarırız. Bu formatlayıcı işlev, **durumsuz mantığı** kapsüller: bazı girdileri alır ve beklenen çıktıyı hemen döndürür. Durumsuz mantığı yeniden kullanmak için birçok kütüphane bulunmaktadır - örneğin [lodash](https://lodash.com/) ve [date-fns](https://date-fns.org/), bunlardan bazılarıdır.

Buna karşılık, durumlu mantık zamanla değişen durumları yönetmeyi içerir. Basit bir örnek, bir sayfadaki farenin mevcut konumunu takip etmektir. Gerçek dünya senaryolarında, dokunma hareketleri veya bir veritabanıyla bağlantı durumu gibi daha karmaşık mantıklar da içerebilir.

## Fare Takipçisi Örneği {#mouse-tracker-example}

Fare takip işlevselliğini bir bileşenin içinde doğrudan Composition API kullanarak uygulamak isteseydik, durum şu şekilde görünürdü:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Fare pozisyonu: {{ x }}, {{ y }}</template>
```

Peki ya bu mantığı birden fazla bileşende yeniden kullanmak istiyorsak? Mantığı dış bir dosyaya, bir bileşen işlevi olarak çıkarabiliriz:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// geleneksel olarak, bileşen işlevlerinin isimleri "use" ile başlar
export function useMouse() {
  // bileşen tarafından kapsüllenmiş ve yönetilen durum
  const x = ref(0)
  const y = ref(0)

  // bir bileşen zamanla yönetilen durumunu güncelleyebilir.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // bir bileşen ayrıca kendi bileşeninin yaşam döngüsüne bağlanabilir
  // yan etkileri kurmak ve kaldırmak için.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // yönetilen durumu dönüş değeri olarak sunar
  return { x, y }
}
```

Ve bu bileşenlerde şu şekilde kullanılabilir:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Fare pozisyonu: {{ x }}, {{ y }}</template>
```


  Fare pozisyonu: {{ x }}, {{ y }}


[Oyun Alanında Deneyin](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Görüldüğü gibi, temel mantık aynı kalıyor - yapmamız gereken tek şey, bunu bir dış işlev içine almak ve gösterilmesi gereken durumu döndürmek. Bileşen içinde olduğu gibi, bileşen işlevlerinde de `Composition API işlevlerinin` tüm aralığını kullanabilirsiniz. Aynı `useMouse()` işlevselliği artık herhangi bir bileşende kullanılabilir.

Ancak bileşenlerin en havalı tarafı, aynı zamanda birbirlerini çağırabilmeleridir: bir bileşen işlevi bir veya daha fazla başka bileşen işlevini çağırabilir. Bu, karmaşık mantığı küçük, izole birimler halinde birleştirmemizi sağlar, tıpkı bir uygulamayı bileşenler kullanarak birleştirdiğimiz gibi. Aslında, bu nedenle, bu modeli mümkün kılan API'lerin topluluğuna "Composition API" adını verdik.

Örneğin, bir DOM olay dinleyicisini ekleme ve kaldırma mantığını kendi bileşen işlevine çıkarabiliriz:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // isterseniz, bu
  // hedef olarak seçici dizelerini desteklemesini de sağlayabilirsiniz
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

Ve şimdi `useMouse()` bileşenimizi şu şekilde basitleştirebiliriz:

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
`useMouse()` çağıran her bileşen örneği, birbirleriyle etkileşime girmeyecek şekilde kendi `x` ve `y` durumlarının kopyalarını oluşturur. Eğer bileşenler arasında paylaşılan durumu yönetmek isterseniz, `Durum Yönetimi` bölümüne bakabilirsiniz.
:::

## Async Durum Örneği {#async-state-example}

`useMouse()` bileşeni herhangi bir argüman almaz, bu yüzden bir tane kullanan başka bir örneğe bakalım. Asenkron veri çekimi yaparken, genellikle farklı durumları yönetmemiz gerekir: yükleme, başarı ve hata:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Bir hata meydana geldi: {{ error.message }}</div>
  <div v-else-if="data">
    Veri yüklendi:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Yükleniyor...</div>
</template>
```

Bu düzeni her veri çekmesi gereken bileşende tekrar etmek zorlayıcı olacaktır. Bunu bir bileşen işlevine çıkaralım:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Artık bileşenimizde sadece şöyle yapabiliriz:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Reaktif Durum Kabulü {#accepting-reactive-state}

`useFetch()` bir statik URL dizesi argümanı alır - yani sadece bir kez veri çeker ve sonra tamamlanır. URL değiştiğinde yeniden çekmesini istiyorsak, bileşen işlevine reaktif durumu geçmeleri gerekir ve bileşen işlevinin geçilen durumu kullanarak izlemeler oluşturmasını sağlarız.

Örneğin, `useFetch()` bir ref kabul edebilmelidir:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// bu yeniden çekim tetiklemelidir
url.value = '/new-url'
```

Ya da, bir [getter işlevini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) kabul edebilmelidir:

```js
// props.id değiştiğinde yeniden çekim yap
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Mevcut uygulamamızı `watchEffect()` ve `toValue()` API'leri ile yeniden biçimlendirebiliriz:

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // çekim yapmadan önce durumu sıfırla..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` 3.3'te eklenen bir API'dir. ref veya getter'ları değerlere normalleştirmek için tasarlanmıştır. Argüman bir ref ise, ref'in değerini döndürür; argüman bir işlev ise, işlevi çağırır ve döndürülen değeri sağlar. Aksi halde, argüman olduğu gibi geri döner. `unref()` ile benzer şekilde çalışır, ancak işlevler için özel muamele yapar.

`toValue(url)` çağrısının `watchEffect` geri çağırma **içinde** çağrıldığını unutmayın. Bu, `toValue()` normalleştirmesi sırasında erişilen herhangi bir reaktif bağımlılığın izlenmesini sağlar.

Bu versiyon `useFetch()` artık statik URL dizeleri, ref'ler ve getter'ları kabul ederek daha esnek hale gelir. İzleme etkisi hemen çalışır ve `toValue(url)` sırasında erişilen bağımlılıkları izler. Eğer hiç izlenen bağımlılık yoksa (örneğin url zaten bir dizeyse), etki yalnızca bir kez çalışır; aksi takdirde, izlenen bir bağımlılık değiştiğinde yeniden çalışır.

İşte [güncellenmiş `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=), gösterim amacıyla yapay bir gecikme ve rastgele hata ile.

## Konvansiyonlar ve En İyi Uygulamalar {#conventions-and-best-practices}

### İsimlendirme {#naming}

Bileşen işlevlerini "use" ile başlayan camelCase isimlerle adlandırmak bir konvansiyondur.

### Girdi Argümanları {#input-arguments}

Bir bileşen, reaktivite için onlara bağlı olmasa bile ref veya getter argümanlarını kabul edebilir. Eğer diğer geliştiriciler tarafından kullanılabilecek bir bileşen yazıyorsanız, girdi argümanlarının ref veya getter olabileceği durumları ele almak iyi bir fikirdir. Bunun için `toValue()` yardımcı işlevi işe yarayabilir:

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // Eğer maybeRefOrGetter bir ref veya getter ise,
  // normalleştirilmiş değeri dönecektir.
  // Aksi takdirde, olduğu gibi döner.
  const value = toValue(maybeRefOrGetter)
}
```

Eğer bileşen işleviniz girdi bir ref veya getter olduğunda reaktif etkiler oluşturuyorsa, `watch()` ile ref / getter'ı açıkça izlediğinizden veya etkili bir `watchEffect()` içinde `toValue()` çağrısı yaptığınızdan emin olun.

Önceki tartışılan `useFetch()` uygulaması, giriş argümanı olarak ref'ler, getter'lar ve düz değerleri kabul eden bir bileşen işlevinin somut bir örneğini sağlar.

### Dönüş Değerleri {#return-values}

Bileşen işlevlerinde `reactive()` yerine yalnızca `ref()` kullandığımızı muhtemelen fark etmişsinizdir. Bileşen işlevlerinin her zaman birden fazla ref içeren düz, reaktif olmayan bir nesne döndürmesi önerilen bir konvansiyondur. Bu, bileşenler içinde yeniden yapılandırılabilirken reaktiviteyi korumayı sağlar:

```js
// x ve y refs
const { x, y } = useMouse()
```

Bir bileşen işlevinden reaktif bir nesne döndürmek, bu tür yeniden yapılandırmaların bileşen içindeki duruma reaktivite bağlantısını kaybetmesine neden olurken, ref'ler bu bağlantıyı korur.

Eğer bileşen işlevlerinden döndürülen durumu nesne özellikleri olarak kullanmayı tercih ediyorsanız, döndürülen nesneyi `reactive()` ile sarabilirsiniz, böylece ref'ler açılır. Örneğin:

```js
const mouse = reactive(useMouse())
// mouse.x, orijinal ref'e bağlıdır
console.log(mouse.x)
```

```vue-html
Fare pozisyonu: {{ mouse.x }}, {{ mouse.y }}
```

### Yan Etkiler {#side-effects}

Bileşen işlevlerinde yan etkiler (örn. DOM olay dinleyicileri eklemek veya veri almak) oluşturmak kabul edilebilir, ancak aşağıdaki kurallara dikkat edin:

- Eğer `Sunucu Tarafı Renderi` (SSR) kullanan bir uygulama üzerinde çalışıyorsanız, DOM'a özgü yan etkileri `onMounted()` gibi montaj sonrası yaşam döngüsü kancalarında gerçekleştirdiğinizden emin olun. Bu kancalar yalnızca tarayıcıda çağrılır, bu yüzden içlerindeki kodun DOM'a erişimi vardır.

- Yan etkileri `onUnmounted()` içinde temizlemeyi unutmayın. Örneğin, bir bileşen bir DOM olay dinleyicisi kuruyorsa, `useMouse()` örneğinde gördüğümüz gibi `onUnmounted()` içinde bu dinleyiciyi kaldırmalıdır. Ayrıca, bunu sizin için otomatik olarak yapan bir bileşen işlevi kullanmak iyi bir fikir olabilir, örneğin `useEventListener()` örneği.

### Kullanım Kısıtlamaları {#usage-restrictions}

Bileşen işlevleri yalnızca `` içinde veya `setup()` kancasında çağrılmalıdır. Ayrıca, bu bağlamlarda **senkron** olarak çağrılmalıdırlar. Bazı durumlarda, `onMounted()` gibi yaşam döngüsü kancalarında da çağırabilirsiniz.

Bu kısıtlamalar önemlidir çünkü Vue'nun geçerli aktif bileşen örneğini belirlemesine olanak tanıyan bu bağlamlardır. Aktif bir bileşen örneğine erişim, aşağıdakilerin yapılabilmesi için gereklidir:

1. Yaşam döngüsü kancalarının ona kaydedilmesi.

2. Hesaplanan özelliklerin ve izleyicilerin ona bağlanabilmesi, böylece örnek çıkarıldığında temizlenebilir ve bellek sızıntılarını önleyebilir.

:::tip
`` bileşen işlevlerini **await** kullandıktan sonra çağırabileceğiniz tek yerdir. Derleyici, asenkron işlemden sonra aktif örnek bağlamını otomatik olarak geri yükler.
:::

## Bileşenleri Düzenleme İçin Bileşen İşlevlerini Çıkarma {#extracting-composables-for-code-organization}

Bileşen işlevleri yalnızca yeniden kullanılmak için değil, aynı zamanda kod organizasyonu için de çıkarılabilir. Bileşenlerinizin karmaşıklığı arttıkça, gezinmekte ve anlamakta zorlanacağınız fazla büyük bileşenlerle karşılaşabilirsiniz. Composition API, bileşen kodunuzu mantıksal konulara dayalı olarak daha küçük işlevlere organize etmek için tam esneklik sunar:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

Bir ölçüde, bu çıkarılan bileşen işlevlerini birbiriyle iletişim kurabilen bileşen kapsamlı servisler olarak düşünebilirsiniz.

## Bileşen İşlevlerini Options API'de Kullanma {#using-composables-in-options-api}

Options API kullanıyorsanız, bileşen işlevleri `setup()` içinde çağrılmalı ve döndürülen bağlamalar `this` ve şablona ifşa edilebilmesi için `setup()`'dan döndürülmelidir:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() ile ifşa edilen özellikler `this` üzerinde erişilebilir
    console.log(this.x)
  }
  // ...diğer seçenekler
}
```

## Diğer Tekniklerle Karşılaştırmalar {#comparisons-with-other-techniques}

### Karşılaştırma: Mixinler {#vs-mixins}

Vue 2'den gelen kullanıcılar, bileşen mantığını yeniden kullanılabilir birimlere çıkarmamıza izin veren `mixins` seçeneğine aşina olabilir. Mixinlerin üç temel dezavantajı vardır:

1. **Özelliklerin belirsiz kaynağı**: birçok mixin kullanıldığında, hangi örnek özelliğinin hangi mixin tarafından enjekte edildiği belirsiz hale gelir; bu da uygulamayı takip etmeyi zorlaştırır. Bu nedenle, bileşen işlevleri için referans + yeniden yapılandırma modelini kullanmanızı öneriyoruz: bu, tüketen bileşenlerde özellik kaynağını netleştirir.

2. **Ad alanı çakışmaları**: farklı yazarlar tarafından gelen birden fazla mixin aynı özellik anahtarlarını kaydedebilir ve ad alanı çakışmalarına neden olabilir. Bileşen işlevleri ile çelişen anahtarlarla karşılaşıldığında, yeniden yapılandırılan değişkenleri yeniden adlandırabilirsiniz.

3. **Dolaylı çapraz-mixin iletişimi**: birbiriyle etkileşimde bulunması gereken birden fazla mixin, paylaşılan özellik anahtarlarına güvenmek zorundadır, bu da bunları dolaylı olarak birleştirir. Bileşen işlevlerinde ise, bir bileşen işlevinden alınan değerler normal işlevler gibi başka birine argüman olarak geçirilebilir.

Bu nedenlerle, Vue 3'te mixinlerin kullanılmasını artık önermiyoruz. Bu özellik yalnızca geçiş ve aşinalık nedenleri için tutulmaktadır.

### Karşılaştırma: Renderless Bileşenler {#vs-renderless-components}

Bileşen slotları bölümünde, kapsamlı slotlara dayanan `Renderless Bileşen` modelini tartıştık. Aynı fare takip demo'sunu renderless bileşenler kullanarak uyguladık.

Bileşen işlevlerinin renderless bileşenlere göre en büyük avantajı, bileşen örneği yükü getirmemesidir. Tüm uygulama boyunca kullanıldığında, renderless bileşen modelinin oluşturduğu ekstra bileşen örnekleri belirgin bir performans yükü haline gelebilir.

Saf mantığı yeniden kullanırken bileşen işlevlerini; hem mantığı hem de görsel düzeni yeniden kullanırken bileşenleri kullanmanızı öneriyoruz.

### Karşılaştırma: React Kancaları {#vs-react-hooks}

Eğer React deneyiminiz varsa, bunun özel React kancalarına çok benzediğini fark edebilirsiniz. Composition API, kısmen React kancalarından ilham almıştır ve Vue bileşen işlevleri, mantık bileşimi yetenekleri açısından gerçekten React kancalarına benzer. Ancak, Vue bileşen işlevleri, Vue'nun ince-grained reaktiviteli sistemi temel alınarak oluşturulmuştur; bu, React kancalarının yürütme modelinden temelde farklıdır. Bu, [Composition API SSS](https://vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks) bölümünde daha ayrıntılı olarak tartışılmaktadır.

## Daha Fazla Okuma {#further-reading}

- `Reaktivite Derinliği`: Vue'nun reaktivite sisteminin nasıl çalıştığına dair düşük seviyeli bir anlayış için.
- `Durum Yönetimi`: Birden fazla bileşen tarafından paylaşılan durumu yönetme kalıpları için.
- `Bileşen İşlevlerinin Testi`: bileşen işlevlerinin birim testi ile ilgili ipuçları.
- [VueUse](https://vueuse.org/): sürekli büyüyen bir Vue bileşen işlevleri koleksiyonu. Kaynak kodu aynı zamanda harika bir öğrenme kaynaklarıdır.