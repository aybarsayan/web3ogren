---
title: Bileşenler
seoTitle: Vue Bileşenleri Kullanımı
sidebar_position: 4
description: Bu bölüm, Vue bileşenlerinin nasıl kullanılacağını ve içe aktarılacağını açıklar. Çocuk bileşenlerinin örnekleriyle birlikte detaylı bir inceleme sunmaktadır.
tags: 
  - Vue
  - Bileşenler
  - Çocuk Bileşeni
  - Geliştirme
keywords: 
  - Vue
  - Bileşenler
  - Çocuk Bileşeni
  - Geliştirme
---
## Bileşenler {#components}

Şu ana kadar yalnızca tek bir bileşen ile çalıştık. Gerçek Vue uygulamaları genellikle iç içe bileşenlerle oluşturulur.

Bir üst bileşen, şablonunda başka bir bileşeni çocuk bileşen olarak render edebilir. Bir çocuk bileşeni kullanmak için önce onu içe aktarmamız gerekir:




```js
import ChildComp from './ChildComp.vue'
```







```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

Bileşeni `components` seçeneğini kullanarak kaydetmemiz gerekiyor. Burada `ChildComp` bileşenini `ChildComp` anahtarı altında kaydetmek için nesne özelliği kısayolunu kullanıyoruz.






Daha sonra, bileşeni şablon içinde şu şekilde kullanabiliriz:

```vue-html
<ChildComp />
```





```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

Bileşeni `components` seçeneğini kullanarak kaydetmemiz gerekiyor. Burada `ChildComp` bileşenini `ChildComp` anahtarı altında kaydetmek için nesne özelliği kısayolunu kullanıyoruz.

Şablonu DOM içinde yazdığımız için, etiket adları için büyük/küçük harf duyarsızlık kurallarına tabi olacaktır. Bu nedenle, çocuk bileşeni referans almak için kebab-case adını kullanmalıyız:

```vue-html
<child-comp></child-comp>
```



:::tip
Artık çocuk bileşeni içe aktarın ve şablonda render edin.
:::