---
title: Kancalar
description: 'Preactte kancalar, davranışları bir araya getirmenizi ve bu mantığı farklı bileşenlerde yeniden kullanmanıza olanak tanır. Kancalar APIsi, bileşenler arasında state mantığını basit ve etkili bir şekilde yeniden kullanmayı amaçlar.'
keywords: [Preact, kancalar, API, bileşenler, state mantığı, işlevsel bileşenler, yazılım geliştirme]
---

# Kancalar

Kancalar API'si, state ve yan etkileri bir araya getiren yeni bir kavramdır. Kancalar, bileşenler arasında state mantığını yeniden kullanmanıza olanak tanır.

:::tip
Eğer bir süre Preact ile çalıştıysanız, bu zorlukları çözmeye çalışan "render props" ve "yüksek düzey bileşenler" gibi desenlere aşina olabilirsiniz.
:::

Bu çözümler genellikle kodun anlaşılmasını zorlaştırmış ve daha soyut hale getirmiştir. Kancalar API'si, state ve yan etkiler için mantığı düzenli bir şekilde çıkarmanızı mümkün kılar ve ayrıca bu mantığı, ona bağımlı bileşenlerden bağımsız olarak test etmeyi de basitleştirir.

Kancalar, herhangi bir bileşende kullanılabilir ve class bileşenler API'sinin rely olduğu `this` anahtar kelimesinin birçok tuzağından kaçınır. Bileşen örneğinden özelliklere erişmek yerine, kancalar kapsamlara güvenir. Bu, değer bağlı olmasını sağlar ve asenkron state güncellemeleriyle ilgili meydana gelebilecek pek çok güncel olmayan veri sorununu ortadan kaldırır.

Kancaları içe aktarmanın iki yolu vardır: `preact/hooks` veya `preact/compat`.

---



---

## Giriş

Kancaları anlamanın en kolay yolu, bunları eşdeğer class tabanlı bileşenlerle karşılaştırmaktır.

Bir sayıyı ve bir artırma butonunu render eden basit bir sayaç bileşeni örneği kullanacağız:

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Counter extends Component {
  state = {
    value: 0
  };

  increment = () => {
    this.setState(prev => ({ value: prev.value +1 }));
  };

  render(props, state) {
    return (
      <div>
        <p>Sayac: {state.value}</p>
        <button onClick={this.increment}>Artır</button>
      </div>
    );
  }
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Şimdi, işte kancalar kullanılarak oluşturulmuş eşdeğer bir fonksiyon bileşeni:

```jsx
// --repl
import { useState, useCallback } from "preact/hooks";
import { render } from "preact";
// --repl-before
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);

  return (
    <div>
      <p>Sayac: {value}</p>
      <button onClick={increment}>Artır</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Bu noktada, her ikisi oldukça benzer görünüyor; ancak kancalar versiyonunu daha da basitleştirebiliriz.

Sayaç mantığını özel bir kancaya çıkaralım, böylece bileşenler arasında kolayca yeniden kullanılabilir hale gelsin:

```jsx
// --repl
import { useState, useCallback } from "preact/hooks";
import { render } from "preact";
// --repl-before
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return { value, increment };
}

// İlk sayaç
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      <p>Sayaç A: {value}</p>
      <button onClick={increment}>Artır</button>
    </div>
  );
}

// Farklı bir çıkış üreten ikinci sayaç.
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1> Sayaç B: {value}</h1>
      <p>Ben güzel bir sayacım</p>
      <button onClick={increment}>Artır</button>
    </div>
  );
}
// --repl-after
render(
  <div>
    <CounterA />
    <CounterB />
  </div>,
  document.getElementById("app")
);
```

Her iki `CounterA` ve `CounterB`'nin birbirlerinden tamamen bağımsız olduğunu unutmayın. Her ikisi de `useCounter()` özel kancasını kullanır, ancak her birinin o kancayla ilişkili state'in kendi örneği vardır.

> Bunun biraz garip göründüğünü mü düşünüyorsunuz? Yalnız değilsiniz!
> 
> Birçokımızın bu yaklaşıma alışması biraz zaman aldı.

## Dependens argümanı

Birçok kanca, bir kancanın ne zaman güncellenmesi gerektiğini sınırlamak için kullanılabilecek bir argüman alır. Preact, bağımlılık dizisindeki her bir değeri kontrol eder ve son çağrıldığı zamandan bu yana değişip değişmediğini kontrol eder. Bağımlılık argümanı belirtilmediğinde, kanca her zaman yürütülür.

Yukarıdaki `useCounter()` uygulamamızda, `useCallback()`'a bir bağımlılık dizisi geçtik:

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);  // <-- bağımlılık dizisi
  return { value, increment };
}
```

