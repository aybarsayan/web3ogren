---
title: "JSX"
description: "Deno provides built-in support for JSX in `.jsx` and `.tsx` files, which can be beneficial for server-side rendering or generating code to be used in the browser. This document explores default configurations, automatic runtimes, and optimization techniques."
keywords: [Deno, JSX, TypeScript, React, Preact, development, server-side rendering]
oldUrl:
  - /deploy/manual/using-jsx/
  - /runtime/manual/advanced/jsx_dom/jsx/
  - /runtime/manual/advanced/jsx/
---

Deno, `.jsx` ve `.tsx` dosyalarında JSX için yerleşik destek sunar. Deno'daki JSX, sunucu tarafı render işlemleri veya tarayıcıda kullanılmak üzere kod oluşturmak için faydalı olabilir.

## Varsayılan yapılandırma

Deno CLI, `tsc` için varsayılanlardan farklı bir JSX varsayılan yapılandırmasına sahiptir. Deno, varsayılan olarak aşağıdaki
[TypeScript derleyici](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
seçeneklerini kullanır:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment"
  }
}
```

> **Not**: `"react"` seçeneğini kullanarak JSX'i aşağıdaki JavaScript koduna dönüştürebilirsiniz:

```jsx
// girdi
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// çıktı:
const jsx = React.createElement(
  "div",
  { className: "foo" },
  React.createElement(MyComponent, { value: 2 }),
);
```

## JSX otomatik çalışma zamanı (önerilir)

React 17 ile birlikte, React ekibi [yeni JSX dönüşümleri](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) olarak adlandırdıkları bir özellik ekledi. Bu, JSX dönüşümleri için API'yi geliştirdi ve otomatik olarak ilgili JSX içe aktarımlarını eklemek için bir mekanizma sağladı, böylece bunu kendiniz yapmak zorunda kalmazsınız. Bu JSX kullanmanın önerilen yoludur.

Daha yeni JSX çalışma zamanı dönüşümünü kullanmak için `deno.json` dosyanızdaki derleyici seçeneklerini değiştirebilirsiniz.

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react"
  }
}
```

> **Önemli Bilgi**: Arka planda `jsxImportSource` ayarı, her zaman içe aktarma belirleyicisine bir `/jsx-runtime` ekleyecektir.

```js
// Bu içe aktarma otomatik olarak eklenecektir
import { jsx as _jsx } from "react/jsx-runtime";
```

`"react-jsx"` seçeneğini kullanarak JSX'i aşağıdaki JavaScript koduna dönüştürebilirsiniz:

```jsx
// girdi
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// çıktı
import { jsx as _jsx } from "react/jsx-runtime";
const jsx = _jsx(
  "div",
  {
    className: "foo",
    children: _jsx(MyComponent, { value: 2 }),
  },
);
```

> **Uyarı**: Eğer React yerine [Preact](https://preactjs.com/) kullanmak isterseniz, `jsxImportSource` değerini uygun şekilde güncelleyebilirsiniz.

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "react-jsx",
-     "jsxImportSource": "react"
+     "jsxImportSource": "preact"
    },
    "imports": {
-     "react": "npm:react"
+     "preact": "npm:preact"
    }
  }
