---
title: TypeScript Kullanımı
seoTitle: TypeScript ile React Kullanım Kılavuzu
sidebar_position: 1
description: TypeScript, JavaScript projelerinde tür tanımlamaları eklemek için kullanılır. Bu kılavuz, TypeScript ile React kullanmanın temellerini kapsar.
tags: 
  - TypeScript
  - React
  - JavaScript
  - web-development
keywords: 
  - TypeScript
  - React
  - JSX
  - JavaScript
  - web-development
---
TypeScript, JavaScript kod tabanlarına tür tanımlamaları eklemekte popüler bir yöntemdir. Kutudan çıktığı gibi TypeScript `JSX'i destekler` ve projeye [`@types/react`](https://www.npmjs.com/package/@types/react) ve [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) ekleyerek tam React Web desteği alabilirsiniz.





* `React Bileşenleri ile TypeScript`
* `Kancalarla yazma örnekleri`
* `@types/react`'den ortak türler`
* `Daha fazla öğrenme kaynakları`



## Kurulum {/*installation*/}

Tüm `üretim kalitesindeki React çerçeveleri` TypeScript kullanımı için destek sunar. Kurulum için çerçeveye özel kılavuzu izleyin:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Var olan bir React projesine TypeScript ekleme {/*adding-typescript-to-an-existing-react-project*/}

React'in tür tanımlamalarının son sürümünü yüklemek için:


npm install @types/react @types/react-dom


`tsconfig.json` dosyanızda aşağıdaki derleyici seçeneklerini ayarlamanız gerekmektedir:

1. `dom` [`lib`](https://www.typescriptlang.org/tsconfig/#lib) içinde bulunmalıdır (Not: Eğer `lib` seçeneği belirtilmezse, default olarak `dom` dahil edilir).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) geçerli seçeneklerden birine ayarlanmalıdır. `preserve` çoğu uygulama için yeterli olmalıdır.
   Eğer bir kütüphane yayınlıyorsanız, ne tür bir değer seçeceğinize dair [`jsx` belgelerine](https://www.typescriptlang.org/tsconfig/#jsx) danışın.

## React Bileşenleri ile TypeScript {/*typescript-with-react-components*/}



JSX bulunan her dosya `.tsx` uzantısını kullanmalıdır. Bu, TypeScript'in bu dosyanın JSX içerdiğini anlamasını sağlayan TypeScript'e özgü bir uzantıdır.



React ile TypeScript yazmak, React ile JavaScript yazmaya çok benzerdir. Bir bileşenle çalışmanın ana farkı, bileşeninizin prop'ları için türler sağlayabilmenizdir. Bu türler doğruluk kontrolü için ve editörlerde çevrimiçi belgeler sağlamak için kullanılabilir.

`Hızlı Başlangıç` kılavuzundaki `MyButton` bileşeni`'ni alarak butonun `title`'ını tanımlayan bir tür ekleyebiliriz:



```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoş geldiniz</h1>
      <MyButton title="Ben bir butonum" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```




Bu kumandalar TypeScript kodunu işleyebilir, ancak tür denetleyicisini çalıştırmaz. Bu, TypeScript kumandalarını öğrenmek için değiştirebileceğiniz anlamına gelir, ancak hiçbir tür hatası veya uyarısı almayacaksınız. Tür denetimi almak için [TypeScript Playground](https://www.typescriptlang.org/play) kullanabilir veya daha kapsamlı bir çevrimiçi kumanda kullanabilirsiniz.



Bu çevrimiçi sözdizimi, bir bileşen için türler sağlamak için en basit yoldur, ancak tanımlamak için birkaç alana sahip olduğunuzda karmaşıklaşabilir. Bunun yerine, bileşenin prop'larını tanımlamak için bir `interface` veya `type` kullanabilirsiniz:



```tsx src/App.tsx active
interface MyButtonProps {
  /** Buton içinde görüntülenecek metin */
  title: string;
  /** Butona etkileşim yapılabilir mi */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoş geldiniz</h1>
      <MyButton title="Ben devre dışı bir butonum" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```



Bileşeninizin prop'larını tanımlayan tür, ihtiyaç duyduğunuz kadar basit veya karmaşık olabilir, ancak bir `type` veya `interface` ile tanımlanmış bir nesne türü olmalıdır. TypeScript'in nesneleri nasıl tanımladığı hakkında daha fazla bilgi edinmek isterseniz [Nesne Türleri](https://www.typescriptlang.org/docs/handbook/2/objects.html) ve bir prop'un birkaç farklı türden biri olabileceğini açıklamak için [Birlik Türleri](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) ve daha kapsamlı kullanım durumları için [Türlerden Türler Oluşturma](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) kılavuzuna göz atabilirsiniz.

## Örnek Kancalar {/*example-hooks*/}

`@types/react`'ten gelen tür tanımlamaları, yerleşik Kancalar için türleri içerir, bu nedenle bileşenlerinizde ek bir kurulum olmadan bunları kullanabilirsiniz. Kullandığınız koda göre, çoğu zaman [çıkarılan türler](https://www.typescriptlang.org/docs/handbook/type-inference.html) alırsınız ve ideal olarak türleri sağlama detaylarıyla uğraşmak zorunda kalmazsınız.

Ancak, Kancalar için tür sağlamanın birkaç örneğine bakalım.

### `useState` {/*typing-usestate*/}

`useState` Kancası`, ilk durumda geçen değeri yeniden kullanarak değerin türünün ne olması gerektiğini belirleyecektir. Örneğin:

```ts
// Türü "boolean" olarak çıkar
const [enabled, setEnabled] = useState(false);
```

Bu, `enabled` için türü `boolean` atar ve `setEnabled` `boolean` argümanı alan veya `boolean` döndüren bir fonksiyon olarak tanımlanır. Eğer duruma açıkça bir tür sağlamak istiyorsanız, bunu `useState` çağrısına bir tür argümanı sağlayarak yapabilirsiniz:

```ts
// Türü "boolean" olarak açıkça ayarla
const [enabled, setEnabled] = useState<boolean>(false);
```

Bu durumda çok faydalı değildir, ancak union türü olan bir duruma tür sağlamak istediğinizde yaygın bir durumdur. Örneğin, `status` burada birkaç farklı dizeden biri olabilir:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Veya, `durum yapılandırmasını organize etme ilkeleri` önerildiği gibi, ilişkili durumu bir nesne olarak gruplandırabilir ve farklı olasılıkları nesne türleri ile tanımlayabilirsiniz:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

`useReducer` Kancası`, bir azaltıcı fonksiyon ve bir başlangıç durumu alır. Azaltıcı fonksiyon için türler ilk durumdan çıkarılır. İsterseniz, `useReducer` çağrısına bir tür argümanı sağlayarak duruma bir tür sağlayabilirsiniz, ancak genellikle türü başlangıç durumuna ayarlamak daha iyidir:



```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Bilinmeyen işlem");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Sayaç uygulamama hoş geldiniz</h1>

      <p>Sayım: {state.count}</p>
      <button onClick={addFive}>5 ekle</button>
      <button onClick={reset}>Sıfırla</button>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```



TypeScript'i birkaç önemli yerde kullanıyoruz:

- `interface State`, azaltıcının durumunun şeklini tanımlar.
- `type CounterAction`, azaltıcıya iletilebilecek farklı eylemleri tanımlar.
- `const initialState: State`, başlangıç durumu için bir tür sağlar ve ayrıca `useReducer` tarafından default olarak kullanılan türdür.
- `stateReducer(state: State, action: CounterAction): State`, azaltıcı fonksiyonunun argümanları ve dönüş değeri için türleri ayarlar.

`initialState` üzerinde tür ayarlamanın daha açık bir alternatifi, `useReducer`'a bir tür argümanı sağlamaktır:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

`useContext` Kancası`, verileri bileşen ağacında aşağı doğru iletmek için bir tekniktir; bileşenler aracılığıyla prop'ları iletmenize gerek kalmadan kullanılabilir. Bu, bir sağlayıcı bileşen oluşturarak ve genellikle bir çocuk bileşeninde değeri tüketmek için bir Kanca oluşturarak kullanılır.

Kapsayıcı tarafından sağlanan değerin türü, `createContext` çağrısına geçilen değerden çıkarılır:



```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Geçerli tema: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```



Bu teknik, mantıklı bir varsayılan değere sahip olduğunuzda çalışır - ancak bazen böyle bir değer yoksa, bu durumda varsayılan değer olarak `null` mantıklı olabilir. Ancak, tür sisteminin kodunuzu anlaması için `createContext` üzerinde açıkça `ContextShape | null` ayarlamanız gerekir. 

Bu, kapsayıcı tüketiciler için `| null` ifadesini ortadan kaldırmanız gerektiği sorununu doğurur. Önerimiz, Kancanın varlığını runtime kontrol etmesi ve mevcut olmadığında bir hata fırlatmasıdır:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Bu daha basit bir örnektir, ama burada daha karmaşık bir nesneyi hayal edebilirsiniz
type ComplexObject = {
  kind: string
};

// Kapsayıcı, varsayılan değeri doğru şekilde yansıtmak için `| null` kullanılarak oluşturulmuştur.
const Context = createContext<ComplexObject | null>(null);

// `| null` ifadesi Kancadaki kontrol aracılığıyla kaldırılacak.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject, bir Sağlayıcı içinde kullanılmalıdır") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Geçerli nesne: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

`useMemo` Kancası, bir fonksiyon çağrısından bir hafızalı değerin oluşturulmasını/erişilmesini sağlar; yalnızca 2. parametrede belirtilen bağımlılıklar değiştiğinde fonksiyonu yeniden çalıştırır. Kancanın çağrılma sonucu, ilk parametredeki fonksiyonun döndürdüğü değerden çıkarılır. Kanca üzerinde bir tür argümanı sağlayarak daha açık olabilirsiniz.

```ts
// visibleTodos'ın türü filterTodos'un döndürdüğü değerden çıkar
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback` {/*typing-usecallback*/}

`useCallback` ikinci parametrede geçirilen bağımlılıklar aynı kaldığı sürece bir fonksiyona sabit bir referans sağlar. `useMemo` gibi, fonksiyonun türü ilk parametredeki fonksiyonun döndürdüğü değerden çıkarılır ve Kanca'ya daha açık bir tür argümanı sağlayarak daha da açık olabilirsiniz.

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript katı modunda çalışırken `useCallback`, geri çağırma içindeki parametrelere tür eklemeyi gerektirir. Bunun nedeni, geri çağırmanın türünün fonksiyonun dönüş değerinden çıkarılmasıdır ve parametreler olmadan tür tamamen anlaşılamaz.

Kod stili tercihinize bağlı olarak, geriye dönüş fonksiyonunu tanımlarken etkinlik işleyicisi türü ile birlikte sağlamak için React türlerindeki `*EventHandler` fonksiyonlarını kullanabilirsiniz:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Beni Değiştir");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Değer: {value}</p>
    </>
  );
}
```

## Kullanışlı Türler {/*useful-types*/}

`@types/react` paketinden gelen oldukça geniş bir tür seti bulunmaktadır, React ve TypeScript'in nasıl etkileşime girdiğini anladıktan sonra göz atmaya değer. Bunları [DefinitelyTyped'deki React klasöründe](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts) bulabilirsiniz. Burada daha yaygın türlerden birkaçını kapsayacağız.

### DOM Olayları {/*typing-dom-events*/}

React'te DOM olaylarıyla çalışırken, olayın türü genellikle olay işleyicisinden çıkarılabilir. Ancak, bir etkinliği olay işleyicisine geçirmek için bir fonksiyonu dışa aktarmak istediğinizde, olayın türünü açıkça ayarlamanız gerekecektir.



```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Beni Değiştir");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Değer: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```



React türlerinde sağlanan birçok olay türü bulunmaktadır - tam liste [burada](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) bulunabilir ve bu liste [DOM'daki en popüler olaylara](https://developer.mozilla.org/en-US/docs/Web/Events) dayanmaktadır.

Aradığınız türü belirlerken, kullandığınız olay işleyicisi için ipucu bilgilerine bakabilirsiniz; bu ipucu, olayın türünü gösterecektir.

Eğer bu listede yer almayan bir olayı kullanmanız gerekiyorsa, tüm olayların temel türü olan `React.SyntheticEvent` türünü kullanabilirsiniz.

### Çocuklar {/*typing-children*/}

Bir bileşenin çocuklarını tanımlamanın iki yaygın yolu vardır. İlk yol, JSX'te çocuk olarak geçirilebilecek tüm olası türlerin birleşimi olan `React.ReactNode` türünü kullanmaktır:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Bu, çocuklar için çok geniş bir tanımdır. İkinci yol ise, yalnızca JSX öğeleri içeren `React.ReactElement` türünü kullanmaktır, bu da JavaScript ilkel türlerini (string veya number gibi) içermez:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Dikkat edilmesi gereken nokta; TypeScript'i kullanarak çocukların belirli bir türde JSX öğeleri olduğunu tanımlayamazsınız. Bu nedenle, yalnızca `` çocuklarını kabul eden bir bileşeni tanımlamak için tür sistemini kullanamazsınız.

`React.ReactNode` ve `React.ReactElement` türlerinin tür denetleyicisinde nasıl çalıştığını görmek için [bu TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA) örneğine bakabilirsiniz.

### Stil Props {/*typing-style-props*/}

React'te satır içi stiller kullanırken, `style` prop'una geçirilen nesneyi tanımlamak için `React.CSSProperties` kullanabilirsiniz. Bu tür, tüm olası CSS özelliklerinin birleşimidir ve `style` prop'una geçerli CSS özellikleri geçirdiğinizden emin olmak için iyi bir yoldur ve editörünüzde otomatik tamamlama sağlar.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Daha Fazla Öğrenme {/*further-learning*/}

Bu kılavuz, TypeScript'i React ile kullanmanın temellerini kapsadı, ancak öğrenilecek çok daha fazla şey var. 
Belgelerdeki bireysel API sayfaları, bunları TypeScript ile nasıl kullanacağınız konusunda daha derinlemesine belgeler içerebilir.

Aşağıdaki kaynakları öneriyoruz:

 - [TypeScript el kitabı](https://www.typescriptlang.org/docs/handbook/) TypeScript'in resmi belgeleridir ve hemen hemen tüm önemli dil özelliklerini kapsar.

 - [TypeScript sürüm notları](https://devblogs.microsoft.com/typescript/) yeni özellikleri derinlemesine anlatır.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) TypeScript'i React ile kullanmak için toplum tarafından tutulmuş bir kılavuzdur ve bu belgeye göre daha fazla yararlı köşe vakasına dokunur.

 - [TypeScript Topluluğu Discord](https://discord.com/invite/typescript) TypeScript ve React ile ilgili sorunlar hakkında soru sormak ve yardım almak için harika bir yerdir.