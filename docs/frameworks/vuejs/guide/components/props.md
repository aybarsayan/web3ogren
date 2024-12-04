---
title: Props
seoTitle: Vue.js Props Guide
sidebar_position: 4
description: Bu sayfa, Vue bileşenlerindeki propsları nasıl kullanacağınızı ve beyan edeceğinizi açıklar. Fonksiyonel ve reaktif özelliklerle birlikte, prop doğrulamaları hakkında bilgi verir.
tags: 
  - Vue.js
  - Props
  - Bileşenler
  - Geliştirici
keywords: 
  - Vue
  - Props
  - Bileşen
  - Reaktif
  - JavaScript
---
## Props {#props}

> Bu sayfa, `Bileşen Temelleri` makalesini zaten okuduğunuzu varsayıyor. Bileşenlerle yeniyseniz, önce onu okuyun.


  


## Props Deklarasyonu {#props-declaration}

Vue bileşenleri, bileşene iletilen dış props'ların geçiş nitelikleri olarak nasıl işleneceğini bilmesi için açık bir props beyanı gerektirir (bu konu `özel bölümünde` ele alınacaktır).



`` kullanan SFC'lerde, props `defineProps()` makrosu kullanılarak beyan edilebilir:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

Non-`` bileşenlerinde, props `props` seçeneği kullanılarak beyan edilir:

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() props'u ilk argüman olarak alır.
    console.log(props.foo)
  }
}
```

`defineProps()`'a geçirilen argümanın, `props` seçeneklerine sağlanan değerle aynı olduğunu fark edin: Her iki beyan tarzı arasında aynı props seçenekleri API'si paylaşılmaktadır.





Props, `props` seçeneği kullanılarak beyan edilir:

```js
export default {
  props: ['foo'],
  created() {
    // props, `this` üzerinde açığa çıkar.
    console.log(this.foo)
  }
}
```



Bir dizi string kullanarak props beyan etmenin yanı sıra, nesne sözdizimini de kullanabiliriz:



```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```




```js
// <script setup> içinde
defineProps({
  title: String,
  likes: Number
})
```

```js
// non-<script setup> içinde
export default {
  props: {
    title: String,
    likes: Number
  }
}
```



Nesne beyan sözdiziminde, nesnenin anahtarları prop adını temsil ederken, değer, beklenen türün constructor fonksiyonu olmalıdır.

Bu, bileşeninizi bir anlamda belgeler, ayrıca bileşeninizi kullanan diğer geliştiriciler, hatalı tür geçirirlarsa tarayıcı konsolunda uyarı alır. Daha fazla ayrıntıyı `prop doğrulaması` başlığı altında ele alacağız.



Ayrıca bakınız: `Bileşen Props'larını Türlendirme` 





Eğer `` ile TypeScript kullanıyorsanız, sadece tip anotasyonları kullanarak da props beyan edebilirsiniz:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Daha fazla ayrıntı: `Bileşen Props'larını Türlendirme` 





## Reaktif Props Ayrıştırma  ** {#reactive-props-destructure}

Vue'nun reaktivite sistemi durum kullanımını özellik erişimine dayalı olarak takip eder. Örneğin, `props.foo`'ya bir hesaplanmış getter veya izleyici içinde eriştiğinizde, `foo` prop'u bir bağımlılık olarak takip edilir.

Dolayısıyla, aşağıdaki kodu verdiğinizde:

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // sadece 3.5'ten önce bir kez çalışır
  // 3.5+’te "foo" prop'u değiştiğinde yeniden çalışır
  console.log(foo)
})
```

3.4 ve altındaki sürümlerde, `foo` gerçek bir sabittir ve asla değişmez. 3.5 ve üzerindeki sürümlerde, Vue'nun derleyicisi, aynı `` bloğu içindeki kod, `defineProps`'dan ayrıştırılan değişkenlere eriştiğinde otomatik olarak `props.` ekler. Bu nedenle yukarıdaki kod, aşağıdakiyle eşdeğer hale gelir:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` derleyici tarafından `props.foo`'ya dönüştürülüyor
  console.log(props.foo)
})
```

Ayrıca, JavaScript'in yerel varsayılan değer sözdizimini kullanarak, props için varsayılan değerler beyan edebilirsiniz. Bu, özellikle tür tabanlı props beyanı kullanırken yararlıdır:

```ts
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