```

### Geliştirme dönüşümü

`"jsx"` seçeneğini `"react-jsxdev"` olarak ayarlamak, her JSX düğümüne ek hata ayıklama bilgileri taşır. Ek bilgiler, her JSX düğümünün çağrıldığı dosya adı, satır numarası ve sütun numarasıdır.

> **Not**: Bu bilgi genellikle çerçevelerde geliştirme sırasında hata ayıklama deneyimini geliştirmek için kullanılır. React'te bu bilgi, hata yığınlarını geliştirmek ve bileşenin React geliştirme araçları tarayıcı uzantısında nerede oluşturulduğunu göstermek için kullanılır.

`"react-jsxdev"` seçeneğini kullanarak JSX'i aşağıdaki JavaScript koduna dönüştürebilirsiniz:

```jsx
// girdi
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// çıktı
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "file:///input.tsx";
const jsx = _jsxDEV(
  "div",
  {
    className: "foo",
    children: _jsxDEV(
      MyComponent,
      {
        value: 2,
      },
      void 0,
      false,
      {
        fileName: _jsxFileName,
        lineNumber: 3,
        columnNumber: 5,
      },
      this,
    ),
  },
  void 0,
  false,
  {
    fileName: _jsxFileName,
    lineNumber: 1,
    columnNumber: 14,
  },
  this,
);
```

:::caution
Sadece `"react-jsxdev"` bilgisini geliştirme sırasında kullanın ve üretimde kullanmayın.
:::

### JSX içe aktarma kaynağı pragma'sını kullanma

Projeniz için yapılandırılmış bir JSX içe aktarma kaynağınız olup olmadığına veya varsayılan "eski" yapılandırmayı kullanıp kullanmadığınıza bakılmaksızın, bir `.jsx` veya `.tsx` modülüne JSX içe aktarma kaynağı pragma'sı ekleyebilir ve Deno bunu dikkate alacaktır.

`@jsxImportSource` pragma'sı, modülün ilk yorumlarında yer almalıdır. Örneğin, esm.sh'den Preact'i kullanmak için aşağıdakine benzer bir şey yapabilirsiniz:

```jsx
/** @jsxImportSource https://esm.sh/preact */

export function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

### `jsxImportSourceTypes`

Bazı durumlarda, bir kütüphane tür sağlamayabilir. Türleri belirtmek için `@jsxImportSourceTypes` pragma'sını kullanabilirsiniz:

```jsx
/** @jsxImportSource npm:react@^18.3 */
/** @jsxImportSourceTypes npm:@types/react@^18.3 */

export function Hello() {
  return <div>Hello!</div>;
}
```

Veya `_deno.json_` dosyasında `jsxImportSourceTypes` derleyici seçeneği ile belirtebilirsiniz:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:react@^18.3",
    "jsxImportSourceTypes": "npm:@types/react@^18.3"
  }
}
```

## JSX ön derleme dönüşümü

Deno, sunucu tarafı render işlemleri için optimize edilmiş
[yeni JSX dönüşümü](https://deno.com/blog/v1.38#fastest-jsx-transform) ile birlikte gelir. Diğer JSX dönüşümü seçeneklerine göre **7-20x** daha hızlı olabilir. Fark, ön derleme dönüşümünün JSX'inizi statik olarak analiz etmesi ve mümkünse önceden derlenmiş HTML dizelerini depolamasıdır. Böylece birçok JSX nesnesi oluşturma süresi ortadan kaldırılabilir.

Ön derleme dönüşümünü kullanmak için `jsx` seçeneğini `"precompile"` olarak ayarlayın.

```diff title="deno.json"
  {
    "compilerOptions": {
+     "jsx": "precompile",
      "jsxImportSource": "preact"
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

> **Not**: HTML öğelerini temsil eden JSX düğümlerinin ön derlenmesini önlemek için, bunları `jsxPrecompileSkipElements` ayarına ekleyebilirsiniz.

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "precompile",
      "jsxImportSource": "preact",
+     "jsxPrecompileSkipElements": ["a", "link"]
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

:::note
`precompile` dönüşümü, [Preact](https://preactjs.com/) veya [Hono](https://hono.dev/) ile en iyi şekilde çalışır. React'te desteklenmez.
:::

`"precompile"` seçeneğini kullanarak JSX'i aşağıdaki JavaScript koduna dönüştürebilirsiniz:

```jsx
// girdi
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// çıktı:
import {
  jsx as _jsx,
  jsxTemplate as _jsxTemplate,
} from "npm:preact/jsx-runtime";
const $$_tpl_1 = [
  '<div class="foo">',
  "</div>",
];
function MyComponent() {
  return null;
}
const jsx = _jsxTemplate(
  $$_tpl_1,
  _jsx(MyComponent, {
    value: 2,
  }),
);