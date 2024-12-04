---
title: Render Mekanizması
seoTitle: Vue Render Mekanizması Açıklaması
sidebar_position: 1
description: Vuenun render mekanizması, sanal DOM ve render pipeline sürecini anlamak için temel bilgiler sunar. Uygulama performansını artırmak için kullanılan optimizasyonlar üzerinde durulmaktadır.
tags: 
  - Vue
  - Render Mekanizması
  - Sanal DOM
  - Reactivity
  - Performans
keywords: 
  - Vue
  - Render
  - Sanal DOM
  - Geliştirici
  - Yüklenme
---
## Render Mekanizması {#rendering-mechanism}

Vue, bir şablonu alıp gerçek DOM düğümlerine nasıl dönüştürüyor? Vue, bu DOM düğümlerini verimli bir şekilde nasıl güncelliyor? Burada, Vue'nun iç render mekanizmasına dalarak bu sorulara biraz açıklık getirmeye çalışacağız.

## Sanal DOM {#virtual-dom}

Muhtemelen "sanal DOM" terimini duymuşsunuzdur; Vue'nun render sisteminin temelini oluşturan bir kavramdır.

Sanal DOM (VDOM), ideal veya “sanal” bir UI tasvirinin bellekte tutulduğu ve “gerçek” DOM ile senkronize edildiği bir programlama konseptidir. Bu kavram, [React](https://reactjs.org/) tarafından öncülük edilmiştir ve Vue da dahil olmak üzere birçok diğer çerçeve tarafından farklı uygulamalarla benimsenmiştir.

:::info
Sanal DOM, özel bir teknolojiden çok bir modeldir. Bu yüzden tek bir kanonik uygulama yoktur.
:::

Basit bir örnekle bu fikri anlatabiliriz:

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* daha fazla vnode */
  ]
}
```

Burada, `vnode`, bir `` öğesini temsil eden sıradan bir JavaScript nesnesidir (bir "sanak düğüm"). Gerçek öğeyi oluşturmak için gereken tüm bilgileri içerir. Ayrıca, onu sanal DOM ağacının kökü yapan daha fazla çocuk vnode içerir.

Bir çalışma zamanında render edici, bir sanal DOM ağacını yürüyebilir ve ondan gerçek bir DOM ağacı oluşturabilir. Bu işleme **mount** denir.

Eğer iki kopya sanal DOM ağacımız varsa, render edici, iki ağacı da yürüyüp karşılaştırabilir, farkları belirleyebilir ve bu değişiklikleri gerçek DOM'a uygulayabilir. Bu işleme **patch** denir; ayrıca "farklama" veya "uzlaştırma" olarak da bilinir.

:::tip
Sanal DOM'un ana avantajı, geliştiricinin programatik olarak istenen UI yapılarını beyanlı bir şekilde oluşturmaya, incelemeye ve birleştirmeye olanak tanımasıdır; doğrudan DOM manipülasyonunu ise render ediciye bırakır.
:::

## Render Pipeline {#render-pipeline}

Yüksek seviyede, bir Vue bileşeni monte edildiğinde olanlar şunlardır:

1. **Derleme**: Vue şablonları, sanal DOM ağaçları döndüren **render fonksiyonlarına** derlenir. Bu adım, ya bir derleme aşaması aracılığıyla önceden yapılabilir ya da çalışma zamanı derleyicisi kullanılarak anlık olarak gerçekleştirilebilir.

2. **Montaj**: Çalışma zamanındaki render edici, render fonksiyonlarını çağırır, döndürülen sanal DOM ağacını yürür ve bunun temelinde gerçek DOM düğümlerini oluşturur. Bu adım, `reaktif bir etki` olarak gerçekleştirilir, bu nedenle kullanılan tüm reaktif bağımlılıkları takip eder.

3. **Patch**: Montaj sırasında kullanılan bir bağımlılık değiştiğinde, etki yeniden çalıştırılır. Bu sefer, yeni ve güncellenmiş bir Sanal DOM ağacı oluşturulur. Çalışma zamanı render edici yeni ağacı yürür, eski ağacı ile karşılaştırır ve gerçek DOM'a gerekli güncellemeleri uygular.

![render pipeline](../../../images/frameworks/vuejs/guide/extras/images/render-pipeline.png)

## Şablonlar vs. Render Fonksiyonları {#templates-vs-render-functions}

Vue şablonları, sanal DOM render fonksiyonlarına derlenir. Vue ayrıca, şablon derleme adımını atlamamıza ve doğrudan render fonksiyonları yazmamıza olanak tanıyan API'ler sağlar. Render fonksiyonları, yüksek derecede dinamik mantıkla başa çıkarken şablonlardan daha esnektir; çünkü vnodes ile çalışmak için JavaScript'in tüm gücünü kullanabilirsiniz.

:::note
Pekala, neden Vue varsayılan olarak şablonları öneriyor? Bir dizi neden var:
:::

1. Şablonlar, gerçek HTML'e daha yakındır. Bu, mevcut HTML parçalarını yeniden kullanmayı, erişilebilirlik en iyi uygulamalarını uygulamayı, CSS ile stil vermeyi ve tasarımcıların anlamasını ve değiştirmesini kolaylaştırır.

2. Şablonlar, daha belirleyici sözdizimleri nedeniyle statik olarak analiz etmeyi daha kolay hale getirir. Bu, Vue'nun şablon derleyicisinin sanal DOM'un performansını artırmak için birçok derleme zamanı optimizasyonu uygulamasına olanak tanır (bunu aşağıda tartışacağız).

Pratikte, şablonlar uygulamalardaki çoğu kullanım durumu için yeterlidir. Render fonksiyonları genellikle yüksek derecede dinamik render mantığıyla başa çıkması gereken yeniden kullanılabilir bileşenlerde yalnızca kullanılır. Render fonksiyonu kullanımı `Render Fonksiyonları & JSX` bölümünde daha ayrıntılı olarak tartışılmaktadır.

## Derleyici-Bilgilidir Sanal DOM {#compiler-informed-virtual-dom}

React ve diğer çoğu sanal-DOM uygulamalarındaki sanal DOM uygulaması tamamen çalışma zamanı üzerinedir: uzlaştırma algoritması, gelen sanal DOM ağacı hakkında herhangi bir varsayımda bulunamaz, bu nedenle ağacı tamamen tarayarak her vnodenin özelliklerini karşılaştırmak zorundadır. Ayrıca, ağacın bir kısmı asla değişmese bile, her yeniden renderda bunlar için daima yeni vnod'ler oluşturulur; bu da gereksiz bellek yüküne yol açar. Bu, sanal DOM'un en çok eleştirilen yönlerinden biridir: bir ölçüde kaba kuvvet bir uzlaştırma süreci, doğruluk ve beyanlılık karşısında etkinliği feda eder.

Ama böyle olmak zorunda değil. Vue'de, çerçeve hem derleyiciye hem de çalışma zamanına sahiptir. Bu, yalnızca sıkı bir şekilde entegre edilmiş bir render edicinin avantaja sahip olabileceği birçok derleme zamanı optimizasyonu uygulamamıza olanak tanır. Derleyici, şablonu statik olarak analiz edebilir ve çalışma zamanının mümkün olduğunca kestirmeden yararlanması için oluşturulan kodda ipuçları bırakabilir. Aynı zamanda, kullanıcıya uç durumlarda daha doğrudan kontrol sağlamak için render fonksiyonu katmanına geçme yeteneğini hala koruruz. Bu hibrit yaklaşımı **Derleyici-Bilgilidir Sanal DOM** adını veriyoruz.

Aşağıda, Vue şablon derleyicisinin sanal DOM'un çalışma zamanı performansını artırmak için yaptığı birkaç büyük optimizasyonu tartışacağız.

### Statik Yükseltme {#static-hoisting}

Bir şablonda, dinamik bağlamaları içermeyen bölümler sıkça bulunur:

```vue-html{2-3}
<div>
  <div>foo</div> <!-- yükseltilmiş -->
  <div>bar</div> <!-- yükseltilmiş -->
  <div>{{ dynamic }}</div>
