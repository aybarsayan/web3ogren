---
title: Sözlük
seoTitle: Vue Teknik Terimleri Sözlüğü
sidebar_position: 1
description: Bu sözlük, Vue ile konuşurken yaygın olarak kullanılan teknik terimlerin anlamlarına dair bazı yönergeler sunmayı amaçlamaktadır. Terimlerin bağlamında doğru kullanımı teşvik etmektedir.
tags: 
  - Vue
  - teknik terimler
  - yazılım geliştirme
  - programlama
  - web geliştirme
keywords: 
  - Vue
  - sözlük
  - teknik terimler
  - yazılım geliştirme
  - programlama
---
## Sözlük {#glossary}

Bu sözlük, Vue ile konuşurken yaygın olarak kullanılan teknik terimlerin anlamlarına dair bazı yönergeler sunmayı amaçlamaktadır. Terimlerin nasıl kullanıldığına dair *tanımlayıcı* olmayı, nasıl kullanılmaları gerektiğine dair bir *kural koyucu* spesifikasyonu olmaktan ziyade, terimlerin yaygın kullanımını yansıtmaktadır. Bazı terimlerin çevresindeki bağlama bağlı olarak hafifçe farklı anlamları veya nüansları olabilir.

[[TOC]]

## async component {#async-component}

:::tip
*Async component*, başka bir bileşenin etrafında sarılmış bir öğe olup, sarılmış bileşenin tembel bir şekilde yüklenmesine olanak tanır.
:::

Bu genellikle, derlenmiş `.js` dosyalarının boyutunu azaltmanın bir yolu olarak kullanılır ve bu dosyaların yalnızca gerektiğinde yüklenen daha küçük parçalara bölünmesine olanak tanır.

Vue Router'ın [yol bileşenlerinin tembel yüklenmesi](https://router.vuejs.org/guide/advanced/lazy-loading.html) için benzer bir özelliği vardır, ancak bu Vue'nun async bileşenler özelliğini kullanmaz.

Daha fazla bilgi için:
- `Rehber - Async Bileşenler`

## compiler macro {#compiler-macro}

*Compiler macro*, bir derleyici tarafından işlenen ve başka bir şeye dönüştürülen özel bir koddur. Temelde, akıllıca bir şekilde string değiştirmeyi temsil eder.

Vue'nun `SFC` derleyicisi, `defineProps()`, `defineEmits()` ve `defineExpose()` gibi çeşitli makroları destekler. Bu makrolar normal JavaScript fonksiyonları gibi görünmek üzere tasarlanmıştır, böylece JavaScript / TypeScript etrafındaki aynı ayrıştırıcı ve tip çıkarımı araçlarından yararlanabilirler. Ancak bunlar, tarayıcıda çalıştırılan gerçek fonksiyonlar değildir. Derleyicinin tespit ettiği ve gerçekte çalıştırılacak olan gerçek JavaScript kodu ile değiştirdiği özel stringlerdir.

:::warning
Makroların kullanımına yönelik bazı sınırlamalar vardır.
:::

Örneğin, `const dp = defineProps` oluşturmayı düşündüğünüzde, bunun `defineProps` için bir takma ad oluşturmasına izin vereceğini düşünebilirsiniz, ancak bu aslında bir hata ile sonuçlanacaktır. `defineProps()`'a hangi değerlerin geçirileceği ile ilgili de sınırlamalar vardır, çünkü 'argümanlar' derleyici tarafından işlenmeli ve çalışma zamanında değil.

Daha fazla bilgi için:
- `` - `defineProps()` & `defineEmits()`
- `` - `defineExpose()`

## component {#component}

*Component* terimi Vue'ya özgü değildir. Birçok UI frameworkünde yaygındır. Kullanıcı arayüzündeki bir parçayı, örneğin bir buton veya onay kutusunu tanımlar. Bileşenler aynı zamanda daha büyük bileşenler oluşturmak için bir araya getirilebilir.

Bileşenler, Vue'nin bir UI'yi daha küçük parçalara ayırmak amacıyla sağladığı birincil mekanizmadır, hem bakımını geliştirmek hem de kodun yeniden kullanılmasına olanak tanımak için.

