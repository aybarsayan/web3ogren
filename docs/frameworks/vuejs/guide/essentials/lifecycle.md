---
title: Yaşam Döngüsü Kancaları
seoTitle: Vue Yaşam Döngüsü Kancaları Hakkında Bilgiler
sidebar_position: 4
description: Vue bileşenlerinde yaşam döngüsü kancalarının önemi ve nasıl kullanılacağı hakkında bilgi. Kullanıcıların belirli aşamalarda kod eklemesine olanak tanır.
tags: 
  - Vue
  - yaşam döngüsü kancaları
  - bileşen
keywords: 
  - Vue
  - yaşam döngüsü
  - lifecycle hooks
  - component
---
## Yaşam Döngüsü Kancaları {#lifecycle-hooks}

Her Vue bileşeni örneği oluşturulduğunda bir dizi başlatma adımından geçer - örneğin, veri gözlemini ayarlaması, şablonu derlemesi, örneği DOM'a monte etmesi ve veri değiştiğinde DOM'u güncellemesi gerekir. Bu süreçte, kullanıcıların belirli aşamalarda kendi kodlarını eklemelerine olanak tanıyan yaşam döngüsü kancaları olarak adlandırılan işlevleri de çalıştırır.

## Yaşam Döngüsü Kancalarının Kaydedilmesi {#registering-lifecycle-hooks}

Örneğin, `onMounted``mounted` kancası, bileşen başlangıç render işlemini tamamladıktan ve DOM düğümlerini oluşturduktan sonra kod çalıştırmak için kullanılabilir:



```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`bileşen şimdi monte edildi.`)
})
</script>
```




```js
export default {
  mounted() {
    console.log(`bileşen şimdi monte edildi.`)
  }
}
```



Ayrıca, örneğin yaşam döngüsünün farklı aşamalarında çağrılacak diğer kancalar da vardır; en yaygın olarak kullanılanlar `onMounted`, `onUpdated`, ve `onUnmounted`.`mounted`, `updated`, ve `unmounted`.



Tüm yaşam döngüsü kancaları, `this` bağlamları mevcut etkin örneğe işaret edecek şekilde çağrılır. Bu, yaşam döngüsü kancalarını tanımlarken ok işlevleri kullanmaktan kaçınmanız gerektiği anlamına gelir, çünkü böyle yaparsanız bileşen örneğine `this` ile erişemezsiniz.





`onMounted` çağrıldığında, Vue otomatik olarak kayıtlı geri çağırma işlevini mevcut etkin bileşen örneği ile ilişkilendirir. Bu, bu kancaların bileşen kurulumu sırasında **eşzamanlı** olarak kaydedilmesi gerektiği anlamına gelir. Örneğin, bunu yapmayın:

```js
setTimeout(() => {
  onMounted(() => {
    // bu çalışmayacak.
  })
}, 100)
```

Bu, çağrının `setup()` veya `` içinde sözdizimsel olarak yer alması gerektiği anlamına gelmez. `onMounted()` çağrısı dış bir işlevde çağrılabilir, yeter ki çağrı yığını eşzamanlı olsun ve `setup()` içinden kaynaklansın.



## Yaşam Döngüsü Diyagramı {#lifecycle-diagram}

Aşağıda örneğin yaşam döngüsü için bir diyagram bulunmaktadır. Şu anda her şeyin tam olarak ne anlama geldiğini anlamanıza gerek yok; ancak öğrendikçe ve daha fazla şey inşa ettikçe, bu faydalı bir referans olacaktır.

![Bileşen yaşam döngüsü diyagramı](../../../images/frameworks/vuejs/guide/essentials/images/lifecycle.png)



Tüm yaşam döngüsü kancaları ve ilgili kullanım durumları hakkında ayrıntılar için `Yaşam Döngüsü Kancaları API referansı``Yaşam Döngüsü Kancaları API referansı`'na danışın.