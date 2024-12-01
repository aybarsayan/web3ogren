---
title: Bileşenler
description: Bileşenler, Preact uygulamalarının kalbini oluşturur. Bu içerikte, nasıl yaratılacağını ve UIlar oluştururken nasıl kullanılacağını keşfedeceksiniz.
keywords: [Bileşenler, Preact, Fonksiyonel Bileşenler, Sınıf Bileşenleri, Yapı Taşları, UI Geliştirme]
---

# Bileşenler

Bileşenler, Preact'teki temel yapı taşlarını temsil eder. Küçük yapı taşlarından karmaşık UI'lar inşa etmeyi kolaylaştırmakta temel bir roldedirler. Ayrıca, oluşturulan çıktıma durum eklemekten de sorumludurlar.

Preact'te konuşacağımız iki tür bileşen bulunmaktadır.

---



---

## Fonksiyonel Bileşenler

Fonksiyonel bileşenler, `props`'u ilk argüman olarak alan düz işlevlerdir. İşlev adı **büyük harfle** başlamalıdır, böylece JSX'te çalışabilirler.

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
  return <div>Benim adım {props.name}.</div>;
}

// Kullanım
const App = <MyComponent name="John Doe" />;

// Renderlar: <div>Benim adım John Doe.</div>
render(App, document.body);
```

> Önceki sürümlerde bunlar `"Durumsuz Bileşenler"` olarak biliniyordu. Bu artık `hooks-addon` ile geçerli değil.

## Sınıf Bileşenleri

Sınıf bileşenleri durum ve yaşam döngüsü yöntemlerine sahip olabilir. Sonuncusu, bir bileşenin DOM'a eklendiğinde veya örneğin yok edildiğinde çağrılan özel yöntemlerdir.

Burada, mevcut zamanı görüntüleyen basit bir `` sınıf bileşenimiz var:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // Yaşam döngüsü: Bileşenimiz oluşturulduğunda çağrılır
  componentDidMount() {
    // her saniye zamanı güncelle
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Yaşam döngüsü: Bileşenimiz yok edilmeden önce çağrılır
  componentWillUnmount() {
    // render edilemediğinde durdur
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Yaşam Döngüsü Yöntemleri

Saatin her saniye güncellenmesi için, ``'ın DOM'a ne zaman eklendiğini bilmemiz gerekiyor. _Eğer HTML5 Özel Öğeleri kullandıysanız, bu `attachedCallback` ve `detachedCallback` yaşam döngüsü yöntemlerine benzer._ Preact, bir Bileşen için tanımlıysa aşağıdaki yaşam döngüsü yöntemlerini çağırır:

| Yaşam döngüsü yöntemi                | Ne zaman çağrılır                              |
|--------------------------------------|------------------------------------------------|
| `componentWillMount()`               | (kaldırıldı) bileşen DOM'a eklenmeden önce    |
| `componentDidMount()`                | bileşen DOM'a eklendikten sonra               |
| `componentWillUnmount()`             | DOM'dan kaldırılmadan önce                     |
| `componentWillReceiveProps(nextProps, nextContext)` | yeni props alımından önce _(kaldırıldı)_ |
| `getDerivedStateFromProps(nextProps, prevState)` | `shouldComponentUpdate`'den hemen önce. Durumu güncellemek için bir nesne döndürün ya da güncellemeyi atlamak için `null` döndürün. Dikkatlice kullanın. |
| `shouldComponentUpdate(nextProps, nextState, nextContext)` | `render()`'den önce. Render'ı atlamak için `false` döndürün |
| `componentWillUpdate(nextProps, nextState, nextContext)` | `render()`'den önce _(kaldırıldı)_ |
| `getSnapshotBeforeUpdate(prevProps, prevState)` | `render()`'den hemen önce çağrılır. döndürdüğü değer `componentDidUpdate`'e iletilir. |
| `componentDidUpdate(prevProps, prevState, snapshot)` | `render()`'den sonra                       |

> Aşağıda, bunların birbirleriyle ilişkisini gösteren bir görsel bulunmaktadır (orijinal olarak [bir tweet](https://web.archive.org/web/20191118010106/https://twitter.com/dan_abramov/status/981712092611989509) olarak Dan Abramov tarafından paylaşılmıştır):


### Hata Sınırları

:::info
Hata sınırı, `componentDidCatch()` veya statik `getDerivedStateFromError()` yöntemini (veya her ikisini) uygulayan bir bileşendir.
:::

Bu, oluşturma sırasında meydana gelen hataları yakalamanıza olanak tanıyan özel yöntemlerdir ve genellikle daha güzel hata mesajları veya diğer yedek içerikler sağlamak ve kayıt için bilgiler saklamak için kullanılır. Hata sınırlarının tüm hataları yakalayamayacağını ve olay işleyicileri veya asenkron kodda (örneğin bir `fetch()` çağrısında) atılan hataların ayrı olarak ele alınması gerektiğini unutmamak önemlidir.

Bir hata yakalandığında, bu yöntemleri kullanarak herhangi bir hataya reaksiyon gösterebilir ve güzel bir hata mesajı veya başka bir yedek içerik gösterebiliriz.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { errored: false };
  }

  static getDerivedStateFromError(error) {
    return { errored: true };
  }

  componentDidCatch(error, errorInfo) {
    errorReportingService(error, errorInfo);
  }

  render(props, state) {
    if (state.errored) {
      return <p>Bir şeyler kötü gitti</p>;
    }
    return props.children;
  }
}
// --repl-after
render(<ErrorBoundary />, document.getElementById('app'));
```

## Fragmanlar

Bir `Fragment`, aynı anda birden fazla eleman döndürmenize olanak tanır. Her "blok" için tek bir kök elemanın gerektiği JSX sınırlamasını çözerler. Genellikle listeler, tablolar veya CSS flexbox ile bir arada kullanılır, aksi takdirde herhangi bir ara eleman stil üzerinde etki eder.

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// Renderlar:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Çoğu modern işleyici, `Fragments` için daha kısa bir sözdizimi kullanmanıza olanak tanır. Daha kısa olanı çok daha yaygındır ve genellikle karşılaşacağınız türüdür.

```jsx
// Bu:
const Foo = <Fragment>foo</Fragment>;
// ... aynı şeydir:
const Bar = <>foo</>;
```

Ayrıca bileşenlerinizden diziler de döndürebilirsiniz:

```jsx
function Columns() {
  return [
    <td>Merhaba</td>,
    <td>Dünya</td>
  ];
}
```

Bir döngüde `Fragments` oluşturuyorsanız, anahtarlar eklemeyi unutmayın:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Anahtar olmadan, Preact hangi elemanların
        // yeniden render edildiğini tahmin etmek zorunda kalır.
        <Fragment key={item.id}>
          {item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```