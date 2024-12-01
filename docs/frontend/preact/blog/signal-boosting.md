---
title: Signal Güçlendirme
date: 2022-09-24
authors:
  - Joachim Viide
description: Preact Signals'ın yeni sürümü, reaktif sistemin temellerine önemli performans güncellemeleri getiriyor. Bu yazıda, bağımsız olarak kullanılabilen, ancak framework'a özgü bağlayıcılar için temel işlev gören @preact/signals-core paketinin optimizasyon sürecine dair ayrıntılar yer almaktadır.
keywords: [Preact, Signals, reaktif programlama, performans, JavaScript, computed signals, effects]
---

# Signal Güçlendirme

Preact Signals'ın yeni sürümü, reaktif sistemin temellerine önemli performans güncellemeleri getiriyor. Bunu hangi tür numaralarla başardığımızı öğrenmek için okumaya devam edin.

Yakın zamanda Preact Signals paketlerinin yeni sürümlerini [duyurduk](https://twitter.com/jviide/status/1572570215350964224):

 * [@preact/signals-core](https://www.npmjs.com/package/@preact/signals-core) 1.2.0 paylaşılan temel işlevsellik için
 * [@preact/signals](https://www.npmjs.com/package/@preact/signals) 1.1.0 Preact bağlayıcıları için
 * [@preact/signals-react](https://www.npmjs.com/package/@preact/signals-react) 1.1.0 React bağlayıcıları için

:::info
Bu yazı, bağımsız olarak da kullanılabilen, ancak framework'a özgü bağlayıcılar için bir temel işlev gören **@preact/signals-core** paketini optimize etmek için aldığımız adımları özetleyecek.
:::

Signals, Preact ekibinin reaktif programlamaya getirdiği bir bakış açısıdır. Signals'ın ne olduğu ve Preact ile nasıl bağlantılı olduğu hakkında yumuşak bir başlangıç yapmak istiyorsanız, `Signals duyurusunun blog yazısı` tam size göre. Daha derin bir anlayış için `resmi dokümantasyona` göz atın.

Hiçbirinin bizim tarafımızdan icat edilmediğini belirtmek gerekir. Reaktif programlamanın oldukça uzun bir geçmişi var ve JavaScript dünyasında [Vue.js](https://vuejs.org/), [Svelte](https://svelte.dev/), [SolidJS](https://www.solidjs.com/), [RxJS](https://rxjs.dev/) ve ismini veremeyeceğim birçok başka platform tarafından yaygın bir şekilde tanıtılmıştır. Hepsine selam olsun!

---

## Signals Core'un Hızlı Turuna

Öncelikle, **@preact/signals-core** paketindeki temel özelliklere genel bir bakışla başlayalım.

Aşağıdaki kod parçacıkları, paketten içe aktarılan fonksiyonlar kullanmaktadır. Yeni bir fonksiyon karışıma dahil olduğunda, içe aktarma ifadeleri yalnızca o zaman gösterilecektir.

### Signals

Sade _signals_, reaktif sistemimizin temeli olan temel kök değerlerdir. Diğer kütüphaneler bunlara örneğin, "gözlemler" ([MobX](https://mobx.js.org/observable-state.html), [RxJS](https://rxjs.dev/guide/observable)) veya "refs" ([Vue](https://vuejs.org/guide/extras/reactivity-in-depth.html#how-reactivity-works-in-vue)) diyebilir. Preact ekibi, [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) tarafından kullanılan "signal" terimini benimsemiştir.

:::tip
Signals, reaktif bir kabuk içine sarılı rastgele JavaScript değerlerini temsil eder. Bir signal'e başlangıç değeri sağlarsınız ve daha sonra onu okuma ve güncelleme işlemleri yapabilirsiniz.
:::

```js
// --repl
import { signal } from "@preact/signals-core";

const s = signal(0);
console.log(s.value); // Console: 0

s.value = 1;
console.log(s.value); // Console: 1
```

Kendileri başlarına çok ilginç değildirler, iki diğer ilke olan _computed signals_ ve _effects_ ile birleşene kadar.

### Computed Signals

_Computed signals_, diğer signal'lardan yeni değerler türetmek için _compute functions_ kullanır.

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hello");
const s2 = signal("World");

const c = computed(() => {
  return s1.value + " " + s2.value;
});
```

> `computed(...)`'ye verilen compute fonksiyonu hemen çalışmayacaktır. Bunun nedeni computed signals'ların _tembel_ bir şekilde değerlendirilmesidir; yani, değerleri okunduğunda.

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hello");
const s2 = signal("World");

const c = computed(() => {
  return s1.value + " " + s2.value;
});
// --repl-before
console.log(c.value); // Console: Hello World
```

Hesaplanan değerler ayrıca _önbelleğe alınır_. Hesaplama fonksiyonları oldukça maliyetli olabileceğinden, yalnızca önemli olduğunda yeniden çalışmasını isteriz. Çalışan bir compute fonksiyonu, çalışması sırasında gerçekten okunan signal değerlerini izler. Hiçbir değer değişmemişse, yeniden hesaplamayı atlayabiliriz. Yukarıdaki örnekte, `a.value` ve `b.value` aynı kaldığı sürece daha önce hesaplanan `c.value` değerini sonsuza kadar yeniden kullanabiliriz. Bu _bağımlılık izleme_ sürecinin kolaylaştırılması, önce temel değerleri signals içine sarmamızın nedenidir.

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hello");
const s2 = signal("World");

const c = computed(() => {
  return s1.value + " " + s2.value;
});

console.log(c.value); // Console: Hello World
// --repl-before
// s1 ve s2 değişmedi, burada yeniden hesaplama yok
console.log(c.value); // Console: Hello World

s2.value = "darkness my old friend";

// s2 değişti, bu nedenle hesaplama fonksiyonu yeniden çalışır
console.log(c.value); // Console: Hello darkness my old friend
```

Anlaşılan o ki, computed signals kendileri de signals'tır. Bir computed signal, diğer computed signals'a bağımlı olabilir.

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

console.log(quadruple.value); // Console: 4
count.value = 20;
console.log(quadruple.value); // Console: 80
```

Bağımlılık seti statik kalmak zorunda değildir. Computed signal, yalnızca en son bağımlılık setindeki değişikliklere yanıt verir.

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const choice = signal(true);
const funk = signal("Uptown");
const purple = signal("Haze");

const c = computed(() => {
  if (choice.value) {
    console.log(funk.value, "Funk");
  } else {
    console.log("Purple", purple.value);
  }
});
c.value;               // Console: Uptown Funk

purple.value = "Rain"; // purple bağımlılık değil, bu nedenle
c.value;               // etki çalışmaz

choice.value = false;
c.value;               // Console: Purple Rain

funk.value = "Da";     // funk artık bağımlılık değil, bu nedenle
c.value;               // etki çalışmaz
```

Bu üç özellik - bağımlılık izleme, tembellik ve önbellekleme - reaktiflik kütüphanelerinde yaygın özelliklerdir. Vue'nun _computed properties_ ile [bir örnektir](https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j).

### Effects

Computed signals, yan etkisi olmayan [saf fonksiyonlar](https://en.wikipedia.org/wiki/Pure_function) için iyi bir şekilde kullanılır. Ayrıca tembel değillerdir. Peki, signal değerlerindeki değişikliklere sürekli olarak gözlem yapmadan tepki vermek istiyorsak ne yapmalıyız? Etkiler devreye giriyor!

Computed signals gibi, etkiler de bir fonksiyon (_effect function_) ile oluşturulur ve bağımlılıklarını izler. Ancak, tembel değil, etkiler _istekli_ olarak çalışır. Etki fonksiyonu, etki oluşturulduğunda hemen çalıştırılır ve daha sonra bağımlılık değerleri değiştiğinde sürekli olarak tekrar çalıştırılır.

```js
// --repl
import { signal, computed, effect } from "@preact/signals-core";

const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

effect(() => {
  console.log("quadruple is now", quadruple.value);
});               // Console: quadruple value is now 4

count.value = 20; // Console: quadruple value is now 80
```

Bu tepkiler _bildirimler_ tarafından tetiklenir. Bir plain signal değiştiğinde, hemen bağımlılarını bilgilendirir. Bunlar da kendi bağımlılarını bilgilendirir ve böyle devam eder. Reaktif sistemlerde yaygın olarak [görülme](https://mobx.js.org/computeds.html) - computed signals, bildirim yolundaki bir etki yeniden hesaplanması gereken durumda kendilerini eski olarak işaretler. Eğer bildirim bir etkinliğe kadar iletilirse, o zaman bu etki, daha önceden planlanmış tüm etkiler bitene kadar çalıştırılmayı planlar.

:::warning
Bir etkinlik tamamlandığında, etkinlik ilk oluşturulduğunda döndürülen _dispose_ fonksiyonunu çağırın:
:::

```js
// --repl
import { signal, computed, effect } from "@preact/signals-core";
// --repl-before
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

const dispose = effect(() => {
  console.log("quadruple is now", quadruple.value);
});                 // Console: quadruple value is now 4

dispose();
count.value = 20;  // konsola hiçbir şey yazılmaz
```

Diğer fonksiyonlar da mevc, ancak `batch` gibi bu üçü, aşağıdaki uygulama notları için en ilgili olanlardır.

---

# Uygulama Notları

Yukarıdaki ilkelere daha performanslı versiyonlar uygulamaya karar verdiğimizde, aşağıdaki alt görevlerin hepsini çözmenin hızlı yollarını bulmalıyız:

 * Bağımlılık izleme: Kullanılan signals'ları (plain veya computed) takip etmek. Bağımlılıklar dinamik olarak değişebilir.
 * Tembellik: Compute fonksiyonları yalnızca talep üzerine çalışmalıdır.
 * Önbellekleme: Bir computed signal yalnızca bağımlılıklarının değişmiş olabileceği durumlarda yeniden hesaplanmalıdır.
 * İsteklilik: Bir etkideki bir şey değiştiğinde mümkün olan en kısa sürede çalışmalıdır.

Reaktif bir sistem, farklı bir sürü şekilde uygulanabilir. **@preact/signals-core**'un ilk sürümleri Set'ler üzerine kuruluydu, bu nedenle bunu karşılaştırma ve karşıtlık için kullanmaya devam edeceğiz.

### Bağımlılık İzleme

HerCompute/effect fonksiyonu değerlendirmeye başladığında, çalışması sırasında okunan signal'ları yakaladıkları bir yola ihtiyaç duyar. Bunun için computed signal veya etki, kendisini mevcut _değerlendirme bağlamı_ olarak ayarlamaktadır. Bir signal'in `.value` özelliği okunduğunda, bir [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) çağrılır. Getter, değerlendirme bağlamının bir bağımlılığı, _source_, olarak signal'i ekler. Bağlam ayrıca signal'in bir bağımlısı, _target_, olarak eklenir.

Sonuç olarak signals ve etkiler, her zaman bağımlılıkları ve bağımlılarını güncel bir şekilde görürler. Her signal, değerinin değiştiğinde bağımlılarını bilgilendirebilir. Etkiler ve computed signals, bir etkinliğin ortadan kaldırıldığı durumlarda bildirimlerden çıkarılmak için bağımlılık setlerine atıfta bulunabilir.



Aynı signal, aynı değerlendirme bağlamı içinde birden fazla kez okunabilir. Bu durumlarda bağımlılık ve bağımlı girişleri için bir tür deduplikasyon yapmak faydalı olacaktır. Ayrıca değişen bağımlılık setlerini ele alacak bir yolu da gereklidir: her çalıştırmadan sonra bağımlılık setini yeniden inşa etmek veya bağımlılıkları/bağımlıları aşamalı olarak ekleyip çıkarmak.

JavaScript'in [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) nesneleri tüm bunlar için iyi bir seçimdir. Birçok diğer uygulama gibi, Preact Signals'ın orijinal sürümü de bunu kullandı. Set'ler, [sabit O(1) zaman](https://en.wikipedia.org/wiki/Time_complexity#Constant_time) (amortize) içinde öğeleri eklemeye _ve_ kaldırmaya izin verirken, mevcut öğeleri [lineer O(n) zaman](https://en.wikipedia.org/wiki/Time_complexity#Linear_time) ile döngü içine almayı sağlar. Ayrıca, tekrar eden öğeleri otomatik olarak yönetir! Reaktif sistemlerin Set'lerden (veya [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)) faydalanmasının sebebi de budur; iş için doğru araç.

:::note
Ancak bazı alternatif yaklaşımlar bulup bulamayacağımızı merak ediyorduk. Set'lerin oluşturulması görece pahalı olabilir ve en azından computed signals, bağımlılar ve bağımlılıklar için iki ayrı Set gerektirebilir. Jason, muhtemelen [benchmarked](https://esbench.com/bench/6317fc2a6c89f600a5701bc9) toplamdan biraz daha fazla sürede Set döngüsünün Array'lerin verimliliğini nasıl etkilediğini test etti. Çok fazla döngü yapacağımız için bu önemli bir mesele.
:::



Set'ler, eklenme sırasına göre döngüye alınır. Bu harika - çünkü daha sonra önbellekleme işlemleriyle ilgili durumlarda bu ihtiyacımız olan şeydir. Ancak, sıralamanın her zaman aynı kalmayacağı olasılığı vardır. Aşağıdaki senaryoya bakın:

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const s1 = signal(0);
const s2 = signal(0);
const s3 = signal(0);

const c = computed(() => {
  if (s1.value) {
    s2.value;
    s3.value;
  } else {
    s3.value;
    s2.value;
  }
});
```

`s1`'e bağlı olarak, bağımlılıkların sırası ya `s1, s2, s3` ya da `s1, s3, s2` olabilir. Set'lerin sıralı tutulması için özel adımlar atılmalıdır: ya öğeleri kaldırıp tekrar eklemek, ya bir fonksiyon çalıştırılmadan önce seti boşaltmak ya da her çalıştırma için yeni bir set oluşturmak. Her yaklaşımın bellek döngüsüne neden olma potansiyeli vardır. Ve bunun hepsi, bağımlılıkların sırasının değişebileceği teorik ama muhtemelen nadir durumu hesaba katmak içindir.

Bununla başa çıkmanın birden fazla yolu vardır. Örneğin, bağımlılıkları numaralandırarak ve sonra sıralayarak. Nihayetinde [bağlantılı listeleri](https://en.wikipedia.org/wiki/Linked_list) araştırmaya yöneldik.

### Bağlantılı Listeler

Bağlantılı listeler genellikle oldukça ilkel olarak kabul edilir, ancak amacımız için çok hoş özelliklere sahiptirler. Eğer çift yönlü bir bağlantılı liste düğmeleri oluşturursanız, aşağıdaki işlemler son derece ucuz olabilir:

 * Bir öğeyi listenin bir ucuna O(1) zaman diliminde eklemek.
 * Bir düğümü (zaten bir işaretçiye sahipseniz) liste içerisindeki herhangi bir yerden O(1) zaman diliminde kaldırmak.
 * Listeyi O(n) zaman diliminde (her düğüm için O(1)) döngüye almak.

Görünüşe göre bu işlemler, bağımlılıklar/b bağımlıları yönetmek için ihtiyacımız olan tüm şeylerdir.

Her bağımlılık ilişkisinin "kaynak Düğümleri" oluşturduğumuzda başlayalım. Düğümün `source` niteliği, üzerine bağımlı olunan sinyale işaret eder. Her Düğüm, bağımlılık listesindeki bir sonraki ve önceki kaynak Düğümlerine işaret eden `nextSource` ve `prevSource` özelliklerine sahiptir. Etkiler veya computed signals, ilk düğüme işaret eden bir `sources` niteliğine sahiptir. Artık bağımlılıkların üzerinde döngü yapabilir, yeni bir bağımlılık ekleyebilir ve listeyi yeniden sıralamak için bağımlılıkları kaldırabiliriz.



Şimdi aynı işlemi diğer yönde yapalım: Her bağımlı için bir "target Node" oluştur. Düğümün `target` niteliği, bağımlı etki veya computed signal'e işaret eder. `nextTarget` ve `prevTarget`, çift yönlü bir bağlantılı liste oluşturur. Plain ve computed signal, bağımlı listelerinde ilk hedef Düğümüne işaret eden bir `targets` niteliğine sahiptir.



Ama hey, bağımlılıklar ve bağımlılar çiftler halinde gelir. Her kaynak Düğümü için **mutlaka** eşleşen bir hedef Düğüm olmalıdır. Bu gerçeği kullanabiliriz ve "kaynak Düğüm" ve "hedef Düğüm" kavramlarını yalnızca "Düğümler" olarak birleştirebiliriz. Her Düğüm, bağımsızın bağımlılık listesinin bir parçası olarak kullanabileceği bir tür dört yönlü canavara dönüşür.



Her Düğüm, bela kayıt işlemleri için ek malzemelerle birleştirilebilir. Her compute/effect fonksiyonu öncesinde önceki bağımlılıkları döneriz ve her Düğümün "unused" bayrağını ayarlarız. Ayrıca, daha sonra kullanmak üzere Düğümü `.source.node` niteliğine geçici olarak kaydederiz. Fonksiyon çalışmaya başlayabilir.

Çalışma sırasında, her bağımlılık okunduğunda kayıt değerleri kullanılarak, o bağımlılığın bu veya önceki çalışmada daha önce görülüp görülmediği keşfedilebilir. Eğer bağımlılık önceki çalışmadan geliyorsa, Düğümünü geri dönüş yoluyla kullanabiliriz. Daha önceki görülmemiş bağımlılıkları ise yeni Düğümler oluştururuz. Düğümler, kullanıma göre ters sırada tutmak için karıştırılır. Çalışmanın sonunda, bağımlılık listesini tekrar dolaşarak, "unused" bayrağı ayarlanmış olan Düğümleri ortadan kaldırırız. Ardından, kalan düğümlerin listesini ters çeviririz, böylece daha sonra tüketim için düzenli hale gelir.

Bu ölümcül dans, her bağımlılık-bağımlı çifti için yalnızca bir Düğüm ayırmamıza ve bu Düğümü bağımlılık ilişkisi sürdüğü sürece sonsuz olarak kullanmamıza olanak tanır. Eğer bağımlılık ağacı durgun kalırsa, bellek tüketimi de etkili bir şekilde başlangıç inşa aşamasından sonra sabit kalır. Bu arada bağımlılık listeleri güncel ve kullanıma göre sırada kalmaya devam eder. Her Düğüm için sabit O(1) çalışma süresi ile. Harika!

### İstekli Etkiler

Bağımlılık izleme halledildiği için, istekli etkileri uygulamak, değişiklik bildirimleri ile göreceli olarak kolaydır. Signals, bağımlılarını değer değişiklikleri hakkında bilgilendirir. Eğer bağımlı kendisi bağımlılara sahip bir computed signal ise, o zaman bildirim iletmeye devam eder. Bildirim alan etkiler, kendilerini çalıştırılmayı planlar.

Bu noktada birkaç optimizasyon ekledik. Eğer bir bildirimin alındığı noktada, önceki bir bildirim aldıysa ve henüz çalıştırma imkanı bulamamışsa, bildirim iletmez. Bu, bağımlılık ağacının açıldığında veya kapandığında ardışık bildirim stampede'lerini önler. Ayrıca, plain signals, eğer sinyalin değeri gerçekten değişmiyorsa (örneğin, `s.value = s.value`), bağımlılarını bilgilendirmez. Ama bu sadece nazik olmak.

Etkilerin kendilerini planlayabilmesi için bir tür planlanmış etkilerin listesinin olması gerekir. Her Etki örneğine, Etki örnekleri tek bağlı sıralama listesindeki düğn olarak da görev yapmasını sağlamak için özel bir niteliğe `.nextBatchedEffect` ekledik. Bu, bellek döngüsünü azaltır çünkü aynı etkiye tekrar tekrar planlanmak, ek bellek tahsis veya serbest bırakma gerektirmez.

### Ara: Bildirim Abonelikleri vs. GC

Tamamen doğru konuşmadık. Computed signals aslında bağımlılıklarından _her zaman_ bildirim almaz. Bir computed signal, bilgisini dinleyen bir şey varsa, bağımlılık bildirimlerine abone olur. Bu, şu gibi durumlarda problemleri önler:

```js
const s = signal(0);

{
  const c = computed(() => s.value)
}
// c kapsamdan çıktı
```

Eğer `c`, her zaman `s`'den bildirimlere abone olursa, `c`'nin çöp toplayıcı tarafından yok edilemeyeceği, `s` de kapsam dışına çıkene kadar tutulması gerekeceği anlamına gelir. Çünkü, `s`, `c`'ye bir referans tutmaya devam edecektir.

:::danger
Bu sorunu çözmenin birden fazla yolu vardır, örneğin [WeakRefs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) kullanmak veya computed signals'ın manuel olarak serbest bırakılmasını gerektirmek. Bizim durumumuzda, bağlantılı listeler, tüm bu O(1) işlemlerle, bağımlılık bildirimlerine dinamik olarak abone olma ve abonelikten çıkarma imkanı sağladığı için çok uygun bir yol sağlıyor. Nihai sonuç, sarkintı computed signal referanslarına özel bir dikkat etmeniz gerekmediğidir. Bunun en ergonomik ve verimli yaklaşım olduğunu hissettik.
:::

---
title: Tembel & Önbellekli Hesaplanan İşaretler
description: Bu makalede, tembel hesaplanan işaretlerin nasıl çalıştığı, önbellekleme ve bağımlılık takibi konuları ele alındı. Verimlilik artırma yöntemlerine dair önemli bilgilere yer veriliyor.
keywords: [hesaplanan işaretler, önbellekleme, bağımlılık takibi, verimlilik, programlama]
---

### Tembel & Önbellekli Hesaplanan İşaretler

Tembel bir hesaplanan işareti uygulamanın en kolay yolu, değeri her okunduğunda yeniden hesaplamaktır. Ancak, bu çok verimli olmaz. İşte burada önbellekleme ve bağımlılık takibi büyük bir yardımcıdır.

Her düz ve hesaplanan işaretin kendi _sürüm numarası_ vardır. Kendi değerlerinin değiştiğini her fark ettiklerinde sürüm numaralarını artırırlar. 

:::info
Bir hesaplama fonksiyonu çalıştırıldığında, bağımlılıklarının en son görülen sürüm numaralarını Düğümlere kaydeder.
:::

Önceki bağımlılık değerlerini yerine sürüm numaralarını Düğümlerde saklamayı seçebilirdik. Ancak, hesaplanan işaretler tembel olduğu için, geçersiz ve muhtemelen pahalı değerleri sonsuza kadar tutabilirlerdi. Bu nedenle, sürüm numaralandırmasının güvenli bir uzlaşma olduğunu düşündük.

Hesaplanan bir işaretin gününü geçirebileceği ve önbellek değerini yeniden kullanabileceği zamanı belirlemek için aşağıdaki algoritma ile sonuçlandık:

1. Eğer en son çalıştırmadan bu yana hiçbir işaretin değeri değişmediyse, o zaman çık ve önbellek değerini döndür.

> Her düz işaret değiştiğinde, tüm düz işaretler arasında paylaşılan _küresel sürüm numarasını_ da artırır. Her hesaplanan işaret, gördükleri en son küresel sürüm numarasını takip eder. Eğer küresel sürüm geçen hesaplamadan beri değişmediyse, o zaman yeniden hesaplama erken atlanabilir. O durumda herhangi bir hesaplanan değerde bir değişiklik olmayacaktır.

2. Eğer hesaplanan işaret, bildirimleri dinliyorsa ve en son çalıştırmadan bu yana bildirim almadıysa, o zaman çık ve önbellek değerini döndür.

> Bir hesaplanan işaret, bağımlılıklarından bir bildirim aldığında, önbellek değerini geçersiz olarak işaretler. Daha önce belirtildiği gibi, hesaplanan işaretler her zaman bildirim almaz. Ancak aldıklarında, bundan yararlanabiliriz.

3. Bağımlılıkları sırayla yeniden değerlendirin. Sürüm numaralarını kontrol edin. Eğer hiçbir bağımlılık sürüm numarasını değiştirmediyse, yeniden değerlendirmeden sonra bile, o zaman çık ve önbellek değerini döndür.

> Bu adım, bağımlılıkları kullandıkları sırada tutmak için özel bir sevgi ve özen göstermemizin nedenidir. Eğer bir bağımlılık değişirse, o zaman listede daha sonraki bağımlılıkları yeniden değerlendirmek istemiyoruz çünkü bu sadece gereksiz bir iş olabilir. Kim bilir, belki de ilk bağımlılıktaki değişiklik, sonraki hesaplama fonksiyonu çalıştırıldığında son bağımlılıkların atlanmasına neden olur.

4. Hesaplama fonksiyonunu çalıştırın. Eğer dönen değer önbellek değerinden farklıysa, o zaman hesaplanan işaretin sürüm numarasını artırın. Yeni değeri önbelleğe alıp döndürün.

> Bu son çare! Ancak en azından yeni değer, önbellek değeriyle eşitse, o zaman sürüm numarası değişmeyecek ve aşağıdaki bağımlılıklar bunu kendi önbellekleme optimizasyonları için kullanabilecektir.

Son iki adım genellikle bağımlılıkların içine doğru tekrarlar. Bu nedenle, önceki adımlar tekrarları kısa devre yapmayı hedefleyecek şekilde tasarlanmıştır.

---

# Oyun Sonu

Tipik Preact tarzında, yol boyunca atılmış birçok küçük optimizasyon vardı. [Kaynak kod](https://github.com/preactjs/signals/tree/main/packages/core/src) bazı faydalı olabilecek yorumlar içermektedir. 

:::note
Uygulamamızın sağlam olmasını sağlamak için neler türünde köşe vakaları bulduğumuzu merak ediyorsanız, [testlere](https://github.com/preactjs/signals/tree/main/packages/core/test) göz atın.
:::

Bu gönderi bir tür beyin dökümüydü. **@preact/signals-core** sürüm 1.2.0'ı daha iyi hale getirmek için aldığımız ana adımları özetledi - "daha iyi" tanımına göre. Umarım buradaki bazı fikirler yankı bulur ve başkaları tarafından yeniden kullanılabilir ve harmanlanabilir. En azından hayal bu!

Katkıda bulunan herkese büyük teşekkürler. Ve buraya kadar okuduğunuz için teşekkürler! Güzel bir yolculuktu.