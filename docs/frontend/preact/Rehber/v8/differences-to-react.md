---
description: Preact, React ile birçok benzerliğe sahip olmakla birlikte, önemli farklılıklar da sunar. Bu içerik, Preact'ın React ile olan farklarını, nelerin dahil ve eksik olduğunu detaylandırır.
keywords: [Preact, React, farklılıklar, uyumluluk, bileşenler, özellikler]
---

# React Farklılıkları

Preact, React'ın yeniden uygulanması olarak tasarlanmamıştır. Aralarında farklılıklar vardır. Bu farklılıkların birçok tanesi önemsizdir ya da tamamen ortadan kaldırılabilir; [preact-compat] kullanarak, bu Preact üzerinde React ile %100 uyumluluk sağlamayı amaçlayan ince bir katmandır.

Preact'ın her bir React özelliğini dahil etmeye çalışmamasının nedeni, **küçük** ve **odaklanmış** kalmaktır - aksi takdirde React projesine optimizasyonlar sunmak daha mantıklı olacaktır; zaten çok karmaşık ve iyi tasarlanmış bir kod tabanıdır.

---



---

## Sürüm Uyumluluğu

Preact ve [preact-compat] için sürüm uyumluluğu, React'ın _mevcut_ ve _önceki_ ana sürümleri ile ölçülmektedir. React ekibi yeni özellikler duyurduğunda, bunlar [Proje Hedefleri]'ne göre mantıklı olduğu takdirde Preact'ın çekirdeğine eklenebilir. Bu, sürekli tartışma ve açık bir şekilde yapılan kararlarla gelişen oldukça demokratik bir süreçtir; sorunlar ve çekme istekleri kullanılarak.

> Bu nedenle, web sitesi ve belgeler, uyumluluğu veya karşılaştırmaları tartışırken React `0.14.x` ve `15.x` sürümlerini yansıtmaktadır.  
> — Dikkat edilmesi gereken önemli bir nokta.

## Neler Dahil?

- [ES6 Sınıf Bileşenleri]
    - _Sınıflar, durumlu bileşenleri tanımlamak için ifade edici bir yol sağlar._
- [Yüksek-Düzen Bileşenleri]  
    - _`render()`'dan diğer bileşenleri döndüren bileşenler, etkili bir şekilde sarmalayıcılardır._
- [Durumsuz Saf Fonksiyonel Bileşenler]  
    - _`props`'ı argüman olarak alan ve JSX/VDOM döndüren fonksiyonlardır._
- [Bağlamlar]: Eski `context API` desteği Preact [3.0]'da eklenmiştir.
    - _[Yeni API](https://reactjs.org/docs/context.html) desteği [PR #963 olarak tartışılmaktadır](https://github.com/preactjs/preact/pull/963)._
- [Referanslar]: Fonksiyon referansları Preact [4.0]'da eklenmiştir. Dize referansları `preact-compat` içinde desteklenmektedir.
    - _Referanslar, oluşturulan elementlere ve alt bileşenlere atıfta bulunmanın bir yolunu sağlar._
- Sanal DOM Farklılaştırma
    - _Bu bir zorunluluktur - Preact'ın farkı basit ama etkilidir ve **[son derece](http://developit.github.io/js-repaint-perfs/) [hızlıdır](https://localvoid.github.io/uibench/)**._

:::tip
Daha fazla bilgi için [hyperscript] hakkında okuyabilirsiniz; `h()` işlevi ile ilgili birçok ek bilgi barındırıyor.
:::

- `h()`, `React.createElement`'in daha genel bir versiyonu
    - _Bu fikir aslında [hyperscript] olarak adlandırılıyordu ve React ekosisteminin çok ötesinde değere sahiptir; bu nedenle Preact orijinal standardı teşvik etmektedir. ([Oku: neden `h()`?](http://jasonformat.com/wtf-is-jsx))_
    - _Ayrıca biraz daha okunaklı: `h('a', { href:'/' }, h('span', null, 'Ana Sayfa'))`_

## Neler Eklenmiş?

Preact, aslında React topluluğundaki çalışmalardan ilham alan bazı kullanışlı özellikler ekler:

- `this.props` ve `this.state` `render()` fonksiyonuna sizin için geçirilir  
    - _Yine de onları manuel olarak referans alabilirsiniz. Bu sadece daha temiz, özellikle de [destructuring] kullanırken._
- DOM güncellemelerinin gruplandırılması, `setTimeout(1)` kullanılarak debounc edilmiş veya toplanmıştır _(requestAnimationFrame de kullanılabilir)_
- CSS sınıfları için sadece `class` kullanabilirsiniz. `className` hala desteklenir, ancak `class` tercih edilir.
- Bileşen ve element geri dönüşümü/pooling.

## Neler Eksik?

- [PropType] Doğrulaması: Herkes PropTypes kullanmaz, bu nedenle Preact'ın çekirdeğinin bir parçası değildir.
    - _**PropTypes tamamen desteklenmektedir** [preact-compat] içinde, ya da bunları manuel olarak kullanabilirsiniz._
- [Çocuklar]: Preact içinde gerekli değildir, çünkü `props.children` _her zaman bir Dizi_'dir.
    - _`React.Children`, [preact-compat] içinde tamamen desteklenmektedir._
- Sentetik Olaylar: Preact'ın tarayıcı destek hedefi, bu ekstra yükü gerektirmemektedir.
    - _Preact, olay işleme için tarayıcının yerel `addEventListener`'ını kullanır. DOM olay işleyicilerinin tam listesi için [GlobalEventHandlers]’e bakın._
    - _Tam bir olay uygulaması daha fazla bakım ve performans endişeleri, ve daha büyük bir API anlamına gelir._

## Neler Farklı?

Preact ve React arasında bazı daha ince farklılıklar vardır:

- `render()` üçüncü bir argümanı kabul eder; bu, _değiştirilecek_ kök düğümüdür, aksi takdirde ekler. Gelecek bir sürümde, belki kök düğümünü denetleyerek bir değiştirme render'ının uygun olduğuna otomatik olarak karar verir.
- Bileşenler `contextTypes` veya `childContextTypes` implementasyonu yapmaz. Çocuklar, `getChildContext()`'dan çekilen tüm `context` girişlerini alır.

[Proje Hedefleri]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/preactjs/preact/milestones/3.0
[4.0]: https://github.com/preactjs/preact/milestones/4.0
[preact-compat]: https://github.com/preactjs/preact-compat
[PropType]: https://github.com/developit/proptypes
[Bağlamlar]: https://reactjs.org/docs/legacy-context.html
[Referanslar]: https://facebook.github.io/react/docs/more-about-refs.html
[Çocuklar]: https://facebook.github.io/react/docs/top-level-api.html#reactchildren
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[ES6 Sınıf Bileşenleri]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[Yüksek-Düzen Bileşenleri]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Durumsuz Saf Fonksiyonel Bileşenler]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[Bağlantılı Durum]: /guide/v8/linked-state