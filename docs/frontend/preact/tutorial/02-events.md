---
description: Olaylar ve Preact'te nasıl işlendiği hakkında detaylı bilgi. Olay işleyicileri, DOM API'si ve uygulama geliştirme sürecindeki önemi ele alınıyor.
keywords: [Preact, olaylar, olay işleyicileri, JSX, DOM API]
---

# Olaylar

Olaylar, uygulamaları etkileşimli hale getirmenin yolu olup, klavye ve fare gibi girdilere yanıt verir ve bir resmin yüklenmesi gibi değişikliklere tepki verir. Olaylar, Preact’te DOM'da olduğu gibi çalışır - [MDN] üzerinde bulabileceğiniz herhangi bir olay tipi veya davranışı Preact’te kullanılabilir. Örneğin, **olay işleyicilerinin** genellikle zorunlu DOM API'si kullanılarak nasıl kaydedildiğine bakalım:

```js
function clicked() {
  console.log('clicked')
}
const myButton = document.getElementById('my-button')
myButton.addEventListener('click', clicked)
```

:::info
Preact'in DOM API'sinden farkı, olay işleyicilerinin nasıl kaydedildiğidir. Preact’te, olay işleyicileri bir elemanın prop'u olarak beyan edilerek kaydedilir; `style` ve `class` gibi. Genel olarak, ismi "on" ile başlayan her prop bir olay işleyicisidir.
:::

Bir olay işleyici prop'unun değeri, o olay gerçekleştiğinde çağrılacak olan işleyici fonksiyonudur.

Örneğin, bir düğme üzerinde "click" olayını dinleyebiliriz, bunun için `onClick` prop'unu işleyici fonksiyonumuzla ekleyerek:

```jsx
function clicked() {
  console.log('clicked')
}
<button onClick={clicked}>
```

Olay işleyici isimleri, tüm prop isimleri gibi büyük/küçük harf duyarlıdır. Ancak, Preact bir Eleman üzerinde standart bir olay tipini (tıkla, değiştir, dokunma hareketi vb.) kaydederken durumu algılar ve arka planda doğru durumu kullanır. Bu nedenle `` çalışır, çünkü olay `"click"` (küçük harf) olarak geçiyor.

---

## Deneyin!

Bu bölümün tamamlanması için, sağdaki düğme elemanının JSX'ine kendi tıklama işleyicinizi eklemeyi deneyin. İşleyicinizde, yukarıda yaptığımız gibi `console.log()` kullanarak bir mesaj kaydedin.

Kodunuz çalıştığında, düğmeye tıklayın ve olay işleyicinizi çağırın, sonra bir sonraki bölüme geçin.


  🎉 Tebrikler!
  Preact'te olayları nasıl işleyeceğinizi öğrendiniz.


```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function() {
    solutionCtx.setSolved(true);
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```

```jsx:repl-initial
import { render } from "preact";

function App() {
  return (
    <div>
      <p class="count">Count:</p>
      <button>Click Me!</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function App() {
  const clicked = () => {
    console.log('hi')
  }

  return (
    <div>
      <p class="count">Count:</p>
      <button onClick={clicked}>Click Me!</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

:::tip
Olay işleyicünüzü daha güvenilir hale getirmek için, **arrow function** ile fonksiyonu tanımlamak iyi bir uygulamadır.
:::

[MDN]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events