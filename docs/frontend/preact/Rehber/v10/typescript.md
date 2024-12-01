---
description: Preact, yerleşik TypeScript desteği sunar ve bu içerikte TypeScript'i kullanarak bileşen geliştirme ve tür güvenliğini nasıl sağlayacağınızı öğrenebilirsiniz.
keywords: [Preact, TypeScript, bileşen geliştirme, tür güvenliği, JSX]
---

# TypeScript

Preact, kütüphane tarafından kullanılan TypeScript tür tanımlarını içerir! 

:::info
Preact'i TypeScript destekleyen bir editörde (örneğin VSCode) kullandığınızda, sıradan JavaScript yazarken ek tür bilgilerinden yararlanabilirsiniz.
:::

Kendi uygulamalarınıza tür bilgisi eklemek istiyorsanız, [JSDoc açıklamaları](https://fettblog.eu/typescript-jsdoc-superpowers/) kullanabilir veya TypeScript yazıp bunu sıradan JavaScript'e derleyebilirsiniz. Bu bölüm, ikincisine odaklanacaktır.

---



---

## TypeScript yapılandırması

TypeScript, Babel yerine kullanabileceğiniz tam teşekküllü bir JSX derleyici içerir. JSX'i Preact uyumlu JavaScript'e dönüştürmek için `tsconfig.json` dosyanıza aşağıdaki yapılandırmayı ekleyin:

```json
// Klasik Dönüşüm
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    //...
  }
}
```
```json
// Otomatik Dönüşüm, TypeScript >= 4.1.1'de mevcuttur
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    //...
  }
}
```

:::tip
TypeScript'i bir Babel araç zinciri içinde kullanıyorsanız, `jsx`'yi `preserve` olarak ayarlayın ve Babel'in derlemeye devam etmesine izin verin.
:::

Doğru türleri almak için `jsxFactory` ve `jsxFragmentFactory`'yi belirtmeniz gerekir.

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    //...
  }
}
```

`.babelrc` dosyanızda:

```javascript
{
  presets: [
    "@babel/env",
    ["@babel/typescript", { jsxPragma: "h" }],
  ],
  plugins: [
    ["@babel/transform-react-jsx", { pragma: "h" }]
  ],
}
```

:::warning
`.jsx` dosyalarınızı `.tsx` olarak yeniden adlandırın, böylece TypeScript JSX'nizi doğru bir şekilde çözebilir.
:::

## TypeScript preact/compat yapılandırması

Projeniz, daha geniş React ekosistemine destek gerektirebilir. Uygulamanızın derlenmesini sağlamak için, `node_modules` üzerinde tür denetimini devre dışı bırakmanız ve türlere yollar eklemeniz gerekebilir. Bu şekilde, kütüphaneler React'i içe aktardıklarında takma adınız doğru şekilde çalışacaktır.

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

## Bileşenlerin türleri

Preact'te bileşenleri türlendirmek için farklı yollar vardır. Sınıf bileşenleri, tür güvenliğini sağlamak için genel tür değişkenlerine sahiptir. TypeScript, bir fonksiyonu fonksiyonel bileşen olarak görür, bu yüzden JSX döndürdüğü sürece geçerlidir. Fonksiyonel bileşenler için özellikleri tanımlamak için birden fazla çözüm vardır.

### Fonksiyon bileşenleri

Düzenli fonksiyon bileşenlerini türlendirmek, fonksiyon argümanlarına tür bilgisi eklemek kadar kolaydır.

```tsx
interface MyComponentProps {
  name: string;
  age: number;
};

function MyComponent({ name, age }: MyComponentProps) {
  return (
    <div>
      Benim adım {name}, {age.toString()} yaşındayım.
    </div>
  );
}
```

:::note
Varsayılan özellikler ayarlamak için fonksiyon imzasında varsayılan bir değer belirtebilirsiniz.
:::

```tsx
interface GreetingProps {
  name?: string; // ad isteğe bağlıdır!
}