Daha fazla bilgi için:
- `Rehber - Bileşen Temelleri`

**Bileşen** kelimesi birkaç başka terimde de geçmektedir:

- `async component`
- `dynamic component`
- `functional component`
- `Web Component`

## composable {#composable}

*Composable* terimi, Vue'daki yaygın bir kullanım desenini tanımlar. Bu, Vue'nun `Composition API` kullanımında yapılan bir özelliktir.

- Composable bir fonksiyondur.
- Composables, durum bilgisi taşıyan mantığı kapsüllemek ve yeniden kullanmak için kullanılır.
- Fonksiyon adı genellikle `use` ile başlar, böylece diğer geliştiriciler bunun bir composable olduğunu bilir.
- Fonksiyon genellikle bir bileşenin `setup()` işlevinin (veya eşdeğer olarak bir `` bloğunun) senkron yürütülmesi sırasında çağrılması beklenir. Bu, composable'ın çağrılmasını mevcut bileşen bağlamına bağlar, örneğin `provide()`, `inject()` veya `onMounted()` gibi çağrılar aracılığıyla.
- Composables tipik olarak bir düz nesne döner, reaktif bir nesne değil. Bu nesne genellikle referanslar ve işlevler içerir ve çağrılan kod içinde dağıtılması beklenir.

Birçok desende olduğu gibi, belirli bir kodun bu etiket için nitelikli olup olmadığı konusunda bazı anlaşmazlıklar olabilir. Tüm JavaScript yardımcı işlevleri composable değildir. Bir fonksiyon Composition API'yi kullanmıyorsa muhtemelen bir composable değildir. `setup()` işlevinin senkron yürütülmesi sırasında çağrılması beklensizse muhtemelen bir composable değildir.

Composables yazmak hakkında daha fazla bilgi için `Rehber - Composables` sayfasına bakabilirsiniz.

## Composition API {#composition-api}

*Composition API*, Vue'da bileşenler ve composables yazmak için kullanılan bir dizi işlevdir.

Bu terim aynı zamanda bileşenleri yazmanın iki ana stilinden birini tanımlamak için kullanılır; diğer stil ise `Options API` olarak adlandırılır. Composition API kullanarak yazılan bileşenler ya `` ya da açık bir `setup()` işlevi kullanır.

Daha fazla bilgi için `Composition API SSS` sayfasına bakabilirsiniz.

## custom element {#custom-element}

*Custom element*, modern tarayıcılarda uygulanan `Web Components` standardının bir özelliğidir. Bu, özel bir HTML öğesini HTML işaretlemesinde kullanma yeteneğini ifade eder ve bu öğeyi sayfadaki o noktada bulundurur.

Vue, özel öğeleri render etme desteği sağlar ve bunların Vue bileşeni şablonlarında doğrudan kullanılmasına olanak tanır.

Daha fazla bilgi için:
- `Rehber - Vue ve Web Bileşenleri`

## directive {#directive}

*Directive* terimi, `v-` öneki ile başlayan şablon niteliklerini veya bunların eşdeğer kısayollarını ifade eder.

Yerleşik direktifler arasında `v-if`, `v-for`, `v-bind`, `v-on` ve `v-slot` bulunur.

Vue ayrıca özel direktifler oluşturmayı destekler, ancak bunlar genellikle yalnızca DOM düğümlerini doğrudan manipüle etmek için bir 'kaçış kapağı' olarak kullanılır. Özel direktifler genellikle yerleşik direktiflerin işlevselliğini yeniden yaratmak için kullanılamaz.

Daha fazla bilgi için:
- `Rehber - Şablon Söz Dizimi - Direktifler`
- `Rehber - Özelleştirilmiş Direktifler`

## dynamic component {#dynamic-component}

*Dynamic component* terimi, hangi alt bileşenin render edileceğine dair kararın dinamik olarak verilmesi gereken durumları tanımlar. Genellikle bu, `` kullanılarak gerçekleştirilir.

Dinamik bir bileşen özel bir bileşen türü değildir. Herhangi bir bileşen dinamik bileşen olarak kullanılabilir. Dinamik olan, bileşenin seçimi olup, bileşenin kendisi değildir.

