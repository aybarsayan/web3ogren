---
title: Bileşen v-model
seoTitle: Vue 3 Bileşen v-model Kullanımı
sidebar_position: 4
description: Bu belge, Vue 3 ile bileşenlerde nasıl v-model kullanılacağını açıklamaktadır. İki yönlü veri bağlama uygulamaları ve en iyi pratikler üzerinde durulmaktadır.
tags: 
  - Vue3
  - v-model
  - bileşenler
  - veri bağlama
keywords: 
  - Vue
  - iki yönlü veri bağlama
---
## Bileşen v-model {#component-v-model}

### Temel Kullanım {#basic-usage}

`v-model`, bir bileşende iki yönlü veri bağlama uygulamak için kullanılabilir.



Vue 3.4 ile birlikte, bunu gerçekleştirmek için önerilen yaklaşım, `defineModel()` makrosunu kullanmaktır:

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Üst bileşende bağlı v-model: {{ model }}</div>
  <button @click="update">Arttır</button>
</template>
```

Üst bileşen, `v-model` ile bir değeri bağlayabilir:

```vue-html
<!-- Parent.vue -->
<Child v-model="countModel" />
```

`defineModel()` tarafından döndürülen değer bir ref'dir. Diğer ref'ler gibi erişilebilir ve değiştirilebilir, tek farkla ki bu, bir üst değer ile bir yerel değer arasında iki yönlü bir bağlama olarak işlev görür:

- `.value`'sı, üst `v-model` ile bağlı olan değerle senkronizedir;
- Çocuk tarafından değiştirildiğinde, üstte bağlı değer de güncellenir.

Bu, bu ref'i `v-model` ile bir yerel giriş elemanına da bağlayabileceğiniz anlamına gelir, bu da yerel giriş elemanlarını sarmayı ve aynı `v-model` kullanımını sağlamayı kolaylaştırır:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)

### Altta Ne Oluyor {#under-the-hood}

`defineModel`, bir kolaylık makrosudur. Derleyici bunu aşağıdakilere genişletir:

- Yerel ref'in değeriyle senkronize edilen `modelValue` adlı bir prop;
- Yerel ref'in değeri değiştirildiğinde yayılacak olan `update:modelValue` adlı bir olay.

Aşağıdakileri önceden 3.4 öncesinde aynı çocuk bileşeni uygulamak için kullanabilirsiniz:

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

Sonrasında, üst bileşende `v-model="foo"` derlendiğinde:

```vue-html
<!-- Parent.vue -->
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```

Gördüğünüz gibi, oldukça daha ayrıntılı. Ancak, altında neler olup bittiğini anlamak için yararlıdır.

Çünkü `defineModel` bir prop ilan ettiği için, `defineModel`'a geçirerek temel prop'un seçeneklerini de belirleyebilirsiniz:

```js
// v-model'i zorunlu kılma
const model = defineModel({ required: true })

// varsayılan bir değer sağlama
const model = defineModel({ default: 0 })
```

:::warning
Eğer `defineModel` prop'u için bir `default` değeri varsa ve üst bileşenden bu prop için herhangi bir değer sağlanmazsa, üst ve alt bileşenler arasında senkronizasyonun bozulmasına neden olabilir. Aşağıdaki örnekte, üstteki `myRef` tanımsız, ancak alt bileşenin `model` değeri 1'dir:

**Alt bileşen:**

```js
const model = defineModel({ default: 1 })
```

**Üst bileşen:**

```js
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::





Öncelikle, bir yerel elemanda `v-model` kullanımına yeniden göz atalım:

```vue-html
<input v-model="searchText" />
```

Altta, şablon derleyicisi `v-model`'i daha ayrıntılı bir eşdeğeri genişletir. Yani yukarıdaki kod, aşağıdaki gibi işler:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

Bir bileşende kullanıldığında, `v-model` bunun yerine buna genişler:

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

Bunun çalışması için, `` bileşeninin iki şeyi yapması gerekir:

1. Yerel `` elemanının `value` özelliğini `modelValue` prop'una bağlamak
2. Yerel bir `input` olayı tetiklendiğinde, yeni değerle `update:modelValue` özel olayını yaymak

İşte bu şekilde:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Artık `v-model` bu bileşenle mükemmel bir şekilde çalışmalıdır:

```vue-html
<CustomInput v-model="searchText" />
```