</div>
```

[Şablon Gezgini'nde İncele](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGhvaXN0ZWQgLS0+XG4gIDxkaXY+YmFyPC9kaXY+IDwhLS0gaG9pc3RlZCAtLT5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj5cbiIsIm9wdGlvbnMiOnsiaG9pc3RTdGF0aWMiOnRydWV9fQ==)

`foo` ve `bar` div'leri statik - her yeniden renderda vnodları yeniden oluşturmak ve karşılaştırmak gereksizdir. Vue derleyicisi, onların vnode oluşturma çağrılarını render fonksiyonundan otomatik olarak yükseltir ve her renderda aynı vnodları yeniden kullanır. Render edici, eski vnode ile yeni vnodun aynı olduğunu fark ettiğinde, onların karşılaştırmasını tamamen atlayabilir.

Ayrıca, yeterli sayıda ardışık statik eleman olduğunda, bunlar tek bir "statik vnode" içinde yoğunlaştırılır; bu, tüm bu düğnüler için düz HTML dizelerini içerir ([Örnek](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdjBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)). Bu statik vnodlar, ilk montajda `innerHTML` ayarlanarak monte edilir. Aynı içeriğin uygulamanın başka bir yerinde yeniden kullanılması durumunda, yeni DOM düğümleri, yerel `cloneNode()` kullanılarak oluşturulur; bu da son derece etkilidir.

### Patch Flag'leri {#patch-flags}

Dinamik bağlamalara sahip bir tekil öğe için, derleme zamanı sırasında ondan birçok bilgi de çıkarabiliriz:

```vue-html
<!-- yalnızca sınıf bağlaması -->
<div :class="{ active }"></div>

