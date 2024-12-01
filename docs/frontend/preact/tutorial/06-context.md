---
description: Bağlam, Preact ile bileşenler arasında veri paylaşımını otomatikleştirir. Bu bölüm, bağlamın nasıl kullanılacağına dair örnekler sunarak derinlemesine bilgi sağlar.
keywords: [Preact, bağlam, Provider, Consumer, useContext, kimlik doğrulama, bileşen]
---

# Bağlam

Bir uygulama büyüdükçe, sanal DOM ağacı genellikle derinlemesine iç içe geçmiş hale gelir ve birçok farklı bileşenden oluşur. Ağacın çeşitli yerlerindeki bileşenler, bazen yaygın verilere erişmek zorundadır - genellikle kimlik doğrulama, kullanıcı profili bilgisi, önbellekler, depolama gibi uygulama durumu parçalarıdır. Tüm bu bilgileri ağaç boyunca bileşen prop'ları olarak iletmek mümkün olsa da, bu durumda her bileşenin bu durumun farkında olması gerekir - bu durumda tüm yaptığı sadece durumu ağaç boyunca iletmek olsa bile.

:::tip
Bağlam, değerleri ağaç boyunca _otomatik olarak_ iletmemizi sağlayan bir özelliktir ve bileşenlerin herhangi bir şeyin farkında olmasına gerek yoktur.
:::

Bu, Bir Sağlayıcı/Tüketici yaklaşımı kullanılarak gerçekleştirilir:

- `` bağlamın değerini bir ..., including all children">alt ağaçta ayarlar
- `` en yakın üst  tarafından ayarlanan bağlam değerini alır

Başlamak için, sadece bir bileşen içeren basit bir örneğe bakalım. Bu durumda, bir "Kullanıcı Adı" bağlam değeri sağlıyoruz _ve_ bu değeri tüketiyoruz:

```jsx
import { createContext } from 'preact'

const Username = createContext()

export default function App() {
  return (
    // kullanıcı adı değerini alt ağaçlarımıza sağla:
    <Username.Provider value="Bob">
      <div>
        <p>
          <Username.Consumer>
            {username => (
              // bağlamdan geçerli kullanıcı adını al:
              <span>{username}</span>
            )}
          </Username.Consumer>
        </p>
      </div>
    </Username.Provider>
  )
}
```

:::info
Gerçek kullanımda, bağlam nadiren aynı bileşen içinde sağlanır ve tüketilir - bileşen durumu genellikle bu durumda en iyi çözümdür.
:::

### Kancalar ile kullanım

Bağlam `` API'si çoğu kullanım durumu için yeterlidir, ancak kapsama için iç içe geçmiş işlevlere dayandığı için yazması biraz zahmetli olabilir. Fonksiyon bileşenleri yerine Preact'in `useContext()` kancasını kullanmayı tercih edebilir, bu kancanın yaptığı şey bağlamın sanal DOM ağacındaki bileşenin konumundaki değerini döndürmektir. 

İşte önceki örnek tekrar, bu sefer iki bileşene bölündü ve bağlamın geçerli değerini almak için `useContext()` kullanıldı:

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Username = createContext()

export default function App() {
  return (
    <Username.Provider value="Bob">
      <div>
        <p>
          <User />
        </p>
      </div>
    </Username.Provider>
  )
}

function User() {
  // bağlamdan geçerli kullanıcı adını al:
  const username = useContext(Username) // "Bob"
  return <span>{username}</span>
}
```

:::note
`User`'ın birden fazla Bağlamın değerine erişmesi gereken bir durumu hayal edebiliyorsanız, daha basit `useContext()` API'si çok daha kolay takip edilebilir.
:::

### Gerçekçi kullanım

Bağlamın daha gerçekçi bir kullanımı, bir uygulamanın kimlik doğrulama durumunu (kullanıcının giriş yapıp yapmadığı) saklamak olacaktır. 

Bunu yapmak için, saklamak için bir bağlam oluşturabiliriz, buna `AuthContext` diyeceğiz. AuthContext'in değeri, oturum açmış kullanıcımızı içeren bir `user` özelliğinin yanı sıra bu durumu değiştirmek için bir `setUser` yöntemi içeren bir nesne olacaktır.

```jsx
import { createContext } from 'preact'
import { useState, useMemo, useContext } from 'preact/hooks'

const AuthContext = createContext()

export default function App() {
  const [user, setUser] = useState(null)

  const auth = useMemo(() => {
    return { user, setUser }
  }, [user])

  return (
    <AuthContext.Provider value={auth}>
      <div class="app">
        {auth.user && <p>Hoş geldin {auth.user.name}!</p>}
        <Login />
      </div>
    </AuthContext.Provider>
  )
}

