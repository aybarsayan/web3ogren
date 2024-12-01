---
name: Web Components
description: 'Preact ile web bileşenlerinin nasıl kullanılacağı. Bu içerik, Preactin web bileşenleri ile entegrasyonunu ve kullanımını detaylandırmaktadır.'
keywords: [Preact, web bileşenleri, özel unsurlar, komponent, geliştirme]
---

# Web Components

Preact'ın küçük boyutu ve standartlara öncelikli yaklaşımı, web bileşenleri oluşturmak için mükemmel bir seçim yapar.

Web Bileşenleri, yeni HTML unsur türlerini - `` veya `` gibi Özel Unsurlar oluşturmaya olanak tanıyan bir dizi standarttır. Preact, [bu standartları tam olarak destekler](https://custom-elements-everywhere.com/#preact), Özel Unsur yaşam döngüleri, özellikleri ve olaylarını sorunsuz bir şekilde kullanmanıza olanak tanır.

> **Not:** Preact, hem tam uygulamaları hem de bir sayfanın bireysel parçalarını görüntülemek üzere tasarlanmıştır, bu nedenle Web Bileşenleri oluşturmak için doğal bir uyum sağlar. Birçok şirket, bileşen veya tasarım sistemleri oluşturmak için kullanır ve bunlar daha sonra bir dizi Web Bileşenine sarılır, bu da çoklu projeler arasında ve diğer frameworklerde yeniden kullanılmasını sağlar.

Preact ve Web Bileşenleri, tamamlayıcı teknolojilerdir: Web Bileşenleri, tarayıcıyı genişletmek için düşük seviyeli ilkelere bir set sağlar ve Preact, bu ilkelere oturabilecek yüksek seviyeli bir bileşen modeli sunar.

---



---

## Web Bileşenlerini Görüntüleme

Preact'ta, web bileşenleri diğer DOM Unsurları gibi çalışır. Kayıtlı etiket adı kullanılarak görüntülenebilirler:

```jsx
customElements.define('x-foo', class extends HTMLElement {
  // ...
});

function Foo() {
  return <x-foo />;
}
```

### Özellikler ve Nitelikler

JSX, özellikler ve nitelikler arasında ayrım yapma yolu sağlamaz. Özel Unsurlar, genellikle nitelikler olarak ifade edilemeyen karmaşık değerleri ayarlamak için özel özelliklere güvenmektedir. Bu, Preact’ta iyi çalışır çünkü işleyici, etkilenen DOM unsurunu inceleyerek değerleri bir özellik veya nitelik olarak ayarlayıp ayarlamayacağına otomatik olarak karar verir. 

:::tip
Bir Özel Unsur, belirli bir özellik için bir [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) tanımladığında, Preact onun varlığını algılar ve niteliği yerine setteri kullanır.
:::

```jsx
customElements.define('context-menu', class extends HTMLElement {
  set position({ x, y }) {
    this.style.cssText = `left:${x}px; top:${y}px;`;
  }
});

function Foo() {
  return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

> **Not:** Preact, adlandırma şemaları hakkında hiçbir varsayıma bulunmaz ve adları, JSX veya başka bir şekilde, DOM özelliklerine zorlamaya çalışmaz. Bir özel unsurun `someProperty` adında bir özelliği varsa, bu `someProperty=...` ile ayarlanmalıdır, `some-property=...` değil.

`preact-render-to-string` ("SSR") kullanarak statik HTML görüntülediğinizde, yukarıdaki gibi karmaşık özellik değerleri otomatik olarak serileştirilmez. Statik HTML, istemcide hidratlandığında uygulanır.

### Örnek Metotlara Erişim

Özel web bileşeninizin örneğine erişebilmek için `refs`'i kullanabiliriz:

```jsx
function Foo() {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.doSomething();
    }
  }, []);

  return <x-foo ref={myRef} />;
}
```

### Özel olayları tetikleme

Preact, genellikle büyük/küçük harf ayrımına duyarlı olan standart yerleşik DOM Olaylarının duraklarını normalize eder. Bu, gerçek olay adının `"change"` olmasına rağmen ``'a bir `onChange` özellik geçmenin mümkün olmasının nedenidir. 

> **Dikkat:** Özel Unsurlar, genellikle açık API'lerinin bir parçası olarak özel olaylar başlatır. Ancak hangi özel olayların ateşlendiğini bilmenin bir yolu yoktur. 
:::

Özel Unsurların Preact’te sorunsuz bir şekilde desteklenmesini sağlamak için, tanınmayan olay işleyici özellikleri geçildiğinde DOM Unsurunun adlandırılması tam olarak belirtilen haliyle kaydedilir.

```jsx
// Yerleşik DOM olayı: "click" olayını dinler
<input onClick={() => console.log('click')} />