IDE'nizde ayrıştırılan props ile normal değişkenler arasında daha görsel bir ayrım istiyorsanız, Vue'nun VSCode eklentisi, ayrıştırılan props için yerleşim ipuçlarını etkinleştirme ayarı sağlar.

### Ayrıştırılan Props'u Fonksiyonlara Geçirme {#passing-destructured-props-into-functions}

Ayrıştırılan bir prop'u bir fonksiyona geçirdiğimizde, örneğin:

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

Bu, beklenildiği gibi çalışmayacaktır çünkü `watch(props.foo, ...)` ile eşdeğer - burada bir reaktif veri kaynağı yerine bir değer geçiriyoruz. Aslında, Vue'nun derleyicisi bu tür durumları yakalar ve bir uyarı verir.

Normal bir prop'u `watch(() => props.foo, ...)` ile izlediğimiz gibi, ayrıştırılan bir prop'u da bir getter içinde sarmalayarak izleyebiliriz:

```js
watch(() => foo, /* ... */)
```

Ayrıca, reaktiviteyi koruyarak ayrıştırılan bir prop'u harici bir fonksiyona geçmemiz gerektiğinde önerilen yaklaşım budur:

```js
useComposable(() => foo)
```

Harici fonksiyon, sağlanan prop'un değişikliklerini takip etmek için gereksinim duyduğunda getter'ı çağırabilir (veya bunu `toValue` ile normalize edebilir).



## Prop Geçiş Detayları {#prop-passing-details}

### Prop Adı Yazımı {#prop-name-casing}

Uzun prop adlarını camelCase kullanarak beyan ediyoruz çünkü bu, özellik anahtarları olarak kullanıldıklarında alıntı yapma ihtiyacını ortadan kaldırır ve HTML ifadelerinde doğrudan referans göstermemizi sağlar çünkü geçerli JavaScript tanımlayıcılarıdır:



```js
defineProps({
  greetingMessage: String
})
```




```js
export default {
  props: {
    greetingMessage: String
  }
}
```



```vue-html
<span>{{ greetingMessage }}</span>
```

Teknik olarak, bir alt bileşene prop geçirirken camelCase kullanmak da mümkündür (ancak `in-DOM şablonları` dışında). Ancak, tüm durumlarda HTML öznitelikleriyle uyum sağlamak amacıyla kebab-case kullanma alışkanlığı vardır:

```vue-html
<MyComponent greeting-message="hello" />
```

Mümkün olduğunca `bileşen etiketleri için PascalCase` kullanıyoruz çünkü bu, Vue bileşenlerini yerel öğelerden ayırarak şablon okunabilirliğini artırır. Ancak, prop'ları geçirirken camelCase kullanmanın çok fazla pratik faydası yoktur, bu nedenle her dilin geleneklerine uymayı tercih ediyoruz.

### Statik ve Dinamik Props {#static-vs-dynamic-props}

Şu ana kadar, aşağıdaki gibi statik değerler olarak geçirilen props'ları gördünüz:

```vue-html
<BlogPost title="My journey with Vue" />
```

Ayrıca `v-bind` veya kısayolu olan `:` ile dinamik olarak atanan props'ları da gördünüz, örneğin:

