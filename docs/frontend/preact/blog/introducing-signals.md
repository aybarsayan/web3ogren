---
title: Sinyalları Tanıtma
date: 2022-09-06
authors:
  - Marvin Hagemeister
  - Jason Miller
description: Sinyaller, uygulamaların karmaşıklığından bağımsız olarak durum güncellemelerini hızlandıran bir yöntemdir. Bu belge, sinyallerin nasıl çalıştığını, hangi sorunları çözdüğünü ve Preact ile entegrasyonunu detaylandırmaktadır.
keywords: [sinyaller, Preact, durum yönetimi, geliştirme, performans]
---

# Sinyalları Tanıtma

Sinyaller, uygulamaların ne kadar karmaşık hale gelirse gelsin hızlı kalmasını sağlayan bir durum ifade etme yoludur. Sinyaller reaktif ilkelere dayanır ve sanal DOM için optimize edilmiş benzersiz bir uygulama ile mükemmel geliştirici ergonomisi sağlar.

:::tip
**İpucu:** Sinyaller, bileşenlerin otomatik güncellenmesini sağlarken, durum güncellemelerinin hızlı kalmasını da garanti eder.
:::

Bir sinyalin özünde, bazı değerleri tutan `.value` özelliğine sahip bir nesne vardır. Bir bileşenin içinden bir sinyalin değer özelliğine erişmek, o sinyalin değeri değiştiğinde otomatik olarak o bileşeni günceller.

Son derece basit ve yazılması kolay olmasının yanı sıra, bu durum uygulamanızın kaç bileşene sahip olduğuna bakılmaksızın durum güncellemelerinin hızlı kalmasını da sağlar. Sinyaller varsayılan olarak hızlıdır ve arka planda güncellemeleri otomatik olarak optimize eder.

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal, computed } from "@preact/signals";
 
const count = signal(0);
const double = computed(() => count.value * 2);
 