Daha fazla bilgi için:
- `Rehber - Bileşenler Temelleri - Dinamik Bileşenler`

## effect {#effect}

`Reaktif etkiler` ve `yan etkiler` sayfasına bakınız.

## event {#event}

Bir programın farklı bölümleri arasında iletişim kurmak için olayların kullanımı, birçok programlama alanında yaygındır. Vue içinde, terim genellikle hem yerel HTML element olaylarını hem de Vue bileşeni olaylarını kapsamak için kullanılır. `v-on` direktifi, şablonlarda her iki tür olay için de dinleyici olarak kullanılır.

Daha fazla bilgi için:
- `Rehber - Olay Yönetimi`
- `Rehber - Bileşen Olayları`

## fragment {#fragment}

*Fragment* terimi, diğer VNode'lar için bir üst düğüm olarak kullanılan özel bir `VNode` türünü ifade eder, ancak kendisi herhangi bir unsuru render etmez.

Bu ad, yerel DOM API'sinde [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) benzeri bir kavramdan gelmektedir.

Fragmentler, birden fazla kök düğümü olan bileşenleri desteklemek için kullanılır. Böyle bileşenler birden fazla kök düğüme sahip gibi görünse de, sahne arkasında bir fragment düğümü tek bir kök olarak kullanılır ve 'kök' düğümlerin ebeveyni olarak görev üstlenir.

## functional component {#functional-component}

Bir bileşen tanımı genellikle seçenekleri içeren bir nesnedir. `` kullanıyorsanız, bu şekilde görünmeyebilir, ancak `.vue` dosyasından ihraç edilen bileşen yine de bir nesne olacaktır.

*Functional component*, işlev kullanarak tanımlanan alternatif bir bileşen biçimidir. O işlev, bileşenin `render işlevi` olarak görev yapar.

Fonksiyonel bir bileşenin kendi durumu olamaz. Ayrıca, normal bileşen yaşam döngüsünden geçmez, bu nedenle yaşam döngüsü kancaları kullanılamaz. Bu, onları normal, durum bilgisi taşıyan bileşenlerden daha hafif hale getirir.

Daha fazla bilgi için:
- `Rehber - Render Fonksiyonları & JSX - Fonksiyonel Bileşenler`

## hoisting {#hoisting}

*Hoisting* terimi, bir kod bölümünün diğer kodlardan önce çalıştırılması anlamına gelir. Yürütme, daha önce bir noktaya 'çekilir'.

JavaScript, `var`, `import` ve fonksiyon bildirimleri gibi bazı yapılar için hoisting kullanır.

Vue bağlamında, şablon derleyicisi *statik hoisting* uygulayarak performansı artırır. Bir şablonu render fonksiyonuna dönüştürürken, statik içeriğe karşılık gelen VNode'lar yalnızca bir kez oluşturulabilir ve ardından yeniden kullanılabilir.

Daha fazla bilgi için:
- `Rehber - Render Mekanizması - Statik Hoisting`

## in-DOM template {#in-dom-template}

Bir bileşen için bir şablon belirtmenin çeşitli yolları vardır. Çoğu durumda, şablon bir dize olarak sağlanır.

*In-DOM template* terimi, şablonun bir dize yerine DOM düğümleri şeklinde sağlandığı durumu ifade eder. Vue, ardından DOM düğümlerini `innerHTML` kullanarak bir şablon dizesine dönüştürür.

Daha fazla bilgi için:
- `Rehber - Uygulama Oluşturma - In-DOM Kök Bileşen Şablonu`
- `Rehber - Bileşen Temelleri - in-DOM Şablon Parse Uyarıları`
- `Seçenekler: Render - şablon`

## inject {#inject}

`provide / inject` sayfasına bakınız.

## lifecycle hooks {#lifecycle-hooks}

Bir Vue bileşeninin bir yaşam döngüsü vardır. Örneğin, oluşturulur, monte edilir, güncellenir ve kaldırılır.

*Lifecycle hooks*, bu yaşam döngüsü olaylarını dinlemenin bir yoludur.

Seçenekler API'si ile her bir kanca ayrı bir seçenek olarak sağlanır, örneğin `mounted`. Composition API ise bunun yerine `onMounted()` gibi fonksiyonlar kullanır.

