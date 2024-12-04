---
title: Kompozisyon API ile TypeScript
seoTitle: TypeScript ile Kompozisyon API Kullanımı
sidebar_position: 4
description: Bu sayfada, Vuenun Kompozisyon APIsinin TypeScript ile kullanımına dair ayrıntılı bilgi bulacaksınız. Bileşen propslarının türlendirilmesi, emitlerin türleri ve reaktif özelliklerin nasıl kullanılacağı gibi konular ele alınacaktır.
tags: 
  - Vue
  - TypeScript
  - Kompozisyon API
  - Bileşen
  - Reaktif
keywords: 
  - Vue
  - TypeScript
  - Kompozisyon API
  - Bileşen
  - Reaktif
---
## Kompozisyon API ile TypeScript {#typescript-with-composition-api}

> Bu sayfanın `TypeScript ile Vue Kullanımı` üzerine genel bir bakış okuduğunuzu varsayıyor.

## Bileşen Props'larının Türü {#typing-component-props}

### `` Kullanımı {#using-script-setup}

`` kullanırken, `defineProps()` makrosu, argümanına dayalı olarak props türlerini çıkarmayı destekler:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Bu, "çalışma zamanı beyanı" olarak adlandırılır, çünkü `defineProps()`'a geçirilen argüman, çalışma zamanı `props` seçeneği olarak kullanılacaktır.

Ancak, genellikle saf türler ile props tanımlamak için, generic tür argümanı kullanmak daha basittir:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Bu, "türe dayalı beyan" olarak adlandırılır. Derleyici, tür argümanına dayalı olarak eşdeğer çalışma zamanı seçeneklerini çıkarmaya çalışacaktır. Bu durumda, ikinci örneğimiz birinci örnekle tamamen aynı çalışma zamanı seçeneklerine derlenir.

Türe dayalı beyan veya çalışma zamanı beyanını kullanabilirsiniz, ancak her ikisini aynı anda kullanamazsınız.

Ayrıca props türlerini ayrı bir arayüze taşıyabiliriz:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

Bu, `Props` bir dış kaynaktan aktarılmış olsa bile çalışır. Bu özellik, TypeScript'in Vue'nun bir eş bağımlılığı olmasını gerektirir.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Söz dizimi Sınırlamaları {#syntax-limitations}

3.2 ve altı sürümlerde, `defineProps()` için generic tür parametresi bir tür literal'ı veya yerel bir arayüze referans ile sınırlıdır.

Bu sınırlama 3.3'te kaldırılmıştır. Vue'nun en son sürümü, tür parametre pozisyonunda aktarılmış ve sınırlı bir karmaşık tür kümesine referans vermeyi destekler. Ancak, türden çalışma zamanı dönüşümünün hala AST tabanlı olması nedeniyle, gerçek tür analizine ihtiyaç duyan bazı karmaşık türler, örneğin koşullu türler desteklenmez. Bir prop'un türü için koşullu türler kullanabilirsiniz, ancak tüm props nesnesi için kullanamazsınız.

### Props Varsayılan Değerleri {#props-default-values}

Türe dayalı beyan kullanırken, props için varsayılan değerler beyan etme yeteneğimizi kaybederiz. Bu, `Reaktif Props Yapılandırması` ile çözülebilir :

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

3.4 ve altı sürümlerde, Reaktif Props Yapılandırması varsayılan olarak etkin değildir. Alternatif olarak, `withDefaults` derleyici makrosunu kullanabilirsiniz:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Bu, eşdeğer çalışma zamanı props `varsayılan` seçeneklerine derlenecektir. Ayrıca, `withDefaults` yardımcı programı varsayılan değerler için tür kontrolü sağlar ve döndürülen `props` türünün, varsayılan değerlerin beyan edildiği özellikler için isteğe bağlı bayrakların kaldırıldığından emin olur.

:::info
Değişken referans türleri (diziler veya nesneler gibi) için varsayılan değerlerin `withDefaults` kullanırken işlevlere sarılması gerektiğini lütfen unutmayın, bu yanlışlıkla değişimi ve dış etkileri önler. Bu, her bileşen örneğinin varsayılan değerinin kendi kopyasını almasını sağlar. Bu, yapılandırma ile varsayılan değerler kullanırken **gerekli değildir.**
:::

### `` Olmadan {#without-script-setup}

`` kullanmıyorsanız, props tür çıkarımını etkinleştirmek için `defineComponent()` kullanmak gereklidir. Şuraya geçirilen props nesnesinin türü `props` seçeneğinden çıkarılır.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- tür: string
  }
})
```

### Karmaşık prop türleri {#complex-prop-types}

Türe dayalı beyan ile bir prop, herhangi bir diğer türde olduğu gibi karmaşık bir tür kullanabilir:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Çalışma zamanı beyanı için `PropType` yardımcı türünü kullanabiliriz:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Bu, `props` seçeneğini doğrudan tanımlarken de aynı şekilde çalışır:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

`props` seçeneği, Genellikle Opsiyonel API ile daha yaygın olarak kullanılır, bu nedenle `Opsiyonel API ile TypeScript` rehberinde daha detaylı örnekler bulacaksınız. Bu örneklerde gösterilen teknikler, `defineProps()` ile yapılan çalışma zamanı beyanlarına da uygulanabilir.

## Bileşen Emit'lerinin Türü {#typing-component-emits}

`` içerisinde, `emit` fonksiyonu hem çalışma zamanı beyanı hem de tür beyanı kullanılarak türlendirilebilir:

```vue
<script setup lang="ts">
// çalışma zamanı
const emit = defineEmits(['change', 'update'])

