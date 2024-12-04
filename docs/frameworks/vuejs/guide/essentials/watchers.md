---
title: İzleyiciler
seoTitle: İzleyiciler - Vue.js
sidebar_position: 4
description: İzleyiciler, Vue.jsde reaktif verilerin değişimini izlemek için kullanılan önemli bir özellik. Bu bölümde, temel kullanım örnekleri, derin izleyici özellikleri ve daha fazlası açıklanmaktadır.
tags: 
  - izleyici
  - reaktif özellikler
  - Vue.js
keywords: 
  - izleyiciler
  - reaktif
  - Vue.js
---
## İzleyiciler {#watchers}

## Temel Örnek {#basic-example}

Hesaplanan özellikler, türetilmiş değerleri beyan ederek hesaplamamıza olanak tanır. Ancak, durum değişikliklerine yanıt olarak "yan etkiler" gerçekleştirmemiz gereken durumlar vardır; örneğin, DOM'u değiştirmek veya bir asenkron işlemin sonucuna dayalı olarak başka bir durum parçasını değiştirmek.



:::info
Seçenekler API'si ile, bir reaktif özellik değiştiğinde bir fonksiyonu tetiklemek için `watch` seçeneğini` kullanabiliriz:
:::

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Sorular genellikle bir soru işareti içerir. ;-)',
      loading: false
    }
  },
  watch: {
    // her zaman soru değiştiğinde bu fonksiyon çalışacak
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Düşünüyorum...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Hata! API\'ye erişilemedi. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Evet/hayır sorusu sor:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Playground'da dene](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

:::warning
`watch` seçeneği ayrıca anahtar olarak nokta ile ayrılmış bir yol destekler:
:::

```js
export default {
  watch: {
    // Not: yalnızca basit yollar. İfadeler desteklenmez.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```





:::info
Composition API ile, bir parça reaktif durum değiştiğinde bir geri çağırmayı tetiklemek için `watch` fonksiyonunu` kullanabiliriz:
:::

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Sorular genellikle bir soru işareti içerir. ;-)')
const loading = ref(false)

// watch, doğrudan bir ref üzerinde çalışır
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Düşünüyorum...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Hata! API\'ye erişilemedi. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Evet/hayır sorusu sor:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Playground'da dene](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)



### İzlemekteki Kaynak Türleri {#watch-source-types}

`watch`'ın ilk argümanı farklı türlerde reaktif "kaynaklar" olabilir: bir ref (hesaplanan ref'ler dahil), reaktif bir nesne, bir [getter fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) veya birden fazla kaynağın bir dizisi:

```js
const x = ref(0)
const y = ref(0)

// tek bir ref
watch(x, (newX) => {
  console.log(`x: ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`x + y toplamı: ${sum}`)
  }
)

// birden fazla kaynaktan oluşan dizi
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x: ${newX} ve y: ${newY}`)
})
```

Reaktif bir nesnenin bir özelliğini bu şekilde izleyemeyeceğinizi unutmayın:

```js
const obj = reactive({ count: 0 })

// bu çalışmayacak çünkü watch()'a bir sayı geçiriyoruz
watch(obj.count, (count) => {
  console.log(`Count: ${count}`)
})
```

Bunun yerine, bir getter kullanın:

```js
// bunun yerine bir getter kullanın:
watch(
  () => obj.count,
  (count) => {
    console.log(`Count: ${count}`)
  }
)
```



## Derin İzleyiciler {#deep-watchers}



`watch` varsayılan olarak yüzeyseldir: geri çağırma, izlenen özellik yeni bir değere atanır atanmaz tetiklenir - iç içe geçmiş özellik değişikliklerinde tetiklenmez. Tüm iç içe mutasyonlar üzerinde geri çağırmayı tetiklemek istiyorsanız, derin bir izleyici kullanmanız gerekir:

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Not: `newValue` burada `oldValue`'ye eşit olacaktır
        // iç içe mutasyonlarda, nesne kendisi
        // değiştirilmediği sürece.
      },
      deep: true
    }
  }
}
```





Reaktif bir nesne üzerinde `watch()` çağırdığınızda, bu otomatik olarak derin bir izleyici oluşturacaktır - geri çağırma, tüm iç içe mutasyonlar üzerinde tetiklenecektir:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // iç içe özellik mutasyonlarında tetiklenir
  // Not: `newValue` burada `oldValue`'ye eşit olacaktır
  // çünkü ikisi de aynı nesneye işaret eder!
})

