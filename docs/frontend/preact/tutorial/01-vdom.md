---
title: Sanal DOM
description: Sanal DOM, modern web geliştirmede performansı artırmak için kullanılan bir tekniktir. Bu içerik, Sanal DOM'un nasıl oluşturulup güncelleneceğini açıklamaktadır.
keywords: [sanal DOM, Preact, JSX, HTM, modern web geliştirme, etkileşimli arayüzler, performans]
---

# Sanal DOM

"Sanal DOM" ifadesini duymuş olabilirsiniz ve merak etmiş olabilirsiniz: onu "sanal" yapan nedir? Sanal bir DOM, tarayıcı için programlama yaparken kullandığımız gerçek DOM'dan nasıl farklıdır?

Sanal DOM, nesneleri kullanarak bir ağaç yapısının basit bir tanımıdır:

```js
let vdom = {
  type: 'p',         // bir <p> elementi
  props: {
    class: 'big',    // class="big" ile
    children: [
      'Merhaba Dünya!' // ve "Merhaba Dünya!" metni ile
    ]
  }
}
```

Preact gibi kütüphaneler, bu tanımları oluşturmanın bir yolunu sağlar; bu tanımlar daha sonra tarayıcının DOM ağacıyla karşılaştırılabilir. Her ağaç parçası karşılaştırıldıkça, tarayıcının DOM ağacı, Sanal DOM ağacının tanımladığı yapıya uyacak şekilde güncellenir.

:::tip
Bu, yararlı bir araçtır çünkü kullanıcı arayüzlerini _açıklayıcı bir şekilde_ oluşturmamıza olanak tanır.
:::

Klavye veya fare girişi gibi şeylere yanıt olarak DOM'u _nasıl_ güncelleyeceğimizi tanımlamak yerine, yalnızca bu giriş alındıktan sonra DOM'un _nasıl_ görünmesi gerektiğini tanımlamamız gerekir. Bu, Preact'e sürekli olarak ağaç yapılarının tanımlarını verebileceğimiz anlamına gelir ve mevcut yapısından bağımsız olarak her yeni tanım için tarayıcının DOM ağacını eşleştirecektir.

Bu bölümde, Sanal DOM ağaçlarını nasıl oluşturacağımızı ve Preact'e bu ağaçlarla DOM'u nasıl güncelleyeceğimizi öğreneceğiz.

### Sanal DOM ağaçları oluşturma

Sanal DOM ağaçları oluşturmanın birkaç yolu vardır:

- `createElement()`: Preact tarafından sağlanan bir fonksiyon
- [JSX]: JavaScript'e derlenebilen HTML-benzeri sözdizimi
- [HTM]: JavaScript içinde doğrudan yazabileceğiniz HTML-benzeri sözdizimi

İşleri en basit yaklaşımla başlatmak kullanışlıdır; bu, Preact'in `createElement()` fonksiyonunu doğrudan çağırmayı içerir:

```jsx
import { createElement, render } from 'preact';

let vdom = createElement(
  'p',              // bir <p> elementi
  { class: 'big' }, // class="big" ile
  'Merhaba Dünya!'  // ve "Merhaba Dünya!" metni ile
);

render(vdom, document.body);
```

Yukarıdaki kod, bir paragraf elementinin Sanal DOM "tanımını" oluşturur. `createElement`'e ilk argüman, HTML elementinin adıdır. İkinci argüman, elementin "props"u - elementte ayarlanacak nitelikleri (veya özellikleri) içeren bir nesnedir. Ek argümanlar, öğenin çocuklarıdır; bu çocuklar, `createElement()` çağrılarından gelen Sanal DOM elemanları veya stringler (örneğin, `'Merhaba Dünya!'`) olabilir.

:::info
Son satır, Preact'e, Sanal DOM "tanımımızla" eşleşen gerçek bir DOM ağacı oluşturmasını ve o DOM ağacını bir web sayfasının ``'sine yerleştirmesi gerektiğini söyler.
:::

### Şimdi daha fazla JSX ile!

Fonksiyonelliği değiştirmeden önceki örneği [JSX] kullanarak yeniden yazabiliriz. JSX, daha karmaşık ağaçları tanımlarken okunabilirliği artıran HTML-benzeri sözdizimi kullanarak paragraf elementimizi tanımlamamıza olanak tanır. JSX'in dezavantajı, kodumuzun artık JavaScript'te yazılmaması ve [Babel]' gibi bir araç tarafından derlenmesi gerektiğidir. Derleyiciler, aşağıdaki JSX örneğini, önceki örnekte gördüğümüz tam `createElement()` koduna dönüştürme işini üstlenir.

```jsx
import { createElement, render } from 'preact';

let vdom = <p class="big">Merhaba Dünya!</p>;

render(vdom, document.body);
```

Artık HTML'ye çok daha benziyor!

JSX ile ilgili akılda tutulması gereken son bir şey var: Bir JSX öğesi içindeki kod (açıktaki köşeli parantezlerin içinde) özel bir sözdizimidir ve JavaScript değildir. Sayılar veya değişkenler gibi JavaScript sözdizimini kullanmak istiyorsanız, önce bir `{expression}` kullanarak JSX'den "atlamanız" gerekir - bir şablondaki alanlara benzer. Aşağıdaki örnek, `class`'ı rastgele bir string'e ayarlamak ve bir sayıyı hesaplamak için iki ifade gösterir.