Burada `value` geçmek, `value` değiştiğinde `useCallback`'in yeni bir fonksiyon referansı döndürmesini sağlar. Bu, "stale closures" (eski kapanışlar) durumunu önlemek için gereklidir ve bu, geri çağrının her zaman oluşturulduğu zamandaki ilk render'ın `value` değişkenini referans alarak `increment`'ın her zaman `1` değeri ayarlamasına neden olur.

> Bu, `value` değiştiğinde yeni bir `increment` geri çağrısı oluşturur.
> Performans nedenleriyle, genellikle state değerlerini güncellemek için bir `geri çağrı` kullanmak, bağımlılıkları kullanmaktan daha iyidir.

## Stateful kancalar

Burada, işlevsel bileşenlere stateful mantığı nasıl ekleyebileceğimizi göreceğiz.

Kancaların tanıtılmasından önce, state gerektiği her yerde sınıf bileşenleri zorunlu idi.

### useState

Bu kanca, bir argüman alır; bu ilk state olacaktır. Çağrıldığında, bu kanca iki değişken içeren bir dizi döndürür. İlki mevcut state, ikincisi ise state'imiz için setter'dır.

Setter'ımız, klasik state'imizin setter'ına benzer şekilde çalışır. Bir değer veya mevcutState'i argüman olarak alan bir fonksiyon kabul eder.

Setter'ı çağırdığınızda ve state farklı olduğunda, state'in kullanıldığı bileşenden başlayarak bir yeniden render tetikleyecektir.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // Setter'a bir geri çağrı da geçebilirsiniz
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Sayı: {count}</p>
      <button onClick={increment}>Artır</button>
      <button onClick={decrement}>Azalt</button>
    </div>
  )
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

> Başlangıç state'imiz pahalı ise, bir değer yerine bir fonksiyon geçmek daha iyidir.

### useReducer

`useReducer` kancası, [redux](https://redux.js.org/) ile yakın bir benzerlik taşır. `useState`'e kıyasla, bir sonraki state'in öncekinin dayanması gerektiği karmaşık state mantığında kullanımı daha kolaydır.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useReducer } from 'preact/hooks';

const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error('Beklenmedik eylem');
  }
};

function Counter() {
  // Mevcut state'i ve bir eylemi tetikleyecek dispatch fonksiyonunu döndürür
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('increment')}>+1</button>
      <button onClick={() => dispatch('decrement')}>-1</button>
      <button onClick={() => dispatch('reset')}>sıfırla</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## Memoizasyon

UI programlamada sıklıkla bazı hesaplamalar pahalıdır. Memoizasyon, bu hesaplamaların sonuçlarını önbelleğe alarak aynı girdi kullanıldığında yeniden kullanılmasını sağlar.

### useMemo

`useMemo` kancası ile bu hesaplamanın sonuçlarını memoize edebiliriz ve sadece bağımlılıklardan biri değiştiğinde yeniden hesaplayabiliriz.

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // Sadece bu bağımlılıklardan herhangi birisi değiştiğinde
  // pahalı fonksiyonu yeniden çalıştırın
  [a, b]
);
```

> `useMemo` içinde hiçbir etkili kod çalıştırmamaya dikkat edin. Yan etkiler `useEffect` içinde olmalıdır.

### useCallback

`useCallback` kancası, döndürülen fonksiyonun referansının, bağımlılıklar değişmediği sürece referansel eşit kalmasını sağlamak için kullanılabilir. Bu, referans eşitliğine dayanarak güncellemeleri atlamak için çocuk bileşenlerini optimize etmekte kullanılabilir (örneğin, `shouldComponentUpdate`).

```jsx
const onClick = useCallback(
  () => console.log(a, b),
  [a, b]
);
```

> Eğlenceli gerçek: `useCallback(fn, deps)` ifadesi `useMemo(() => fn, deps)` ifadesiyle eşdeğerdir.

## useRef

Bir işlevsel bileşen içinde bir DOM düğümüne referans almak için `useRef` kancası vardır. `createRef` ile benzer şekilde çalışır.

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
  // useRef'i `null` başlangıç değeriyle başlat
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Input'u Odakla</button>
    </>
  );
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> `useRef` ile `createRef`'i karıştırmamaya dikkat edin.

## useContext

Bir işlevsel bileşende bağlama erişmek için `useContext` kancasını, herhangi bir yüksek düzey veya sarmalayıcı bileşen olmadan kullanabiliriz. İlk argüman `createContext` çağrısından oluşturulmuş bağlam nesnesi olmalıdır.

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const OtherComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Aktif tema: {theme}</p>;
}

// ...sonra
function App() {
  return (
    <Theme.Provider value="light">
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  )
}
// --repl-after
render(<App />, document.getElementById("app"));
```

## Yan Etkiler

Yan etkiler, birçok modern uygulamanın kalbinde yer alır. İster bir API'den veri almak isterseniz, ister bir etkisini belge üzerinde tetiklemek isterseniz, `useEffect`'in neredeyse tüm ihtiyaçlarınızı karşıladığını göreceksiniz. Kancalar API'sinin ana avantajlarından biri, sizi etkiler hakkında düşünmeye yönlendirmesidir, bir bileşenin yaşam döngüsü yerine.