// opsiyonel tabanlı
const emit = defineEmits({
  change: (id: number) => {
    // doğrulama geçişi / başarısızlığı belirtmek için
    // `true` veya `false` döndürüyor
  },
  update: (value: string) => {
    // doğrulama geçişi / başarısızlığı belirtmek için
    // `true` veya `false` döndürüyor
  }
})

// tür tabanlı
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternatif, daha özlü sözdizimi
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Tür argümanı aşağıdaki gibi olabilir:

1. Bir çağrılabilir fonksiyon türü, ancak [Çağrı İmzası](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures) ile bir tür literal'ı olarak yazılmıştır. Dönülen `emit` fonksiyonunun türü olarak kullanılacaktır.
2. Anahtarların etkinlik adları olduğu ve değerlerin etkinlik için ek kabul edilen parametreleri temsil eden dizi / demet türleri olduğu bir tür literal'ı. Yukarıdaki örnek, her argümanın açık bir adı olması için adlandırılmış demetler kullanmaktadır.

Gördüğümüz gibi, tür beyanı, yayılan etkinliklerin tür kısıtları üzerinde daha ince ayrıntılı kontrol sağlar.

`` kullanmıyorsanız, `defineComponent()` kurulum bağlamında yayınlanan `emit` fonksiyonu için izin verilen etkinlikleri çıkarım yapabilir:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- tür kontrolü / otomatik tamamlama
  }
})
```

## `ref()` Türlendirme {#typing-ref}

Refs, başlangıç değerinden tür çıkarımı yapar:

```ts
import { ref } from 'vue'

// çıkarılan tür: Ref<number>
const year = ref(2020)

// => TS Hatası: Tür 'string' tür 'number'a atanamaz.
year.value = '2020'
```

Bazen bir ref'in iç değerine karmaşık türler belirtmemiz gerekebilir. Bunu `Ref` türünü kullanarak yapabiliriz:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // tamam!
```

Veya `ref()` çağrıldığında varsayılan çıkarımı geçersiz kılmak için generic bir argüman geçirerek:

```ts
// sonuç türü: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // tamam!
```

Eğer bir generic tür argümanı belirlerseniz ancak başlangıç değerini atlamazsanız, sonuç türü `undefined` içeren bir birleşim türü olur:

```ts
// çıkarılan tür: Ref<number | undefined>
const n = ref<number>()
```

## `reactive()` Türlendirme {#typing-reactive}

`reactive()` da argümanından tür çıkarımı yapar:

```ts
import { reactive } from 'vue'

// çıkarılan tür: { title: string }
const book = reactive({ title: 'Vue 3 Rehberi' })
```

Bir `reactive` özelliğini açıkça türlendirmek için arayüzleri kullanabiliriz:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Rehberi' })
```

:::tip
`reactive()`'nin generic argümanını kullanmanız önerilmez çünkü dönen tür, iç içe ref açma işlemini yöneten, generic argüman türünden farklıdır.
:::

## `computed()` Türlendirme {#typing-computed}

`computed()` işleminin döndürdüğü değere bağlı olarak tür çıkarımı yapar:

```ts

const count = ref(0)

// çıkarılan tür: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Hatası: `split` özelliği 'number' türünde yok
const result = double.value.split('')
```

Açıkça bir tür belirtmek için generic bir argüman da verebilirsiniz:

```ts
const double = computed<number>(() => {
  // Bu bir sayı döndürmezse tür hatası
})
```

## Olay İşleyicilerinin Türlendirilmesi {#typing-event-handlers}

Yerel DOM olaylarıyla uğraşırken, işleyiciye geçirdiğimiz argümanı doğru bir şekilde türlendirmek yararlı olabilir. Şu örneğe bir bakalım:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` dolaylı olarak `any` türüne sahiptir
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Tür notasyonu olmadan, `event` argümanı dolaylı olarak `any` türüne sahip olacaktır. Bu, `"strict": true` veya `"noImplicitAny": true` kullanıldığında bir TS hatasına yol açar. Bu nedenle, olay işleyicilerinin argümanlarını açıkça yazmanız önerilir. Ayrıca, `event`'in özelliklerine erişirken tür varsayımları yapmanız gerekebilir:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Provide / Inject Türlendirme {#typing-provide-inject}

