---
title: Seçenekler Durum
seoTitle: Vue Seçenekleri Durum Yönetimi
sidebar_position: 1
description: Bu bölümde, bileşen örneğinin reaktif durumu döndüren fonksiyonları ve bunların kullanımına dair bilgiler sunulmaktadır. Detaylı açıklamalar ve örneklerle bileşen yapısına dair kapsamlı bir anlayış geliştirin.
tags: 
  - Vue
  - Bileşenler
  - Reaktiflik
keywords: 
  - bileşen durumu
  - Vue reaktivite
  - bileşen özellikleri
  - Vue 3
---
## Seçenekler: Durum {#options-state}

## veri {#data}

:::tip
Bileşen örneği için ilk reaktif durumu döndüren bir fonksiyon kullanın.
:::

- **Tür**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Ayrıntılar**

  Fonksiyonun düz bir JavaScript nesnesi döndürmesi beklenir, bu da Vue tarafından reaktif hale getirilecektir. Örnek oluşturulduktan sonra, reaktif veri nesnesine `this.$data` olarak erişilebilir. Bileşen örneği, veri nesnesinde bulunan tüm özellikleri de proxy olarak kullanır, bu nedenle `this.a`, `this.$data.a` ile eşdeğerdir.

  Tüm üst düzey veri özellikleri döndürülen veri nesnesine dahil edilmelidir. `this.$data`'ya yeni özellikler eklemek mümkündür, ancak bu **tavsiye edilmez**. Bir özelliğin istenilen değeri henüz mevcut değilse, Vue'nun özelliğin mevcut olduğunu anlamasını sağlamak için `undefined` veya `null` gibi boş bir değer yer tutucu olarak dahil edilmelidir.

  `_` veya `$` ile başlayan özellikler, Vue'nun dahili özellikleri ve API yöntemleri ile çakışabileceğinden bileşen örneğinde proxy olarak **kullanılmaz**. Bunlara `this.$data._property` olarak erişmeniz gerekecektir.

  Durum bilgisi olan kendi nesne nesneleri gibi tarayıcı API nesneleri ve prototip özellikler ile nesneler döndürmeyi **tavsiye edilmez**. Döndürülen nesne ideal olarak bileşenin durumunu yalnızca temsil eden düz bir nesne olmalıdır.

- **Örnek**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  `data` özelliği ile bir ok fonksiyonu kullanıyorsanız, `this` bileşenin örneği olmayacak, ancak yine de örneğe fonksiyonun birinci argümanı olarak erişebilirsiniz:

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **Ayrıca bakınız** `Derin Reaktivite`