// Özel Unsur: "TabChange" olayını dinler (büyük/küçük harf duyarlı!)
<tab-bar onTabChange={() => console.log('tab change')} />

// Düzeltildi: "tabchange" olayını dinler (küçük harf)
<tab-bar ontabchange={() => console.log('tab change')} />
```

---

## Bir Web Bileşeni Oluşturma

Herhangi bir Preact bileşeni, [preact-custom-element](https://github.com/preactjs/preact-custom-element) ile bir web bileşenine dönüştürülebilir; bu, Özel Unsurlar v1 spesifikasyonuna uyan oldukça ince bir sarmalayıcıdır.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => (
  <p>Hello, {name}!</p>
);

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      HTML etiket adı     |       gölge-dom kullan
//   Bileşen tanımı      İzlenen nitelikler
```

> **Not:** [Özel Unsur Spesifikasyonuna](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname) göre, etiket adı bir tire (`-`) içermelidir.

Yeni etiket adını HTML'de kullanın, nitelik anahtarları ve değerleri prop olarak geçilecektir:

```html
<x-greeting name="Billy Jo"></x-greeting>
```

Çıktı:

```html
<p>Hello, Billy Jo!</p>
```

### İzlenen Nitelikler

Web Bileşenleri, niteliklerinin değerlerinin değiştiğinde yanıt vermek için hangi adları gözlemlemek istediğinizi açıkça listelemeyi gerektirir. Bunlar, `register()` fonksiyonuna geçirilen üçüncü parametre aracılığıyla belirtilir:

```jsx
// `name` niteliğindeki değişiklikleri dinle
register(Greeting, 'x-greeting', ['name']);
```

`register()`'e üçüncü parametreyi atladığınızda, izlenecek nitelikler bileşen üzerindeki statik `observedAttributes` özelliği kullanılarak belirtilebilir. Bu, aynı zamanda Özel Unsurun adı için de geçerlidir ve `tagName` statik özelliği kullanılarak belirtilebilir:

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Bo"></x-greeting>
class Greeting extends Component {
  // <x-greeting> olarak kaydedin:
  static tagName = 'x-greeting';

  // Şu nitelikleri takip et:
  static observedAttributes = ['name'];

  render({ name }) {
    return <p>Hello, {name}!</p>;
  }
}
register(Greeting);
```

Hiçbir `observedAttributes` belirtilmemişse, var ise bunlar bileşenin üzerindeki `propTypes` anahtarlarından çıkarılacaktır:

```jsx
// Diğer seçenek: PropTypes kullanın:
function FullName({ first, last }) {
  return <span>{first} {last}</span>
}

FullName.propTypes = {
  first: Object,   // PropTypes veya bu
  last: Object     // tanımlanmış olmayan prop'ları tanımlamak için bu yöntem
};

register(FullName, 'full-name');
```

### Slots'ları props olarak geçme

`register()` fonksiyonu, seçenekleri geçirmek için dördüncü bir parametreye sahiptir; şu anda yalnızca `shadow` seçeneği desteklenmektedir, bu da belirtilen elemana bir gölge DOM ağacı ekler. Etkinleştirildiğinde, bu, Özel Unsurun çocuklarını gölge ağacındaki belirli yerlere yönlendirmek için adlandırılmış `` unsurlarının kullanılmasına olanak tanır.

```jsx
function TextSection({ heading, content }) {
	return (
		<div>
			<h1>{heading}</h1>
			<p>{content}</p>
		</div>
	);
}

register(TextSection, 'text-section', [], { shadow: true });
```

Kullanım:

```html
<text-section>
  <span slot="heading">Güzel başlık</span>
  <span slot="content">Harika içerik</span>
</text-section>