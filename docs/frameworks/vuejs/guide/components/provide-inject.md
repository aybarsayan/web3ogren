---
title: Sağlama / Enjeksiyon
seoTitle: Sağlama ve Enjeksiyon ile Veri Geçişi
sidebar_position: 3
description: Bu kılavuzda, Vue.jsde sağlama ve enjeksiyon yöntemlerini öğrenerek bileşenler arasında veri geçişini nasıl gerçekleştirebileceğinizi keşfedeceksiniz. Ayrıca, props delme sorununu nasıl çözebileceğinizi de öğreneceksiniz.
tags: 
  - Vue.js
  - Sağlama
  - Enjeksiyon
  - Bileşenler
  - Reaktivite
keywords: 
  - sağlık
  - enjeksiyon
  - component
  - props drilling
  - Vue
---
## Sağlama / Enjeksiyon {#provide-inject}

> Bu sayfanın, `Bileşenler Temelleri` konusunu okuduğunuzu varsaydığını unutmayın. Eğer bileşenlere yeniyseniz, önce onu okuyun.

## Prop Delme {#prop-drilling}

Genellikle, bir ebeveyn bileşenden bir çocuk bileşene veri geçmemiz gerektiğinde, `props` kullanırız. Ancak, büyük bir bileşen ağacında derinlemesine yerleşmiş bir bileşenin uzak bir atasından bir şey alması gereken bir durumu düşünelim. Sadece props ile, aynı prop'u tüm ebeveyn zinciri boyunca iletmek zorundayız:

![prop drilling diagram](../../../images/frameworks/vuejs/guide/components/images/prop-drilling.png)

:::warning
Not edin ki `` bileşeni bu props'ları hiç önemsemiyor olabilir, yine de `` bunlara erişebilmesi için bunları deklarasyon etmek ve iletmek zorundadır. Daha uzun bir ebeveyn zinciri varsa, daha fazla bileşen de etkilenir.
:::

Bu duruma "props delme" denir ve kesinlikle başa çıkması eğlenceli değildir. Props delme sorununu `provide` ve `inject` ile çözebiliriz. Bir ebeveyn bileşen, tüm çocukları için bir **bağımlılık sağlayıcısı** olarak hizmet edebilir. Çocuk ağaçlarındaki herhangi bir bileşen, ebeveyn zincirindeki yukarıdaki bileşenlerden sağlanan bağımlılıkları **enjekte** edebilir.

![Sağlama/enjeksiyon şeması](../../../images/frameworks/vuejs/guide/components/images/provide-inject.png)

## Sağlama {#provide}



Bir bileşenin çocuklarına veri sağlamak için `provide()` fonksiyonunu kullanın:

```vue
<script setup>
import { provide } from 'vue'

provide(/* anahtar */ 'message', /* değer */ 'merhaba!')
</script>
```

Yine `` kullanılmıyorsa, `provide()` fonksiyonunun `setup()` içerisinde senkron olarak çağrıldığından emin olun:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* anahtar */ 'message', /* değer */ 'merhaba!')
  }
}
```

`provide()` fonksiyonu iki argüman alır. İlk argüman **enjeksiyon anahtarı** olarak adlandırılır, bu bir dize veya bir `Symbol` olabilir. Enjeksiyon anahtarı, çocuk bileşenlerin enjeksiyon yapmak için gereken değeri bulmasına yardımcı olur. Tek bir bileşen, farklı enjeksiyon anahtarları ile `provide()` fonksiyonunu birden fazla kez çağırarak farklı değerler sağlayabilir.

İkinci argüman ise sağlanan değerdir. Değer, reaktif durumlar gibi herhangi bir türde olabilir:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Reaktif değerleri sağlamak, bunları kullanan çocuk bileşenlerin sağlayıcı bileşenle reaktif bir bağlantı kurmasını sağlar.





Bir bileşenin çocuklarına veri sağlamak için `provide` seçeneğini kullanın:

```js
export default {
  provide: {
    message: 'merhaba!'
  }
}
```

`provide` nesnesindeki her bir özellik için, anahtar çocuk bileşenlerin doğru değeri bulmasına yardımcı olurken, değer ise enjekte edilecek olan değerdir.

Örneğin `data()` aracılığıyla bildirilen veriler gibi örnek başına durum sağlamak gerekiyorsa, `provide` bir fonksiyon değeri kullanmalıdır:

```js{7-12}
export default {
  data() {
    return {
      message: 'merhaba!'
    }
  },
  provide() {
    // `this`'e erişebilmek için fonksiyon sözdizimini kullanın
    return {
      message: this.message
    }
  }
}
```

Ancak, bu durumun **reaktif** olmadığını unutmayın. Aşağıda `enjeksiyonları rektif hale getirmeyi` tartışacağız.



## Uygulama Seviyesinde Sağlama {#app-level-provide}

Bir bileşende veri sağlamanın yanı sıra, uygulama seviyesinde de sağlayabiliriz:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* anahtar */ 'message', /* değer */ 'merhaba!')
```

