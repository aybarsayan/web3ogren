---
description: Bu belge, Preact'teki bileşen türlerini ve bunların nasıl kullanılacağını açıklar. Klasik Bileşenler ve Durumsuz Fonksiyonel Bileşenler hakkında örnekler ve açıklamalar içerir.
keywords: [Preact, bileşen türleri, Klasik Bileşenler, Durumsuz Fonksiyonel Bileşenler, JSX, props]
---

# Bileşen Türleri

Preact'te iki tür bileşen vardır:

- **Hayat döngüsü yöntemlerine ve duruma sahip Klasik Bileşenler**
- **`props` kabul eden ve [JSX] döndüren Durumsuz Fonksiyonel Bileşenler**

Bu iki tür içinde, bileşenleri uygulamanın birkaç farklı yolu da vardır.

---



---

## Örnek

Bir örnek kullanarak: basit bir `` bileşeni, bir HTML `` öğesi oluşturur:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Bu bileşeni şu şekilde oluşturabiliriz:

```xml
<Link href="http://example.com">Bazı Metin</Link>
```

### Props ve State Ayıklama

Bu ES6 / ES2015 olduğu için, `` bileşenimizi `render()`'ın ilk argümanı olan `props`'tan yerel değişkenlere anahtarları eşleştirerek daha da basitleştirebiliriz, [ayıklama](https://github.com/lukehoban/es6features#destructuring) kullanarak:

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Eğer `` bileşenimize geçirilen _tüm_ `props`'ları `` öğesine kopyalamak istersek, [yayılma operatörü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) kullanabiliriz:

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```

### Durumsuz Fonksiyonel Bileşenler

Son olarak, bu bileşenin durumu tutmadığını görebiliriz - bileşeni aynı `props` ile render ettiğimizde her seferinde aynı sonucu alırız. Bu durumda, genellikle bir Durumsuz Fonksiyonel Bileşen kullanmak en iyisidir. Bunlar, `props`'ı bir argüman olarak kabul eden ve JSX döndüren yalnızca fonksiyonlardır.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *ES2015 Notu:* yukarıdaki bir Ok Fonksiyonu'dur ve fonksiyon gövdesi için süslü parantezler yerine parantezler kullandığımız için, parantezlerin içindeki değer otomatik olarak döndürülür. Bunun hakkında daha fazla bilgi edinebilirsiniz [burada](https://github.com/lukehoban/es6features#arrows).