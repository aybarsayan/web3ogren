---
title: Yaşam Döngüsü ve Şablon Referansları
seoTitle: Vue Yaşam Döngüsü ve Şablon Referansları
sidebar_position: 4
description: Vue reaktivitesi ile DOM güncellemelerinin yönetimi ve özel ref özellikleri hakkında bilgiler. Şablon referansları ile DOM manipülasyonu yapmayı öğrenin.
tags: 
  - Vue
  - reaktivite
  - şablon referansı
  - yaşam döngüsü
keywords: 
  - Vue.js
  - DOM
  - reaktivite
  - lifecycle hooks
---
## Yaşam Döngüsü ve Şablon Referansları {#lifecycle-and-template-refs}

Şu ana kadar, Vue reaktivite ve deklaratif render sayesinde tüm DOM güncellemelerini bizim için yönetiyordu. Ancak, kaçınılmaz olarak, DOM ile manuel olarak çalışmamız gereken durumlar olacaktır.

**Şablon referansı** - yani şablondaki bir elemana referans - özel `ref` özelliği kullanılarak istenebilir:

```vue-html
<p ref="pElementRef">hello</p>
```



Ref'e erişmek için, eşleşen adla bir ref beyan edip ve onu açığa çıkarmamız gerekir:



```js
const pElementRef = ref(null)
```




```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```



Ref'in `null` değeriyle başlatıldığını unutmayın. Bu, ````setup()` çalıştırıldığında elementin henüz var olmamasından kaynaklanmaktadır. Şablon referansı, bileşen **mount** edildikten sonra yalnızca erişilebilir.

:::tip
Mount işleminden sonra kod çalıştırmak için `onMounted()` fonksiyonunu kullanabilirsiniz.
:::

```js
import { onMounted } from 'vue'

onMounted(() => {
  // bileşen artık mount edildi.
})
```

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // bileşen artık mount edildi.
    })
  }
})
```





Element, `this.$refs` üzerinde `this.$refs.pElementRef` olarak açığa çıkartılacaktır. Ancak, yalnızca bileşen **mount** edildikten sonra erişebilirsiniz.

:::tip
Mount işleminden sonra kod çalıştırmak için `mounted` seçeneğini kullanabilirsiniz.
:::

```js
export default {
  mounted() {
    // bileşen artık mount edildi.
  }
}
```

```js
createApp({
  mounted() {
    // bileşen artık mount edildi.
  }
})
```



Bu, bir **yaşam döngüsü kancası** olarak adlandırılır - bileşenin yaşam döngüsünün belirli zamanlarında çağrılacak bir geri çağırma tanımlamamızı sağlar. Diğer kancalar `created` ve `updated``onUpdated` ve `onUnmounted` gibi vardır. Daha fazla detay için Yaşam Döngüsü Diyagramı'na göz atın.

Şimdi, bir `mounted``onMounted` kancası eklemeye, `` elementine `this.$refs.pElementRef``pElementRef.value` aracılığıyla erişmeye ve üzerinde bazı doğrudan DOM işlemleri yapmaya çalışın (örneğin, `textContent`'ını değiştirmek).