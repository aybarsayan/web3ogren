---
description: Bağlam, bileşenler arasında props geçişine olanak tanır ve temaların yönetilmesine yardımcı olur. Bu belge, yeni ve eski API'leri kapsamlı bir şekilde açıklar.
keywords: [bağlam, createContext, Preact, bileşenler, tema, API, props]
---

# Bağlam

Bağlam, bir değeri her bileşen arasında props aracılığıyla geçmeden ağacın derinliklerinde bir çocuğa iletmenizi sağlar. Bunun için en popüler kullanım durumu tema olmaktır. Kısacası, bağlam, Preact'te pub-sub tarzı güncellemeleri yapmanın bir yolu olarak düşünülebilir.

:::tip
Bağlam kullanırken `createContext` API'sini tercih edin.
:::

Bağlam kullanmanın iki farklı yolu vardır: Daha yeni `createContext` API'si ve eski bağlam API'si aracılığıyla. İkisi arasındaki fark, eski olanın bir bileşen arasındaki render işlemini `shouldComponentUpdate` ile iptal ederken çocuğu güncelleyememesidir. Bu nedenle her zaman `createContext` kullanmanızı şiddetle öneriyoruz.

---



---

## createContext

Öncelikle, etrafta geçirebileceğimiz bir bağlam nesnesi oluşturmamız gerekiyor. Bu, `createContext(initialValue)` fonksiyonu aracılığıyla yapılır. Bağlam değerini ayarlamak için kullanılan bir `Provider` bileşeni ve bağlamdan değeri alan bir `Consumer` bileşeni döner.

`initialValue` argümanı, bir bağlamın ağaçta üstünde eşleşen bir `Provider` olmadığında yalnızca kullanılır. Bu, bileşenleri izolasyonda test etmek için faydalı olabilir çünkü sarıcı bir `Provider` oluşturma ihtiyacını ortadan kaldırır.

```jsx
// --repl
import { render, createContext } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => {
        return <button {...props} class={'btn ' + theme}>Temalı Buton</button>;
      }}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

> Bağlamı kullanmanın daha kolay bir yolu `useContext` kancası aracılığıyladır.

## Eski Bağlam API'si

Eski API'yi geri uyumluluk nedenleriyle dahil ediyoruz. `createContext` API'si tarafından aşılmıştır. Eski API'nin, `shouldComponentUpdate` içerisinde `false` döndüren bileşenler varsa güncellemeleri engelleme gibi bilinen sorunları vardır. Yine de bunu kullanmanız gerekiyorsa okumaya devam edin.

> Eski API ile çalışırken dikkatli olun, güncellemeler beklenildiği gibi gerçekleşmeyebilir.  
> — Dikkat

Bağlam aracılığıyla özel bir değişken iletmek için bir bileşenin `getChildContext` yöntemine sahip olması gerekir. Orada, bağlamda saklamak istediğiniz yeni değerleri döndürürsünüz. Bağlam, fonksiyon bileşenlerinde ikinci argüman veya sınıf tabanlı bileşende `this.context` aracılığıyla erişilebilir.

```jsx
// --repl
import { render } from 'preact';

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      Temalı Buton
    </button>
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: 'light'
    }
  }

  render() {
    return (
      <div>
        <SomeOtherComponent>
          <ThemedButton />
        </SomeOtherComponent>
      </div>
    );
  }
}
// --repl-after
render(<App />, document.getElementById("app"));
```