```vue-html
<!-- Bir değişkenin değerini dinamik olarak atayın -->
<BlogPost :title="post.title" />

<!-- Karmaşık bir ifadenin değerini dinamik olarak atayın -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### Farklı Değer Türlerini Geçirme {#passing-different-value-types}

Yukarıdaki iki örnekte, string değerleri geçiriyoruz, ancak _herhangi_ bir değer türü prop'a geçirilebilir.

#### Number {#number}

```vue-html
<!-- `42` statik olmasına rağmen, Vue'ya bunun bir JavaScript ifadesi olduğunu belirtmek için v-bind kullanmalıyız. -->
<BlogPost :likes="42" />

<!-- Bir değişkenin değerine dinamik olarak atayın. -->
<BlogPost :likes="post.likes" />
```

#### Boolean {#boolean}

```vue-html
<!-- Değer belirtmeden prop'u eklemek `true` anlamına gelir. -->
<BlogPost is-published />

<!-- `false` statik olmasına rağmen, Vue'ya bunun bir JavaScript ifadesi olduğunu belirtmek için v-bind kullanmalıyız. -->
<BlogPost :is-published="false" />

<!-- Bir değişkenin değerine dinamik olarak atayın. -->
<BlogPost :is-published="post.isPublished" />
```

#### Array {#array}

```vue-html
<!-- Dizi statik olmasına rağmen, Vue'ya bunun bir JavaScript ifadesi olduğunu belirtmek için v-bind kullanmalıyız. -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Bir değişkenin değerine dinamik olarak atayın. -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Object {#object}

```vue-html
<!-- Nesne statik olmasına rağmen, Vue'ya bunun bir JavaScript ifadesi olduğunu belirtmek için v-bind kullanmalıyız. -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Dinamik olarak bir değişkenin değerine atayın. -->
<BlogPost :author="post.author" />
```

### Bir Nesne Kullanarak Birden Fazla Özelliği Bağlama {#binding-multiple-properties-using-an-object}

Bir nesnenin tüm özelliklerini prop olarak geçirmek istiyorsanız, argüman olmaksızın `v-bind` kullanabilirsiniz` (`:prop-name` yerine `v-bind`). Örneğin, bir `post` nesnesini düşünelim:



```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```




```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```



Aşağıdaki şablon:

```vue-html
<BlogPost v-bind="post" />
```

Şuna eşdeğer olacaktır:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## Tek Yönlü Veri Akışı {#one-way-data-flow}

Tüm props, çocuk özelliği ile ana özellik arasında **tek yönlü aşağıya bağlanma** oluşturur: ana özellik güncellendiğinde, çocuk bileşene akacak ancak tersine olmayacaktır. Bu, çocuk bileşenlerin yanlışlıkla ana durumunu değiştirmesini engelleyerek uygulamanızın veri akışını anlamayı zorlaştırabilir.

Ayrıca, ana bileşen her güncellendiğinde, çocuk bileşendeki tüm props'lar en son değerle güncellenecektir. Bu, bir çocuk bileşenin içinde bir prop'u değiştirmeyi **denememeniz** gerektiği anlamına gelir. Eğer yaparsanız, Vue konsolda uyarı verecektir:



```js
const props = defineProps(['foo'])

// ❌ uyarı, props salt okunur!
props.foo = 'bar'
```




```js
export default {
  props: ['foo'],
  created() {
    // ❌ uyarı, props salt okunur!
    this.foo = 'bar'
  }
}
```



Bir prop'u değiştirmeye çalışmanın genellikle iki durumu vardır:

1. **Prop, başlangıç değeri geçmek için kullanılır; çocuk bileşen bunu daha sonra yerel bir veri özelliği olarak kullanmak ister.** Bu durumda, en iyisi, prop'u başlangıç değeri olarak kullanacak bir yerel veri özelliği tanımlamaktır:

   

   ```js
   const props = defineProps(['initialCounter'])

   // counter yalnızca props.initialCounter'ı başlangıç değeri olarak kullanır;
   // bu, gelecekteki prop güncellemelerinden bağımsızdır.
   const counter = ref(props.initialCounter)
   ```

   
   

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // counter yalnızca this.initialCounter'ı başlangıç değeri olarak kullanır;
         // bu, gelecekteki prop güncellemelerinden bağımsızdır.
         counter: this.initialCounter
       }
     }
   }
   ```

   