function Counter() {
  return (
    <button onClick={() => count.value++}>
      {count} x 2 = {double}
    </button>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Sinyaller, kancalardan farklı olarak, bileşenlerin içinde veya dışında kullanılabilir. Sinyaller ayrıca hem kancalar **_hem de_** sınıf bileşenleri ile harika çalışır, böylece onları kendi hızınızda tanıtabileceğiniz gibi mevcut bilginizi de birlikte getirebilirsiniz. Birkaç bileşende deneyin ve zamanla benimseyin.

:::info
Sinyallerin arka planda otomatik optimizasyon yapması, geliştiricilerin performans sorunlarıyla daha az karşılaşmasını sağlar.
:::

Bu arada, sizin için olabildiğince küçük kütüphaneler sunma geleneğimize sadık kalıyoruz. Preact'te sinyalleri kullanmak, paket boyutunu sadece **1.6kB** artırır.

Hızlı bir başlangıç yapmak istiyorsanız, sinyaller hakkında daha derinlemesine bilgi edinmek için `belgelerimize` göz atın.

## Hangi sorunlar sinyalleri çözüyor?

Son yıllarda, küçük startuplardan, aynı anda yüzlerce geliştiricinin katkıda bulunduğu monolitlere kadar geniş bir uygulama yelpazesi ve ekipleri üzerinde çalıştık. Bu süreçte, çekirdek ekipteki herkes uygulama durumunun yönetimindeki tekrar eden sorunları fark etti.

> "Manuel entegrasyon gerektiren çözümler, geliştiricilerde benimseme isteksizliği oluşturabiliyor." — Marvin Hagemeister

Bu sorunları çözmeye yönelik harika çözümler yaratıldı, ancak en iyi çözümler bile, çerçeveye manuel entegrasyon gerektiriyor. Sonuç olarak, bu çözümleri benimseme konusunda geliştiricilerden isteksizlik gördük; bunun yerine çerçeve tarafından sağlanan durum ilkelere dayanarak inşa etmeyi tercih ettiler.

:::note
Sinyalları, optimal performans ve geliştirici ergonomisini sorunsuz çerçeve entegrasyonu ile birleştiren ikna edici bir çözüm olarak inşa ettik.
:::

## Küresel durum mücadelesi

Uygulama durumu genellikle küçük ve basit başlar, belki birkaç basit `useState` kancasını içerir. Bir uygulama büyüdükçe ve daha fazla bileşen aynı durum parçasına erişmek zorunda kaldığında, o durum en sonunda ortak bir üst bileşene taşınır. Bu desen, durumun büyük çoğunluğunun bileşen ağacının köküne yakın bir yere yerleşene kadar birden çok kez tekrarlanır.



Bu senaryo, durum geçersizliği nedeniyle etkilenen tüm ağacı güncellemesi gereken geleneksel sanal DOM tabanlı çerçeveler için bir zorluk teşkil etmektedir. Temelde, render performansı bu ağaçtaki bileşen sayısının bir fonksiyonudur. Bunu, çerçevenin aynı nesneleri almasını sağlamak için `memo` veya `useMemo` kullanarak bileşen ağacının bazı bölümlerini hafızaya alarak aşabiliriz. Hiçbir şey değişmediğinde, bu çerçevenin ağacın bazı bölümlerinin render edilmesini atlamasını sağlar.

Teorik olarak makul göründüğü halde, gerçeklik genellikle çok daha karmaşıktır. Pratikte, kod tabanları büyüdükçe bu optimizasyonların nerelere yerleştirileceğini belirlemek zorlaşır. Sıklıkla, iyi niyetle yapılan hafızalama bile, dengesiz bağımlılık değerleri tarafından etkisiz hale gelir. Kancaların analiz edilebilecek açık bir bağımlılık ağacı olmadığından, araçlar geliştiricilerin **_neden_** bağımlılıkların dengesiz olduğunu teşhis etmelerine yardımcı olamaz.

## Bağlam kaosu

Ekiplerin durum paylaşımı için başvurduğu bir diğer yaygın çözüm, durumu bağlam içine yerleştirmektir. Bu, bağlam sağlayıcısı ile tüketicileri arasında render atlamaya olanak tanır. Ancak burada bir tuzak vardır: yalnızca bağlam sağlayıcısına geçirilen değer güncellenebilir ve yalnızca bir bütün olarak. Bağlam üzerinden sergilenen bir nesnenin özelliğini güncellemek, o bağlamın tüketicilerini güncellemiyor - ayrıntılı güncellemeler mümkün değildir. Bununla baş etmenin mevcut seçenekleri, durumu birden fazla bağlama bölmek veya özelliklerinden herhangi biri değiştiğinde bağlam nesnesini kopyalayarak aşırı geçersiz kılmaktır.


Değerleri bağlama yerleştirmek ilk başta değerli bir takas gibi görünse de, sonuçta değerleri paylaşmak için bileşen ağacı boyutunun artmasının olumsuz etkileri sorun haline gelir. İş mantığı kaçınılmaz olarak birden fazla bağlam değerine bağlı hale gelir, bu da onu ağacın belirli bir yerinde uygulanmaya zorlar. Ağacın ortasında bağlama abone olan bir bileşen eklemek maliyetlidir, çünkü bağlamı güncellerken atlanabilecek bileşen sayısını azaltır. Dahası, abonenin altındaki bileşenlerin şimdi yeniden render edilmesi gerekir. Bu sorunun tek çözümü aşırı hafızalama kullanımıdır, bu da bizi hafızalama ile ilişkili sorunlara geri getirir.

## Durumu yönetmenin daha iyi bir yolunu ararken

Bir sonraki nesil durum ilkesinin peşinde, taslak kağıdına geri döndük. Mevcut çözümdeki sorunları aynı anda ele alacak bir şey oluşturmak istedik. Manuel çerçeve entegrasyonu, aşırı hata bellekleme, bağlamın altoptimal kullanımı ve programatik gözlemlenebilirlik eksikliği geride kaldı.

:::warning
Dikkat: Geliştiricilerin bu stratejilerle performansa "katılması" gerekebilir.
:::

Peki, bu durumu tersine çevirip varsayılan olarak **hızlı** bir sistem sağlayabilir miydik? 

Bu soruların yanıtı Sinyaller. Bu, hafızalama veya uygulamanız boyunca numaralara ihtiyaç duymadan varsayılan olarak hızlı bir sistemdir. Sinyaller, bu durumun küresel, props veya bağlam aracılığıyla geçirilmiş ya da bileşene özgü olup olmadığına bakılmaksızın ince-granüllü durum güncellemeleri sağlayan faydaları sunar.

## Sinyaller ile geleceğe

Sinyallerin arkasındaki ana fikir, bir değeri bileşen ağacı boyunca doğrudan geçmek yerine, değeri içeren bir sinyal nesnesi geçmektir (bir `ref`'e benzer). Bir sinyalin değeri değiştiğinde, sinyalin kendisi aynı kalır. Sonuçta, sinyalleri geçtikleri bileşenleri yeniden render etmeden güncelleyebiliriz, çünkü bileşenler sinyali ve değerini görmez. Bu, bileşenleri render etmenin pahalı işlemlerini atlamamıza ve aslında sinyalin değerine erişen ağaçtaki belirli bileşenlere hemen geçmemizi sağlar.


Bir uygulamanın durum grafiğinin genellikle bileşen ağacından çok daha sığ olduğunu kullanıyoruz. Bu, durumu güncellemek için gereken iş yükünün çok daha az olduğu için daha hızlı render sağlar. Bu fark, tarayıcıda ölçüldüğünde en belirgindir - aşağıdaki ekran görüntüsü, aynı uygulamanın iki kez ölçülen DevTools Profiler izini gösterir: bir kez durum primi olarak kancaları kullanırken ve ikinci kez sinyaller kullanırken:


Sinyalleri kullanmanın yolu, herhangi bir geleneksel sanal DOM tabanlı çerçevenin güncelleme mekanizmasını açıkça geride bırakmaktadır. Test ettiğimiz bazı uygulamalarda, sinyaller o kadar hızlıdır ki, alev grafiğinde onları bulmak zorlaşır.

Sinyaller performans ölçümünü tersine çeviriyor: hafızalama veya seçimciler aracılığıyla performansa katılmak yerine, sinyaller varsayılan olarak hızlıdır. Sinyallerle performans, (sinyal kullanılmadığında) dışlama ile elde edilir.

:::danger
Kritik Uyarı: Bu seviyede performansı elde etmek için sinyaller, belirli ilkelere dayanarak inşa edilmiştir.
:::

* **Varsayılan olarak tembel:** Şu anda bir yerde kullanılan sinyaller gözlemlenir ve güncellenir - bağlantısı kesik sinyaller performansı etkilemez.
* **Optimal güncellemeler:** Bir sinyalin değeri değişmediyse, o sinyalin değerini kullanan bileşenler ve etkiler güncellenmez, sinyalin bağımlılıkları değişse bile.
* **Optimal bağımlılık takibi:** Çerçeve, her şeyin hangi sinyallere bağımlı olduğunu sizin için takip eder - kancalarda olduğu gibi bağımlılık dizileri yoktur.
* **Doğrudan erişim:** Bir bileşende bir sinyalin değerine erişmek, güncellemeleri otomatik olarak abone edersiniz, seçimcilere veya kancalara gerek yoktur.

Bu ilkeler, sinyallerin kullanıcı arayüzlerini render etmekle ilgili olmayan senaryolar da dahil olmak üzere geniş bir kullanım yelpazesi için uygun olmasına olanak tanır.

## Sinyalleri Preact'e getirmek

Doğru durum ilkesini belirledikten sonra, bunu Preact'e uyarlamak için çalışmalara başladık. Kancalar hakkında her zaman sevdiğimiz şey, bunların doğrudan bileşenler içinde kullanılabilmesidir. Bu, genellikle "seçici" fonksiyonlar veya durumu güncellemek için özel bir fonksiyonu sararak abone olmaya dayalı üçüncü taraf durum yönetim çözümlerine göre bir ergonomik avantajdır.

```js
// Seçici tabanlı abonelik :(
function Counter() {
  const value = useSelector(state => state.count);
  // ...
}
 
// Sarıcı fonksiyon tabanlı abonelik :(
const counterState = new Counter();
 
const Counter = observe(props => {
  const value = counterState.count;
  // ...
});
```

Hiçbir yaklaşım bizim için tatmin edici hissettirmedi. Seçici yaklaşım, tüm durum erişimini bir seçimci içine sarmayı gerektirir ki bu, karmaşık veya iç içe geçmiş durumlar için can sıkıcı hale gelir. Bileşenleri bir işlevin içine sarmak, bileşenleri sarmak için manuel çaba gerektirir ki bu da kaybolan bileşen adları ve statik özellikler gibi bir dizi sorun getirir.

:::
:::info
**Ekstra Bilgi:** Seçiciler ve sarıcılar gibi kavramların öğrenilmesi, geliştiricilere ek bir yük getirebilir.
:::

Son birkaç yıl içinde pek çok geliştirici ile yakın çalışmak fırsatına sahip olduk. Özellikle (p)react'e yeni olanlar için, seçiciler ve sarıcılar gibi kavramların her durum yönetim çözümünde verimli hissetmeye başlamadan önce öğrenilmesi gereken ek kavramlar olduğu sık görülen bir mücadeledir.

İdeal olarak, seçiciler veya sarıcı fonksiyonlar hakkında bilgi sahibi olmayı gerektirmeden duruma bileşenler içinde doğrudan erişebilmek isteriz:

```jsx
// Bunu tüm uygulamanın erişmesi gereken bazı küresel bir durum olarak düşünün:
let count = 0;
 
function Counter() {
 return (
   <button onClick={() => count++}>
     değer: {count}
   </button>
 );
}
```

Kod açık ve ne olduğunun anlaşılması kolaydır, ancak ne yazık ki bu çalışmaz. Butona tıkladığınızda bileşen güncellenmez çünkü `count`'ın değiştiğini bilmenin yolu yoktur.

Bu senaryoyu kafamızdan çıkaramadık. Bu kadar açık bir modeli gerçeğe dönüştürmek için ne yapabilirdik? Farklı fikirler ve uygulamalar denemeye başladık ve Preact'in `takılabilir renderleyicisinden` faydalandık. Zaman aldı, ancak sonunda bunu gerçekleştirmenin bir yolunu bulduk:

```jsx
// --repl
import { render } from "preact";
import { signal } from "@preact/signals";
// --repl-before
// Bunu tüm uygulamanın erişmesi gereken bazı küresel bir durum olarak düşünün:
const count = signal(0);
 
function Counter() {
 return (
   <button onClick={() => count.value++}>
     Değer: {count.value}
   </button>
 );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Seçiciler, sarıcı fonksiyonlar, hiçbir şey yok. Sinyalin değerine erişmek, bileşenin o sinyalin değeri değiştiğinde güncellenmesi gerektiğini bilmesi için yeterlidir. Birkaç uygulamada prototipi denedikten sonra, bir şeyin yolda olduğunu görmek netti. Bu şekilde kod yazmak sezgisel hissettirdi ve sürecin optimal kalmasını sağlamak için zihinsel jimnastik gerektirmedi.

## Daha da hızlı gidebilir miyiz?

Burada durabilirdik ve sinyalleri olduğu gibi yayınlayabilirdik, ancak bu Preact ekibi: Preact entegrasyonunu ne kadar ileriye götürebileceğimizi görmek gerekiyordu. Yukarıdaki Counter örneğinde, `count` değerinin yalnızca metin göstermek için kullanıldığı, bu durumun tam bir bileşenin yeniden render edilmesini gerektirmediği bir durum var. Sinyalin değeri değiştiğinde bileşeni otomatik olarak yeniden render etmek yerine, metni yalnızca yeniden render etsek? Daha iyisi, sanal DOM'u tamamen atlayıp metni doğrudan DOM'da güncelleyebilir miydik?

```jsx
const count = signal(0);
 
// Bunun yerine:
<p>Değer: {count.value}</p>
 
// … sinyali doğrudan JSX'e geçebiliriz:
<p>Değer: {count}</p>
 
// … ya da DOM özellikleri olarak geçebiliriz:
<input value={count} onInput={...} />
```

Evet, bunu da yaptık. Bir sinyali, genelde bir dize kullandığınız her yere doğrudan JSX'e geçirebilirsiniz. Sinyalin değeri metin olarak render edilir ve değiştiğinde otomatik olarak kendini günceller. Bu, özellikler için de geçerlidir.

## Sonraki Adımlar

Eğer meraklıysanız ve hızlı bir başlangıç yapmak istiyorsanız, sinyaller için `belgelerimize` göz atın. Onları nasıl kullanacağınıza dair geri bildirimlerinizi duymayı çok isteriz.

:::note
Sinyallara geçmek için acele etmenin gerekli olmadığını unutmayın. Kancalar, desteklenmeye devam edecek ve sinyallerle de harika çalışıyor! Öncelikle birkaç bileşenle denemeler yaparak sinyalleri yavaş yavaş denemenizi öneriyoruz.
:::