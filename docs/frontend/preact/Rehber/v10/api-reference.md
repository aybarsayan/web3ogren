---
name: API Referansı
description: 'Preact modülünün tüm dışa aktarılan işlevleri hakkında daha fazla bilgi edinin. Bu sayfa, Preact bileşen gelişimi için gerekli olan tüm temel işlevleri kapsamlı bir şekilde açıklamaktadır.'
keywords: [Preact, API, bileşen, render, JavaScript, Sanal DOM, önceden render]
---

# API Referansı

Bu sayfa, tüm dışa aktarılan işlevlerin hızlı bir özetini sunmaktadır.

---



---

## Bileşen

`Component`, durumlu Preact bileşenleri oluşturmak için genişletilebilen bir temel sınıftır.

Doğrudan örneklendirilmek yerine, Bileşenler render edici tarafından yönetilir ve gerektiğinde oluşturulur.

```js
import { Component } from 'preact';

class MyComponent extends Component {
  // (aşağıya bakın)
}
```

### Component.render(props, state)

Tüm bileşenler bir `render()` işlevi sağlamalıdır. Render işlevine bileşenin mevcut `props` ve `state`i geçirilir ve bir Sanal DOM Elemanı (genellikle bir JSX "elemanı"), bir Dizi veya `null` döndürmelidir.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props, this.props ile aynidir
		// state, this.state ile aynidir

		return <h1>Merhaba, {props.name}!</h1>;
	}
}
```

:::tip
Bileşenler ve nasıl kullanılabilecekleri hakkında daha fazla bilgi edinmek için `Bileşenler Dokümantasyonu` sayfasını kontrol edin.
:::

## render()

`render(virtualDom, containerNode, [replaceNode])`

Bir Sanal DOM Elemanını bir ana DOM elemanı `containerNode` içine render eder. Hiçbir şey döndürmez.

```jsx
// --repl
// Render öncesi DOM ağacı:
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// Render sonrası:
// <div id="container">
//  <div>foo</div>
// </div>
```

:::info
İsteğe bağlı `replaceNode` parametresi sağlanırsa, `containerNode`nin bir çocuğu olmalıdır. Render işlemine nereden başlanacağını çıkarım yapmak yerine, Preact, geçilen öğeyi kendi ayrıştırma algoritmasını kullanarak günceller veya değiştirir. 
:::

> ⚠️ `replaceNode` argümanı, Preact `v11` ile kaldırılacaktır. Bu, hesaplanması gereken çok sayıda kenar durumu ve hata getirmektedir. Geçmiş nedenlerle bu bölümü burada tutuyoruz, ancak kimsenin üçüncü `replaceNode` argümanını kullanmasını tavsiye etmiyoruz.

```jsx
// Render öncesi DOM ağacı:
// <div id="container">
//   <div>bar</div>
//   <div id="target">foo</div>
// </div>

import { render } from 'preact';

const Foo = () => <div id="target">BAR</div>;

render(
  <Foo />,
  document.getElementById('container'),
  document.getElementById('target')
);

// Render sonrası:
// <div id="container">
//   <div>bar</div>
//   <div id="target">BAR</div>
// </div>
```

İlk argüman, ya bir bileşeni ya da bir elemanı temsil eden geçerli bir Sanal DOM Elemanı olmalıdır. Bir Bileşen geçirirken, bileşeninizi doğrudan çağırmak yerine Preact'in örneklendirme işlemini gerçekleştirmesine izin vermek önemlidir; aksi takdirde beklenmedik şekillerde bozulacaktır:

```jsx
const App = () => <div>foo</div>;

// YAPMAYIN: Bileşenleri doğrudan çağırmak, kancaları ve güncelleme sırasını bozar:
render(App(), rootElement); // HATA
render(App, rootElement); // HATA

