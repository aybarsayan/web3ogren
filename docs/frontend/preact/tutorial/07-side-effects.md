---
title: Yan Etkileri
description: Yan etkiler, Sanal DOM'da meydana gelen değişiklikler sırasında tetiklenen önemli kod parçacıklarıdır. Bu makalede, işlev bileşenleri ve sınıf bileşenlerinde yan etkilerin nasıl yönetileceğini öğrenin.
keywords: [yan etkiler, Sanal DOM, useEffect, bileşen yaşam döngüsü, veri çekme, Preact]
prev: /tutorial/06-context
next: /tutorial/08-keys
solvable: true
---

# Yan Etkileri

Yan etkiler, Sanal DOM ağacında değişiklikler olduğunda çalışan kod parçacıklarıdır. `props` kabul etme ve yeni bir Sanal DOM ağacı döndürme standart yaklaşımını izlemezler ve genellikle ağaç dışına çıkarak durumu değiştirmek veya DOM API'lerine çağrı yapmak gibi zorunlu kodları tetiklerler. Yan etkiler genellikle veri çekimini tetiklemek için de kullanılır.

### Etkiler: işlev bileşenlerindeki yan etkiler

:::info
Yan etkileri etkili bir şekilde yönetmek, uygulamanızın performansı ve etkinliği için kritik öneme sahiptir.
:::

Daha önce, `useRef()` kancası ve referanslar hakkında öğrendiğimiz bir bölümde yan etkilerin bir örneğini gördük. Refimiz, bir DOM öğesine işaret eden `current` özelliği ile doldurulduğunda, o öğe ile etkileşimde bulunacak kodu "tetiklemek" için bir yol bulmamız gerekiyordu.

Render'dan sonra kodu tetiklemek için en yaygın yan etki yaratma yolunun `useEffect()` kancası olduğunu kullandık:

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
  const input = useRef()

  // burada bulunan geri çağırma <App> render edildikten sonra çalışacak:
  useEffect(() => {
    // ilişkili DOM öğesine erişim:
    input.current.focus()
  }, [])

  return <input ref={input} />
}
```

**Dikkat**: `useEffect()`'e ikinci bir argüman olarak boş bir dizi geçirildiğine dikkat edin. Etki geri çağırmaları, "bağımlılıklar" dizisindeki herhangi bir değer bir render'dan diğerine değiştiğinde çalışır. Örneğin, bir bileşen ilk render edildiğinde, önceki "bağımlılıklar" dizisi değerleri ile karşılaştıracak bir şey olmadığı için tüm etki geri çağırmaları çalışır.

> "Bağımlılıklar" dizisine değerler ekleyerek bir etki geri çağırmasını koşullara göre tetikleyebiliriz; yani yalnızca bir bileşen ilk render edildiğinde değil. Bu genellikle veri değişikliklerine yanıt olarak kod çalıştırmak veya bir bileşen sayfadan kaldırıldığında ("unmounted") kullanılır.  
> — Önemli bilgi

Bir örneğe bakalım:

```js
import { useEffect, useState } from 'preact/hooks';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('<App> ilk kez render edildi')
  }, [])

  useEffect(() => {
    console.log('count değeri değişti: ', count)
  }, [count])
  //  ^ 'count' her değiştiğinde ve ilk renderda çalışır

  return <button onClick={() => setCount(count+1)}>{count}</button>
}
```

### Yaşam Döngüsü yöntemleri: sınıf bileşeni yan etkileri

Sınıf bileşenleri de Preact tarafından sağlanan [yaşam döngüsü yöntemleri] ile yan etkiler tanımlayabilir. İşte en yaygın kullanılan yaşam döngüsü yöntemlerinden bazıları:

| Yaşam döngüsü yöntemi | Ne zaman çalışır: |
|:---------------------|:-----------------|
| `componentWillMount` | bir bileşen ilk kez render edilmeden hemen önce |
| `componentDidMount`  | bir bileşen ilk kez render edildikten sonra |
| `componentWillReceiveProps` | bir bileşen yeniden render edilmeden önce |
| `componentDidUpdate` | bir bileşen yeniden render edildikten sonra |

:::tip
Sınıf bileşenlerinde yan etki kullanımının en yaygın örneklerinden biri, bir bileşen ilk kez render edildiğinde veri çekmek ve ardından bu veriyi duruma kaydetmektir.
:::

Aşağıdaki örnek, bir kere render edildiğinde JSON API'sinden kullanıcı bilgisi talep eden ve ardından o bilgiyi gösteren bir bileşeni göstermektedir.

```jsx
import { Component } from 'preact';

export default class App extends Component {
  // bu, bileşen ilk kez render edildiğinde çağrılır:
  componentDidMount() {
    // JSON kullanıcı bilgilerini al, 'state.user' içinde sakla:
    fetch('/api/user')
      .then(response => response.json())
      .then(user => {
        this.setState({ user })
      })
  }

  render(props, state) {
    const { user } = state;

    // henüz veri almadıysak, bir yükleniyor göstergesi göster:
    if (!user) return <div>Yükleniyor...</div>

    // verimiz var! API'den aldığımız kullanıcı adını göster:
    return (
      <div>
        <h2>Merhaba, {user.username}!</h2>
      </div>
    )
  }
}
```

---

## Deneyin!

Bu alıştırmayı basit tutacağız: sağdaki kod örneğini, `count` her değiştiğinde loglamak için değiştirin, yalnızca `` ilk kez render edildiğinde değil.


  🎉 Tebrikler!
  Preact'te yan etkiler kullanmayı öğrendiniz.



```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function(m, s) {
    if (/Count is now/.test(m) && s === 1) {
      solutionCtx.setSolved(true);
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count is now: ', count)
  }, []);
  // ^^ buradan başlayın!

  return <button onClick={() => setCount(count+1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count is now: ', count)
  }, [count]);
  // ^^ buradan başlayın!

  return <button onClick={() => setCount(count+1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

[yaşam döngüsü yöntemleri]: /guide/v10/components#lifecycle-methods