obj.count++
```

Bu, bir getter döndüren reaktif bir nesne ile farklıdır - bu durumda, geri çağırma yalnızca getter farklı bir nesne döndürdüğünde tetiklenecektir:

```js
watch(
  () => state.someObject,
  () => {
    // state.someObject değiştirildiğinde yalnızca tetiklenir
  }
)
```

Ancak, ikinci durumu açıkça `deep` seçeneğini kullanarak derin bir izleyiciye dönüştürebilirsiniz:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Not: `newValue` burada `oldValue`'ye eşit olacaktır
    // *değiştirilmedikçe* state.someObject
  },
  { deep: true }
)
```



:::warning Dikkatle Kullanınız
Derin izleme, izlenen nesnedeki tüm iç içe geçmiş özellikleri gezinmeyi gerektirir ve büyük veri yapıları üzerinde kullanıldığında maliyetli olabilir. Bunun sadece gerekli olduğunda kullanılması ve performans etkilerine dikkat edilmesi gerekir.
:::

## İstemci İzleyiciler {#eager-watchers}

`watch` varsayılan olarak tembeldir: geri çağırma, izlenen kaynak değişene kadar çağrılmaz. Ancak bazı durumlarda, aynı geri çağırma mantığının hevesle çalışmasını isteyebiliriz - örneğin, bazı başlangıç verilerini almak isteyebiliriz ve ardından ilgili durum değiştiğinde verileri tekrar alabiliriz.



Geri çağırmanın hemen çalışmasını sağlamak için, bir nesne tanımlayıp `handler` fonksiyonu ve `immediate: true` seçeneğini kullanarak izleyiciyi tanımlayabiliriz:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // bu, bileşen oluşturulduğunda hemen çalışacak.
      },
      // hevesli geri çağırma yürütmesini zorla
      immediate: true
    }
  }
  // ...
}
```

Geri çağırma fonksiyonunun ilk yürütmesi, `created` kancasından hemen önce gerçekleşecektir. Vue, `data`, `computed` ve `methods` seçeneklerini zaten işlemiştir, bu nedenle bu özellikler ilk çağrıda mevcut olacaktır.





Geri çağırmanın hemen çalışmasını sağlamak için `immediate: true` seçeneğini geçebiliriz:

```js
watch(
  source,
  (newValue, oldValue) => {
    // hemen yürütülür, daha sonra `source` değiştiğinde de
  },
  { immediate: true }
)
```



## Tek Seferlik İzleyiciler {#once-watchers}

- Yalnızca 3.4+ sürümlerinde desteklenmektedir.

İzleyici geri çağırması, izlenen kaynak değiştiğinde çalışacaktır. Eğer geri çağırmanın yalnızca kaynak değiştiğinde bir kez tetiklenmesini istiyorsanız, `once: true` seçeneğini kullanın.



```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // `source` değiştiğinde yalnızca bir kez tetiklenir
      },
      once: true
    }
  }
}
```





```js
watch(
  source,
  (newValue, oldValue) => {
    // `source` değiştiğinde yalnızca bir kez tetiklenir
  },
  { once: true }
)
```





## `watchEffect()` \*\* {#watcheffect}

İzleyici geri çağrısının, tam olarak aynı reaktif durumu kaynak olarak kullanması yaygındır. Örneğin, `todoId` ref'inin değiştiğinde uzaktan bir kaynağı yüklemek için bir izleyici kullanan aşağıdaki kodu düşünün:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

Özellikle, izleyicinin `todoId`'yi iki kez nasıl kullandığına dikkat edin; bir kez kaynak olarak ve sonra geri çağırma içerisinde tekrar.

Bu, `watchEffect()` ile basitleştirilebilir. `watchEffect()`, geri çağırmanın reaktif bağımlılıklarını otomatik olarak izlememize olanak tanır. Yukarıdaki izleyici, şu şekilde yeniden yazılabilir:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Burada, geri çağırma hemen çalışacak; `immediate: true` belirtmeye gerek yok. Yürütme sırasında, `todoId.value`'yı bağımlılık olarak otomatik olarak izleyecektir (hesaplanan özelliklere benzer). `todoId.value` değiştiğinde, geri çağırma tekrar çalıştırılacaktır. `watchEffect()` ile, artık kaynak değeri olarak `todoId`'yi açıkça geçmemize gerek yok.

Bu `örneği` inceleyebilirsiniz; `watchEffect()` ve reaktif veri çekme işleminin işe yaradığı durumları gösterir.

Bu gibi durumlar için, yalnızca bir bağımlılık varsa, `watchEffect()`'in faydası oldukça azdır. Ancak birden fazla bağımlılığa sahip izleyiciler için, `watchEffect()` bağımlılık listesini manuel olarak tutma yükümlülüğünü ortadan kaldırır. Ayrıca, bir iç içe veri yapısındaki birçok özelliği izlemeye ihtiyacınız varsa, `watchEffect()`, geri çağırmada kullanılan özellikleri izleyeceğinden daha verimli olabilir; bu nedenle iç içe tüm özellikleri izlemek zorunda kalmazsınız.

:::tip
`watchEffect` yalnızca **eşzamanlı** yürütme sırasında bağımlılıkları izler. Async bir geri çağırma ile kullanıldığında, yalnızca ilk `await` işlemi öncesinde erişilen özellikler izlenecektir.
:::

### `watch` ile `watchEffect` Karşılaştırması {#watch-vs-watcheffect}

`watch` ve `watchEffect` her ikisi de reaktif yan etkileri gerçekleştirmemizi sağlar. Ana farkları, reaktif bağımlılıklarını izleme şeklidir:

- `watch`, yalnızca açıkça izlenen kaynağı izler. Geri çağırma içerisinde erişilen hiçbir şeyi izlemez. Ayrıca, geri çağırma yalnızca kaynak gerçekten değiştiğinde tetiklenir. `watch`, bağımlılık izlemeyi yan etkiden ayırarak, geri çağırmanın ne zaman tetikleneceği üzerinde daha kesin bir kontrol sağlar.

- Öte yandan, `watchEffect` bağımlılık izlemeyi ve yan etkileri bir aşamada birleştirir. Eşzamanlı yürütme sırasında erişilen her reaktif özelliği otomatik olarak izler. Bu daha uygundur ve genellikle daha kısa bir kod sonucunu doğurur, ancak reaktif bağımlılıklarını daha az belirgin hale getirir.



## Yan Etki Temizleme {#side-effect-cleanup}

Bazen bir izleyicide yan etkiler, örneğin asenkron istekler gerçekleştirebiliriz:



```js
watch(id, (newId) => {
  fetch(`/api/${newId}`).then(() => {
    // geri çağırma mantığı
  })
})
```




```js
export default {
  watch: {
    id(newId) {
      fetch(`/api/${newId}`).then(() => {
        // geri çağırma mantığı
      })
    }
  }
}
```



Ama ya `id` isteği tamamlanmadan değişirse? Önceki istek tamamlandığında, geride kalmış bir ID değeri ile hala geri çağırma tetiklenecektir. İdeal olarak, `id` yeni bir değere değiştiğinde geride kalan isteği iptal edebilmemiz gerekir.

`onWatcherCleanup()`  API'sini kullanarak, izleyici geçersiz olduğunda ve yeniden çalıştırılmak üzereyken çağrılacak bir temizleme fonksiyonu kaydedebiliriz:



```js {10-13}
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // geri çağırma mantığı
  })

  onWatcherCleanup(() => {
    // geride kalan isteği iptal et
    controller.abort()
  })
})
```




```js {12-15}
import { onWatcherCleanup } from 'vue'

