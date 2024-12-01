---
description: Yerel dinamik tsImport() fonksiyonu, TypeScript dosyalarını içe aktarmak için kullanılır ve çalışma zamanında TypeScript desteği eklemeden kullanılabilir.
keywords: [TypeScript, tsImport, dinamik import, ESM, CommonJS, tsconfig, modül yönetimi]
---

# `tsImport()`

Yerel dinamik `import()` fonksiyonu TypeScript dosyalarını içe aktarmak için kullanılır ( [üst düzey bekleme](https://v8.dev/features/top-level-await) desteklenir). 

:::tip
Bu fonksiyonu, tüm çalışma zamanına TypeScript desteği eklemeden TypeScript dosyalarını içe aktarmak için kullanın.
:::

İçe aktarma bağlamını çözmek için mevcut dosya yolu ikinci argüman olarak geçirilmelidir. Bu işlev bir kerelik kullanım için tasarlandığı için, yüklenen modülleri önbelleğe almaz.

## Kullanım

### ESM

```js
import { tsImport } from 'tsx/esm/api'

const loaded = await tsImport('./file.ts', import.meta.url)

// Eğer tsImport file.ts'yı tekrar yüklemek için kullanılırsa,
// önbellekte bir sonuç vermez ve tekrar yükler
const loadedAgain = await tsImport('./file.ts', import.meta.url)
```

Modül önbelleklemeden yararlanmak istiyorsanız, `ESM kapsamlı kaydı` bölümüne bakın.

### CommonJS

```js
const { tsImport } = require('tsx/esm/api')

const loaded = await tsImport('./file.ts', __filename)
```

## `tsconfig.json`

### Özel `tsconfig.json` yolu

```ts
tsImport('./file.ts', {
    parentURL: import.meta.url,
    tsconfig: './custom-tsconfig.json'
})
```

### `tsconfig.json` arama işlemini devre dışı bırak

```ts
tsImport('./file.ts', {
    parentURL: import.meta.url,
    tsconfig: false
})
```

## Yüklenen dosyaları izleme

`onImport` kancası ile yüklenen dosyaları tespit edin:

```ts
tsImport('./file.ts', {
    parentURL: import.meta.url,
    onImport: (file: string) => {
        console.log(file)
        // file:///foo.ts
    }
})
```

:::info
`onImport` kancası, içe aktarılan dosyaların izlenmesini sağlar ve dosya yolunu konsola yazdırır.
:::

### Önemli Not
> Bu yöntemi kullanırken dikkat edilmesi gereken en önemli noktalardan biri, içe aktarılan dosyaların sürekliği için önbellekleme özelliğinin olmadığını unutmamaktır.  
— Dökümantasyon Ekibi