function Greeting({ name = "Kullanıcı" }: GreetingProps) {
  // ad en azından "Kullanıcı"dır
  return <div>Merhaba {name}!</div>
}
```

Preact ayrıca anonim fonksiyonları not etmek için `FunctionComponent` türünü de içerir. `FunctionComponent`, `children` için de bir tür ekler:

```tsx
import { h, FunctionComponent } from "preact";

const Card: FunctionComponent<{ title: string }> = ({ title, children }) => {
  return (
    <div class="card">
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

`children` türü `ComponentChildren`'dır. Bu türü kullanarak çocukları kendi başınıza belirtebilirsiniz:

```tsx
import { h, ComponentChildren } from "preact";

interface ChildrenProps {
  title: string;
  children: ComponentChildren;
}

function Card({ title, children }: ChildrenProps) {
  return (
    <div class="card">
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

### Sınıf bileşenleri

Preact'in `Component` sınıfı, Props ve State olmak üzere iki genel tür değişkeni ile türlendirilmiştir. Her iki tür de varsayılan olarak boş nesnedir ve ihtiyaçlarınıza göre belirleyebilirsiniz.

```tsx
// Props için türler
interface ExpandableProps {
  title: string;
};

// State için türler
interface ExpandableState {
  toggled: boolean;
};


// GenişletilebilirProps ve GenişletilebilirState için genel türleri bağlayın
class Expandable extends Component<ExpandableProps, ExpandableState> {
  constructor(props: ExpandableProps) {
    super(props);
    // this.state, boolean alanı olan `toggle` içeren bir nesnedir
    // ExpandableState nedeniyle
    this.state = {
      toggled: false
    };
  }
  // `this.props.title` ExpandableProps nedeniyle string'tir
  render() {
    return (
      <div class="expandable">
        <h2>
          {this.props.title}{" "}
          <button
            onClick={() => this.setState({ toggled: !this.state.toggled })}
          >
            Değiştir
          </button>
        </h2>
        <div hidden={this.state.toggled}>{this.props.children}</div>
      </div>
    );
  }
}
```

Sınıf bileşenleri varsayılan olarak çocukları içerir ve bu, `ComponentChildren` olarak türlendirilir.

## Etkinliklerin türleri

Preact, normal DOM etkinliklerini yayar. TypeScript projeniz `dom` kütüphanesini içeriyor (bunu `tsconfig.json`'da ayarlayın), mevcut yapılandırmanızda mevcut olan tüm etkinlik türlerine erişiminiz vardır.

```tsx
export class Button extends Component {
  handleClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      alert(event.target.tagName); // BUTTON'ı uyarır
    }
  }

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}
```

Etkinlik işleyicilerini sınırlamak için ilk argüman olarak fonksiyon imzasına `this` için bir tür açıklaması ekleyebilirsiniz. Bu argüman, derleme sonrası kaldırılacaktır.

```tsx
export class Button extends Component {
  // this argümanını eklemek bağlamayı kısıtlar
  handleClick(this: HTMLButtonElement, event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      console.log(event.target.localName); // "button"
    }
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.children}</button>
    );
  }
}
```

## Referansların türleri

`createRef` fonksiyonu da genel bir türdür ve referansları öğe türlerine bağlamanızı sağlar. Aşağıdaki örnekte, referansın yalnızca `HTMLAnchorElement`'e bağlanabileceğinden emin oluyoruz. Başka herhangi bir öğe ile `ref` kullanmak, TypeScript'in bir hata vermesine neden olur:

```tsx
import { h, Component, createRef } from "preact";

class Foo extends Component {
  ref = createRef<HTMLAnchorElement>();

  componentDidMount() {
    // current türü HTMLAnchorElement'tir
    console.log(this.ref.current);
  }

  render() {
    return <div ref={this.ref}>Foo</div>;
    //          ~~~
    //       💥 Hata! Ref yalnızca HTMLAnchorElement için kullanılabilir
  }
}
```

Bu, `ref`'lerin bağlı olduğu öğelerin, örneğin odaklanabilen giriş öğeleri olduğundan emin olmak istiyorsanız çok yardımcı olur.

## Bağlamın türleri

`createContext`, geçirdiğiniz başlangıç değerlerinden mümkün olduğunca fazlasını çıkarmaya çalışır:

```tsx
import { h, createContext } from "preact";

