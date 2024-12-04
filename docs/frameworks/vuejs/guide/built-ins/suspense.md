---
title: Suspense
seoTitle: Understanding Suspense in Vue
sidebar_position: 4
description:  is a built-in component for managing asynchronous dependencies in a component tree, allowing for loading states during resolution. This guide explains its usage and functionality.
tags: 
  - Vue
  - Async Components
  - Suspense
  - Component Management
keywords: 
  - suspense
  - asynchronous
  - loading state
  - Vue router
  - component lifecycle
---
## Suspense {#suspense}

:::warning Deneysel Özellik  
`` deneysel bir özelliktir. Stabil bir duruma ulaşması garanti edilmez ve API, bunu yapmadan değişebilir.  
:::

`` bir bileşen ağacındaki asenkron bağımlılıkları düzenlemek için yerleşik bir bileşendir. Birden fazla iç içe geçmiş asenkron bağımlılığın çözülmesini beklerken bir yükleniyor durumunu gösterebilir.

## Asenkron Bağımlılıklar {#async-dependencies}

``’ün çözmeye çalıştığı problemi ve bu asenkron bağımlılıklarla nasıl etkileşime girdiğini açıklamak için aşağıdaki bileşen hiyerarşisini hayal edelim:

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (async setup() ile bileşen)
   └─ <Content>
      ├─ <ActivityFeed> (asenkron bileşen)
      └─ <Stats> (asenkron bileşen)
```

Bileşen ağacında, işlenmesi için bazı asenkron kaynakların önce çözülmesi gereken birden fazla iç içe geçmiş bileşen bulunur. `` olmadan, her biri kendi yükleniyor / hata ve yüklü durumlarını yönetmek zorundadır. En kötü senaryoda, sayfada üç yüklenme simgesi görebiliriz ve içerikler farklı zamanlarda görüntülenir.

`` bileşeni, bu iç içe geçmiş asenkron bağımlılıkların çözülmesi için beklerken üst düzey yükleniyor / hata durumlarını göstermemize olanak tanır.

`` için bekleyebileceği iki tür asenkron bağımlılık vardır:

1. Asenkron `setup()` kancası olan bileşenler. Bu, üst düzey `await` ifadeleri kullanan `` bileşenlerini içerir.
2. `Asenkron Bileşenler`.

### `async setup()` {#async-setup}

Bir Composition API bileşeninin `setup()` kancası asenkron olabilir:

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

`` kullanıyorsanız, üst düzey `await` ifadelerinin varlığı, bileşeni otomatik olarak bir asenkron bağımlılık haline getirir:

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### Asenkron Bileşenler {#async-components}

Asenkron bileşenler varsayılan olarak **"askıya alınabilir"** (suspensible) durumdadır. Bu, eğer bir `` varsa, üst düzey bileşen zincirinde asenkron bir bağımlılık olarak muamele göreceği anlamına gelir. Bu durumda, yüklenme durumu `` tarafından kontrol edilir ve bileşenin kendi yüklenme, hata, gecikme ve zaman aşımı seçenekleri göz ardı edilir.

Asenkron bileşen, `suspensible: false` belirterek `Suspense` kontrolünden çıkabilir ve bileşenin her zaman kendi yüklenme durumunu kontrol etmesine izin verebilir.

## Yüklenme Durumu {#loading-state}

`` bileşeni iki slot içerir: `#default` ve `#fallback`. Her iki slot da yalnızca **bir** doğrudan çocuk düğümüne izin verir. Varsayılan slotta bulunan düğüm mümkünse gösterilir. Aksi takdirde, düşme slotundaki düğüm gösterilir.

```vue-html
<Suspense>
  <!-- iç içe geçmiş asenkron bağımlılıkları olan bileşen -->
  <Dashboard />

  <!-- #fallback slotu aracılığıyla yüklenme durumu -->
  <template #fallback>
    Yükleniyor...
  </template>
</Suspense>
```

İlk renderda, `` varsayılan slot içeriğini bellekte renderlar. Eğer süreç esnasında herhangi bir asenkron bağımlılık ile karşılaşılırsa, **bekleme** durumuna geçer. Bekleme durumunda, düşme içeriği gösterilir. Tüm karşılaşılan asenkron bağımlılıklar çözüldüğünde, `` **çözüldü** durumuna geçer ve çözülen varsayılan slot içeriği gösterilir.

Eğer ilk render sırasında hiçbir asenkron bağımlılık ile karşılaşılmadıysa, `` doğrudan çözüldü durumuna geçer.