export default {
  watch: {
    id(newId) {
      const controller = new AbortController()

      fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
        // geri çağırma mantığı
      })

      onWatcherCleanup(() => {
        // geride kalan isteği iptal et
        controller.abort()
      })
    }
  }
}
```



`onWatcherCleanup` yalnızca Vue 3.5+ sürümlerinde desteklenmektedir ve bir `watchEffect` etki fonksiyonunun veya `watch` geri çağırma fonksiyonunun eşzamanlı yürütme sırasında çağrılmalıdır: async bir fonksiyonda `await` ifadesinden sonra çağrılamaz.

Alternatif olarak, bir `onCleanup` fonksiyonu da izleyici geri çağırmalarına 3. argüman olarak, `watchEffect` etki fonksiyonuna ise birinci argüman olarak iletilir:



```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // temizleme mantığı
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // temizleme mantığı
  })
})
```




```js
export default {
  watch: {
    id(newId, oldId, onCleanup) {
      // ...
      onCleanup(() => {
        // temizleme mantığı
      })
    }
  }
}
```



Bu, 3.5'ten önceki sürümlerde çalışmaktadır. Ayrıca, fonksiyon argümanı aracılığıyla geçirilen `onCleanup`, izleyici örneğine bağlandığı için `onWatcherCleanup`'ın eşzamanlılık kısıtlamasına tabi değildir.

## Geri Çağırma Sonlandırma Zamanı {#callback-flush-timing}

Reaktif durumu değiştirdiğinizde, bu hem Vue bileşen güncellemelerini hem de sizin tarafınızdan oluşturulan izleyici geri çağırmalarını tetikleyebilir.

Bileşen güncellemeleri gibi, kullanıcı tarafından oluşturulan izleyici geri çağırmaları da yinelenen çağrıları önlemek için toplu olarak işlenir. Örneğin, bir izleyicinin bir diziye binlerce öğe itmek gibi senkron olarak binlerce kez çağrılmasını istemeyiz.

Varsayılan olarak, bir izleyicinin geri çağrması, ana bileşen güncellemelerinden (varsa) **sonra** ve sahip bileşenin DOM güncellemelerinden **önce** çağrılır. Bu, bir izleyici geri çağrısında sahip bileşenin kendi DOM'una erişmeye çalıştığınızda, DOM'un güncelleme öncesi durumunda olacağı anlamına gelir.

### Son İzleyiciler {#post-watchers}

Bir izleyici geri çağrısında sahip bileşenin DOM'una Vue güncellenmeden **sonra** erişmek istiyorsanız, `flush: 'post'` seçeneğini belirtmelisiniz:



```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```





```js{2,6}
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush `watchEffect()` ayrıca bir kolaylık takma adı taşır, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* Vue güncellemeleri sonrası çalıştırılır */
})
```



### Senkron İzleyiciler {#sync-watchers}

Aynı zamanda, herhangi bir Vue yönetimli güncellemeden önce, senkron bir izleyici oluşturarak geri çağırmanın tetiklenmesi de mümkündür:



```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```





```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