Uygulama seviyesinde sağlanan değerler, uygulamada oluşturulan tüm bileşenler için mevcuttur. Bu, `plugin` yazarken özellikle faydalıdır, çünkü plugin'ler genellikle bileşenler aracılığıyla değer sağlama yeteneğine sahip değildir.

## Enjeksiyon {#inject}



Bir ata bileşeni tarafından sağlanan veriyi enjekte etmek için `inject()` fonksiyonunu kullanın:

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Eğer sağlanan değer bir ref ise, olduğu gibi enjeksiyon yapılacak ve otomatik olarak açılmayacaktır. Bu, enjeksiyon yapan bileşenin sağlayıcı bileşen ile reaktiftir bağlantısını korumasına olanak tanır.

[Reaktivite ile Tam Sağlama + Enjeksiyon Örneği](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Yine `` kullanılmıyorsa, `inject()` yalnızca `setup()` içinde senkron olarak çağrılmalıdır:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```





Bir ata bileşeni tarafından sağlanan veriyi enjekte etmek için `inject` seçeneğini kullanın:

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // enjeksiyon değeri
  }
}
```

Enjeksiyonlar, bileşenin kendi durumundan **önce** çözülür, bu nedenle `data()` içinde enjeksiyonlu özelliklere erişebilirsiniz:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // enjeksiyon değerine dayalı ilk veri
      fullMessage: this.message
    }
  }
}
```

[Tam Sağlama + Enjeksiyon örneği](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Enjeksiyon Taklitleri \* {#injection-aliasing}

`inject` için dizi sözdizimi kullanıldığında, enjekte edilen özellikler bileşen örneğinde aynı anahtarla görünür. Yukarıdaki örnekte, özellik `"message"` anahtarı altında sağlandı ve `this.message` olarak enjekte edildi. Yerel anahtar, enjeksiyon anahtarı ile aynıdır.

Eğer özelliği farklı bir yerel anahtar kullanarak enjekte etmek istiyorsak, `inject` seçeneği için nesne sözdizimini kullanmalıyız:

```js
export default {
  inject: {
    /* yerel anahtar */ localMessage: {
      from: /* enjeksiyon anahtarı */ 'message'
    }
  }
}
```

Burada, bileşen `"message"` anahtarı ile sağlanan bir özelliği bulacak ve `this.localMessage` olarak sergileyecektir.



### Enjeksiyon Varsayılan Değerleri {#injection-default-values}

Varsayılan olarak, `inject` enjeksiyon anahtarının ebeveyn zincirinde bir yerde sağlandığını varsayar. Anahtar sağlanmadığında, bir çalışma zamanı uyarısı olacaktır.

Eğer bir enjeksiyon özelliğinin isteğe bağlı sağlayıcılarla çalışmasını istiyorsak, bir varsayılan değer tanımlamamız gerekiyor, props gibi:



```js
// `değer`, "mesaj" ile eşleşen bir veri sağlanmadığında "varsayılan değer" olacaktır
const value = inject('message', 'varsayılan değer')
```

Bazı durumlarda, varsayılan değer, bir fonksiyon çağrısı veya yeni bir sınıf örneği oluşturularak oluşturulabilir. İsteğe bağlı değerin kullanılmadığı durumlarda gereksiz hesaplamalardan veya yan etkilerden kaçınmak için varsayılan değeri oluşturmak için bir fabrika fonksiyonu kullanılabilir:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

Üçüncü parametre, varsayılan değerin bir fabrika fonksiyonu olarak değerlendirilmesini belirtir.





```js
export default {
  // varsayılan değerler tanımlarken nesne sözdizimi gereklidir
  inject: {
    message: {
      from: 'message', // bu, enjeksiyon için aynı anahtarı kullanıyorsanız isteğe bağlıdır
      default: 'varsayılan değer'
    },
    user: {
      // pahalı olacak şekilde oluşturulması gereken veya bileşen örneği başına benzersiz olmalı olan, inkar değeri için bir fabrika fonksiyonu kullanın.
      default: () => ({ name: 'John' })
    }
  }
}
```



## Reaktivite ile Çalışmak {#working-with-reactivity}



Reaktif sağlama/enjeksiyon değerlerini kullanırken, **reaktif durumlardaki herhangi bir değişikliği mümkün olduğunca sağlayıcı içinde tutmak önerilir**. Bu, sağlanan durumun ve olası değişikliklerin aynı bileşende yer almasını sağlayarak, gelecekte bakımını kolaylaştırır.

Bazen enjeksiyon bileşeninden veriyi güncelleyerek ihtiyaç duyabiliriz. Bu gibi durumlarda durumu değiştirmekten sorumlu bir fonksiyon sağlamayı öneriyoruz:

```vue{7-9,13}
<!-- sağlayıcı bileşen içinde -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('Kuzey Kutbu')

