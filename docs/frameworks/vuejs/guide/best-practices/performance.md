---
title: Performans
seoTitle: Vue Performans Optimizasyonları
sidebar_position: 4
description: Vue uygulamalarında performansı artırmak için gerekli optimizasyon tekniklerini keşfedin. Bu rehber, sayfa yükleme ve güncelleme performansını artırmak için stratejiler sunmaktadır.
tags: 
  - Vue
  - Performans
  - Optimizasyon
  - Web Geliştirme
keywords: 
  - Vue
  - Performans
  - Optimizasyon
  - SPA
  - SSR
---
## Performans {#performance}

## Genel Bakış {#overview}

Vue, manuel optimizasyonlara çok fazla ihtiyaç duymadan en yaygın kullanım senaryoları için performanslı olacak şekilde tasarlanmıştır. Ancak, her zaman ek ince ayarların gerekli olduğu zorlu senaryolar vardır. Bu bölümde, bir Vue uygulamasında performansı artırmak için dikkat etmeniz gereken konuları tartışacağız.

Öncelikle web performansının iki ana yönünü ele alalım:

- **Sayfa Yükleme Performansı**: uygulamanın içeriği ne kadar hızlı gösterdiği ve ilk ziyarette ne kadar hızlı etkileşimli hale geldiği. Bu genellikle [En Büyük İçerik Boyutu (LCP)](https://web.dev/lcp/) ve [İlk Girdi Gecikmesi (FID)](https://web.dev/fid/) gibi web kritik metrikler kullanılarak ölçülür.

- **Güncelleme Performansı**: uygulamanın kullanıcı girdisine ne kadar hızlı yanıt verdiği. Örneğin, bir kullanıcı bir arama kutusuna yazdığında bir listenin ne kadar hızlı güncellendiği veya kullanıcı bir Tek Sayfa Uygulamasında (SPA) bir navigasyon bağlantısına tıkladığında sayfanın ne kadar hızlı geçiş yaptığı.

Her ikisini de en üst düzeye çıkarmak ideal olsa da, farklı ön uç mimarileri, bu yönlerde istenen performansa ulaşmanın ne kadar kolay olduğunu etkileyebilir. Ayrıca, inşa ettiğiniz uygulama türü, performans açısından önceliklerinizi büyük ölçüde etkiler. Bu nedenle, optimal performansı sağlamak için ilk adım, inşa etmekte olduğunuz uygulama tipi için doğru mimariyi seçmektir:

- Vue'yu farklı şekillerde nasıl kullanabileceğinizi görmek için `Vue Kullanım Yolları` başlığına bakın.

- Jason Miller, web uygulamalarının türleri ve bunların ideal uygulanışı / dağıtımı hakkında [Uygulama Holotipleri](https://jasonformat.com/application-holotypes/) adlı makalesinde tartışmaktadır.

## Profil Seçenekleri {#profiling-options}

Performansı artırmak için öncelikle onu nasıl ölçeceğimizi bilmeliyiz. Bu konuda yardımcı olabilecek birçok harika araç bulunmaktadır:

Üretim dağıtımlarının yükleme performansını profillemek için:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Yerel geliştirme sırasında performansı profillemek için:

- [Chrome Geliştirici Araçları Performans Paneli](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - `app.config.performance`, Chrome Geliştirici Araçları'nın performans zaman çizelgesinde Vue'ya özel performans göstergelerini etkinleştirir.
- `Vue Geliştirici Araçları Eklentisi` de bir performans profilleme özelliği sunar.

## Sayfa Yükleme Optimizasyonları {#page-load-optimizations}

Sayfa yükleme performansını optimize etmek için birçok framework'e bağımsız yön vardır - kapsamlı bir özet için [bu web.dev kılavuzuna](https://web.dev/fast/) göz atın. Burada, esas olarak Vue'ya özgü tekniklere odaklanacağız.

### Doğru Mimarinin Seçilmesi {#choosing-the-right-architecture}

Kullanım senaryonuz sayfa yükleme performansına duyarlıysa, onu tamamen istemci tarafı bir SPA olarak göndermekten kaçının. Sunucunuzun kullanıcının görmek istediği içeriği içeren HTML'i doğrudan göndermesini istersiniz. Tamamen istemci tarafı oluşturmanın içeriğe ulaşma süresi genellikle yavaştır. Bu, `Sunucu Tarafı Oluşturma (SSR)` veya `Statik Site Oluşturma (SSG)` ile hafifletilebilir. Vue ile SSR uygulamak hakkında bilgi almak için `SSR Kılavuzu` bağlantısına göz atın. Eğer uygulamanızın zengin etkileşim gereksinimleri yoksa, HTML'i çıkaran geleneksel bir arka uç sunucusu kullanarak çıktıyı HTML ile birlikte Vue ile zenginleştirebilirsiniz.

Ana uygulamanız bir SPA olmak zorundaysa, ancak pazarlama sayfalarınız (iniş, hakkında, blog) varsa, onları ayrı gönderin! Pazarlama sayfalarınız, SSG kullanarak minimum JS ile statik HTML olarak dağıtılmalıdır.

### Paket Boyutu ve Ağaç Sarsma {#bundle-size-and-tree-shaking}

Sayfa yükleme performansını artırmanın en etkili yollarından biri daha küçük JavaScript paketleri göndermektir. Vue kullanırken paket boyutunu azaltmanın bazı yolları şunlardır:

- Mümkünse bir derleme aşaması kullanın.

  - Vue'nun API'lerinin çoğu modern bir derleme aracı ile paketlendiğinde ["ağaç sarsma"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) özelliğine sahiptir. Örneğin, yerleşik `` bileşenini kullanmıyorsanız, nihai üretim paketine dahil edilmez. Ağaç sarsma, kaynak kodunuzdaki diğer kullanılmayan modülleri de kaldırabilir.

  - Bir derleme aşaması kullanıldığında, şablonlar önceden derlenir, böylece Vue derleyicisini tarayıcıya göndermemiz gerekmez. Bu, **14kb** min+gzipped JavaScript tasarrufu sağlar ve çalışma zamanı derleme maliyetini ortadan kaldırır.

- Yeni bağımlılıkları eklerken dikkatli olun! Gerçek dünya uygulamalarında, şişirilmiş paketler en çok ağır bağımlılıkların farkında olunmadan eklenmesinden kaynaklanmaktadır.

  - Bir derleme aşaması kullanıyorsanız, ES modül formatları sunan ve ağaç sarsma dostu bağımlılıklara öncelik verin. Örneğin, `lodash` yerine `lodash-es` tercih edin.

  - Bir bağımlılığın boyutunu kontrol edin ve sağladığı işlevselliğe değer olup olmadığını değerlendirin. Bağımlılığın ağaç sarsma dostu olup olmadığını not edin; gerçek boyut artışı, gerçekten içeri aktardığınız API'lere bağlı olacaktır. [bundlejs.com](https://bundlejs.com/) gibi araçlar hızlı kontroller için kullanılabilir, ancak gerçek derleme kurulumunuzla ölçmek her zaman en doğru sonucu verir.

- Progresif iyileştirme için Vue'yu kullanıyorsanız ve derleme aşamasından kaçınmayı tercih ediyorsanız, [petite-vue](https://github.com/vuejs/petite-vue) (yalnızca **6kb**) kullanmayı düşünün.

### Kod Bölme {#code-splitting}

Kod bölme, bir derleme aracının uygulama paketini birden fazla daha küçük parçaya ayırmasıdır; bu parçalar talep üzerine veya paralel olarak yüklenebilir. Doğru kod bölme ile sayfa yüklemede gerekli olan özellikler hemen indirilebilir; ek parçalar ise yalnızca gerektiğinde tembel bir şekilde yüklenerek performansı artırabilir.

Rollup gibi paketleyiciler (Vite bunlara dayanır) veya webpack, ESM dinamik içe aktarma sözdizimini tespit ederek otomatik olarak bölünmüş parçalar oluşturabilir:

```js
// lazy.js ve bağımlılıkları ayrı bir parçaya bölünecek
// ve yalnızca `loadLazy()` çağrıldığında yüklenecektir.
function loadLazy() {
  return import('./lazy.js')
}
```

Temel sayfa yüklemesinden hemen sonra gerekmeyen özellikler için tembel yükleme kullanılması en iyisidir. Vue uygulamalarında, bu, bileşen ağaçları için bölünmüş parçalar oluşturmak üzere Vue'nun `Asenkron Bileşen` özelliği ile birleştirilebilir:

```js
import { defineAsyncComponent } from 'vue'

// Foo.vue ve bağımlılıkları için ayrı bir parça oluşturulur.
// yalnızca asenkron bileşen sayfada render edildiğinde talep üzerine çağrılır.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Vue Router kullanan uygulamalar için, yol bileşenleri için tembel yükleme kullanılması şiddetle önerilir. Vue Router, `defineAsyncComponent`'tan ayrı olmak üzere tembel yüklemeyi açıkça destekler. Daha fazla bilgi için [Tembel Yükleme Yolları](https://router.vuejs.org/guide/advanced/lazy-loading.html) bağlantısına göz atın.

## Güncelleme Optimizasyonları {#update-optimizations}

### Props Stabilitesi {#props-stability}

Vue'da, bir çocuk bileşeni yalnızca aldığı props'tan en az biri değiştiğinde güncellenir. Aşağıdaki örneği düşünelim:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

 bileşeni içerisinde, o an aktif olan öğeyi belirlemek için `id` ve `activeId` props'larını kullanır. Bu işe yarasa da, sorun şu ki, `activeId` her değiştiğinde, listedeki **her** `` güncellenmek zorundadır!

İdeal olarak, yalnızca aktif durum değişen öğelerin güncellenmesi gerekir. Bunu, aktif durum hesaplamasını ebeveyn bileşene taşıyarak ve ``'in doğrudan bir `active` prop'u almasını sağlayarak başarabiliriz:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Artık çoğu bileşen için `active` prop'u, `activeId` değiştiğinde aynı kalacağından, güncellemeye ihtiyaç duymayacaklardır. Genel olarak, fikir, çocuk bileşenlere geçirilen props'ları mümkün olduğunca kararlı tutmaktır.

### `v-once` {#v-once}

`v-once`, çalışma zamanı verilerine dayanan ancak asla güncellenmesi gerekmeyen içeriği oluşturmak için kullanılabilen yerleşik bir direktiftir. Kullanıldığı tüm alt ağaç, gelecekteki tüm güncellemeler için atlanacaktır. Daha fazla bilgi için `API referansına` başvurun.

### `v-memo` {#v-memo}

`v-memo`, büyük alt ağaçları veya `v-for` listelerini koşullu olarak güncelleme atlaması için kullanılabilen yerleşik bir direktiftir. Daha fazla bilgi için `API referansına` başvurun.

### Hesaplanan Stabilite {#computed-stability}

Vue 3.4 ve üzeri sürümlerde, bir hesaplanan özellik yalnızca hesaplanan değeri önceki değerden farklı olduğunda etkileri tetikler. Örneğin, aşağıdaki `isEven` hesaplaması yalnızca döndüğü değer `true`'dan `false`'a veya tersi şekilde değiştiğinde etkileri tetikler:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// yeni günlükleri tetiklemez çünkü hesaplanan değer `true` olarak kalır.
count.value = 2
count.value = 4
```

Bu, gereksiz etki tetiklemelerini azaltır, ancak maalesef, hesaplanan bir nesne her hesaplandığında yeni bir nesne oluşturuyorsa çalışmaz:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Her seferinde yeni bir nesne oluşturulduğu için, yeni değer teknik olarak her zaman eski değerden farklıdır. `isEven` özelliği aynı kalsa bile, Vue bunun ne olduğunu bilemez, eski ve yeni değer arasında derin bir karşılaştırma yapmadığı sürece. Böyle bir karşılaştırma maliyetli olabilir ve muhtemelen buna değmez.

Bunun yerine, yeni değeri eski değerle manuel olarak karşılaştırarak ve bir şeyin değişmediğini bildiğimizde, eski değeri döndürebiliriz:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Playground'da deneyin](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Dikkat edin ki, eski değeri karşılaştırmadan ve döndürmeden önce her zaman tam hesaplamayı gerçekleştirmelisiniz, böylece aynı bağımlılıkların her çalıştırmada toplanması sağlanabilir.

## Genel Optimizasyonlar {#general-optimizations}

> Aşağıdaki ipuçları hem sayfa yükleme hem de güncelleme performansını etkiler.

### Büyük Listeleri Sanallaştırın {#virtualize-large-lists}

Tüm ön uç uygulamalarında en yaygın performans sorunlarından biri büyük listelerin render edilmesidir. Bir framework ne kadar performanslı olursa olsun, binlerce öğeden oluşan bir listeyi render etmek, tarayıcının yönetmesi gereken DOM düğüm sayısından dolayı **yavaş** olacaktır.

Ancak, tüm bu düğümleri en baştan render etmemiz gerekmiyor. Çoğu durumda, kullanıcının ekran boyutu büyük listemizin yalnızca küçük bir alt kümesini görüntüleyebilir. Performansı büyük ölçüde artırabiliriz **liste sanallaştırması** ile; yani büyük bir listede yalnızca mevcut veya yakında görüntü alana yakın öğeleri render etmek.

Liste sanallaştırmasını uygulamak kolay değildir, ama şansımıza doğrudan kullanabileceğiniz mevcut topluluk kütüphaneleri bulunmaktadır:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Büyük Değişken Olmayan Yapılar için Tepkisel Yükü Azaltın {#reduce-reactivity-overhead-for-large-immutable-structures}

Vue'nun tepkiselliği varsayılan olarak derindir. Bu durum, durum yönetimini sezgisel hale getirirken, veri boyutu büyük olduğunda belirli bir yük oluşturur çünkü her özellik erişimi, bağımlılık takibi yapan proxy tuzaklarını tetikler. Bu genellikle, bir render işlemi 100.000'den fazla özelliğe erişmesi gereken derinlemesine iç içe geçmiş büyük bir dizi için belirgin hale gelir; bu nedenle, yalnızca çok özel kullanım senaryolarını etkilemelidir.

Vue, `shallowRef()` ve `shallowReactive()` kullanarak derin tepkisellikten vazgeçmek için bir çıkış yolu sağlar. Yüzeysel API'ler, yalnızca kök düzeyinde tepkisel durum yaratır ve tüm içe geçmiş nesneleri dokunulmaz halde bırakır. Bu, içten özellik erişimini hızlı tutar. Ancak, kök durumu değiştirmediğimiz sürece tüm içe geçmiş nesneleri değişmez olarak değerlendirmemiz gerektiğidir:

```js
const shallowArray = shallowRef([
  /* derin nesnelerin büyük listesi */
])

// bu güncellemeleri tetiklemez...
shallowArray.value.push(newObject)
// bu tetikler:
shallowArray.value = [...shallowArray.value, newObject]

// bu güncellemeleri tetiklemez...
shallowArray.value[0].foo = 1
// bu tetikler:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Gereksiz Bileşen Soyutlamalarından Kaçının {#avoid-unnecessary-component-abstractions}

Bazen daha iyi bir soyutlama veya kod organizasyonu için `render'sız bileşenler` veya yüksek düzey bileşenler (yani, diğer bileşenleri ekstra props ile render eden bileşenler) oluşturabiliriz. Bununla birlikte, bunun bir sakıncası yoktur, bileşen örneklerinin düz DOM düğümlerinden çok daha pahalı olduğunu unutmayın. Soyutlama desenleri nedeniyle çok sayıda bileşen oluşturmak performans maliyetlerine neden olabilir.

Sadece birkaç örneği azaltmak, belirgin bir etki yaratmayacağından, uygulamada bileşenin yalnızca birkaç kez render edilmesi durumunda problem etmeyin. Bu optimizasyonu düşünmek için en iyi senaryo yine büyük listelerdir. Her bir bileşen içindeki birçok alt bileşene sahip 100 öğeden oluşan bir listeyi hayal edin. Buradaki bir gereksiz bileşen soyutlamasından kurtulmak, yüzlerce bileşen örneği azaltılmasına neden olabilir.