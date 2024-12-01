---
title: Preact X, bir istikrar hikayesi
date: 2024-05-24
authors:
  - Jovi De Croock
description: Preact X, önemli geliştirmeler ve sürdürülebilir pürüzsüz geçişler ile kullanıcı deneyimini güçlendiren bir ekosistem değişikliğidir. Bu yazıda, Preact 11 öncesinde yapılan değişiklikler ve geliştirmeler hakkında bilgi verilmektedir.
keywords: [Preact, Preact X, sürüm, geliştirme, kullanıcı deneyimi]
---

# Preact X, bir istikrar hikayesi

Birçok kişi [Preact 11](https://github.com/preactjs/preact/issues/2621) için uzun zamandır bekliyordu, bu satış duyurusu Temmuz 2020'de açılan bir soruda yapıldı ve v11 için en heyecanlı kişilerden biri olduğumu belirtmek isterim. Preact 11 üzerinde düşünmeye başladığımızda, aklımızda olan değişiklikleri Preact X'te tanıtmanın bir yolunun olmadığını düşündük. Aklımızda olan bazı şeyler:

- GC'yi azaltmak için bir destek VNode yapısı kullanmak, böylece `h()`'nin sonucunu yalnızca destek düğümümüzü güncellemek için kullanacağız.
- Dağıtıcı performansı, montaj / sökme vb. için optimize edilmiş yolları sağlamak.
- `px` ekini kaldırmak, `forwardRef` ve IE11 desteğini kesmek gibi bazı değişiklikler.
- Props içinde ref'i korumak.
- Olay / çocuk farklandırma hatalarını ele almak.

:::tip
**Not**: Bu noktada, yukarıda belirtilen değişikliklerin çoğu başlangıç hedeflerimiz olarak belirlendi.
:::

Bunlar v11 için başlangıç hedeflerimizdi, ancak bu yola çıktığımızda, bu değişikliklerin çoğunun aslında kırıcı değişiklikler olmadığını ve doğrudan v10'da kırılmayan bir şekilde yayınlanabileceğini fark ettik. Sadece üçüncü nokta, `px` ekini kaldırmak ve `ref`'i doğrudan props içinde geçmek ve IE11'den vazgeçmek kırıcı değişiklikler kategorisine giriyor. Diğer özellikleri kararlı v10 sürüm hattında yayınlamayı seçtik, bu da herhangi bir Preact kullanıcısının kodlarını değiştirmeden bunlardan hemen faydalanabilmesine olanak tanıyor.

Preact, v11 için ilk planlarımızı yaptığımız zamandan çok daha büyük bir kullanıcı tabanına sahip. Birçok küçük ve büyük şirket için kritik yazılımlarda yaygın kullanım görüyor. Tanıtabileceğimiz herhangi bir kırıcı değişikliğin ekosistemi tamamen geçirmeye değer olduğundan emin olmak istiyoruz.

[Deneysel çalışmalar](https://github.com/preactjs/preact/tree/v11) yaparken yeni bir tür farklandırma olan [eğik tabanlı farklılaştırma](https://github.com/preactjs/preact/pull/3388)'ya geçtik, gerçek performans iyileştirmeleri gördük ve uzun süredir devam eden birçok hatayı düzelttik. Zaman geçtikçe ve Preact 11 için bu deneylere daha fazla zaman yatırdıkça, elde ettiğimiz iyileştirmelerin yalnızca Preact 11'e özgü olmadığını fark ettik.

---

## Sürümler

Yukarıda bahsedilen Preact 11 sorusundan bu yana 18 (!!) küçük sürüm Preact X'te yayımlandı. Bunların birçoğu, Preact 11'de yapılan çalışmalardan doğrudan ilham almıştır. Birkaçına göz atalım ve etkisini inceleyelim.

### 10.5.0

[Resumed hydration](https://github.com/preactjs/preact/pull/2754) özelliğinin tanıtımı - bu işlevsellik temel olarak bileşen ağacınızın yeniden hidratasyon sürecinde askıya alınmasını sağlar. Örneğin, aşağıdaki bileşen ağacında `Header`'ı yeniden hidrat edeceğiz ve etkileşimli hale getireceğiz, `LazyArticleHeader` askıda kalacak, bu arada sunucu tarafından render edilen DOM ekranda kalacak. Lazy-load tamamlandığında yeniden hidratasyona devam edeceğiz, `Header`'ımız ve `LazyArticleHeader`'ımız etkileşimde bulunabilirken `LazyContents`'ımız çözüme kavuşacak. Bu, en önemli şeylerinizi etkileşimli hale getirirken başlangıç paketinizin boyutunu/download boyutunu aşırı yüklememek için oldukça güçlü bir özellik.

```jsx
const App = () => {
  return (
    <>
      <Header>
      <main>
        <Suspense>
          <LazyArticleHeader />
          <Suspense>
            <article>
              <LazyContents />
            </article>
          </Suspense>
        </Suspense>
      </main>
    </>
  )
}
```

### 10.8.0

10.8.0'da [state settling](https://github.com/preactjs/preact/pull/3553) özelliğini tanıttık, bu özelliği bir bileşenin render sırasında hook-state güncellemeleri yapması durumunda yakalamayı, önceki etkileri iptal etmeyi ve render etmeye devam etmeyi sağlar. Bu döngü haline gelmemesini sağlamak zorundayız ancak bu özellik, render sürecindeki durum çağrıları nedeniyle sıraya alınan render miktarını azaltırken, bu özellik ayrıca React ekosistemiyle uyumluluğumuzu artırdı çünkü birçok kütüphane etkilerin birden fazla kez çağrılmadığına güveniyordu.

### 10.11.0

Yaptığımız birçok araştırma sonucunda Preact'a [useId](https://github.com/preactjs/preact/pull/3583) özelliğini eklemenin bir yolunu bulduk, bu, belirli bir ağaç yapısı için benzersiz değerleri eklemek için ne şekilde gideceğimizi araştırmamızı gerektirdi. Bakım ekiplerimizden biri o dönem [araştırmamız hakkında yazdı](https://www.jovidecroock.com/blog/preact-use-id) ve o zamandan beri bunun üzerine çalışıyoruz, mümkün olduğunca çakışmadan uzak tutmaya çalışıyoruz...

### 10.15.0

Birden fazla yeni bileşenin yeniden renderını sağlayan bir geçişin `rerenderQueue`'mizin sıradan çıkmasına neden olabilecek bir durum olduğunu fark ettik, bu da (context) güncellemelerimizin, sonraki aşamada _tekrar_ eski değerlerle render edilen bileşenlere yayılmasına neden olabiliyor. Gerçekten detaylı bir açıklama için [commit mesajına](https://github.com/preactjs/preact/commit/672782adbf9ccefa7a4d7c175f0adf8580f73c92) göz atabilirsiniz! Böyle yapmak, bu güncellemeleri birleştirmenin yanı sıra, React kütüphaneleriyle uyumluluğumuzu artırdı.

### 10.16.0

V11 için yaptığımız araştırmada, mevcut algoritmamızın zayıf kaldığı bazı durumlarda derinlemesine inceleme yaptık, bu sorunlardan sadece birkaçını listeleyerek:

- [Bir öğeyi diğerinden önce kaldırmak yeniden eklenmeye neden olacaktır.](https://github.com/preactjs/preact/issues/3973)
- [1'den fazla çocuk kaldırıldığında yeniden eklenmeler.](https://github.com/preactjs/preact/issues/2622)
- [Anahtarlanan düğümlerin gereksiz yere sökülmesi.](https://github.com/preactjs/preact/issues/2783)

:::warning
Bu sorunların hepsi kötü bir duruma neden olmadı, bazıları sadece performansı düşürdü.
:::

Eğik tabanlı farklılaştırmayı Preact X'e geçirebileceğimizi öğrendiğimizde çok heyecanlandık, yalnızca birçok durumu düzeltmekle kalmayıp, bu algoritmanın gerçek durumda nasıl davrandığını görmek için de harika bir fırsattı! Gerçekten bu noktada, bu sorunların rapor edilmesi için topluluğumuzun yardımcı olması için hepinize teşekkür etmek istiyorum, çok iyi bir topluluksunuz!

### 10.19.0

10.19.0'da Marvin, [fresh](https://fresh.deno.dev/) üzerindeki araştırmalarını [önceden derlenmiş JSX fonksiyonlarını](https://github.com/preactjs/preact/pull/4177) eklemek için uyguladı, bu, bileşenlerinizi transpilasyon sırasında önceden derlemenize olanak tanır, render-to-string çalışırken yalnızca dizeleri birleştirmek zorundayız, böylece tüm VNode ağacı için bellek tahsis etmek zorundayız. Bu dönüşüm şu an Deno'ya özgüdür ama genel kavram Preact'te mevcuttur!

### 10.20.2

Bir olayın yeni eklenmiş bir VNode'a kabarmasına neden olabileceği birkaç sorunla karşılaştık, bu sorun [bir olay saati ekleyerek](https://github.com/preactjs/preact/pull/4322) düzeltildi. Aşağıdaki senaryoda, durumu ayarlayan düğmeye tıklarsınız, tarayıcı olay kabarmasını mikrotiklerle iç içe geçirir, bu da Preact'in güncellemeleri zamanlamak için kullandığı yöntemdir. Bu birleşim, Preact'in arayüzü güncellemesine neden olur, bu da ``'in o `onClick` işleyicisine sahip olacağı ve durumu hemen kapatacak olan `click`'i tekrar çağıracağı anlamına gelir.

```jsx
const App = () => {
  const [toggled, setToggled] = useState(false);

  return toggled ? (
    <div onClick={() => setToggled(false)}>
      <span>clear</span>
    </div> 
  ) : (
    <div>
      <button
        onClick={() => setToggled(true)}
      >toggle on</button>
    </div>
  )
}
```

## İstikrar

Yukarıda, topluluğumuzun _kırıcı değişiklikler olmadan_ aldığı bazı seçilmiş sürümlerden bahsettik, ancak çok daha fazlası var... Yeni bir ana sürüm eklemenin her zaman topluluğun bir kısmını geride bıraktığını biliyoruz ve bunu istemiyoruz. Preact 8 sürüm hattına baktığımızda, hala geçtiğimiz hafta 100,000 indirme olduğunu görebiliyoruz, son 8.x sürümü 5 yıl önceydi, bu, topluluğun bir kısmının geride kaldığını gösteriyor.

İstikrar harika bir şeydir, Preact ekibi olarak istikrara büyük önem veriyoruz. Aslında diğer ekosistem projelerinde birden fazla anahtar özelliği tanıttık:

- [Signals](https://github.com/preactjs/signals)
- [Asenkron render](https://github.com/preactjs/preact-render-to-string/pull/333)
- [Akış halinde render](https://github.com/preactjs/preact-render-to-string/pull/354)
- [Prefresh](https://github.com/preactjs/prefresh)
- [Önceden render işlemi ile vite preset](https://github.com/preactjs/preset-vite#prerendering-configuration)
- [Yeni bir asenkron yönlendirici](https://github.com/preactjs/preact-iso)
- [Create Preact](https://github.com/preactjs/create-preact)

:::info
Ekosistemimize değer veriyoruz ve [`options API`](https://marvinh.dev/blog/preact-options/) aracılığıyla inşa edilen uzantılara da değer veriyoruz, bu, bu kırıcı değişiklikleri tanıtmak istememenin ve araştırmalarımızdan faydalanmanız için ağrısız bir geçiş yolu sağlamanın ana nedenlerinden biridir.
:::

Bu, Preact 11'in olmayacağı anlamına gelmez, ancak başlangıçta düşündüğümüz gibi olmayabilir. Bunun yerine, yalnızca IE11 desteğini bırakıp performans iyileştirmelerinizi sağlamak isteyebiliriz, tüm bunları Preact X'in istikrarı ile sağlar. Akıllarda dolaşan birçok fikir var ve meta çerçeveler bağlamında daha geniş Preact deneyimi ile oldukça ilgileniyoruz; bunlar, yönlendirme gibi şeyleri kutudan çıkarmak için sağlıyorlar. Bu açıdan Vite preset'imizde ve [Fresh](https://fresh.deno.dev/) ile araştırmalar yapıyoruz, böylece Preact öncelikli bir meta çerçevenin nasıl görünmesi gerektiğini iyi bir şekilde anlayabiliyoruz.