2. **Prop, ham bir değer olarak geçilir ve dönüştürülmesi gerekir.** Bu durumda, prop'un değerini kullanarak bir hesaplanan özellik tanımlamak en iyisidir:

   

   ```js
   const props = defineProps(['size'])

   // prop değiştiğinde otomatik güncellenen hesaplanan özellik
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   
   

   ```js
   export default {
     props: ['size'],
     computed: {
       // prop değiştiğinde otomatik güncellenen hesaplanan özellik
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   

### Nesne / Dizi Props'larını Değiştirme {#mutating-object-array-props}

Nesneler ve diziler prop olarak geçildiğinde, çocuk bileşen prop bağlamasını değiştiremese de, **nesnenin veya dizinin gömülü özelliklerini değiştirebilir.** Bunun nedeni, JavaScript'te nesne ve dizilerin referansla geçirilmesidir ve Vue'nun bu tür değişiklikleri engellemesi orantısız derecede maliyetli olur.

Böyle bir değişikliğin ana dezavantajı, çocuk bileşenin, ana durumu etkilemesi ve bunun ana bileşene bariz bir şekilde yansımamasıdır; bu, veri akışını neden-sonuç ilişkisini anlamayı zorlaştırabilir. İyi bir uygulama olarak, çocuk bileşen, bir olayı `uyandırmalı` ve ana bileşenin değişikliği gerçekleştirmesini sağlamak için bunu yapmalıdır.

## Prop Doğrulaması {#prop-validation}

Bileşenler, daha önce gördüğünüz gibi, props'ları için gereksinimleri belirtebilir, örneğin türler. Gereksinim karşılanmadığında, Vue tarayıcının JavaScript konsolunda uyarıda bulunur. Bu, başkalarının kullanması için tasarlanmış bir bileşeni geliştirirken özellikle kullanışlıdır.

Prop doğrulamaları belirtmek için, bir dizi string yerine doğrulama gereksinimlerini içeren bir nesne verebilirsiniz. Örneğin:



```js
defineProps({
  // Temel tür kontrolü
  //  (`null` ve `undefined` değerleri her türü izni verecektir)
  propA: Number,
  // Birden fazla olası tür
  propB: [String, Number],
  // Gereken string
  propC: {
    type: String,
    required: true
  },
  // Gerekli fakat boş olabilir string
  propD: {
    type: [String, null],
    required: true
  },
  // Varsayılan değeri olan Number
  propE: {
    type: Number,
    default: 100
  },
  // Varsayılan değeri olan Object
  propF: {
    type: Object,
    // Nesne veya dizi varsayılanları, bir fabrikasyon fonksiyonundan döndürülmelidir.
    // Fonksiyon, bileşenin aldığı ham props'ları argüman olarak alır.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Özel doğrulayıcı fonksiyonu
  // tam props, 3.4+ içinde 2. argüman olarak geçilir
  propG: {
    validator(value, props) {
      // Değer bu stringlerden birine uymalıdır
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Varsayılan değeri olan Fonksiyon
  propH: {
    type: Function,
    // Nesne veya dizi varsayılanlarının aksine, bu bir fabrikasyon
    // fonksiyonu değildir - bu, varsayılan değer olarak hizmet eden bir fonksiyondur
    default() {
      return 'Varsayılan fonksiyon'
    }
  }
})
```

:::tip
`defineProps()` argümanındaki kod, `` içinde beyan edilen diğer değişkenlere erişemez çünkü tüm ifade derlendiğinde dış bir fonksiyon kapsamına taşınır.
:::




```js
export default {
  props: {
    // Temel tür kontrolü
    //  (`null` ve `undefined` değerleri her türü izni verecektir)
    propA: Number,
    // Birden fazla olası tür
    propB: [String, Number],
    // Gereken string
    propC: {
      type: String,
      required: true
    },
    // Gerekli fakat boş olabilir string
    propD: {
      type: [String, null],
      required: true
    },
    // Varsayılan değeri olan Number
    propE: {
      type: Number,
      default: 100
    },
    // Varsayılan değeri olan Object
    propF: {
      type: Object,
      // Nesne veya dizi varsayılanları, bir fabrikasyon fonksiyonundan döndürülmelidir.
      // Fonksiyon, bileşenin aldığı ham props'ları argüman olarak alır.
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // Özel doğrulayıcı fonksiyonu
    // tam props, 3.4+ içinde 2. argüman olarak geçilir
    propG: {
      validator(value, props) {
        // Değer bu stringlerden birine uymalıdır
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Varsayılan değeri olan Fonksiyon
    propH: {
      type: Function,
      // Nesne veya dizi varsayılanlarının aksine, bu bir fabrikasyon
      // fonksiyonu değildir - bu, varsayılan değer olarak hizmet eden bir fonksiyondur
      default() {
        return 'Varsayılan fonksiyon'
      }
    }
  }
}
```



Ek ayrıntılar:

- Tüm props varsayılan olarak isteğe bağlıdır, `required: true` belirtilmediği sürece.

- İsteğe bağlı bir prop'un yokluğu, Boolean olmayan bir prop için `undefined` değeri alacaktır.

- `Boolean` yok değerleri `false` olarak cast edilecektir. Bunu değiştirebilmek için bir `default` belirleyebilirsiniz — örneğin: `default: undefined` tanımlamak, bunu bir Boolean olmayan prop şeklinde davranmasını sağlar.

- Bir `default` değeri belirtildiğinde, çözülmüş prop değeri `undefined` olduğunda kullanılacaktır - bu, hem prop yokken, hem de açık bir `undefined` değeri geçirildiğinde gerçekleşir.

Prop doğrulaması başarısız olduğunda, Vue bir konsol uyarısı üretecektir (geliştirme derlemesi kullanıyorsanız).



Eğer `Tip bazlı props beyanları` , Vue izinleri en iyi şekilde çalışma zamanında karşılık gelen prop beyanlarına derleyecektir. Örneğin, `defineProps` şu şekilde derlenecektir: `{ msg: { type: String, required: true }}`.




::: tip Not
Props'ların **oluşum** anında doğrulandığını, bu yüzden durum özelliklerinin (örneğin `data`, `computed` vb.) `default` veya `validator` fonksiyonları içinde mevcut olmayacağını unutmayın.
:::



### Çalışma Zamanı Tür Kontrolleri {#runtime-type-checks}

`type`, aşağıdaki yerel constructor'lardan biri olabilir:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

Ayrıca, `type` özel bir sınıf veya constructor fonksiyonu da olabilir ve doğrulama `instanceof` kontrolü ile yapılacaktır. Örneğin, aşağıdaki sınıfı düşünün:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Bunu, bir prop'un türü olarak kullanabilirsiniz:



```js
defineProps({
  author: Person
})
```




```js
export default {
  props: {
    author: Person
  }
}
```



Vue, `author` prop'unun değerinin gerçekten de `Person` sınıfının bir örneği olup olmadığını doğrulamak için `instanceof Person` kullanır.

### Boş Olabilir Tür {#nullable-type}

Eğer tür gerekli ama boş olabilir ise, `null` içeren dizi sözdizimini kullanabilirsiniz:



```js
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```




```js
export default {
  props: {
    id: {
      type: [String, null],
      required: true
    }
  }
}
```



Unutmayın ki, eğer `type` sadece `null` olarak tanımlanırsa, bu her türü iznine verir.