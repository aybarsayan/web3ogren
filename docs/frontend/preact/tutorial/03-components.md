---
description: Bu içerikte, Bileşenlerin nasıl çalıştığını ve iç içe kullanımlarını öğreneceksiniz. Ayrıca, sınıf bileşenleri ve yaşam döngüsü yöntemleri hakkında bilgi edineceksiniz.
keywords: [Bileşen, Sanal DOM, Preact, JSX, yaşam döngüsü yöntemleri, fonksiyon bileşenleri, iç içe bileşenler]
---

# Bileşenler

Bu eğitimin birinci bölümünde belirttiğimiz gibi, Sanal DOM uygulamalarındaki ana yapı taşı **Bileşen**'dir. Bir Bileşen, Sanal DOM ağacının bir parçası olarak işlenebilen, kendi içinde yer alan bir uygulama parçasıdır; tam olarak bir HTML öğesi gibi davranır. Bir Bileşeni, bir fonksiyon çağrısı gibi düşünebilirsiniz: her ikisi de kod tekrarını ve dolaylılığı mümkün kılan mekanizmalardır.

Örnek vermek gerekirse, bir HTML `` öğesini tanımlayan bir Sanal DOM ağacı döndüren basit bir bileşen oluşturacağız `MyButton`:

```jsx
function MyButton(props) {
  return <button class="my-button">{props.text}</button>
}
```

Bu bileşeni, JSX içinde referans vererek bir uygulamada kullanabiliriz:

```js
let vdom = <MyButton text="Bana Tıkla!" />

// createElement'i hatırlıyor musun? Yukarıdaki satır şuna derlenir:
let vdom = createElement(MyButton, { text: "Bana Tıkla!" })
```

JSX kullanarak HTML ağaçlarını tanımladığınız her yerde, aynı zamanda Bileşen ağacını da tanımlayabilirsiniz. Fark, bir bileşenin adının, bileşenin adıyla (bir JavaScript değişkeni) örtüşen büyük harfle başlaması gerektiğidir.

:::info
Preact, JSX'iniz tarafından tanımlanan Sanal DOM ağacını işlerken, karşılaştığı her bileşen fonksiyonu, ağacın o noktasında çağrılacaktır.
:::

Örneğin, `MyButton` bileşenimizi bir web sayfasının gövdesine yerleştirmek için, bileşeni tanımlayan bir JSX öğesini `render()`'e geçirebiliriz:

```jsx
import { render } from 'preact';

render(<MyButton text="Bana tıkla!" />, document.body)
```

### Bileşenleri İç İçe Kullanma

Bileşenler, döndürdükleri Sanal DOM ağacında diğer bileşenlere referans verebilirler. Bu, bir bileşenler ağacı oluşturur:

```jsx
function MediaPlayer() {
  return (
    <div>
      <MyButton text="Oynat" />
      <MyButton text="Durdur" />
    </div>
  )
}

render(<MediaPlayer />, document.body)
```

Bu tekniği, farklı senaryolar için farklı bileşen ağaçları oluşturmak üzere kullanabiliriz. **MediaPlayer**'ın ses çalmadığı zaman "Oynat" butonunu, ses çaldığı zaman "Durdur" butonunu göstermesi için:

```jsx
function MediaPlayer(props) {
  return (
    <div>
      {props.playing ? (
        <MyButton text="Durdur" />
      ) : (
        <MyButton text="Oynat" />
      )}
    </div>
  )
}

render(<MediaPlayer playing={false} />, document.body)
// <button>Oynat</button> oluşturur

render(<MediaPlayer playing={true} />, document.body)
// <button>Durdur</button> oluşturur
```

> **Unutmayın:** JSX'deki `{curly}` parantezleri, bizi normal JavaScript'e döndürür.  
> Burada, `playing` props'unun değerine bağlı olarak farklı butonlar göstermek için bir [ternary] ifadesi kullanıyoruz.

### Bileşen Çocukları

Bileşenler, tıpkı HTML öğeleri gibi iç içe geçmiş şekilde de kullanılabilir. Bileşenlerin güçlü birer temel olmasının nedenlerinden biri, sanal DOM öğelerinin bir bileşen içinde nasıl işleneceğini kontrol etmek için özel mantık uygulamamızdır.

:::note
Bu işlemin çalışma şekli oldukça basittir: JSX'teki bir bileşenin içinde yer alan herhangi bir Sanal DOM öğesi, o bileşene özel bir `children` props'u olarak iletilir.
:::

Bir bileşen, `children` değerini JSX içinde `{children}` ifadesiyle referans vererek çocuklarını nereye yerleştireceğini belirleyebilir. Ya da bileşenler basitçe `children` değerini döndürebilir ve Preact, bu Sanal DOM öğelerini tam o bileşenin Sanal DOM ağacındaki konumunda işleyecektir.

```jsx
<Foo>
  <a />
  <b />
</Foo>

function Foo(props) {
  return props.children  // [<a />, <b />]
}
```

Önceki örneği düşünürsek, `MyButton` bileşenimiz, bir `` öğesi olarak ekrana yerleştirilen bir `text` prop'unu bekliyordu. Peki ya metin yerine bir resim göstermek isteseydik?

`MyButton`'ı `children` prop'unu kullanarak iç içe almaya izin verecek şekilde tekrar yazalım:

```jsx
function MyButton(props) {
  return <button class="my-button">{props.children}</button>
}

function App() {
  return (
    <MyButton>
      <img src="icon.png" />
      Bana Tıkla!
    </MyButton>
  )
}

render(<App />, document.body)
```