[Oyun alanında dene](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

Bu bileşende `v-model`'i uygulamanın bir başka yolu, hem bir getter hem de bir setter ile yazılabilir bir `computed` özelliği kullanmaktır. `get` yöntemi `modelValue` özelliğini döndürmelidir ve `set` yöntemi ilgili olayı yaymalıdır:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```



## `v-model` Argümanları {#v-model-arguments}

Bir bileşende `v-model`, bir argümanı da kabul edebilir:

```vue-html
<MyComponent v-model:title="bookTitle" />
```



Alt bileşende, ilgili argümanı karşılamak için `defineModel()`'a bir string geçerek destekleyebiliriz:

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqFklFPwjAUhf9K05dhgiyGNzJI1PCgCWqUx77McQeFrW3aOxxZ9t+9LTAXA/q2nnN6+t12Db83ZrSvgE944jIrDTIHWJmZULI02iJrmIWctSy3umQRRaPOWhweNX0pUHiyR3FP870UZkyoTCuH7FPr3VJiAWzqSwfR/rbUKyhYatdV6VugTktTQHQjVBIfeYiEFgikpwi0YizZ3M2aplfXtklMWvD6UKf+CfrUVPBuh+AspngSd718yH+hX7iS4xihjUZYQS4VLPwJgyiI/3FLZSrafzAeBqFG4jgxeuEqGTo6OZfr0dZpRVxNuFWeEa4swL4alEQm+IQFx3tpUeiv56ChrWB41rMNZLsL+tbVXhP8zYIDuyeQzkN6HyBWb88/XgJ3ZxJ95bH/MN/B6aLyjMfYQ6VWhN3LBdqn8FdJtV66eY2g3HkoD+qTbcgLTo/jX+ra6D+449E47BOq5e039mr+gA==)

Eğer prop seçeneklerine de ihtiyaç varsa, bunları model isminin ardından geçirmelisiniz:

```js
const title = defineModel('title', { required: true })
```


3.4 Öncesi Kullanım

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps({
  title: {
    required: true
  }
})
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)





Bu durumda, varsayılan `modelValue` prop'u ve `update:modelValue` olayı yerine, alt bileşen bir `title` prop'u beklemeli ve üst değeri güncellemek için `update:title` olayını yaymalıdır:

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)



## Birden Fazla `v-model` Bağlantısı {#multiple-v-model-bindings}

`v-model` argümanları` ile öğrendiğimiz gibi, belirli bir prop ve olayı hedefleme yeteneğini kullanarak, tek bir bileşen örneğinde birden fazla `v-model` bağlamamız mümkün.

Her `v-model`, bileşende fazladan seçenekler gerektirmeden farklı bir prop'a senkronize edilir:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```



```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)


3.4 Öncesi Kullanım

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)





```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)



## `v-model` Modifikasyonları ile İlgilenmek {#handling-v-model-modifiers}

Form giriş bağlamaları hakkında bilgi aldığımızda, `v-model`'in [dahili modifikasyonları](https://vuejs.org/guide/essentials/forms#modifiers) - `.trim`, `.number` ve `.lazy` - olduğunu gördük. Bazı durumlarda, özel bir girdi bileşeninizde `v-model`'in özel modifikasyonları desteklemesini de isteyebilirsiniz.

`v-model` bağlaması ile sağlanan string'in ilk harfini büyük hale getiren bir özel modifikasyon olan `capitalize` örneğini oluşturalım:

```vue-html
<MyComponent v-model.capitalize="myText" />
```



Bileşen `v-model`'ine eklenen modifikasyonlar, alt bileşende `defineModel()` dönüş değerini şu şekilde parçalayarak erişilebilir:

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

Değerin, modifikasyonlara bağlı olarak nasıl okunacağını veya yazılacağını şartlı olarak ayarlamak için, `defineModel()`'a `get` ve `set` seçenekleri geçebiliriz. Bu iki seçenek, model ref'in elde edilmesi veya ayarlanması sırasında değeri alır ve dönüştürülmüş bir değer döndürmelidir. `capitalize` modifikasyonunu gerçekleştirmek için`set` seçeneğini nasıl kullanabileceğimiz:

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)


3.4 Öncesi Kullanım

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="props.modelValue" @input="emitValue" />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)






Bileşene eklenen modifikasyonlar, bileşene `modelModifiers` prop'u ile sağlanır. Aşağıdaki örnekte, varsayılan olarak boş bir nesne dönen `modelModifiers` prop'una sahip bir bileşen oluşturduk:

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Bileşenin `modelModifiers` prop'unun `capitalize` içerdiğini ve değerinin `true` olduğunu unutmayın - bu, `v-model` bağlaması üzerinde `v-model.capitalize="myText"` olarak ayarlandığı içindir.

Artık prop'umuzu ayarladıktan sonra, `modelModifiers` nesnesi anahtarlarını kontrol edebilir ve yayılan değeri değiştirmek için bir işlemci yazabiliriz. Aşağıdaki kodda, `` elementi bir `input` olayı tetiklediğinde string'in büyük harfli olmasını sağlayacağız.

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Oyun alanında dene](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)



### Argüman ile `v-model` için Modifikasyonlar {#modifiers-for-v-model-with-arguments}



Argüman ve modifikasyonları olan `v-model` bağlamaları için, oluşturulan prop adı `arg + "Modifiers"` biçiminde olacaktır. Örneğin:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

İlgili bildirimler şöyle olmalıdır:

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```


İşte argümanlarla farklı `v-model` kullanarak modifikasyonları örnek almak için başka bir örnek:

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```



```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```


3.4 Öncesi Kullanım

```vue{5,6,10,11}
<script setup>
const props = defineProps({
firstName: String,
lastName: String,
firstNameModifiers: { default: () => ({}) },
lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true }
</script>
```





```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true }
  }
}
</script>
```