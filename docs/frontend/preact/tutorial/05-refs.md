---
description: Bu içerik, Preact'ta refs kullanımını ve bunların nasıl DOM elementleri ile etkileşimde bulunduğunu detaylandırmaktadır. Ayrıca, fonksiyon bileşenleri için `useRef` ve `useEffect` hook'larının kullanımını da açıklamaktadır.
keywords: [Preact, refs, useRef, useEffect, DOM, komponentler, geliştirici rehberi]
---

# Refs

İlk bölümde öğrendiğimiz gibi, DOM bir zorunlu API sağlar, bu da elementler üzerinde fonksiyonları çağırarak değişiklik yapmamıza olanak tanır. Preact bileşeninden zorunlu DOM API'sine erişmemiz gereken bir örnek, bir input elementine otomatik olarak odaklanmak olabilir.

`autoFocus` prop'u (veya `autofocus` attribute'u) bir input'a ilk kez render edildiğinde odaklanmak için kullanılabilir, ancak belirli bir zamanda ya da belirli bir olaya yanıt olarak bir input'a odaklanmamız gereken durumlar vardır.

:::info
DOM elementleriyle doğrudan etkileşimde bulunmamız gereken bu durumlar için "refs" adı verilen bir özellik kullanabiliriz.
:::

DOM elementleriyle doğrudan etkileşimde bulunmamız gereken bu durumlar için "refs" adı verilen bir özellik kullanabiliriz. Bir ref, herhangi bir değere işaret eden `current` özelliğine sahip basit bir JavaScript nesnesidir. JavaScript nesneleri referans ile iletildiği için, bir ref nesnesine erişim sağlayan herhangi bir fonksiyon, `current` özelliğini kullanarak değerini alabilir veya ayarlayabilir. Preact, ref nesnelerindeki değişiklikleri takip etmez, bu nedenle, render sırasında bilgi depolamak için kullanılabilirler ve daha sonra ref nesnesine erişimi olan herhangi bir fonksiyon tarafından erişilebilir.

> Ref özelliğinin doğrudan kullanımının nasıl göründüğünü hiçbir şey render etmeden görebiliriz.  
> — Preact Documentation

```js
import { createRef } from 'preact'

// create a ref:
const ref = createRef('initial value')
// { current: 'initial value' }

// read a ref's current value:
ref.current === 'initial value'

// update a ref's current value:
ref.current = 'new value'

// pass refs around:
console.log(ref) // { current: 'new value' }
```

Preact'ta refs'i kullanışlı kılan şey, bir ref nesnesinin bir Virtual DOM elementine render sırasında geçirilebilmesidir. Preact, ref'in değerini (yani `current` özelliğini) ilgili HTML elementine ayarlayacaktır. Ayarlandıktan sonra, ref'in mevcut değerini kullanarak HTML elementine erişebilir ve değiştirebiliriz:

```jsx
import { createRef } from 'preact';

// create a ref:
const input = createRef()

// pass the ref as a prop on a Virtual DOM element:
render(<input ref={input} />, document.body)

// access the associated DOM element:
input.current // an HTML <input> element
input.current.focus() // focus the input!
```

:::warning
`createRef()`'in global olarak kullanılması önerilmez, çünkü birden fazla render ref'in mevcut değerini üzerine yazacaktır. Bunun yerine, ref'leri sınıf özellikleri olarak depolamak en iyisidir.
:::

```jsx
import { createRef, Component } from 'preact';

export default class App extends Component {
  input = createRef()

  // this function runs after <App> is rendered
  componentDidMount() {
    // access the associated DOM element:
    this.input.current.focus();
  }

  render() {
    return <input ref={this.input} />
  }
}
```

Fonksiyon bileşenleri için, bir `useRef()` hook'u, bir ref oluşturmanın ve o aynı ref'e sonraki render'larda erişmenin pratik bir yolunu sağlar. Aşağıdaki örnek, bileşenimiz render edildikten sonra bir geri çağırmayı çağırmak için `useEffect()` hook'unun nasıl kullanıldığını da gösterir; burada ref'in mevcut değeri HTML input elementine ayarlanacaktır:

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
  // create or retrieve our ref:  (hook slot 0)
  const input = useRef()

  // the callback here will run after <App> is rendered:
  useEffect(() => {
    // access the associated DOM element:
    input.current.focus()
  }, [])

  return <input ref={input} />
}
```

:::note
Unutmayın, refs yalnızca DOM elementlerini depolamakla sınırlı değildir. Ekstra render oluşturacak bir durumu ayarlamadan bileşenin renderları arasında bilgi depolamak için de kullanılabilirler. Bunu daha sonraki bir bölümde göreceğiz.
:::

## Deneyin!

Şimdi, tıkladığımızda bir input alanına odaklanan bir buton oluşturarak bunu pratiğe dökelim.



```js:setup
function patch(input) {
  if (input.__patched) return;
  input.__patched = true;
  var old = input.focus;
  input.focus = function() {
    solutionCtx.setSolved(true);
    return old.call(this);
  };
}

useResult(function (result) {
  var expectedInput;
  var timer;
  [].forEach.call(result.output.querySelectorAll('input'), patch);

  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (e.currentTarget.localName !== 'button') return;
    clearTimeout(timer);
    var input = e.currentTarget.parentNode.parentNode.querySelector('input');
    expectedInput = input;
    if (input) patch(input);
    timer = setTimeout(function() {
      if (expectedInput === input) {
        expectedInput = null;
      }
    }, 10);
    if (oe) return oe.apply(this, arguments);
  }

  return function () {
    options.event = oe;
  };
}, []);
```

```jsx:repl-initial
import { render } from 'preact';
import { useRef } from 'preact/hooks';

function App() {
  function onClick() {

  }

  return (
    <div>
      <input defaultValue="Merhaba Dünya!" />
      <button onClick={onClick}>Input'a odaklan</button>
    </div>
  );
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useRef } from 'preact/hooks';

function App() {
  const input = useRef();

  function onClick() {
    input.current.focus();
  }

  return (
    <div>
      <input ref={input} defaultValue="Merhaba Dünya!" />
      <button onClick={onClick}>Input'a odaklan</button>
    </div>
  );
}

render(<App />, document.getElementById("app"));
```