function updateLocation() {
  location.value = 'Güney Kutbu'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- enjeksiyon bileşeninde -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Ayrıca, sağlanan değeri `readonly()` ile sarmalayarak, sağlama üzerinden geçen verinin enjeksiyon bileşeni tarafından değiştirilmemesini sağlayabilirsiniz.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('okunmaz-sayı', readonly(count))
</script>
```





Enjeksiyonları sağlayıcıya reaktif olarak bağlamak için ``computed()`` fonksiyonu ile bir hesaplanmış özellik sağlamak zorundayız:

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'merhaba!'
    }
  },
  provide() {
    return {
      // açıkça bir hesaplanmış özellik sağlayın
      message: computed(() => this.message)
    }
  }
}
```

[Reaktivite ile Tam Sağlama + Enjeksiyon Örneği](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

`computed()` fonksiyonu genellikle Composition API bileşenlerinde kullanılır, ancak Options API içindeki belirli kullanım senaryolarını da tamamlayabilir. Kullanım hakkında daha fazla bilgi edinmek için `Reaktivite Temelleri` ve `Hesaplanan Özellikler` konularını okuyabilirsiniz.



## Sembol Anahtarları ile Çalışmak {#working-with-symbol-keys}

Şimdiye kadar, örneklerde dize enjeksiyon anahtarları kullandık. Eğer birçok bağımlılık sağlayıcısı olan büyük bir uygulama üzerinde çalışıyorsanız veya diğer geliştiriciler tarafından kullanılacak bileşenler yazıyorsanız, potansiyel çakışmaları önlemek için sembol enjeksiyon anahtarlarını kullanmak en iyisidir.

Sembolleri özel bir dosyada dışa aktarmanız önerilir:

```js
// keys.js
export const myInjectionKey = Symbol()
```



```js
// sağlayıcı bileşeninde
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* sağlanacak veri */
})
```

```js
// enjeksiyon bileşeninde
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

Ayrıca bakınız: `Sağlama / Enjeksiyon Tipi` 





```js
// sağlayıcı bileşeninde
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* sağlanacak veri */
      }
    }
  }
}
```

```js
// enjeksiyon bileşeninde
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```