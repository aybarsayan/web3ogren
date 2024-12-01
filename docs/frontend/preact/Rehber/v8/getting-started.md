---
description: Bu rehber, Preact kullanarak basit bir tık tak takvimi bileşeni oluşturmaya yöneliktir. İçerik, bileşenlerin nasıl çalıştığını ve JSX'in nasıl render edildiğini açıklamaktadır.
keywords: [Preact, JSX, bileşenler, render etme, yaşam döngüsü]
---

# Başlarken

Bu rehber, basit bir "tık tak takvimi" bileşeni oluşturmaya yöneliktir. Her konuda daha ayrıntılı bilgilere Rehber menüsündeki özel sayfalarda erişebilirsiniz.

> :information_desk_person: [ES2015 kullanmak zorunda değilsiniz](https://github.com/developit/preact-without-babel)... ama kullanmalısınız. Bu rehberin, babel ve/veya webpack/browserify/gulp/grunt/vb. ile bir tür ES2015 yapılandırmasına sahip olduğunuzu varsaydığını unutmayın. Eğer yoksa, [preact-cli](https://github.com/preactjs/preact-cli) veya [CodePen Şablonu](http://codepen.io/developit/pen/pgaROe?editors=0010) ile başlayın.

---



---

## İhtiyacınız Olanı İçe Aktarın

`preact` modülü hem adlandırılmış hem de varsayılan dışa aktarımlar sağlar, bu nedenle ya istediğiniz bir ad alanı altında her şeyi içe aktarabilirsiniz ya da sadece ihtiyaç duyduğunuz öğeleri yerel olarak alabilirsiniz:

**Adlandırılmış:**

```js
import { h, render, Component } from 'preact';

// Babel'e JSX'i h() çağrılarına dönüştürmesini bildirin:
/** @jsx h */
```

**Varsayılan:**

```js
import preact from 'preact';

// Babel'e JSX'i preact.h() çağrılarına dönüştürmesini bildirin:
/** @jsx preact.h */
```

> Adlandırılmış dışa aktarımlar, yüksek yapılandırılmış uygulamalar için iyi çalışırken, varsayılan dışa aktarım hızlıdır ve kütüphanenin farklı bölümlerini kullanırken herhangi bir güncelleme gerektirmez.

**CDN üzerinden kullanımı:**

```html
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.min.js"></script>

<!-- Preact'i bir JS Modülü olarak yüklemek için: -->
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.mjs" type="module"></script>
```

### Küresel pragma

Kodunuzda `@jsx` pragma'sını belirtmek yerine, bunu bir `.babelrc` dosyasında küresel olarak yapılandırmak en iyisidir.

**Adlandırılmış:**
>**Babel 5 ve öncesi için:**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Babel 6 için:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```
>
> **Babel 7 için:**
>
> ```json
> {
>   "plugins": [
>     ["@babel/plugin-transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Varsayılan:**
>**Babel 5 ve öncesi için:**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Babel 6 için:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```
>
> **Babel 7 için:**
>
> ```json
> {
>   "plugins": [
>     ["@babel/plugin-transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---

## JSX'i Render Etme

Öncelikle, Preact `h()` fonksiyonunu sağlar, bu da JSX'inizi Sanal DOM öğelerine dönüştürür _([işte böyle](http://jasonformat.com/wtf-is-jsx))_. Ayrıca, bu Sanal DOM'dan bir DOM ağacı oluşturan bir `render()` fonksiyonu da sağlar.

Bir JSX render etmek için, bu iki fonksiyonu içe aktarın ve şu şekilde kullanın:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Merhaba, dünya!</span>
		<button onClick={ e => alert("merhaba!") }>Bana Tıkla</button>
	</div>
), document.body);
```

Eğer [hyperscript] veya onun [birçok dostu](https://github.com/developit/vhtml) ile çalıştıysanız bu oldukça mantıklı görünmelidir.

:::tip
Ancak, bir Sanal DOM ile hyperscript render etmek anlamsızdır. Biz bileşenleri render etmek ve veri değiştiğinde güncellenmelerini istiyoruz - işte burada sanal DOM farklılıklarının gücü parlıyor. :star2:
:::

---

## Bileşenler

Preact, kullanıcı arayüzünün kapsüllenmiş, kendini güncelleyen parçalarını oluşturmak için genişletilebilen genel bir `Component` sınıfı sunar. Bileşenler, `shouldComponentUpdate()` ve `componentWillReceiveProps()` gibi standart React `yaşam döngüsü yöntemlerini` destekler. Bu yöntemlerin belirli uygulamalarını sağlamak, bileşenlerin ne zaman ve nasıl güncelleneceğini kontrol etmek için tercih edilen mekanizmadır.

Bileşenlerin ayrıca bir `render()` metodu vardır, ancak React'tan farklı olarak bu metod `(props, state)` argümanları alır. Bu, `props` ve `state`'i JSX'den referans almak için yerel değişkenlere ayırmanın ergonomik bir yolunu sağlar.

Şimdi, mevcut zamanı gösteren çok basit bir `Clock` bileşenine bakalım.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// Clock örneğini <body> içine render et:
render(<Clock />, document.body);
```

Bu harika. Bunu çalıştırmak aşağıdaki HTML DOM yapısını üretir:

```html
<span>22:28:57</span>
```

---

## Bileşenin Yaşam Döngüsü

Saatin zamanının her saniye güncellenmesi için, ``’ın DOM'a hangi zamanla monte edildiğini bilmemiz gerekir. _HTML5 Özel Elemanlarını kullandıysanız, bu `attachedCallback` ve `detachedCallback` yaşam döngüsü yöntemlerine benzer._ Preact, bir Bileşen için tanımlıysa aşağıdaki yaşam döngüsü yöntemlerini çağırır:

| Yaşam döngüsü yöntemi       | Ne zaman çağrılır                              |
|-----------------------------|------------------------------------------------|
| `componentWillMount`        | bileşen DOM'a monte edilmeden önce              |
| `componentDidMount`         | bileşen DOM'a monte edildikten sonra            |
| `componentWillUnmount`      | DOM'dan kaldırılmadan önce                     |
| `componentWillReceiveProps` | yeni özellikler kabul edilmeden önce            |
| `shouldComponentUpdate`     | `render()` öncesinde. Render'ı atlamak için `false` döndürün |
| `componentWillUpdate`       | `render()` öncesinde                           |
| `componentDidUpdate`        | `render()` sonrası                             |

Bu nedenle, bileşen DOM'a eklendiğinde 1 saniyelik bir zamanlayıcı başlatmak ve kaldırıldığında durdurmak istiyoruz. Zamanlayıcıyı oluşturacağız ve `componentDidMount`'ta ona bir referans saklayacağız, zamanlayıcıyı `componentWillUnmount`'da durduracağız. Her zamanlayıcı tiklemesi sırasında, bileşenin `state` nesnesini yeni bir zaman değeriyle güncellemeye çalışacağız. Bunu yapmak bileşeni otomatik olarak yeniden render eder.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// başlangıç zamanını ayarla:
		this.state = { time: Date.now() };
	}

	componentDidMount() {
		// zamanı her saniyede bir güncelle
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// render edilemezken durdur
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// Clock örneğini <body> içine render et:
render(<Clock />, document.body);
```

---

Artık [bir tıklayan saat](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/) var!

[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript