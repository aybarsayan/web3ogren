---
description: ESM Kayıt API'si, geliştiricilerin çalışma zamanında manuel kayıt yapmalarını sağlar. ESM formatında etkili olan bu API, dosya yüklemeleri ve izleme gibi işlevler sunmaktadır.
keywords: [ESM, Kayıt API'si, JavaScript, TypeScript, çalışma zamanı, import, namespace]
---

# ESM Kayıt API'si

ESM Kayıt API'si, geliştirmeyi çalışma zamanında manuel olarak kaydetmenizi sağlar. Ancak, bunun yalnızca ESM (`.mjs`/`.mts` ve `.js`/`.ts` `package.json#type` `module` olduğunda) üzerinde etkili olduğunu unutmayın.

## Kullanım

```js
import { register } from 'tsx/esm/api'

// tsx geliştirmesini kaydet
const unregister = register()

await import('./file.ts')

// Gerektiğinde kaydı kaldır
unregister()
```

### Kapsamlı kayıt

Tüm çalışma zamanı ortamını etkilemeden kayıt olmak istiyorsanız, bir ad alanı ekleyebilirsiniz.

:::info
Bir ad alanı sağlandığında, dosyaları yüklemek için özel bir `import()` yöntemi döndürecektir.
:::

```js
import { register } from 'tsx/esm/api'

const api = register({
    // Benzersiz bir ad alanı geçin
    namespace: Date.now().toString()
})

// İstek ve mevcut dosya yolunu geçin
// Bu ad alanı kullanıldığından, önceki ithalatlardan önbellek vuruşu almayacaktır
const loaded = await api.import('./file.ts', import.meta.url)

// Bu, yukarıdakiyle aynı ad alanını kullanıyor, bu nedenle bir önbellek vuruşu verecektir
const loaded2 = await api.import('./file.ts', import.meta.url)

api.unregister()
```

### Yüklenen dosyaları takip etme

`onImport` kancası ile yüklenen dosyaları algılayın. Bu, bir izleyici kurarken bağımlılıkları takip etmek istediğinizde yararlı olabilir.

:::tip
Yüklenen dosyaları izlemek için `onImport` fonksiyonu içerisinde dosya adını konsola yazdırabilirsiniz.
:::

```ts
register({
    onImport: (file: string) => {
        console.log(file) // 'file:///foo.ts'
    }
})