// YAPIN: Bileşenleri h() veya JSX kullanarak geçmek, Preact'in doğru bir şekilde render etmesine izin verir:
render(h(App), rootElement); // başarı
render(<App />, rootElement); // başarı
```

## hydrate()

Eğer uygulamanızı önceden render ettiyseniz veya sunucu tarafında HTML'ye render ettiyseniz, Preact, tarayıcıda yüklenirken çoğu render işini atlayabilir. Bu, `render()`'dan `hydrate()`'a geçiş yapılarak etkinleştirilebilir; bu işlem en azından olay dinleyicilerini ekler ve bileşen ağacınızı kurar. Bu yalnızca önceden render yapıldığında veya `Sunucu Tarafında Render` ile birlikte kullanıldığında çalışır.

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(type, props, ...children)`

Verilen `props` ile bir Sanal DOM Elemanı döndürür. Sanal DOM Elemanları, uygulamanızın UI hiyerarşisinde bir düğümün hafif detaylandırmalarıdır; esasen `{ type, props }` biçiminde bir nesnedir.

`type` ve `props`'tan sonra, kalan parametreler `children` özelliğine toplanır.
Çocuklar aşağıdakilerden biri olabilir:

- Ölçü değerleri (string, number, boolean, null, undefined, vb.)
- İç içe geçmiş Sanal DOM Elemanları
- Yukarıdaki değerlerden sonsuz derecede iç içe geçmiş Diziler

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Merhaba!');
// <div id="foo">Merhaba!</div>

h('div', { id: 'foo' }, 'Merhaba', null, ['Preact!']);
// <div id="foo">Merhaba Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Merhaba!')
);
// <div id="foo"><span>Merhaba!</span></div>
```

## toChildArray

Bu yardımcı işlev, bir `props.children` değerini yapısına veya içerisine bakılmaksızın düzleştirilmiş bir Diziye dönüştürür. Eğer `props.children` zaten bir dizi ise, bir kopya döndürülür. Bu işlev, `props.children`'ın bir dizi olmayabileceği durumlarda faydalıdır; bu, JSX'teki belirli statik ve dinamik ifadelerin birleşimi ile gerçekleşebilir.

Tek bir çocuğa sahip Sanal DOM Elemanları için `props.children`, çocuğa bir referanstır. Birden çok çocuk olduğunda, `props.children` her zaman bir Dizidir. `toChildArray` yardımcı işlevi, tüm durumları tutarlı bir şekilde ele almanın bir yolunu sağlar.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>{count} çocuğum var</div>;
}

// props.children "bar"
render(
  <Foo>bar</Foo>,
  container
);

// props.children [<p>A</p>, <p>B</p>] olduğunda
render(
  <Foo>
    <p>A</p>
    <p>B</p>
  </Foo>,
  container
);
```

## cloneElement

`cloneElement(virtualElement, props, ...children)`

Bu işlev, bir Sanal DOM Elemanının sığ bir kopyasını oluşturmanızı sağlar.
Genellikle bir öğenin `props`'unu eklemek veya üzerini yazmak için kullanılır:

```jsx
function Linkout(props) {
  // bağlantıya target="_blank" ekleyin:
  return cloneElement(props.children, { target: '_blank' });
}
render(<Linkout><a href="/">ana sayfa</a></Linkout>);
// <a href="/" target="_blank">ana sayfa</a>
```

## createContext

`Context dokümantasyonu` bölümüne bakın.

## createRef

Bir öğeye veya bileşene, render edildikten sonra referans verebilmek için bir yol sağlar.

Daha fazla ayrıntı için `Referanslar dokümantasyonu` sayfasına bakın.

## Fragment

Çocukları olabilen, ancak bir DOM elemanı olarak render edilmeyen özel bir bileşen türüdür.
Fragment'lar, onları bir DOM konteynerine sarmadan birden fazla kardeş çocuğu döndürmeyi mümkün kılar:

```jsx
// --repl
import { Fragment, render } from 'preact';

render(
  <Fragment>
    <div>A</div>
    <div>B</div>
    <div>C</div>
  </Fragment>,
  document.getElementById('container')
);
// Render eder:
// <div id="container">
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```