---
title: Bileşen Temelleri
seoTitle: Vue Bileşenleri Temelleri
sidebar_position: 4
description: Bileşenler, UIyi bağımsız ve yeniden kullanılabilir parçalara ayırmayı sağlar. Bu kılavuzda, bileşen tanımlama ve kullanma yöntemlerini öğrenin.
tags: 
  - Vue
  - Bileşen
  - Geliştirici
  - UI
  - JavaScript
keywords: 
  - Vue.js
  - Bileşenler
  - Geliştirme
  - Kullanıcı Arayüzü
---
## Bileşenler Temelleri {#components-basics}

Bileşenler, UI'yi bağımsız ve yeniden kullanılabilir parçalara ayırmamıza ve her parçayı izolasyonda düşünmemize olanak tanır. Bir uygulamanın genellikle iç içe geçmiş bileşenlerden oluşan bir ağaç yapısına organize edilmesi yaygındır:

![](../../../images/frameworks/vuejs/guide/essentials/images/components.png)



Bu, yerel HTML öğelerini nasıl iç içe aldığımıza oldukça benzer, ancak Vue, her bileşende özel içerik ve mantığı kapsüllememizi sağlayan kendi bileşen modelini uygular. Vue, yerel Web Bileşenleri ile de uyumlu çalışır. Vue Bileşenleri ve yerel Web Bileşenleri arasındaki ilişki hakkında daha fazla bilgi edinmek istiyorsanız, `buradan daha fazla bilgi okuyun`.

## Bir Bileşeni Tanımlama {#defining-a-component}

Bir derleme adımı kullanırken, tipik olarak her Vue bileşenini `.vue` uzantılı özel bir dosyada tanımlarız - buna `Tek Dosya Bileşeni` (kısa SFC) denir:



```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Bana {{ count }} kez tıkladınız.</button>
</template>
```




```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Bana {{ count }} kez tıkladınız.</button>
</template>
```



Bir derleme adımı kullanmıyorsanız, bir Vue bileşeni, Vue'ya özel seçenekleri içeren düz bir JavaScript nesnesi olarak tanımlanabilir:



```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Bana {{ count }} kez tıkladınız.
    </button>`
}
```




```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      Bana {{ count }} kez tıkladınız.
    </button>`
  // Ayrıca bir DOM içindeki şablonu hedefleyebilirsiniz:
  // template: '#my-template-element'
}
```



Şablon burada bir JavaScript dizesi olarak satır içi olarak tanımlanmıştır, bu da Vue'nun bunu anlık olarak derleyeceği anlamına gelir. Ayrıca, bir öğeye (genellikle yerel `` öğeleri) işaret eden bir ID seçicisi de kullanabilirsiniz - Vue, içeriğini şablon kaynağı olarak kullanacaktır.

Yukarıdaki örnek, bir bileşen tanımlar ve onu bir `.js` dosyasının varsayılan ihracı olarak dışarı aktarır, ancak aynı dosyadan birden fazla bileşen dışa aktarmak için adlandırılmış dışa aktarımlar da kullanabilirsiniz.

## Bir Bileşeni Kullanma {#using-a-component}

:::tip
Bu kılavuzun geri kalanında SFC sözdizimini kullanacağız - bileşenler etrafındaki kavramlar, bir derleme adımı kullanıp kullanmadığınızdan bağımsız olarak aynıdır. `Örnekler` bölümü, her iki senaryoda da bileşen kullanımını gösterir.
:::

Bir alt bileşeni kullanmak için, onu üst bileşende içe aktarmamız gerekir. Sayma bileşenimizi `ButtonCounter.vue` adlı bir dosyanın içine yerleştirdiğimizi varsayalım, bileşen dosyanın varsayılan ihracı olarak kullanılabilir hale gelecektir:



```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>İşte bir alt bileşen!</h1>
  <ButtonCounter />
</template>
```




```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>İşte bir alt bileşen!</h1>
  <ButtonCounter />
</template>
```



`` ile, içe aktarılan bileşenler otomatik olarak şablona sunulmaktadır.