Provide ve inject genellikle ayrı bileşenlerde gerçekleştirilir. Enjekte edilen değerlerin doğru bir şekilde türlendirilmesi için, Vue `InjectionKey` arayüzünü sağlar; bu, `Symbol` uzantılı bir generic türdür. Sağlayıcı ve tüketici arasındaki enjekte edilen değerin türünü senkronize etmek için kullanılabilir:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // string olmayan bir değer sağlamak hata verecektir

const foo = inject(key) // foo'nun türü: string | undefined
```

Enjeksiyon anahtarını ayrı bir dosyada tutması önerilir, böylece birden fazla bileşende ithal edilebilir.

Dize enjeksiyon anahtarları kullanırken, enjekte edilen değerin türü `unknown` olacaktır ve açıkça bir generic tür argümanı ile belirtilmesi gerekir:

```ts
const foo = inject<string>('foo') // tür: string | undefined
```

Enjekte edilen değerin hala `undefined` olabileceğini unutmayın, çünkü bir sağlayıcının bu değeri çalışma zamanında sağlaması garantisi yoktur.

`undefined` türü, varsayılan bir değer sağlayarak kaldırılabilir:

```ts
const foo = inject<string>('foo', 'bar') // tür: string
```

Değerin her zaman sağlandığından emin iseniz, değeri zorla biçimlendirebilirsiniz:

```ts
const foo = inject('foo') as string
```

## Şablon Refs Türlendirmesi {#typing-template-refs}

Vue 3.5 ve `@vue/language-tools` 2.1 ile (hem IDE dil hizmetine hem de `vue-tsc`'ye güç veren), SFC'lerde `useTemplateRef()` ile oluşturulan refs'lerin türü, eşleşen `ref` niteliğinin kullanıldığı elemanın üzerine **otomatik olarak çıkarılabilir**.

Otomatik çıkarımın mümkün olmadığı durumlarda, şablon referansını açık bir türle biçimlendirmek için generic argümanı kullanabilirsiniz:

```ts
const el = useTemplateRef<HTMLInputElement>('el')
```


3.5'ten Önceki Kullanım

Şablon refs, açık bir generic tür argümanı ve başlangıç değeri olarak `null` ile oluşturulmalıdır:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```



Doğru DOM arayüzünü elde etmek için [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary) gibi sayfalara göz atabilirsiniz.

Sıkı tür güvenliği için, `el.value`'ya erişirken opsiyonel zincirleme veya tür koruyucuları kullanmanız gereklidir. Çünkü başlangıç ref değeri `null` dur ve bileşen monte edilene kadar `null` olarak ayarlanabilir, ayrıca `v-if` ile ilgili eleman kaldırıldığında `null` olarak ayarlanabilir.

## Bileşen Şablon Refs Türlendirmesi {#typing-component-template-refs}

Vue 3.5 ve `@vue/language-tools` 2.1 ile (hem IDE dil hizmetine hem de `vue-tsc`'ye güç veren), SFC'lerde `useTemplateRef()` ile oluşturulan refs'lerin türü, eşleşen `ref` niteliğinin kullanıldığı eleman veya bileşenin üzerinde **otomatik olarak çıkarılabilir**.

Otomatik çıkarımın mümkün olmadığı durumlarda (örneğin, SFC dışı kullanım veya dinamik bileşenler), şablon referansını açık bir türle biçimlendirmek için generic argümanı kullanabilirsiniz.

İthal edilen bir bileşenin örnek türünü almak için önce türünü `typeof` ile almalıyız, ardından TypeScript'in yerleşik `InstanceType` yardımcı türünü kullanarak örnek türünü çıkarmalıyız:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

Tam bileşenin türü mevcut değilse veya önemli değilse, `ComponentPublicInstance` kullanılabilir. Bu sadece tüm bileşenler tarafından paylaşılan `$el` gibi özellikleri içerir:

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

Eğer referans verilen bileşen bir `generic bileşen` ise, örneğin `MyGenericModal`:

```vue
<!-- MyGenericModal.vue -->
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

Parametre olarak `ComponentExposed`'i [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) kütüphanesinden kullanarak referans vermeniz gerekecek; çünkü `InstanceType` çalışmaz.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal = useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

`@vue/language-tools` 2.1+ ile, statik şablon refs'lerinin türleri otomatik olarak çıkarılabilir ve yukarıdaki gereksizlik yalnızca uç durumlarda gereklidir.