Bir çözüldü durumuna geçtikten sonra, `` yalnızca `#default` slotunun kök düğümü değiştirildiğinde bekleme durumuna döner. Ağacın daha derinlerinde iç içe geçen yeni asenkron bağımlılıklar, ``’nin bekleme durumuna dönmesine neden **olmaz**.

Bir geri dönüş gerçekleştiğinde, düşme içeriği hemen gösterilmeyecektir. Bunun yerine, ``, yeni içerik ve asenkron bağımlılıklarının çözülmesini beklerken önceki `#default` içeriğini gösterecektir. Bu davranış `timeout` props'u ile yapılandırılabilir: ``, varsayılan içerik yeni içerikle değiştiğinde `timeout` süresinden uzun sürerse düşme içeriğine geçer. `timeout` değeri `0` ise, varsayılan içerik değiştirilir değiştirilmez düşme içeriği hemen gösterilecektir.

## Olaylar {#events}

`` bileşeni 3 olayı yayar: `pending`, `resolve` ve `fallback`. `pending` olayı bekleme durumuna geçildiğinde meydana gelir. `resolve` olayı, yeni içeriğin `default` slotunda çözülmesi tamamlandığında yayılır. `fallback` olayı, düşme slotunun içeriği gösterildiğinde tetiklenir.

Bu olaylar, örneğin, yeni bileşenler yüklenirken eski DOM'un önünde bir yükleniyor göstergesi göstermek için kullanılabilir.

## Hata Yönetimi {#error-handling}

`` şu anda bileşen aracılığıyla hata yönetimi sağlamaz - ancak, `` üst bileşeninde asenkron hataları yakalamak ve yönetmek için `errorCaptured` seçeneğini veya `onErrorCaptured()` kancasını kullanabilirsiniz.

## Diğer Bileşenlerle Birleştirme {#combining-with-other-components}

``'ü `` ve `` bileşenleri ile bir arada kullanmak yaygındır. Bu bileşenlerin iç içe geçme sırası, hepsinin doğru bir şekilde çalışması için önemlidir.

Ayrıca, bu bileşenler sıklıkla [Vue Router](https://router.vuejs.org/)’dan gelen `` bileşeni ile bir arada kullanılır.

Aşağıdaki örnek, bu bileşenlerin iç içe geçmesini gösterir, böylece hepsi beklenildiği gibi davranır. Daha basit kombinasyonlar için kullanmadığınız bileşenleri kaldırabilirsiniz:

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- ana içerik -->
          <component :is="Component"></component>

          <!-- yüklenme durumu -->
          <template #fallback>
            Yükleniyor...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router, dinamik importlar kullanarak [tembel yükleme bileşenleri](https://router.vuejs.org/guide/advanced/lazy-loading.html) için yerleşik desteğe sahiptir. Bu, asenkron bileşenlerden farklıdır ve şu anda ``'yi tetiklemeyecektir. Ancak, yine de asenkron bileşenlere sahip alt bileşenler olabilir ve bunlar normal şekilde ``'yi tetikleyebilir.

## İç içe Geçmiş Suspense {#nested-suspense}

- Sadece 3.3+ sürümlerde desteklenmektedir.

Birden fazla asenkron bileşenimiz olduğunda (iç içe geçmiş veya düzen tabanlı yollar için yaygındır) şu şekilde:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

``, ağacın altındaki tüm asenkron bileşenleri beklenildiği gibi çözecek bir sınır oluşturur. Ancak, `DynamicAsyncOuter` değiştiğinde, `` bunu doğru bir şekilde bekler; ancak `DynamicAsyncInner` değiştiğinde, iç içe geçmiş `DynamicAsyncInner` bir boş düğüm renderlar, çözülene kadar (önceki ya da düşme slotu yerine).

Bunu çözmek için, iç bileşen için patch’i yönetmek üzere iç içe geçmiş bir suspense kullanabiliriz:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- bu -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

`suspensible` props'unu ayarlamazsanız, iç `` üst `` tarafından senkron bir bileşen olarak muamele görecektir. Bu, kendi düşme slotuna sahip olduğu anlamına gelir ve eğer her iki `Dynamic` bileşeni aynı anda değişirse, boş düğümler ve çocuk `` kendi bağımlılık ağacını yüklerken birden fazla patch döngüsü olabilecektir ki bu istenmeyen bir durum olabilir. Ayarlandığında, tüm asenkron bağımlılık yönetimi, üst ``'ye verilir (yayınlanan olaylar dahil) ve iç `` yalnızca bağımlılık çözümü ve patching için bir sınır olarak işlev görür.