const AppContext = createContext({
  authenticated: true,
  lang: "en",
  theme: "dark"
});
// AppContext, preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

Ayrıca, başlangıç değerinde tanımladığınız tüm özellikleri geçmeniz gerekir:

```tsx
function App() {
  // Bu hata verir 💥 çünkü tema tanımlanmamıştır
  return (
    <AppContext.Provider
      value={{
//    ~~~~~ 
// 💥 Hata: tema tanımlı değil
        lang: "de",
        authenticated: true
      }}
    >
    {}
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

Tüm özellikleri belirtmek istemiyorsanız, varsayılan değerleri geçersiz kılmalarla birleştirebilir veya belirli bir tür ile bağlamı bağlamak için genel tür değişkenini kullanarak varsayılan değer olmadan çalışabilirsiniz:

```tsx
const AppContext = createContext(appContextDefault);

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: "de",
        ...appContextDefault
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

Ya da varsayılan değerlerle çalışmadan ve bağlamı belirli bir tür ile bağlamak için genel tür değişkenini kullanarak:

```tsx
interface AppContextValues {
  authenticated: boolean;
  lang: string;
  theme: string;
}

const AppContext = createContext<Partial<AppContextValues>>({});

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: "de"
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

Tüm değerler isteğe bağlı hale gelir, bu nedenle kullanırken null kontrolleri yapmanız gerekir.

## Kancaların türleri

Çoğu kanca, özel türlendirme bilgisine ihtiyaç duymaz, ancak kullanımdan türleri çıkarabilir.

### useState, useEffect, useContext

`useState`, `useEffect` ve `useContext` tümü genel türler içerir, bu nedenle ek bir açıklama yapmanıza gerek yoktur. Aşağıda, `useState` kullanan minimal bir bileşen bulunmaktadır ve tüm türler, fonksiyon imzasının varsayılan değerlerinden çıkarılır.

```tsx
const Counter = ({ initial = 0 }) => {
  // çünkü initial bir sayı (varsayılan değer!), clicks bir sayıdır
  // setClicks, 
  // - bir sayı 
  // - bir sayı döndüren bir fonksiyon
  const [clicks, setClicks] = useState(initial);
  return (
    <>
      <p>Clicks: {clicks}</p>
      <button onClick={() => setClicks(clicks + 1)}>+</button>
      <button onClick={() => setClicks(clicks - 1)}>-</button>
    </>
  );
};
```

`useEffect`, yalnızca temizleme fonksiyonlarını döndürdüğünüzde ekstra kontroller yapar.

```typescript
useEffect(() => {
  const handler = () => {
    document.title = window.innerWidth.toString();
  };
  window.addEventListener("resize", handler);

  // ✅  eğer etkili geri dönüş fonksiyonu döndürüyorsanız
  // bu, argüman almayan bir fonksiyon olmalıdır
  return () => {
    window.removeEventListener("resize", handler);
  };
});
```

`useContext`, `createContext`'a geçirdiğiniz varsayılan nesneden tür bilgisi alır.

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
  // lang türü string olacak
  const { lang } = useContext(LanguageContext);
  return <>
    <p>Seçtiğiniz dil: {lang}</p>
  </>
}
```

### useRef

`tür oluşturma`, `createRef` gibi, `useRef` de `HTMLElement`'in bir alt türü ile genel bir tür değişkenine bağlanmaktan faydalanır. Aşağıdaki örnekte, `inputRef` yalnızca `HTMLInputElement`'e geçirilebileceğinden emin oluyoruz. `useRef`, genellikle `null` ile başlatılır, `strictNullChecks` bayrağı etkinleştirildiğinde, önce `inputRef`'in gerçekten mevcut olup olmadığını kontrol etmemiz gerekir.

