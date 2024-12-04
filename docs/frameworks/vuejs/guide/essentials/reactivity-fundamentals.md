---
title: Reaktivite Temelleri
seoTitle: Reactivity Fundamentals - Vue Documentation
sidebar_position: 1
description: Reaktif programlama ilkelerini öğrenin ve Vue.js ile reaktif durumu nasıl yöneteceğinizi keşfedin. Seçenek APIsi ve Kompozisyon APIsi arasındaki farkları anlamak için detaylı bilgiler.
tags: 
  - reaktivite
  - vue
  - kompozisyon api
  - seçenek api
  - JavaScript
keywords: 
  - reaktif durum
  - Vue.js
  - JavaScript Proksileri
  - ref
  - reactive
---
## Reaktivite Temelleri {#reactivity-fundamentals}

:::tip API Tercihi
Bu sayfa ve kılavuzun ilerleyen bölümlerindeki birçok bölüm, Seçenek API'si ve Kompozisyon API'si için farklı içerikler içermektedir. Mevcut tercihiniz Seçenek API'siKompozisyon API'si. Sol kenar çubuğun üstündeki "API Tercihi" anahtarlarıyla API stilleri arasında geçiş yapabilirsiniz.
:::



## Reaktif Durum Bildirimi \* {#declaring-reactive-state}

Seçenek API'si ile bir bileşenin reaktif durumunu tanımlamak için `data` seçeneğini kullanırız. Seçenek değeri, bir nesne döndüren bir fonksiyon olmalıdır. Vue, yeni bir bileşen örneği oluştururken bu fonksiyonu çağıracak ve dönen nesneyi reaktivite sistemine saracaktır. Bu nesnenin üst düzey özellikleri bileşen örneği üzerinde (`this` yöntemlerde ve yaşam döngüsü kancalarında):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` daha sonra açıklayacağımız bir yaşam döngüsü kancasıdır.
  mounted() {
    // `this` bileşen örneğine atıfta bulunur.
    console.log(this.count) // => 1

    // veri de değiştirilebilir
    this.count = 2
  }
}
```

[Playground'da Deneyin](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Bu örnek özellikleri yalnızca örnek ilk oluşturulduğunda eklenir, bu nedenle `data` fonksiyonundan dönen nesnede hepsinin mevcut olduğundan emin olmalısınız. Gerekirse, istenen değer henüz mevcut değilse özellikler için `null`, `undefined` veya başka bir yer tutucu değeri kullanın.

`this`'e yeni bir özellik eklemek mümkündür, ancak bu şekilde eklenen özellikler reaktif güncellemeleri tetikleyemez.

Vue, bileşen örneği aracılığıyla kendi yerleşik API'lerini açarken `$` ön ekini kullanmaktadır. Ayrıca `_` ön ekini dahili özellikler için saklar. Bu karakterlerden biriyle başlayan üst düzey `data` özelliği adlarını kullanmaktan kaçınmalısınız.

### Reaktif Proksi vs. Orijinal \* {#reactive-proxy-vs-original}

Vue 3'te veriler [JavaScript Proksileri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) kullanılarak reaktif hale getirilir. Vue 2'den gelen kullanıcıların dikkat etmesi gereken birkaç köşe durumu vardır:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

`this.someObject`'a atandıktan sonra eriştiğinizde, değer orijinal `newObject`'ın reaktif bir proksisidir. **Vue 2'den farklı olarak, orijinal `newObject` sağlam kalır ve reaktif hale getirilmeyecek: reaktif duruma her zaman `this`'in bir özelliği olarak eriştiğinizden emin olun.**





## Reaktif Durum Bildirimi \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

Kompozisyon API'sinde reaktif durumu tanımlamanın önerilen yolu `ref()` fonksiyonunu kullanmaktır:

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` argümanı alır ve onu `.value` özelliğine sahip bir ref nesnesi içinde sarmalar:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Ayrıca bakınız: `Refs'i Tipleme` 