<!-- yalnızca id ve değer bağlamaları -->
<input :id="id" :value="value">

<!-- yalnızca metin çocukları -->
<div>{{ dynamic }}</div>
```

[Şablon Gezgini'nde İncele](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

Bu öğeler için render fonksiyonu kodunu üretirken, Vue her birinin ihtiyaç duyduğu güncelleme türünü doğrudan vnode oluşturma çağrısında kodlar:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* Sınıf */)
```

Son argüman, `2`, bir [patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts)dir. Bir öğe birden fazla patch flag'ine sahip olabilir ki bu flag'ler tek bir sayıya birleştirilir. Çalışma zamanı render edici, gerekli işlerin yapılıp yapılmayacağını belirlemek için flag'lere [bit düzlemi işlemleri](https://en.wikipedia.org/wiki/Bitwise_operation) kullanarak kontrol edebilir:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // öğenin sınıfını güncelle
}
```

Bit düzlemi kontrolleri son derece hızlıdır. Patch flag'leri sayesinde, Vue dinamik bağlamalara sahip öğeleri güncellerken gerekli olan en az miktarda işi yapabilir.

Vue, bir vnodun çocuklarının türünü de kodlar. Örneğin, birden fazla kök düğümü olan bir şablon bir parça olarak temsil edilir. Çoğu durumda, bu kök düğümlerinin sırasının asla değişmeyeceğini biliyoruz, bu nedenle bu bilgi de çalışma zamanına bir patch flag olarak sağlanabilir:

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* çocuklar */
  ], 64 /* STABİL_PARÇA */))
}
```

Bu sayede, çalışma zamanı, kök parça için çocuk sırası uzlaştırmasını tamamen atlayabilir.

### Ağaç Düzleştirme {#tree-flattening}

Önceki örnekte üretilen kodu yeniden incelerken, döndürülen sanal DOM ağacının kökünün özel bir `createElementBlock()` çağrısı kullanılarak oluşturulduğunu göreceksiniz:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* çocuklar */
  ], 64 /* STABİL_PARÇA */))
}
```

Kavramsal olarak, bir "blok", şablonun kararlı bir iç yapıya sahip kısmıdır. Bu durumda, tüm şablon tek bir blok içerir çünkü `v-if` ve `v-for` gibi hiçbir yapısal yönerge içermez.

Her blok, patch flag'leri olan herhangi bir alt düğümü (yalnızca doğrudan çocukları değil) izler. Örneğin:

```vue-html{3,5}
<div> <!-- kök blok -->
  <div>...</div>         <!-- izlenmez -->
  <div :id="id"></div>   <!-- izlenir -->
  <div>                  <!-- izlenmez -->
    <div>{{ bar }}</div> <!-- izlenir -->
  </div>
</div>
```

Sonuç, yalnızca dinamik alt düğümleri içeren düzleştirilmiş bir dizi içerir:

```
div (blok kökü)
- :id bağı olan div
- {{ bar }} bağı olan div
```

Bu bileşen yeniden render edilmesi gerektiğinde, tam ağaç yerine yalnızca düzleştirilmiş ağacı taraması yeterlidir. Bu, **Ağaç Düzleştirmesi** olarak adlandırılır ve sanal DOM uzlaştırması sırasında geçmesi gereken düğüm sayısını büyük ölçüde azaltır. Şablonun statik kısımlarının etkili bir şekilde atlandığı anlamına gelir.

`v-if` ve `v-for` yönergeleri yeni blok düğümleri oluşturur:

```vue-html
<div> <!-- kök blok -->
  <div>
    <div v-if> <!-- if bloku -->
      ...
    </div>
  </div>
</div>
```

Bir alt blok, üst bloğun dinamik alt düğümlerinin dizisinde izlenir. Bu, üst blok için kararlı bir yapı sağlar.

### SSR Hidratasyonu Üzerindeki Etki {#impact-on-ssr-hydration}

Hem patch flag'leri hem de ağaç düzleştirme, Vue'nun `SSR Hidratasyonu` performansını büyük ölçüde artırır:

- Tekil öğe hidratasyonu, karşılık gelen vnod'un patch flag'ine dayanarak hızlı yollar alabilir.

- Yalnızca blok düğümleri ve onların dinamik alt düğümleri, hidratasyon sırasında geçmelidir; bu da şablon düzeyinde kısmi hidratasyonu etkili bir şekilde elde eder.