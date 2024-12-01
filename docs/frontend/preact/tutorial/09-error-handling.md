---
description: Bu belge, Preactte hata yönetimi uygulamalarını açıklamakta ve kullanıcıların beklenmedik hatalarla başa çıkmalarına yardımcı olacak yöntemler sunmaktadır.
keywords: [JavaScript, hata yönetimi, Preact, bileşen hataları, Error Boundary]
---

# Hata Yönetimi

JavaScript, esnek bir yorumlanan dil olduğu için, çalışma zamanı hatalarıyla karşılaşmak mümkündür (ve hatta kolaydır). Beklenmedik bir senaryonun veya yazdığımız koddaki bir hatanın sonucu olarak, hataları izlemek ve bazı kurtarma yöntemleri veya zarif hata yönetimi uygulamak önemli olabilir.

:::tip 
Hata yönetimi için kullanıcı dostu mesajlar da tanımlamayı unutmayın; bu, kullanıcı deneyimini iyileştirir.
:::

Preact'te bunu yapmanın yolu hataları yakalamak ve durumu olarak saklamaktır. Bu, bir bileşenin beklenmedik veya bozuk bir render'ı yakalayıp, yedek olarak farklı bir şey render etmesini sağlar.

### Hataları duruma dönüştürmek

Hataları yakalamak ve duruma dönüştürmek için iki API mevcuttur: `componentDidCatch` ve `getDerivedStateFromError`. Fonksiyonel olarak benzerler ve her ikisi de bir sınıf bileşeni üzerinde uygulayabileceğiniz metotlardır:

**componentDidCatch**, bir `Error` argümanı alır ve durumla başa çıkma kararını duruma göre verebilir. Hatanın "yakalanması" ve işlendiği olarak işaretlenmesi için yedek veya alternatif bir ağacın render edilmesi için `this.setState()` çağrısı yapabilir. 

> "Ya da bu yöntem, hatayı bir yerde günlüğe kaydedebilir ve işlenmeden devam etmesine izin verebilir (çökmeye)." — Hata Yönetimi

**getDerivedStateFromError**, bir `Error` argümanı alan statik bir yöntemdir ve bu, bileşene uygulanan bir durum güncelleme nesnesi döndürür `setState()` aracılığıyla. Bu yöntem her zaman bir durum değişikliği ürettiği için bileşeninin yeniden render edilmesine yol açar ve hataları her zaman işlendi olarak işaretler.

Aşağıdaki örnek, ya bir yöntemi kullanarak hataları yakalamayı ve çökmeden zarif bir hata mesajı göstermeyi göstermektedir:

```jsx
import { Component } from 'preact'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error: error.message }
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({ error: error.message })
  }

  render() {
    if (this.state.error) {
      return <p>Ah hayır! Bir hatayla karşılaştık: {this.state.error}</p>
    }
    return this.props.children
  }
}
```

Yukarıdaki bileşen, Preact uygulamalarında hata yönetiminin nasıl uygulanacağına dair oldukça yaygın bir örnektir ve genellikle bir _Error Boundary_ olarak adlandırılır.

### İç içe geçiş ve hata yayılması

Preact'in Sanal DOM ağacınızı render ederken karşılaşılacak hatalar "yukarı yayılır", DOM olayları gibi. Hatanın meydana geldiği bileşenden başlayarak, ağaçtaki her üst bileşene hata iletme fırsatı verilir.

:::info
Sonuç olarak, `componentDidCatch` kullanılarak uygulanmışsa, Hata Sınırları iç içe geçebilir. Bir bileşenin `componentDidCatch()` yöntemi `setState()` çağrısı yapmazsa, hata Sanal DOM ağacında yukarı yayılmaya devam eder ve `setState()` çağrısı yapan bir `componentDidCatch` yöntemi olan bileşene ulaşır.
:::

## Deneyin!

Hata yönetimi bilgimizi test etmek için, basit bir App bileşenine hata yönetimi ekleyelim. App içinde derinlerde bulunan bileşenlerden biri bazı senaryolarda bir hata fırlatabilir ve bu hatayı yakalayarak kullanıcıya beklenmedik bir hata ile karşılaştığını belirten dostça bir mesaj göstermeliyiz.


  🎉 Tebrikler!
  Preact kodunda hataları nasıl yöneteceğinizi öğrendiniz!


```js:setup
useResult(function(result) {
  var options = require('preact').options;

  var oe = options.__e;
  options.__e = function(error, s) {
    if (/objects are not valid/gi.test(error)) {
      throw Error('Görünüşe göre doğrudan bir Hata nesnesini render etmeye çalışıyorsunuz: `error.message` yerine `error`'ı saklamayı deneyin.');
    }
    oe.apply(this, arguments);
    setTimeout(function() {
      if (result.output.textContent.match(/error/i)) {
        solutionCtx.setSolved(true);
      }
    }, 10);
  };

  return function () {
    options.__e = oe;
  };
}, []);
```

```jsx:repl-initial
import { render, Component } from 'preact';
import { useState } from 'preact/hooks';

function Clicker() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error('Hata veriyorum');
  }

  return <button onClick={() => setClicked(true)}>Bana Tıkla</button>;
}

class App extends Component {
  state = { error: null };

  render() {
    return <Clicker />;
  }
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render, Component } from 'preact';
import { useState } from 'preact/hooks';

function Clicker() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error('Hata veriyorum');
  }

  return <button onClick={() => setClicked(true)}>Bana Tıkla</button>;
}

class App extends Component {
  state = { error: null };

  componentDidCatch(error) {
    this.setState({ error: error.message });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <p>Ah hayır! Bir hata oluştu: {error}</p>
    }
    return <Clicker />;
  }
}

render(<App />, document.getElementById("app"));