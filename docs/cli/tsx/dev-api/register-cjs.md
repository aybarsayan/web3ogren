---
description: CommonJS Register API allows you to manually register development at runtime, impacting only CommonJS modules. This document outlines its usage and the possibility of namespace registration to manage module loading efficiently.
keywords: [CommonJS, Register API, development, namespace, require, tsx]
---

# CommonJS Register API

CommonJS Register API, çalıştırma zamanında geliştirmeyi manuel olarak kaydetmenizi sağlar. Ancak, bu yalnızca CommonJS modüllerini (`.cjs`/`.cts` ve `.js`/`.ts` eğer `package.json#type` ayarı unset veya `commonjs` olduğunda) etkiler.

::: warning Uyarılar

- Yüklenen dosyalardaki `import()` çağrıları geliştirilmez çünkü bunlar Node'un ESM kancası tarafından işlenir. `ESM Register API` ile kullanın.
- ESM sözdizimini CommonJS modunda çalışacak şekilde derlediği için, **üst düzey await desteklenmez**.
:::

## Kullanım

```js
const tsx = require('tsx/cjs/api')

// tsx geliştirmesini kaydedin
const unregister = tsx.register()

const loaded = require('./file.ts')

// Gerektiğinde kaydı iptal edin
unregister()
```

### Kapsamlı kayıt

Eğer tüm çalışma zamanı ortamını etkilemeden kayıt olmak istiyorsanız, bir ad alanı ekleyebilirsiniz.

:::tip İpuçları

Bir ad alanı sağlandığında, dosyaları yüklemek için size özel bir `require()` yöntemi döndürecektir.
:::

Bir ad alanı sağlandığında, dosyaları yüklemek için size özel bir `require()` yöntemi döndürecektir:

```js
const tsx = require('tsx/cjs/api')

const api = tsx.register({
    // Eşsiz bir ad alanı geçirin
    namespace: Date.now().toString()
})

// İstek ve mevcut dosya yolunu geçirin
const loaded = api.require('./file.ts', __filename)

api.unregister()
```

:::info Ek Bilgiler

Namespace kullanımı, farklı modüllerin aynı isme sahip olmasını önleyerek modül yüklemesi yaparken daha fazla kontrol sağlar.
:::