---
title: Bileşen Etkinlikleri
seoTitle: Bileşen Etkinliklerini Anlamak
sidebar_position: 4
description: Bu bölümde bileşenlerin olay yayıp dinleme yöntemleri açıklanmaktadır. Ayrıca olay argümanları ile ilişkili bilgiler ve olayların bildirilmesi hakkında da bilgi verilmektedir.
tags: 
  - bileşen
  - olay
  - Vue.js
keywords: 
  - bileşen etkinlikleri
  - olay yayıcılar
  - Vue.js
---



## Bileşen Etkinlikleri {#component-events}

> Bu sayfanın, `Bileşenler Temel Bilgileri` bölümünü okuduğunuzu varsayıyor. Bileşenlerle yeniyseniz, önce onu okuyun.


  


## Olay Yayma ve Dinleme {#emitting-and-listening-to-events}

Bir bileşen, gömülü `$emit` metodunu kullanarak şablon ifadelerinde doğrudan özel olaylar yayabilir (örneğin, bir `v-on` işleyicisinde):

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Bana Tıkla</button>
```



`$emit()` metodu, bileşen örneği üzerinde `this.$emit()` olarak da mevcuttur:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```



Ana bileşen daha sonra `v-on` kullanarak bunu dinleyebilir:

```vue-html
<MyComponent @some-event="callback" />
```

`.once` değiştiricisi de bileşen olay dinleyicilerinde desteklenmektedir:

```vue-html
<MyComponent @some-event.once="callback" />
```

Bileşenler ve props gibi, olay adları otomatik bir case dönüşümü sağlar. CamelCase bir olayı yaydığımızı, ancak ana bileşende kebab-case dinleyicisi ile dinleyebileceğimizi unutmayın. `Props casing` ile olduğu gibi, şablonlarda kebab-case olay dinleyicilerini kullanmanızı öneririz.

:::tip
Yerel DOM olaylarının aksine, bileşen tarafından yayılan olaylar **fısıldamaz**. sadece doğrudan alt bileşen tarafından yayılan olayları dinleyebilirsiniz. Kardeş veya derinlemesine iç içe geçmiş bileşenler arasında iletişime ihtiyaç varsa, bir dış olay otobüsü veya `küresel durum yönetim çözümü` kullanın.
:::

## Olay Argümanları {#event-arguments}

Bazen bir olayla belirli bir değeri yaymak faydalı olabilir. Örneğin, `` bileşeninin metni ne kadar büyüteceğinden sorumlu olmasını isteyebiliriz. Bu durumlarda, `$emit`'e ekstra argümanlar geçerek bu değeri sağlayabiliriz:

```vue-html
<button @click="$emit('increaseBy', 1)">
  1 Artır
</button>
```

Sonra, ana bileşende olayı dinlediğimizde, olay argümanına erişmemizi sağlayan bir inline ok fonksiyonu kullanabiliriz:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Ya da, olay işleyicisi bir metod ise:

```vue-html
<MyButton @increase-by="increaseCount" />
```

O zaman değer, o metodun ilk parametresi olarak geçirilir:



```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```




```js
function increaseCount(n) {
  count.value += n
}
```



:::tip
Olay adı sonrasında `$emit()`'e geçirilen tüm ekstra argümanlar, dinleyiciye iletilecektir. Örneğin, `$emit('foo', 1, 2, 3)` ile dinleyici fonksiyonu üç argüman alacaktır.
:::

## Yayınlanan Olayların Bildirilmesi {#declaring-emitted-events}

Bir bileşen, `defineEmits()` makrosunu`emits` seçeneğini kullanarak yayacağı olayları açıkça bildirebilir:



```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

`` içinde kullandığımız `$emit` metodu, bir bileşenin `` bölümünde erişilebilir değildir, ancak `defineEmits()` bunun yerine kullanabileceğimiz eşdeğer bir fonksiyon döndürür:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

`defineEmits()` makrosu, bir fonksiyon içinde kullanılamaz, yukarıdaki örnekte olduğu gibi doğrudan `` içinde yer almalıdır.

Eğer `` yerine açık bir `setup` fonksiyonu kullanıyorsanız, olaylar `emits` seçeneği kullanarak belirtilmelidir ve `emit` fonksiyonu `setup()` bağlamında açığa çıkar:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

`setup()` bağlamının diğer özellikleri ile birlikte, `emit` güvenle yapılandırılabilir:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```




```js
export default {
  emits: ['inFocus', 'submit']
}
```



`emits` seçeneği ve `defineEmits()` makrosu, nesne sözdizimini de destekler. TypeScript kullanıyorsanız, argümanları türlendirebiliriz ve bu da yayılan olayların yükleminin çalışma zamanı doğrulamasını yapmamızı sağlar:



```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // `true` veya `false` döndür
    // doğrulama geçiş / başarısızlık
  }
})
</script>
```

Eğer TypeScript'i `` ile birlikte kullanıyorsanız, yayılan olayları saf tür tanımlamaları kullanarak da belirlemek mümkündür:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Daha fazla detay: `Bileşen Yayınlarını Türlendirme` 




```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // `true` veya `false` döndür
      // doğrulama geçiş / başarısızlık
    }
  }
}
```

Buna ek olarak: `Bileşen Yayınlarını Türlendirme` 



Her ne kadar isteğe bağlı olsa da, yayımlanan tüm olayları tanımlamak, bileşenin nasıl çalışacağını daha iyi belgelendirmek için önerilir. Ayrıca, Vue'ye, bilinen dinleyicilerin `geçişli nitelikler` dışında bırakılmasına olanak tanır ve 3. parti kodlar tarafından manuel olarak dağıtılan DOM olayları nedeniyle oluşabilecek kenar durumlarını önler.

:::tip
Eğer `emits` seçeneğinde bir yerel olay (örneğin, `click`) tanımlanmışsa, dinleyici artık yalnızca bileşen tarafından yayılan `click` olaylarını dinleyecek ve yerel `click` olaylarına yanıt vermeyecektir.
:::

## Olay Doğrulama {#events-validation}

Prop türü doğrulamasına benzer şekilde, yayımlanan bir olay, dizi sözdiziminden ziyade nesne sözdizimi ile tanımlanmışsa doğrulanabilir.

Doğrulama eklemek için, olaya, `this.$emit``emit` çağrısına geçirilen argümanları alan ve olayın geçerli olup olmadığını belirten bir boolean döndüren bir fonksiyon atama yapılır.



```vue
<script setup>
const emit = defineEmits({
  // Doğrulama yok
  click: null,

  // submit olayını doğrula
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Geçersiz submit olay yükü!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```




```js
export default {
  emits: {
    // Doğrulama yok
    click: null,

    // submit olayını doğrula
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Geçersiz submit olay yükü!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```