---
title: Beyanda Rendering
seoTitle: Beyanda Rendering Overview
sidebar_position: 1
description: Beyanda rendering, Vue bileşenlerinin dinamik olarak nasıl oluşturulacağını keşfetmeyi sağlar. Bu rehberde, reaktif durumun nasıl kullanılacağı ve şablonlarda dinamik içerik renderlemenin yöntemleri ele alınmaktadır.
tags: 
  - Vue
  - reactivity
  - rendering
  - components
keywords: 
  - Vue
  - reactivity
  - rendering
  - components
---
## Beyanda Rendering {#declarative-rendering}



Editörde gördüğünüz şey, bir Vue Tek Dosya Bileşeni (SFC)dir. Bir SFC, bir arada bulunan HTML, CSS ve JavaScript'i kapsayan, yeniden kullanılabilir bir kendine yeterli kod bloğudur ve bir `.vue` dosyası içinde yazılmıştır.



Vue'nun temel özelliği **beyan edici renderleme**dir: HTML'yi genişleten bir şablon sözdizimi kullanarak, HTML'nin JavaScript durumu temelinde nasıl görünmesi gerektiğini tarif edebiliriz. Durum değiştiğinde, HTML otomatik olarak güncellenir.



Değiştirildiğinde güncellemeleri tetikleyebilen durum **reaktif** olarak kabul edilir. Vue'un `reactive()` API'sini kullanarak reaktif durumu bildirebiliriz. `reactive()` kullanılarak oluşturulan nesneler, normal nesneler gibi çalışan JavaScript [Proxy'ler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)dir:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` yalnızca nesneler (diziler ve `Map` ve `Set` gibi yerleşik türler dahil) üzerinde çalışır. Öte yandan, `ref()`, herhangi bir değer türünü alabilir ve iç değerini `.value` özelliği altında açığa çıkaran bir nesne oluşturabilir:

```js
import { ref } from 'vue'

const message = ref('Merhaba Dünya!')

console.log(message.value) // "Merhaba Dünya!"
message.value = 'Değiştirildi'
```

:::info
`reactive()` ve `ref()` detayları [Reaktivite Temelleri Rehberi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)'nde ele alınmaktadır.
:::



Bileşenin `` bloğunda bildirilen reaktif durum, şablonda doğrudan kullanılabilir. Bu, `counter` nesnesinin değeri ve `message` ref'ine dayalı dinamik metin renderlemenin nasıl yapılacağıdır; mustache sözdizimi kullanarak:





`createApp()`'e geçirilen nesne bir Vue bileşenidir. Bir bileşenin durumu, `setup()` fonksiyonu içinde bildirilmalı ve bir nesne kullanılarak döndürülmelidir:

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Merhaba Dünya!')
  return {
    counter,
    message
  }
}
```

Döndürülen nesnedeki özellikler şablonda kullanılabilir hale gelecektir. Bu, `message` değerine dayalı dinamik metin renderlemenin nasıl yapılacağıdır; mustache sözdizimi kullanarak:



```vue-html
<h1>{{ message }}</h1>
<p>Count: {{ counter.count }}</p>
```

`message` ref'ine şablonlarda erişirken `.value` kullanmamıza gerek olmadığını unutmayın: Bu, daha özlü kullanım için otomatik olarak açılır.





Değiştirildiğinde güncellemeleri tetikleyebilen durumlar **reaktif** olarak kabul edilir. Vue'da, reaktif durum bileşenlerde tutulur. Örnek kodda, `createApp()`'e geçirilen nesne bir bileşendir.

Reaktif durumu, bir işlev döndüren `data` bileşen seçeneği kullanarak bildirebiliriz:



```js{3-5}
export default {
  data() {
    return {
      message: 'Merhaba Dünya!'
    }
  }
}
```




```js{3-5}
createApp({
  data() {
    return {
      message: 'Merhaba Dünya!'
    }
  }
})
```



`message` özelliği şablonda kullanılabilir hale gelecektir. Bu, `message` değerine dayalı dinamik metin renderlemenin nasıl yapılacağıdır; mustache sözdizimi kullanarak:

```vue-html
<h1>{{ message }}</h1>
```



Mustache içindeki içerik yalnızca tanımlayıcılar veya yollarla sınırlı değildir - geçerli herhangi bir JavaScript ifadesini kullanabiliriz:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```



Artık kendi reaktif durumunuzu oluşturmaya çalışın ve bunu şablondaki `` için dinamik metin içeriği renderlemek için kullanın.





Artık bir data özelliği oluşturmaya çalışın ve bunu şablondaki `` için metin içeriği olarak kullanın.