Ayrıca, bir bileşeni küresel olarak kaydetmek mümkündür, böylece bir uygulamadaki tüm bileşenler için onu içe aktarmaya gerek kalmadan kullanılabilir. Küresel ve yerel kayıt arasındaki avantajlar ve dezavantajlar, özel `Bileşen Kaydı` bölümünde tartışılmıştır.

Bileşenleri istediğiniz kadar tekrar kullanabilirsiniz:

```vue-html
<h1>İşte birçok alt bileşen!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```



[Playground'da deneyin](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)




[Playground'da deneyin](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)



Düğmelere tıkladığınızda, her birinin kendi, ayrık `count`'ını koruduğunu unutmayın. Bunun nedeni, bir bileşeni kullandığınızda, onun yeni bir **örneği** oluşturulmasıdır.

SFC'lerde, alt bileşenlerin etiket adları için `PascalCase` kullanmanız önerilir, bu sayede yerel HTML öğelerinden ayırt edebilirsiniz. Yerel HTML etiket adları büyük/küçük harfe duyarsız olsa da, Vue SFC derlenmiş bir format olduğundan, içindeki büyük/küçük harfe duyarlı etiket adlarını kullanabiliyoruz. Ayrıca, bir etiketi kapatmak için `/>` kullanabiliyoruz.

Eğer şablonlarınızı doğrudan bir DOM'da yazıyorsanız (örneğin, yerel bir `` öğesinin içeriği olarak), şablon, tarayıcının yerel HTML analiz davranışına tabi olacaktır. Bu tür durumlarda, `kebab-case` ve bileşenler için açık kapanış etiketleri kullanmanız gerekecektir:

```vue-html
<!-- eğer bu şablon DOM'da yazılmışsa -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Daha fazla bilgi için `DOM içi şablon analizi tuzaklarına` bakın.

## Props Geçişi {#passing-props}

Eğer bir blog oluşturuyorsak, muhtemelen bir blog gönderisini temsil eden bir bileşene ihtiyacımız olacaktır. Tüm blog gönderilerinin aynı görsel düzeni paylaşmasını istiyoruz, ancak farklı içerikle. Böyle bir bileşen faydalı olmayacaktır, eğer ona belirli bir gönderiyi göstermek için başlık ve içerik gibi veriler geçemezsek. İşte burada props devreye giriyor.

Props, bir bileşen üzerinde kayıt yapabileceğiniz özel niteliklerdir. Blog gönderi bileşenimize bir başlık geçmek için, bu bileşenin kabul ettiği props listesinde başlığı belirtmemiz gerekir; bunu `props` seçeneğini`defineProps` makrosunu kullanarak yaparız:



```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```




```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```



`defineProps`, yalnızca `` içinde mevcut olan ve açıkça içe aktarılmasına gerek olmayan bir derleme zamanı makrosudur. Tanımlanan props, otomatik olarak şablona sunulmaktadır. `defineProps` ayrıca, bileşene geçirilen tüm props'u içeren bir nesne döner; böylece ihtiyaç halinde JavaScript'te onlara erişebiliriz:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Ayrıca: `Bileşen Props'larının Tipi` 

Eğer `` kullanmıyorsanız, props, `props` seçeneği kullanılarak tanımlanmalıdır ve props nesnesi, `setup()`'a ilk argüman olarak geçilecektir:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```



Bir bileşen, istediğiniz kadar prop'a sahip olabilir ve varsayılan olarak, herhangi bir değer herhangi bir prop'a geçirilebilir.

Bir prop kaydedildikten sonra, ona özel bir nitelik olarak veri geçebilirsiniz, şöyle:

```vue-html
<BlogPost title="Vue ile yolculuğum" />
<BlogPost title="Vue ile blog yazmak" />
<BlogPost title="Neden Vue bu kadar eğlenceli" />
```

Ancak tipik bir uygulamada, muhtemelen üst bileşeninizde bir dizi gönderi olacaksınız:



```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'Vue ile yolculuğum' },
        { id: 2, title: 'Vue ile blog yazmak' },
        { id: 3, title: 'Neden Vue bu kadar eğlenceli' }
      ]
    }
  }
}
```




```js
const posts = ref([
  { id: 1, title: 'Vue ile yolculuğum' },
  { id: 2, title: 'Vue ile blog yazmak' },
  { id: 3, title: 'Neden Vue bu kadar eğlenceli' }
])
```



Daha sonra, her biri için bir bileşeni, `v-for` kullanarak render etmek isteriz:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
/>
```



[Playground'da deneyin](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)




[Playground'da deneyin](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)



`v-bind` sözdizimi` (`:title="post.title"`) kullanılarak dinamik prop değerleri geçirildiğine dikkat edin. Bu, önceden hangi içeriği render edeceğinizi kesin olarak bilmediğinizde özellikle faydalıdır.

Şu anda props hakkında bilmeniz gereken her şey bu, ancak bu sayfayı okuduktan sonra içeriği ile rahat hissettiğinizde, `Props` hakkında tam kılavuzu daha sonra okumayı öneririz.

## Olayları Dinleme {#listening-to-events}

`` bileşenimizi geliştirirken, bazı özellikler üst bileşene geri bildirimde bulunmayı gerektirebilir. Örneğin, blog gönderilerinin metnini büyütmek için erişilebilirlik özelliği eklemeye karar verebiliriz; bu esnada sayfanın geri kalanını varsayılan boyutunda bırakabiliriz.

Üst bileşende, bu özelliği desteklemek için bir `postFontSize` veri niteliğiref ekleyebiliriz:



```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```




```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```



Bu, tüm blog gönderilerinin font büyüklüğünü kontrol etmek için şablon içinde kullanılabilir:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Artık `` bileşeninin şablonuna bir buton ekleyelim:

```vue{5}
<!-- BlogPost.vue, <script> kısmını atlayarak -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Metni Büyüt</button>
  </div>
</template>
```

Buton henüz hiçbir şey yapmıyor - butona tıkladığınızda, üst bileşene blog gönderilerinin hepsinin metnini büyütmesi gerektiği bilgisini iletmek istiyoruz. Bu problemi çözmek için, bileşenler özel bir olay sistemi sağlar. Üst bileşen, `v-on` veya `@` ile herhangi bir alt bileşen örneğinde herhangi bir olayı dinlemeyi seçebilir; bu, yerel DOM olayıyla aynı şekilde çalışır:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
/>
```

Sonra, alt bileşen, kendisinde bir olay yaymak için yerleşik `**`$emit`** metodunu` çağırabilir ve olayın adını geçebilir:

```vue{5}
<!-- BlogPost.vue, <script> kısmını atlayarak -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Metni Büyüt</button>
  </div>
</template>
```

`@enlarge-text="postFontSize += 0.1"` dinleyicisi sayesinde, üst bileşen olayı alacak ve `postFontSize` değerini güncelleyecektir.



[Playground'da deneyin](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)




[Playground'da deneyin](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)



Olayları [belirtebiliriz](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

Angular'ın bileşenleri, kullandığımız `@emit` özelliğini kullanarak özel olayları destekleyebilir. İşte aşağıdaki kodda dolu bir örnek.

## İçerik Dağıtımı ile Slotlar {#content-distribution-with-slots}

Tıpkı HTML öğeleri gibi, bir bileşene içerik geçirebilmek sık sık faydalıdır, şuna benzeyen bir şekilde:

```vue-html
<AlertBox>
  Kötü bir şey oldu.
</AlertBox>
```

Bu, muhtemelen şöyle bir şeye render edilebilir:

:::danger Bu Demo Amaçlı bir Hata
Kötü bir şey oldu.
:::

Bu, Vue'nun özel `` öğesini kullanarak gerçekleştirilebilir:

```vue{4}
<!-- AlertBox.vue -->
<template>
  <div class="alert-box">
    <strong>Bu Demo Amaçlı bir Hata</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Gördüğünüz gibi, içeriğin nereye gitmesini istediğimiz yere `` kullanıyoruz - hepsi bu kadar. İşimiz bitti!



[Playground'da deneyin](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)




[Playground'da deneyin](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)



Şu anda slotlar hakkında bilmeniz gereken her şey bu, ancak bu sayfayı okuduktan sonra içeriği ile rahat hissettiğinizde, `Slotlar` hakkında tam kılavuzu daha sonra okumayı öneririz.