### useEffect

Adından da anlaşılacağı gibi, `useEffect` çeşitli yan etkileri tetiklemenin ana yoludur. Eğer gerekiyorsa, etkiden bir temizlik fonksiyonu bile döndürebilirsiniz.

```jsx
useEffect(() => {
  // Etkinizi tetikleyin
  return () => {
    // İsteğe bağlı: Temizlik kodu
  };
}, []);
```

Belgeye başlığı yansıtacak bir `Title` bileşeniyle başlayalım, böylece bunu tarayıcımızdaki sekme adres çubuğunda görebiliriz.

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

`useEffect`'e verilen ilk argüman, etkinin tetiklendiği argüman almaz bir geri çağrıdır. Bizim durumumuzda, yalnızca başlığın gerçekten değiştiğinde tetiklemek istiyoruz. Aynı kaldığında güncellemeye hiç gerek yoktur. Bu nedenle, `bağımlılık dizisini` belirtmek için ikinci argümanı kullanıyoruz.

Ama bazen daha karmaşık bir kullanım durumuna sahip olabiliriz. Bir bileşenin mount olduğunda bazı verilere abone olması ve unmount olduğunda bunun aboneliğini iptal etmesi gerektiğini düşünün. Bu da `useEffect` ile gerçekleştirilebilir. Herhangi bir temizleme kodu çalıştırmak için, geri çağrımızda bir fonksiyon döndürmemiz yeterlidir.

```jsx
// --repl
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
// Her zaman mevcut pencere genişliğini görüntüleyen bileşen
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <p>Pencere genişliği: {width}</p>;
}
// --repl-after
render(<WindowWidth />, document.getElementById("app"));
```

> Temizlik fonksiyonu isteğe bağlıdır. Eğer herhangi bir temizleme kodu çalıştırmanıza gerek yoksa, `useEffect`'e geçirilen geri çağrıda hiçbir şey döndürmenize gerek yoktur.

### useLayoutEffect

İmzası `useEffect` ile aynıdır, ancak bileşen karşılaştırıldıktan hemen sonra tetiklenir ve tarayıcının boyama şansı vardır.

### useErrorBoundary

Herhangi bir çocuk bileşeni bir hata attığında, bunu yakalamak ve kullanıcıya özel bir hata UI'si göstermek için bu kancayı kullanabilirsiniz.

```jsx
// error = Yakalanan hata veya hiçbir şey hata yoksa `undefined`.
// resetError = Bu fonksiyonu çağırarak bir hatayı çözüldü olarak işaretleyin. Bu
//   sizin uygulamanıza bağlıdır ve bunun ne anlama geldiğini ve hatalardan
//   geri hale gelmenin mümkün olup olmadığını karar verir.
const [error, resetError] = useErrorBoundary();
```

Gözlem amaçları için, herhangi bir hatadan bir hizmeti bilgilendirmek genellikle son derece yararlıdır. Bunun için isteğe bağlı bir geri çağrıyı kullanabiliriz ve bunu `useErrorBoundary`'ye ilk argüman olarak geçebiliriz.

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

Tam bir kullanım örneği şöyle görünebilir:

```jsx
const App = props => {
  const [error, resetError] = useErrorBoundary(
    error => callMyApi(error.message)
  );

  // Güzel bir hata mesajı görüntüle
  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <button onClick={resetError}>Tekrar dene</button>
      </div>
    );
  } else {
    return <div>{props.children}</div>
  }
};
```

> Önceden sınıf tabanlı bileşen API'sini kullandıysanız, o zaman bu kanca, `componentDidCatch` yaşam döngüsü metodunun bir alternatifidir. Bu kanca Preact 10.2.0 ile tanıtılmıştır.

## Yardımcı Kancalar

### useId

Bu kanca, her bir çağırma için benzersiz bir tanımlayıcı oluşturacak ve bunların hem `sunucuda` hem de istemcide aynı şekilde işlenmesini garantileyecektir. Tutarlı kimlikler için yaygın bir kullanım durumu formlardır. `` öğeleri, belirli bir `` öğesi ile ilişkilendirmek için [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for) özniteliğini kullanır. `useId` kancası sadece formlar ile sınırlandırılmamıştır ve her yerde benzersiz bir kimliğe ihtiyaç duyduğunuzda kullanılabilir.

> Kancayı tutarlı hale getirmek için, Preact'i hem sunucuda hem de istemcide kullanmalısınız.

Tam bir kullanım örneği şöyle görünebilir:

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])
  
  // Benzersiz bir ID ile bir girdi görüntüle.
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> Bu kanca Preact 10.11.0 ile tanıtılmıştır ve preact-render-to-string 5.2.4 gerektirir.