function Login() {
  const { user, setUser } = useContext(AuthContext)

  if (user) return (
    <div class="logged-in">
      {user.name} olarak giriş yapıldı.
      <button onClick={() => setUser(null)}>
        Çıkış Yap
      </button>
    </div>
  )

  return (
    <div class="logged-out">
      <button onClick={() => setUser({ name: 'Bob' })}>
        Giriş Yap
      </button>
    </div>
  )
}
```

### İç içe geçmiş bağlam

Bağlamın önemli bir süper gücü vardır ve büyük uygulamalarda oldukça kullanışlı hale gelir: bağlam sağlayıcıları, sanal DOM alt ağacında değerlerini "aşmak" için iç içe geçirilebilir. URL yollarına göre çeşitli kullanıcı arayüzü parçalarının gösterildiği bir web tabanlı e-posta uygulaması hayal edin:

> - `/inbox`: gelen kutusunu göster
> - `/inbox/compose`: gelen kutusunu ve yeni bir mesajı göster
> - `/settings`: ayarları göster
> - `/settings/forwarding`: yönlendirme ayarlarını göster

Geçerli yol bir verilen yol segmentiyle eşleştiğinde yalnızca bir Sanal DOM ağacı oluşturan bir `` bileşeni oluşturabiliriz. İç içe geçmiş Yolları tanımlamayı basitleştirmek için, her eşleşen Yol, kendi alt ağacında "geçerli yol" bağlam değerini, eşleşen yol parçasını hariç tutacak şekilde geçersiz kılabilir.

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Path = createContext(location.pathname)

function Route(props) {
  const path = useContext(Path) // geçerli yol
  const isMatch = path.startsWith(props.path)
  const innerPath = path.substring(props.path.length)
  return isMatch && (
    <Path.Provider value={innerPath}>
      {props.children}
    </Path.Provider>
  )
}
```

:::warning
Bu yeni `Route` bileşenini e-posta uygulamasının arayüzünü tanımlamak için kullanabiliriz. `Inbox` bileşeninin çocukları için `` eşleşmesini tanımlamak için kendi yolunu bilmeye ihtiyaç duymadığını unutmayın.
:::

```jsx
export default function App() {
  return (
    <div class="app">
      <Route path="/inbox">
        <Inbox />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
    </div>
  )
}

function Inbox() {
  return (
    <div class="inbox">
      <div class="messages"> ... </div>
      <Route path="/compose">
        <Compose />
      </Route>
    </div>
  )
}

function Settings() {
  return (
    <div class="settings">
      <h1>Ayarlar</h1>
      <Route path="/forwarding">
        <Forwarding />
      </Route>
    </div>
  )
}
```

### Varsayılan bağlam değeri

İç içe geçmiş bağlam güçlü bir özelliktir ve genellikle farkında olmadan kullanırız. Örneğin, bu bölümün ilk örneğinde, ağaç içinde bir `Username` bağlam değeri tanımlamak için `` kullandık.

Ancak, bu aslında `Username` bağlamının varsayılan değerini geçersiz kılıyordu. Tüm bağlamların bir varsayılan değeri vardır, bu da `createContext()`'e ilk argüman olarak geçirilen değerdir. Örnekte, `createContext`'e hiçbir argüman geçmedik, bu nedenle varsayılan değer `undefined` olarak kaldı.

:::note
İlk örneğin, bir Sağlayıcı yerine varsayılan bağlam değerini kullanarak nasıl görüneceğini şöyle gösterebiliriz:
:::

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Username = createContext('Bob')

export default function App() {
  const username = useContext(Username) // "Bob" döndürür

  return <span>{username}</span>
}
```

## Deneyin!

Bir alıştırma olarak, önceki bölümde oluşturduğumuz sayacın bir _senkronize_ versiyonunu oluşturalım. Bunu yapmak için, bu bölümdeki kimlik doğrulama örneğinden `useMemo()` tekniğini kullanmak isteyeceksiniz. Alternatif olarak, `count` değerini paylaşmak için bir bağlam ve değeri güncellemek için bir `increment` işlevi paylaşmak üzere _iki_ bağlam tanımlayabilirsiniz.


  🎉 Tebrikler!
  Preact'de bağlam nasıl kullanılır öğrendiniz.


```js:setup
var output = useRef();

function getCounts() {
  var counts = [];
  var text = output.current.innerText;
  var r = /Count:\s*([\w.-]*)/gi;
  while (t = r.exec(text)) {
    var num = Number(t[1]);
    counts.push(isNaN(num) ? t[1] : num);
  }
  return counts;
}

useResult(function (result) {
  output.current = result.output;

  if (getCounts().length !== 3) {
    console.warn('Görünüşe göre `count` değerini 0 olarak başlatmamışsınız.');
  }
  
  var timer;
  var count = 0;
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (e.currentTarget.localName !== 'button') return;
    clearTimeout(timer);
    timer = setTimeout(function() {
      var counts = getCounts();
      if (counts.length !== 3) {
        return console.warn('Bir sayaç eksik gibi görünüyor.');
      }
      if (counts[0] !== counts[2] || counts[0] !== counts[1]) {
        return console.warn('Sayaçların senkronize olmadığını görünüyor.');
      }
      var solved = counts[0] === ++count;
      store.setState({ solved: solved });
    }, 10);
    if (oe) return oe.apply(this, arguments);
  }

  return function () {
    options.event = oe;
  };
}, []);
```

```jsx:repl-initial
import { render, createContext } from 'preact';
import { useState, useContext, useMemo } from 'preact/hooks';

const CounterContext = createContext(null);

function Counter() {
  return (
    <div style={{ background: '#eee', padding: '10px' }}>
      <p>Count: {'MISSING'}</p>
      <button>Add</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Counter />
      <Counter />
      <Counter />
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render, createContext } from 'preact';
import { useState, useContext, useMemo } from 'preact/hooks';

const CounterContext = createContext(null);

function Counter() {
  const { count, increment } = useContext(CounterContext);

  return (
    <div style={{ background: '#eee', padding: '10px' }}>
      <p>Count: {count}</p>
      <button onClick={increment}>Add</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  const counter = useMemo(() => {
    return { count, increment };
  }, [count]);

  return (
    <CounterContext.Provider value={counter}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Counter />
        <Counter />
        <Counter />
      </div>
    </CounterContext.Provider>
  )
}

render(<App />, document.getElementById("app"));