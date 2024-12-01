---
description: Preact bileşenlerini oluşturmaya yönelik temel bilgiler ve render işlemleri hakkında detaylı bir rehber.
keywords: [Preact, bileşen, render, yaşam döngüsü, Virtual DOM]
---

# API Referansı

---



---

## Preact.Component

`Component`, genellikle durumlu Preact bileşenleri oluşturmak için alt sınıf olarak kullanacağınız bir temel sınıfdır.

### `Component.render(props, state)`

`render()` fonksiyonu, tüm bileşenler için gereklidir. Bileşenin props ve durumunu inceleyebilir ve bir Preact elemanı veya `null` döndürmelidir.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

### Yaşam döngüsü yöntemleri

> _**İpucu:** HTML5 Özel Öğeleri kullandıysanız, bu `attachedCallback` ve `detachedCallback` yaşam döngüsü yöntemlerine benzer._

Preact, bir Bileşen için tanımlanmışsa aşağıdaki yaşam döngüsü yöntemlerini çağırır:

| Yaşam döngüsü yöntemi       | Ne zaman çağrılır                               |
|-----------------------------|-------------------------------------------------|
| `componentWillMount`        | bileşen DOM'a monte edilmeden önce              |
| `componentDidMount`         | bileşen DOM'a monte edildikten sonra            |
| `componentWillUnmount`      | DOM'dan kaldırılmadan önce                      |
| `componentWillReceiveProps` | yeni props kabul edilmeden önce                  |
| `shouldComponentUpdate`     | `render()`'den önce. Render'ı atlamak için `false` döndürün |
| `componentWillUpdate`       | `render()`'den önce                             |
| `componentDidUpdate`        | `render()`'den sonra                            |

Tüm yaşam döngüsü yöntemleri ve parametreleri aşağıdaki örnek bileşende gösterilmiştir:

```js
import { Component } from 'preact';

class MyComponent extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // Önceki props
		this.state // Önceki durum
	}
	componentWillMount() {}
	componentWillUpdate(nextProps, nextState) {
		this.props // Önceki props
		this.state // Önceki durum
	}
	componentDidMount() {}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUnmount() {
		this.props // Mevcut props
		this.state // Mevcut durum
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

Bir Preact bileşenini `containerNode` DOM düğümüne render eder. Render edilen DOM düğümüne bir referans döndürür.

::::info
Opsiyonel `replaceNode` DOM düğümü sağlanmışsa ve bu `containerNode`'nin bir çocuğu ise, Preact bu öğeyi diffing algoritmasını kullanarak günceller veya değiştirir. Aksi takdirde, Preact render edilen öğeyi `containerNode`'ye ekler.
::::

```js
import { render } from 'preact';

// Bu örnekler, render()'ın aşağıdaki işaretleme ile bir sayfada nasıl davrandığını gösterir:
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// MyComponent'i container'a ekle
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// MyComponent'i <h1>My App</h1> ile karşılaştır
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Verilen `attributes` ile bir Preact Sanal DOM elemanı döndürür.

Tüm kalan argümanlar bir `children` Dizisi içine toplanır ve aşağıdakilerden biri olabilir:

- Ölçü değerleri (string, number, boolean, null, undefined, vb.)
- Daha fazla Sanal DOM elemanları
- Yukarıdakilerin sonsuz şekilde iç içe geçmiş Dizileri

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>