Refs'i bir bileşenin şablonunda erişmek için bunları bileşenin `setup()` fonksiyonundan tanımlayıp döndürmelisiniz:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` Kompozisyon API'sine özel bir kancadır.
  setup() {
    const count = ref(0)

    // referansı şablona aç
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Ref'i şablonda kullanırken `.value` eklememize gerek olmadığını unutmayın. Kolaylık için, refs şablon içinde kullanıldığında otomatik olarak açılır (birkaç `uyarı ile`).

Ayrıca bir ref'i olay işleyicilerinde doğrudan değiştirebilirsiniz:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

Daha karmaşık mantık için, aynı kapsamda refs'i değiştiren fonksiyonlar tanımlayıp bunları durumla birlikte yöntemler olarak açığa çıkarabiliriz:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // .value JavaScript'te gereklidir
      count.value++
    }

    // fonksiyonu da açmayı unutmayın.
    return {
      count,
      increment
    }
  }
}
```

Açık yöntemler daha sonra olay işleyicileri olarak kullanılabilir:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

İşte örneği [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo) üzerinde, herhangi bir inşa aracı kullanmadan.

### `` \*\* {#script-setup}

Durum ve yöntemleri `setup()` aracılığıyla manuel olarak açmak ayrıntılı olabilir. Neyse ki, `Tek Dosya Bileşenleri (SFC'ler)` kullanıldığında bu önlenebilir. `` ile kullanımı basitleştirebiliriz:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Playground'da Deneyin](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

Üst düzey importlar, `` aracılığıyla tanımlanan değişkenler ve fonksiyonlar aynı bileşenin şablonunda otomatik olarak kullanılabilir. Şablona, aynı kapsamda tanımlanan bir JavaScript fonksiyonu gibi düşünün - doğal olarak beraberinde tanımlanan her şeye erişimi vardır.

:::tip
Kılavuzun geri kalanında, Kompozisyon API kod örnekleri için SFC + `` sözdizimini kullanacağız, çünkü bu Vue geliştiricileri için en yaygın kullanımdır.

SFC kullanmıyorsanız, `setup()` seçeneği ile Kompozisyon API'sini kullanmaya devam edebilirsiniz.
:::

### Neden Refs? \*\* {#why-refs}

`.value` ile neden refs'e ihtiyacımız olduğu üzerine merak ediyor olabilirsiniz. Bunu açıklamak için Vue'nun reaktivite sisteminin nasıl çalıştığı hakkında kısa bir bilgi vermek gerekecek.

Bir şablonda bir ref kullandığınızda ve daha sonra ref'in değerini değiştirdiğinizde, Vue değişikliği otomatik olarak algılar ve DOM'u buna göre günceller. Bu, bağımlılık takibi tabanlı bir reaktivite sistemi ile mümkün hale gelir. Bir bileşen ilk kez oluşturulduğunda, Vue **takip eder** render sırasında kullanılan her ref'i. Daha sonra, bir ref değiştirildiğinde, bu durumu **tetikler** onu takip eden bileşenler için tekrar render'lamak.

Standart JavaScript'te düz değişkenlerin erişimi veya değiştirilmesi algılayacak bir yol yoktur. Ancak, bir nesnenin özelliklerinin getirme ve ayarlama işlemlerini yakalayabiliriz.

`.value` özelliği, Vue için bir ref'e erişildiğinde veya değiştirildiğinde algılayabilme fırsatı verir. Arka planda Vue, getter'ında izlemeyi gerçekleştirir ve setter'ında tetiklemeyi yapar. Kavramsal olarak, bir ref'i böyle bir nesne olarak düşünebilirsiniz:

```js
// sahte kod, gerçek uygulama değil
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Refs'in diğer güzel bir özelliği, düz değişkenlerin aksine, en son değere ve reaktivite bağlantısına erişimi koruyarak, fonksiyonlara refs'i geçirebilmenizdir. Bu, karmaşık mantığı yeniden kullanılabilir koda dönüştürürken özellikle faydalıdır.

Reaktivite sisteminin daha ayrıntılı bir incelemesi, `Derin Reaktivite` bölümünde ele alınmıştır.




## Yöntemlerin Bildirilmesi \* {#declaring-methods}



Bir bileşen örneğine yöntem eklemek için `methods` seçeneğini kullanırız. Bu, istenen yöntemleri içeren bir nesne olmalıdır:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // yöntemler yaşam döngüsü kancalarında veya diğer yöntemlerde çağrılabilir!
    this.increment()
  }
}
```

Vue, `methods` için `this` değerini otomatik olarak bağlar, böylece her zaman bileşen örneğine atıfta bulunur. Bu, bir yöntemin doğru `this` değerini korumasını sağlar, eğer bir olay dinleyicisi veya geri çağırma olarak kullanılıyorsa. Yöntemleri tanımlarken ok fonksiyonları kullanmaktan kaçınmalısınız, çünkü bu Vue'nun uygun `this` değerini bağlamasını engeller:

```js
export default {
  methods: {
    increment: () => {
      // KÖTÜ: burada `this` erişimi yok!
    }
  }
}
```

Bileşen örneğinin diğer özellikleri gibi, `methods` de bileşenin şablonundan erişilebilir. Bir şablon içinde en yaygın olarak etkinlik dinleyicileri olarak kullanılırlar:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Playground'da Deneyin](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

Yukarıdaki örnekte, `` tıklandığında `increment` yöntemi çağrılacaktır.



### Derin Reaktivite {#deep-reactivity}



Vue'da durum varsayılan olarak derin reaktiftir. Bu, iç içe nesneleri veya dizileri değiştirseniz bile değişikliklerin algılanabileceği anlamına gelir:

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // bu beklenildiği gibi çalışır.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```





Refs her türlü değer türünü tutabilir, buna derin iç içe nesneler, diziler veya JavaScript yerleşik veri yapıları (örneğin `Map`) dahildir.

Bir ref, değerini derin reaktif hale getirir. Bu, iç içe nesneleri veya dizileri değiştirseniz bile değişikliklerin algılanabileceği anlamına gelir:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // bu beklenildiği gibi çalışır.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Temel olmayan değerler `reactive()` ile reaktif proksilere dönüştürülür, bu da aşağıda açıklanmıştır.

Derin reaktivite dışlama, `sığ refs` ile de mümkündür. Sığ refs için, yalnızca `.value` erişimi reaktivite için izlenir. Sığ refs, büyük nesnelerin gözlemlenme maliyetinden kaçınarak performansı optimize etmek için veya iç durumu bir dış kütüphane tarafından yönetildiğinde kullanılabilir.

Daha fazla okumak için:

- `Büyük Değişmez Yapılar için Reaktivite Aşırılıklarını Azaltın`
- `Dış Durum Sistemleri ile Entegrasyon`



### DOM Güncelleme Zamanlaması {#dom-update-timing}

Reaktif durumu değiştirdiğinizde, DOM otomatik olarak güncellenir. Ancak, DOM güncellemelerinin senkron bir şekilde uygulanmadığını belirtmek gerekir. Bunun yerine, Vue, her bileşenin yalnızca bir kez güncellenmesini sağlamak için güncelleme döngüsündeki "bir sonraki tik" e kadar bunları tamponlar.

Bir durum değişikliğinden sonra DOM güncellemesinin tamamlanmasını beklemek için `nextTick()` global API'sini kullanabilirsiniz:



```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Artık DOM güncellendi
}
```




```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // Artık DOM güncellendi
    }
  }
}
```





## `reactive()` \*\* {#reactive}

Reaktif durumu tanımlamanın başka bir yolu, `reactive()` API'sidir. Bir ref'in içinde ayarlanan değeri saran `reactive()`'ın tersine, `reactive()` bir nesneyi reaktif hale getirir:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Ayrıca bakınız: `Reaktif Tipleme` 

Şablondaki kullanım:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Reaktif nesneler [JavaScript Proksileri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)dir ve normal nesneler gibi davranırlar. Farkı, Vue'nun bir reaktif nesnenin tüm özelliklerine erişimi ve değişiklikleri izlemeyi ve tetiklemeyi engelleyebilmesidir.

`reactive()` nesneyi derin bir şekilde dönüştürür: iç içe nesneler de erişildiğinde `reactive()` ile sarılır. Ayrıca nesne bir ref değeri olduğunda, içeride `ref()` ile çağrılır. Sığ refs gibi, derin reaktifliği dışlamak için `shallowReactive()` API'si de vardır.

### Reaktif Proksi vs. Orijinal \*\* {#reactive-proxy-vs-original-1}

`reactive()`'dan dönen değerin, orijinal nesnenin bir [Proksi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) olduğunu belirtmek önemlidir, bu orijinal nesneye eşit değildir:

```js
const raw = {}
const proxy = reactive(raw)

// proksi orijinal ile EŞİT DEĞİL.
console.log(proxy === raw) // false
```

Sadece proksi reaktiftir - orijinal nesne değiştirildiğinde güncellemeleri tetiklemeyecektir. Bu nedenle, Vue'nun reaktivite sistemiyle çalışırken en iyi uygulama, **durumlarınızın yalnızca proksi sürümlerini kullanmaktır**.

Proksinin tutarlı erişimini sağlamak için, aynı nesne üzerinde `reactive()` çağrısı her zaman aynı proksiyi döner ve mevcut bir proksi üzerinde `reactive()` çağrısı da o aynı proksiyi döner:

```js
// aynı nesne üzerinde reactive() çağrısı aynı proksiyi döner
console.log(reactive(raw) === proxy) // true

// bir proksi üzerinde reactive() çağrısı kendisini döner
console.log(reactive(proxy) === proxy) // true
```

Bu kural iç içe nesneler için de geçerlidir. Derin reaktivite nedeniyle, bir reaktif nesne içinde bulunan iç içe nesneler de proksidir:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### `reactive()`'nun Sınırlamaları \*\* {#limitations-of-reactive}

`reactive()` API'sinin birkaç sınırlaması vardır:

1. **Sınırlı değer türleri:** yalnızca nesne türleri (nesneler, diziler ve [koleksiyon türleri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) gibi `Map` ve `Set`) için çalışır. [Temel türleri](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) olan `string`, `number` veya `boolean` içeremez.

2. **Tüm nesneyi değiştiremez:** Vue'nun reaktivite takibi özellik erişimi üzerinden çalıştığı için, reaktif nesneye her zaman aynı referansı korumalıyız. Bu, bir reaktif nesneyi kolayca "değiştirmenin" mümkün olmadığı anlamına gelir; çünkü ilk referansa olan reaktivite bağlantısı kaybolur:

   ```js
   let state = reactive({ count: 0 })

   // yukarıdaki referans ({ count: 0 }) artık izlenmiyor
   // (reaktivite bağlantısı kayboldu!)
   state = reactive({ count: 1 })
   ```

3. **Yıkıcı dostu değildir:** bir reaktif nesnenin temel tip özelliklerini yerel değişkenlere ayırdığımızda veya o özelliği bir fonksiyona geçtiğimizde, reaktivite bağlantısını kaybederiz:

   ```js
   const state = reactive({ count: 0 })

   // count yerel değişken (state.count) ile bağlantısı kesildiğinde.
   let { count } = state
   // orijinal durumu etkilemez
   count++

   // fonksiyon düz bir sayı alır ve
   // state.count'a yapılan değişiklikleri izlemeyecektir.
   // %state'i geçmemiz gerekir.
   callSomeFunction(state.count)
   ```

Bu sınırlamalar nedeniyle, reaktif durumu tanımlamak için `ref()`'yi ana API olarak kullanmayı öneriyoruz.

## Ek Ref Açma Ayrıntıları \*\* {#additional-ref-unwrapping-details}

### Reaktif Nesne Özelliği Olarak \*\* {#ref-unwrapping-as-reactive-object-property}

Bir ref, reaktif bir nesnenin özelliği olarak erişildiğinde veya değiştirildiğinde otomatik olarak açılır. Başka bir deyişle, normal bir özellik gibi davranır:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Mevcut bir ref'e bağlantılı bir özelliğe yeni bir ref atanırsa, eski ref'i değiştirecektir:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// orijinal ref artık state.count ile bağlantılı değil
console.log(count.value) // 1
```

Ref'in açılması yalnızca derin bir reaktif nesne içinde olduğunda gerçekleşir. `Sığ reaktif nesnelerde` özelliği olarak erişildiğinde uygulanmaz.

### Diziler ve Koleksiyonlar Üzerindeki Uyarı \*\* {#caveat-in-arrays-and-collections}

Reaktif nesnelerin aksine, bir ref'in reaktif bir dizinin veya `Map` gibi yerel bir koleksiyon türünün bir elemanı olarak erişildiğinde **açılma** gerçekleşmez:

```js
const books = reactive([ref('Vue 3 Kılavuzu')])
// burada .value gerekir
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// burada .value gerekir
console.log(map.get('count').value)
```

### Şablonlarda Açılma Durumundaki Uyarı \*\* {#caveat-when-unwrapping-in-templates}

Şablonlarda bir ref'in açılması yalnızca ref'in şablon render bağlamında üst düzey bir özellik olması durumunda uygulanır.

Aşağıdaki örnekte, `count` ve `object` üst düzey özelliklerdir, ancak `object.id` değildir:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Bu nedenle, bu ifade beklenildiği gibi çalışır:

```vue-html
{{ count + 1 }}
```

...bu ise **ÇALIŞMAZ**:

```vue-html
{{ object.id + 1 }}
```

Çıktı sonucu `[nesne Nesnesi]1` olacaktır, çünkü `object.id` alanı değerlendirilirken açılmaz ve bir ref nesnesi olarak kalır. Bunu düzeltmek için, `id`'yi üst düzey bir özellikte ayırabiliriz:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Artık çıktı sonucu `2` olacaktır.

Diğer bir önemli nokta, bir ref herhangi bir metin ara çıktısında (yani `<code v-pre>{{ }}` etiketinde) son değerlendirilen değer olduğunda açıldığıdır, bu nedenle aşağıdaki ifade `1` render edecektir:

```vue-html
{{ object.id }}
```

Bu, metin ara çıktısının bir kolaylığıdır ve `<code v-pre>{{ object.id.value }}` ile eşdeğerdir.