```tsx
import { h } from "preact";
import { useRef } from "preact/hooks";

function TextInputWithFocusButton() {
  // null ile başlat, ancak TypeScript'e bir HTMLInputElement aradığımızı söyle
  const inputRef = useRef<HTMLInputElement>(null);
  const focusElement = () => {
    // sıkı null kontrolleri girdiğimiz için inputEl ve current'in mevcut olup olmadığını kontrol etmemiz gerekiyor.
    // ancak bir kez current mevcut olduğunda, türü HTMLInputElement'tir, bu nedenle
    // odaklanma yöntemine sahiptir! ✅
    if(inputRef && inputRef.current) {
      inputRef.current.focus();
    } 
  };
  return (
    <>
      { /* dahası, inputEl yalnızca giriş öğeleri ile kullanılabilir */ }
      <input ref={inputRef} type="text" />
      <button onClick={focusElement}>Girişi odakla</button>
    </>
  );
}
```

### useReducer

`useReducer` kancası için TypeScript, azaltıcı işlevinden mümkün olduğunca fazla tür çıkarmaya çalışır. Örneğin bir sayacı azaltan bir azaltıcı.

```typescript
// Azaltıcı işlevinin durum türü
interface StateType {
  count: number;
}

// Bir eylem türü, `type` ya "reset", "decrement", "increment" olabilir
interface ActionType {
  type: "reset" | "decrement" | "increment";
}

// İlk durum. Not açıklamaya gerek yok
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    // TypeScript, tüm olası
    // eylem türlerini ele almadığımızdan emin olur ve tür dizeleri için otomatik tamamlama sağlar
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

`useReducer` işlevini kullandığımızda, çeşitli türleri çıkararak geçerli argümanlar için tür kontrolleri yapar.

```tsx
function Counter({ initialCount = 0 }) {
  // TypeScript, azaltıcının en fazla iki argüman aldığından ve
  // başlangıç durumunun StateType türünde olduğundan emin olur.
  // Ayrıca:
  // - state, StateType türündedir
  // - dispatch, ActionType'ı dağıtan bir fonksiyondur
  const [state, dispatch] = useReducer(reducer, { count: initialCount });

  return (
    <>
      Count: {state.count}
      {/* TypeScript, dağıtılan eylemlerin ActionType türünde olduğundan emin olur */}
      <button onClick={() => dispatch({ type: "reset" })}>Sıfırla</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

Gerekli tek açıklama, azaltıcı işlevinin kendisindedir. `useReducer` türleri, azaltıcı işlevinin döndürdüğü değerin `StateType` türünde olmasını da sağlar.

## Yerleşik JSX türlerini genişletme

Özel öğeleriniz `burada` JSX'te kullanmak isteyebilir veya belirli bir kütüphaneyle çalışmak için tüm HTML öğelerine ek nitelikler eklemek isteyebilirsiniz. Bunu yapmak için `IntrinsicElements` veya `HTMLAttributes` arayüzlerini genişletmeniz gerekecektir, böylece TypeScript bunun farkında olur ve doğru tür bilgiler sağlayabilir.

### `IntrinsicElements` Genişletme

```tsx
function MyComponent() {
  return <loading-bar showing={true}></loading-bar>;
  //      ~~~~~~~~~~~
  //   💥 Hata! 'loading-bar' özelliği 'JSX.IntrinsicElements' türünde yok.
}
```

```tsx
// global.d.ts

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      'loading-bar': { showing: boolean };
    }
  }
}

// Bu boş dışa aktarma önemlidir! TS'ye bunun bir modül olarak ele alınacağını söyler
export {}
```

### `HTMLAttributes` Genişletme

```tsx
function MyComponent() {
  return <div custom="foo"></div>;
  //          ~~~~~~
  //       💥 Hata! Tür '{ custom: string; }', 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>' türüne atanamaz.
  //                   'custom' özelliği 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>' türünde yoktur.
}
```

```tsx
// global.d.ts

declare global {
  namespace preact.JSX {
    interface HTMLAttributes {
      custom?: string | undefined;
    }
  }
}

// Bu boş dışa aktarma önemlidir! TS'ye bunun bir modül olarak ele alınacağını söyler
export {}