Artık, bileşenlerin diğer bileşenleri işleme konusunda birkaç örnek görmekteyiz, umarım iç içe geçmiş bileşenlerin, birçok daha küçük parçadan karmaşık uygulamalar oluşturmayı nasıl sağladığı belirginleşmeye başlamıştır.

---

### Bileşen Türleri

Şimdiye kadar, fonksiyon olan Bileşenleri gördük. Fonksiyon bileşenleri giriş olarak `props` alır ve çıkış olarak bir Sanal DOM ağacı döndürür. Bileşenler aynı zamanda JavaScript sınıfları olarak da yazılabilir, bu da Preact tarafından örneklenir ve `render()` yöntemini sağlar; bu yöntem, bir fonksiyon bileşeni ile çok benzer şekilde çalışır.

Sınıf bileşenleri, Preact'in `Component` temel sınıfını genişleterek oluşturulur. Aşağıdaki örnekte, `render()`'ün girdi olarak `props` aldığını ve çıkış olarak bir Sanal DOM ağacı döndürdüğünü gözlemleyin - tıpkı bir fonksiyon bileşeni gibi!

```jsx
import { Component } from 'preact';

class MyButton extends Component {
  render(props) {
    return <button class="my-button">{props.children}</button>
  }
}

render(<MyButton>Bana Tıkla!</MyButton>, document.body)
```

:::tip
Bir bileşeni tanımlamak için sınıf kullanmamızın nedeni, bileşenimizin *yaşam döngüsünü* takip etmektir.
:::

Preact, Sanal DOM ağacını işlerken bir bileşenle karşılaştığında, sınıfımızın yeni bir örneğini oluşturacaktır (`new MyButton()`).

Ancak, birinci bölümden hatırlarsanız - Preact, sürekli yeni Sanal DOM ağaçları alabilir. Preact'e yeni bir ağaç verdiğimiz her seferde, bu önceki ağaç ile karşılaştırılır ve ikisi arasındaki farklar belirlenir; bu değişiklikler sayfaya yansıtılır.

Bir bileşen sınıf kullanılarak tanımlandığında, ağacındaki bu bileşen üzerindeki herhangi bir *güncelleme*, aynı sınıf örneğini yeniden kullanır. Bu, sınıf bileşeninde, `render()` yöntemi tekrar çağrıldığında mevcut olabilecek verileri saklamanın mümkün olduğu anlamına gelir.

Sınıf bileşenleri ayrıca, Sanal DOM ağacındaki değişikliklere yanıt olarak Preact'in çağıracağı bir dizi [yaşam döngüsü yöntemini] de uygulayabilir:

```jsx
class MyButton extends Component {
  componentDidMount() {
    console.log('Yeni bir <MyButton> bileşeninden merhaba!')
  }
  componentDidUpdate() {
    console.log('Bir <MyButton> bileşeni güncellendi!')
  }
  render(props) {
    return <button class="my-button">{props.children}</button>
  }
}

render(<MyButton>Bana Tıkla!</MyButton>, document.body)
// log: "Yeni bir <MyButton> bileşeninden merhaba!"

render(<MyButton>Bana Tıkla!</MyButton>, document.body)
// log: "Bir <MyButton> bileşeni güncellendi!"
```

Sınıf bileşenlerinin yaşam döngüsü, bunları bir uygulama parçasını değişikliklere yanıt verecek şekilde inşa etmek için faydalı bir araç haline getirir; daha çok `props`'u ağaçlara eşlemek yerine. Ayrıca, bunları Sanal DOM ağacında yerleştirildikleri her konumda ayrı olarak bilgi saklamak için bir yol sunar. Bir sonraki bölümde, bileşenlerin ağaçlarının bir bölümünü güncelleyebileceklerini göreceğiz.

---

## Deneyin!

Uygulamak için, bileşenler hakkında öğrendiklerimizi, önceki iki bölümdeki olay becerilerimizle birleştirelim!

`style`, `children` ve `onClick` props'larını kabul eden bir `MyButton` bileşeni oluşturun ve bu props'lar uygulanmış şekilde bir HTML `` öğesi döndürün.


  🎉 Tebrikler!
  Bir bileşen uzmanı olma yolundasınız!


```js:setup
useRealm(function (realm) {
  var options = require('preact').options;
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  var hasComponent = false;
  var check = false;

  win.console.log = function() {
    if (hasComponent && check) {
      solutionCtx.setSolved(true);
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  var e = options.event;
  options.event = function(e) {
    if (e.type === 'click') {
      check = true;
      setTimeout(() => check = false);
    }
  };

  var r = options.__r;
  options.__r = function(vnode) {
    if (typeof vnode.type === 'function' && /MyButton/.test(vnode.type)) {
      hasComponent = true;
    }
  }

  return function () {
    options.event = e;
    options.__r = r;
    win.console.log = prevConsoleLog;
  };
}, []);
```

```jsx:repl-initial
import { render } from "preact";

function MyButton(props) {
  // buradan başla!
}

function App() {
  const clicked = () => {
    console.log('Merhaba!')
  }

  return (
    <div>
      <p class="count">Sayım:</p>
      <button style={{ color: 'purple' }} onClick={clicked}>Bana tıkla</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    console.log('Merhaba!')
  }

  return (
    <div>
      <p class="count">Sayım:</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Bana tıkla</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator  
[lifecycle methods]: /guide/v10/components#lifecycle-methods