Senkron `watchEffect()` ayrıca bir kolaylık takma adı taşır, `watchSyncEffect()`:

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* reaktif veri değiştiğinde senkron olarak çalıştırılır */
})
```



:::warning Dikkatle Kullanınız
Senkron izleyiciler, toplama olmadığı için her reaktif mutasyon tespit edildiğinde tetiklenir. Bunları basit boolean değerlerini izlemek için kullanmakta bir sakınca yoktur, ancak eşzamanlı olarak birçok kez değiştirilebilecek veri kaynaklarında kullanmaktan kaçınılmalıdır, örneğin diziler gibi.
:::



## `this.$watch()` \* {#this-watch}

Aynı zamanda, `$watch()` instance metodunu` kullanarak izleyicileri zorunlu olarak yaratmak da mümkündür:

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Bu, bir izleyiciyi koşullu olarak ayarlamanız gerektiğinde veya yalnızca bir şeye kullanıcı etkileşimi sonucunda izlemek istediğinizde faydalıdır. Ayrıca, izleyiciyi erken durdurmanıza da olanak tanır.



## İzleyiciyi Durdurma {#stopping-a-watcher}



`watch` seçeneği veya `$watch()` instance metodu kullanılarak tanımlanan izleyiciler, sahip bileşen kaldırıldığında otomatik olarak durur, bu nedenle çoğu durumda izleyiciyi durdurmakla ilgili endişeleriniz olmamalıdır.

Sahip bileşen kaldırılmadan önce bir izleyiciyi durdurmanız gereken nadir durumda, `$watch()` API'si bunun için bir fonksiyon döner:

```js
const unwatch = this.$watch('foo', callback)

// ...izleyici artık gerekli olmadığında:
unwatch()
```





`setup()` veya `` içinde senkron olarak tanımlanan izleyiciler, sahip bileşen örneğine bağlıdır ve sahip bileşen kaldırıldığında otomatik olarak duracaklardır. Çoğu durumda, izleyiciyi durdurmakla ilgili endişeleriniz olmamalıdır.

Burada önemli olan, izleyicinin **eşzamanlı** olarak oluşturulmasıdır: izleyici bir async geri çağırmada oluşturulursa, bu sahip bileşene bağlı olmayacaktır ve bellek sızıntısını önlemek için manuel olarak durdurulmalıdır. İşte bir örnek:

```vue
<script setup>
import { watchEffect } from 'vue'

// bu otomatik olarak duracak
watchEffect(() => {})

// ...bu durmayacak!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Bir izleyiciyi manuel olarak durdurmak için, döndürülen işlevi kullanın. Bu, hem `watch` hem de `watchEffect` için çalışır:

```js
const unwatch = watchEffect(() => {})

// ...daha sonra, artık gerekli olmadığında
unwatch()
```

Asenkron olarak izleyici oluşturmanız gereken durumların çok az olduğu ve mümkün olan her durumda eşzamanlı oluşturmanın tercih edilmesi gerektiğini unutmayın. Eğer bazı asenkron verilere beklemeniz gerekiyorsa, izleme mantığınızı koşullu hale getirebilirsiniz:

```js
// asenkron olarak yüklenecek veri
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // veri yüklendiğinde bir şey yap
  }
})
```