Daha fazla bilgi için:
- `Rehber - Yaşam Döngüsü Kancaları`

## macro {#macro}

`Compiler macro` sayfasına bakınız.

## named slot {#named-slot}

Bir bileşenin, adlandırma ile ayrılan birden fazla slotu olabilir. Varsayılan slot dışındaki slotlara *adlandırılmış slotlar* denir.

Daha fazla bilgi için:
- `Rehber - Slotlar - Adlandırılmış Slotlar`

## Options API {#options-api}

Vue bileşenleri nesneler kullanılarak tanımlanır. Bu bileşen nesnelerinin özelliklerine *seçenekler* denir.

Bileşenler iki stil ile yazılabilir. Bir stil, `setup` ile `Composition API`'yi kullanırken (ya `setup()` seçeneği ya da `` aracılığıyla). Diğer stil, çok az doğrudan Composition API kullanarak, benzer bir sonucu elde etmek için çeşitli bileşen seçeneklerini kullanır. Bu şekilde kullanılan bileşen seçeneklerine *Options API* denir.

Options API, `data()`, `computed`, `methods` ve `created()` gibi seçenekleri içerir.

Daha fazla bilgi için:
- `Rehber - Seçenekler API'si`

## plugin {#plugin}

*Plugin* terimi geniş bir bağlamda kullanılabilir, ancak Vue'nun bir uygulamaya işlevsellik eklemek için spesifik bir kavramı vardır.

Eklentiler, `app.use(plugin)` çağrısı ile bir uygulamaya eklenir. Eklenti ya bir işlev ya da bir `install` işlevine sahip bir nesnedir. Bu işlev, uygulama örneği ile geçilir ve gerekli olan her şeyi yapabilir.

Daha fazla bilgi için:
- `Rehber - Eklentiler`

## prop {#prop}

Vue'da *prop* teriminin üç yaygın kullanımı vardır:

- Bileşen prop'ları
- VNode prop'ları
- Slot prop'ları

*Bileşen prop'ları*, çoğu insanın prop'lar olarak düşündüğü şeylerdir. Bunlar, bir bileşen tarafından ya `defineProps()` ya da `props` seçeneği ile açıkça tanımlanır.

Tüm durumlarda, prop'lar dışarıdan geçilen özelliklerdir.

Daha fazla bilgi için:
- `Rehber - Props`
- `Rehber - Render Fonksiyonları & JSX`
- `Rehber - Slotlar - Scoped Slotlar`

## provide / inject {#provide-inject}

`provide` ve `inject`, bileşenler arası iletişimin bir şeklidir.

Bir bileşen bir değeri *sağladığında*, o bileşenin tüm alt bileşenleri bu değeri almak için `inject` kullanabilir. Prop'ların aksine, sağlayan bileşen tam olarak hangi bileşenin değeri aldığını bilmez.

Daha fazla bilgi için:
- `Rehber - provide / inject`

## reactive effect {#reactive-effect}

*Reaktif etki*, Vue'nun reaktivite sisteminin bir parçasıdır. Bir işlevin bağımlılıklarını takip etme ve o bağımlılıkların değerleri değiştiğinde o işlevi yeniden çalıştırma sürecini ifade eder.

Daha fazla bilgi için:
- `Rehber - Reaktivite Derinliği`

## reactivity {#reactivity}

Genel olarak, *reaktivite*, veri değişikliklerine yanıt olarak otomatik olarak eylemler gerçekleştirme yeteneğini ifade eder. Örneğin, bir veri değeri değiştiğinde DOM'u güncellemek veya bir ağ isteği yapmak.

Reaktivite sistemi ile ilgili detaylar için:
- `Rehber - Reaktivite Temelleri`

## Reactivity API {#reactivity-api}

*Reactivity API*, `reaktivite` ile ilgili temel Vue işlevlerinin bir koleksiyonudur. Bunlar, bileşenlerden bağımsız olarak kullanılabilir.

Daha fazla bilgi için:
- `Reactivity API: Temel`
- `Reactivity API: Araçlar`
- `Reactivity API: İleri Düzey`