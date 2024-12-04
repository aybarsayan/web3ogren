---
title: Kural Hooks
seoTitle: Kural Hooks - React
sidebar_position: 4
description: Bu sayfada React Hooks ile ilgili kurallara ve yaygın hatalara dair bilgilere ulaşabilirsiniz. React ve React DOMun eşleşmeyen sürümleri, çift React gibi sorunlar hakkında da bilgiler içerir.
tags: 
  - React
  - Hooks
  - Geliştirme
  - JavaScript
keywords: 
  - React
  - Hooks
  - Geliştirici
  - JavaScript
---
Muhtemelen aşağıdaki hata mesajını aldığınız için buradasınız:


Hooks yalnızca bir fonksiyon bileşeninin gövdesi içinde çağrılabilir.


Bunu görmenizin üç yaygın nedeni olabilir:

1. **Hooks Kurallarını** ihlal ediyor olabilirsiniz.
2. React ve React DOM'un **eşleşmeyen sürümlerine** sahip olabilirsiniz.
3. Aynı uygulamada **birden fazla React kopyasına** sahip olabilirsiniz.

Her bir duruma bakalım.

## Hooks Kurallarını İhlal Etme {/*breaking-rules-of-hooks*/}

`use` ile başlayan fonksiyonlar React'ta `*Hooks*` olarak adlandırılır.

**Döngülerde, koşullarda veya iç içe fonksiyonlar içinde Hooks çağırmayın.** Bunun yerine, her zaman React fonksiyonunuzun en üst seviyesinde, erken dönen ifadelerden önce Hooks kullanın. Hooks yalnızca React, bir fonksiyon bileşenini render ederken çağrılabilir:

* ✅ Onları bir `fonksiyon bileşeninin` gövdesinin en üst seviyesinde çağırın.
* ✅ Onları bir `özel Hook'un` gövdesinin en üst seviyesinde çağırın.

```js{2-3,8-9}
function Counter() {
  // ✅ İyi: bir fonksiyon bileşeninde en üst seviyede
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ İyi: özel bir Hook'ta en üst seviyede
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Başka herhangi bir durumda Hooks ( `use` ile başlayan fonksiyonlar) çağırmak **desteklenmez**, örneğin:

* 🔴 Döngülerde veya koşullarda Hooks çağırmayın.
* 🔴 Koşullu bir `return` ifadesinden sonra Hooks çağırmayın.
* 🔴 Olay işleyicilerinde Hooks çağırmayın.
* 🔴 Sınıf bileşenlerinde Hooks çağırmayın.
* 🔴 `useMemo`, `useReducer` veya `useEffect`'e geçirilen fonksiyonlar içinde Hooks çağırmayın.

Bu kuralları ihlal ederseniz, bu hatayı görebilirsiniz.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Kötü: bir koşul içinde (düzeltmek için, dışarı taşıyın!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Kötü: bir döngü içinde (düzeltmek için, dışarı taşıyın!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Kötü: koşullu bir return'den sonra (düzeltmek için, return'den önce taşıyın!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Kötü: bir olay işleyicisinde (düzeltmek için, dışarı taşıyın!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Kötü: useMemo içinde (düzeltmek için, dışarı taşıyın!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Kötü: bir sınıf bileşeninde (düzeltmek için, bir fonksiyon bileşeni yazın yerine sınıf!)
    useEffect(() => {})
    // ...
  }
}
```

Bu hataları yakalamak için [`eslint-plugin-react-hooks` eklentisini](https://www.npmjs.com/package/eslint-plugin-react-hooks) kullanabilirsiniz.

:::note
`Özel Hooks`, diğer Hooks'u çağırabilir (bu onların tüm amacı). Bu, özel Hooks'un yalnızca bir fonksiyon bileşeni render edilirken çağrılması gerektiğinden çalışır.
:::

## React ve React DOM'un Eşleşmeyen Sürümleri {/*mismatching-versions-of-react-and-react-dom*/}

`react-dom` (
npm ls react


Eğer birden fazla React görüyorsanız, bunun neden olduğunu anlamanız ve bağımlılık ağacınızı düzeltmeniz gerekir. Örneğin, kullandığınız bir kütüphane `react`'i yanlış bir şekilde bağımlılık olarak belirtmiş olabilir (peer bağımlılık yerine). O kütüphane düzeltilene kadar, [Yarn çözümleri](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) mümkün bir geçici çözümdür.

Bu problemi debug etmeye çalışmak için bazı loglar ekleyebilir ve geliştirme sunucunuzu yeniden başlatabilirsiniz:

```js
// Bunu node_modules/react-dom/index.js dosyasına ekleyin
window.React1 = require('react');

// Bunu bileşen dosyanıza ekleyin
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Eğer `false` yazdırıyorsa, iki React'ınız olabilir ve bunun neden olduğunu anlamanız gerekir. [Bu konu](https://github.com/facebook/react/issues/13991) topluluk tarafından karşılaşılan bazı yaygın nedenleri içermektedir.

Bu problem, `npm link` veya eşdeğeri kullanıldığında da ortaya çıkabilir. Bu durumda, paketleyiciniz uygulama dizininde ve kütüphane dizininde iki React'ı "görebilir". `myapp` ve `mylib` kardeş dizinler varsayılmışsa, olası bir düzeltme `mylib`'den `npm link ../myapp/node_modules/react` komutunu çalıştırmaktır. Bu, kütüphanenin uygulamanın React kopyasını kullanmasını sağlamalıdır.

:::note
Genel olarak, React bir sayfada birden fazla bağımsız kopyanın kullanılmasını destekler (örneğin, bir uygulama ve üçüncü taraf bir widget her ikisi de kullanıyorsa). Sadece bileşen ile render edildiği `react-dom` kopyası arasında `require('react')` farklı şekilde çözülürse bozulur.
:::

## Diğer Nedenler {/*other-causes*/}

Eğer bunların hiçbiri işe yaramadıysa, lütfen [bu sorun](https://github.com/facebook/react/issues/13991)'da yorum yapın ve size yardım etmeye çalışalım. Küçük bir örnek oluşturmayı deneyin - bunu yaparken sorunu keşfedebilirsiniz.