---
description: Yerel require() fonksiyonu, TypeScript ve ESM desteği ile geliştirilmiştir. Bu içerik, TypeScript dosyalarını içe aktarma yöntemlerini ve dikkat edilmesi gereken noktaları açıklar.
keywords: [TypeScript, ESM, CommonJS, require, tsx, import, modül]
---

# `tsx.require()`

Yerel `require()` fonksiyonu, **TypeScript** ve **ESM** desteği ile geliştirilmiştir.

Bu fonksiyonu, TypeScript desteğini tüm çalışma zamanına eklemeden **CommonJS** modunda TypeScript dosyalarını içe aktarmak için kullanın.

:::info Not
İçe aktarma bağlamını çözmek için mevcut dosya yolunun ikinci argüman olarak geçirilmesi gerekir.
:::

::: warning Uyarılar

- Yüklenen dosyalardaki `import()` çağrıları geliştirilmez. Bunun yerine `tsImport()` kullanın.
- ESM sözdizimini CommonJS modunda çalışacak şekilde derlediği için üst düzey await desteklenmez.
:::

## Kullanım

### CommonJS

```js
const tsx = require('tsx/cjs/api')

const tsLoaded = tsx.require('./file.ts', __filename)
const tsFilepath = tsx.require.resolve('./file.ts', __filename)
```

### ESM

```js
import { require } from 'tsx/cjs/api'

const tsLoaded = require('./file.ts', import.meta.url)
const tsFilepath = require.resolve('./file.ts', import.meta.url)
```

## Yüklenen dosyaları izleme

CommonJS API'si, yüklenen modülleri `require.cache` içinde izlediği için, bağımlılık takibi için yüklenen dosyaları tanımlamak amacıyla kullanılabilir. Bu, bir izleyici uygularken yararlı olabilir.

```js
const resolvedPath = tsx.require.resolve('./file', import.meta.url)

const collectDependencies = module => [
    module.filename,
    ...module.children.flatMap(collectDependencies)
]

console.log(collectDependencies(tsx.require.cache[resolvedPath]))
// ['/file.ts', '/foo.ts', '/bar.ts']