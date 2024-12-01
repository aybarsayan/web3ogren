---
title: Preact Uygulamalarını Hata Ayıklama
description: 'Preact uygulamalarını etkili bir şekilde hata ayıklamak için kullanılan yöntemler ve araçlar hakkında detaylı bilgi.'
keywords: [Preact, hata ayıklama, geliştirici araçları, hata uyarıları, bileşen raporları]
---

# Preact Uygulamalarını Hata Ayıklama

Preact, hata ayıklamayı kolaylaştıran birçok araç ile birlikte gelir. Bunlar tek bir import içinde paketlenmiştir ve `preact/debug` import edilerek dahil edilebilir. 

:::info
Bu araçlar, Chrome ve Firefox için kendi [Preact Devtools] Uzantımızla entegrasyonu içerir.
:::

Bir hata veya uyarı bastıracağız, yanlış kapsama gibi bir sorun tespit ettiğimizde `` öğelerinde.

---



---

## Kurulum

[Preact Devtools], tarayıcınızın uzantı mağazasından kurulabilir:

- [Chrome için](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [Firefox için](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)
- [Edge için](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)

Kurulduktan sonra, uzantıya bağlantıyı başlatmak için bir yere `preact/debug` import etmemiz gerekiyor. Bu importun, uygulamanızdaki **ilk** import olduğundan emin olun.

> `@preact/preset-vite` paketi otomatik olarak `preact/debug` paketini içerir. Kullanıyorsanız, ayar ve sıkıştırma adımlarını güvenle atlayabilirsiniz!

Uygulamanızın ana giriş dosyasının nasıl görünebileceğine dair bir örnektir.

```jsx
// İlk import olmalıdır
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Üretimden geliştirici araçlarını kaldırma

:::tip
Çoğu paketleyici, bir `if`-ifadesi içindeki bir dalın asla çalıştırılmayacağını tespit ettiğinde kodu kaldırmanıza izin verir. Bunu kullanarak yalnızca `preact/debug`'ı geliştirme sırasında dahil edebilir ve üretim derlemesinde bu değerli baytları koruyabilirsiniz.
:::

```jsx
// İlk import olmalıdır
if (process.env.NODE_ENV==='development') {
  // Import ifadeleri yalnızca en üst düzeyde bulunmasına izin verildiğinden burada require kullanılmalıdır.
  require("preact/debug");
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

Yapı aracınızdaki `NODE_ENV` değişkeninin doğru değere ayarlandığından emin olun.

---

## Hata Ayıklama Uyarıları ve Hataları

Bazen Preact geçersiz kod tespit ettiğinde uyarılar veya hatalar alabilirsiniz. Bu sorunların, uygulamanızın kusursuz çalışmasını sağlamak için düzeltilmesi gerekir.

### `render()` fonksiyonuna `undefined` ebeveyn geçildi

:::warning
Bu, kodun uygulamanızı bir DOM düğümüne değil, hiçliğe render etmeye çalıştığı anlamına gelir.
:::

Fark şudur:

```jsx
// Preact'in aldığı
render(<App />, undefined);

// beklediği
render(<App />, actualDomNode);
```

Bu hatanın başlıca nedeni, `render()` fonksiyonu çağrıldığında DOM düğümünün mevcut olmamasıdır. Mevcut olduğundan emin olun.

### `createElement()` fonksiyonuna `undefined` bileşen geçildi

Preact, bir bileşen yerine `undefined` geçtiğinizde bu hatayı fırlatır. Bunun yaygın nedeni, `default` ve `named` exports'ları karıştırmaktır.

```jsx
// app.js
export default function App() {
  return <div>Merhaba Dünya</div>;
}

// index.js: Yanlış, çünkü `app.js`'de adlandırılmış bir export yok
import { App } from './app';
render(<App />, dom);
```

Tam tersi durumda da aynı hata fırlatılır. Bir `named` export tanımladığınızda ve onu bir `default` export olarak kullanmaya çalıştığınızda bu hatayı alırsınız. Bunu kontrol etmenin hızlı bir yolu (editörünüz zaten yapmıyorsa), importu sadece loglamaktır:

```jsx
// app.js
export function App() {
  return <div>Merhaba Dünya</div>;
}

// index.js
import App from './app';

console.log(App);
// Log: { default: [Function] } bileşen yerine
```

### İki kez JSX literal geçildi

:::note
Bir JSX-Literal veya Bileşeni JSX içinde tekrar geçmek geçersizdir ve bu hatayı tetikler.
:::

```jsx
const Foo = <div>foo</div>;
// Geçersiz: Foo zaten bir JSX-Elementi içeriyor
render(<Foo />, dom);
```

Bunu düzeltmek için, değişkeni doğrudan geçebiliriz:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Tablo içinde hatalı kapsama algılandı

HTML, tabloların nasıl yapılandırılacağı konusunda çok net talimatlar verir. Bunlardan sapmak, çok zor hata ayıklanabilir render hatalarına yol açabilir. Preact, bunu tespit eder ve bir hata mesajı basar. Tabloların nasıl yapılandırılacağını öğrenmek için [mdn belgelerini](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) şiddetle öneririz.

### Geçersiz `ref` özelliği

:::danger
`ref` özelliği beklenmedik bir şey içeriyorsa, bu hatayı fırlatacağız. Bu, bir süre önce kullanımdan kaldırılan string tabanlı `refs`'leri içerir.
:::

```jsx
// geçerli
<div ref={e => {/* ... */)}} />

// geçerli
const ref = createRef();
<div ref={ref} />

// Geçersiz
<div ref="ref" />
```

### Geçersiz olay işleyici

Bazen bir olay işleyicisine yanlış bir değer geçebiliriz. Onlar her zaman bir `function` veya kaldırmak istiyorsanız `null` olmalıdır. Diğer tüm türler geçersizdir.

```jsx
// geçerli
<div onClick={() => console.log("tıkla")} />

// geçersiz
<div onClick={console.log("tıkla")} />
```

### Hook'lar yalnızca render yöntemlerinden çağrılabilir

:::tip
Bu hata, bir hook'u bir bileşenin dışında kullanmaya çalıştığınızda oluşur. Sadece bir fonksiyon bileşenin içinde desteklenirler.
:::

```jsx
// Geçersiz, bir bileşenin içinde kullanılmalıdır
const [value, setValue] = useState(0);

// geçerli
function Foo() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

### `vnode.[property]` almak kullanımdan kaldırıldı

Preact X ile iç `vnode` yapısında bazı önemli değişiklikler yaptık.

| Preact 8.x         | Preact 10.x            |
| ------------------ | ---------------------- |
| `vnode.nodeName`   | `vnode.type`           |
| `vnode.attributes` | `vnode.props`          |
| `vnode.children`   | `vnode.props.children` |

### Aynı anahtara sahip çocuklar bulundu

Sanal DOM tabanlı kütüphanelerin benzersiz bir yönü, çocukların etrafta hareket ettiğini tespit etmeleri gerektiğidir. Ancak hangi çocuğun hangisi olduğunu bilmek için onları bir şekilde işaretlememiz gerekir. _Bu yalnızca çocuklar dinamik olarak oluşturuluyorsa gereklidir._

```jsx
// Her iki çocuk da aynı anahtar "A" olacak
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

Bunu düzgün bir şekilde yapmak, onlara benzersiz anahtarlar vermektir. Çoğu durumda, üzerinde döngü kurduğunuz verilerin bir biçimi `id` içerecektir.

```jsx
const persons = [
  { name: 'John', age: 22 },
  { name: 'Sarah', age: 24}
];

// Bileşeniz içindeki bir yerde
<div>
  {persons.map(({ name, age }) => {
    return <p key={name}>{name}, Yaş: {age}</p>;
  })}
</div>
```

[Preact Devtools]: https://preactjs.github.io/preact-devtools/