```jsx
let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = <p class={maybeBig}>Merhaba {40 + 2}!</p>;
                 // ^---JS---^       ^--JS--^
```

Eğer `render(vdom, document.body)` yaparsak, "Merhaba 42!" metni gösterilecektir.

### Bir kez daha HTM ile

[HTM], bir derleyici gerektirmeden standart JavaScript etiketli şablonları kullanarak JSX'e alternatif olan bir yöntemdir. Etiketli şablonlarla karşılaşmadıysanız, bunlar `${expression}` alanlarını içerebilen özel bir String literal türüdür:

```js
let str = `Miktar: ${40 + 2} birim`;  // "Miktar: 42 birim"
```

HTM, JSX'deki `{expression}` sözdizimi yerine `${expression}` kullanır; bu, kodunuzun hangi kısımlarının HTM/JSX elemanları olduğunu ve hangi kısımlarının düz JavaScript olduğunu daha net hale getirebilir:

```js
import { html } from 'htm/preact';

let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = html`<p class=${maybeBig}>Merhaba ${40 + 2}!</p>`;
                        // ^--JS--^          ^-JS-^
```

Bu örneklerin hepsi aynı sonucu üretir: Preact'e bir DOM ağacını oluşturmak veya güncellemek için verilebilecek bir Sanal DOM ağacı.

---

### Sapma: Bileşenler

Bu eğitimde bileşenler hakkında çok daha fazla ayrıntıya gireceğiz, ancak şimdi önemli olan, `` gibi HTML bileşenlerinin sadece _iki_ tür Sanal DOM elemanından biri olmasıdır. Diğer tür, `p` gibi bir dize yerine türü bir fonksiyon olan bir Bileşendir.

Bileşenler, Sanal DOM uygulamalarının yapı taşlarıdır. Şimdilik, JSX'imizi bir fonksiyona taşıyarak çok basit bir bileşen oluşturalım:

```jsx
import { createElement } from 'preact';

export default function App() {
	return (
		<p class="big">Merhaba Dünya!</p>
	)
}

render(<App />, document.getElementById("app"));
```

`render()`'e bir bileşen geçerken, bileşeninizi doğrudan çağırmak yerine Preact'in örnekleme işlemini gerçekleştirmesine izin vermek önemlidir; aksi takdirde beklenmedik şekillerde hata alırsınız:

```jsx
const App = () => <div>foo</div>;

// YAPMAYIN: Bileşenleri doğrudan çağırmak hook'ları ve güncellenme sırasını bozar:
render(App(), rootElement); // HATA
render(App, rootElement); // HATA

// YAPIN: createElement() veya JSX kullanarak bileşenleri geçirmek, Preact'in doğru bir şekilde görüntülemesine olanak tanır:
render(createElement(App), rootElement); // başarılı
render(<App />, rootElement); // başarılı
```

## Deneyin!

Bu sayfanın sağ tarafında, önceki örneğimizin kodunu en üstte göreceksiniz. Bunun altında, o kodu çalıştırmanın sonucunu gösteren bir kutu bulunmaktadır. Kodu düzenleyebilir ve değişikliklerinizin sonucu nasıl etkilediğini (veya bozdurabileceğini) görebilirsiniz.

:::warning
Bu bölümde öğrendiklerinizi test etmek için, metne biraz daha cazibe katmayı deneyin! `World` kelimesini HTML etiketleri ile sarmalayarak öne çıkarın: `` ve ``.
:::

Daha sonra, tüm metni mor yaparak bir `style` prop'u ekleyin. `style` prop'u özel bir prop'dur ve bir veya daha fazla CSS özelliği ile elementte ayarlanacak bir nesne değeri almasına olanak tanır. Prop değeri olarak bir nesne geçirmek için `{expression}` kullanmanız gerekecek; yani `style={{ property: 'value' }}` şeklinde.


  🎉 Tebrikler!
  Ekranda bazı şeyler görüntüledik. Şimdi bunları etkileşimli hale getireceğiz.


```js:setup
useResult(function(result) {
  var hasEm = result.output.innerHTML.match(/<em>World\!?<\/em>/gi);
  var p = result.output.querySelector('p');
  var hasColor = p && p.style && p.style.color === 'purple';
  if (hasEm && hasColor) {
    solutionCtx.setSolved(true);
  }
}, []);
```

```jsx:repl-initial
import { createElement, render } from 'preact';

function App() {
  return (
    <p class="big">Merhaba Dünya!</p>
  );
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { createElement, render } from 'preact';

function App() {
  return (
    <p class="big" style={{ color: 'purple' }}>
      Merhaba <em>Dünya</em>!
    </p>
  );
}

render(<App />, document.getElementById("app"));
```

[JSX]: https://en.wikipedia.org/wiki/JSX_(JavaScript)
[HTM]: https://github.com/developit/htm
[Babel]: https://babeljs.io