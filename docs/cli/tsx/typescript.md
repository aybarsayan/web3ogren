---
description: TypeScript ile geliştirmenin temellerini ve kurulum süreçlerini keşfedin. Bu kılavuz, tür kontrolü, tsconfig ayarları ve gelişmiş iş akışları hakkında bilgi sunmaktadır.
keywords: [TypeScript, tsx, tür kontrolü, tsconfig, geliştirme iş akışı, Node.js, IntelliSense]
---

# TypeScript

_tsx_ kendi başına kodunuzu tür kontrol etmez ve bunun ayrı olarak ele alınmasını bekler. _tsx_ TypeScript'in kurulu olmasını gerektirmese de, IDE'niz tarafından sağlanan tür kontrolleri hızlı betikler için yeterli olabilir. **Projelerinizde bir tür kontrol adımı eklemeniz şiddetle önerilir.**

## Geliştirme iş akışı

Tür kontrolü önemlidir ancak her çalıştırmada zaman alıcı ve maliyetli olabilir.

> `tsx` bu sorunu, tür hatalarıyla engellenmeden doğrudan TypeScript kodu çalıştırmanıza izin vererek hafifletir.  
> — Tipik iş akışı, işlevsellik üzerinde daha hızlı iterasyon yapmanıza ve tür hatalarını derleme gereksinimleri yerine linting hataları olarak ele almanıza olanak tanır.

Modern IDE'ler, örneğin VSCode, [IntelliSense](https://code.visualstudio.com/docs/languages/typescript) aracılığıyla gerçek zamanlı tür kontrolü sağlar, bu da manuel tür kontrollerine olan ihtiyacı azaltır. Tür kontrolünü dahil etmek için, bunu diğer linters (örneğin ESLint) ile birlikte ön yükleme kancalarında veya CI kontrollerinde ekleyin.

## Kurulum

Projelerinizde şunları kurarak başlayın:

- [`typescript`](https://npmjs.com/package/typescript) `tsc` CLI komutuyla tür kontrolü yapmak için
- [`@types/node`](https://npmjs.com/package/@types/node) TypeScript'e Node.js API türlerini sağlamak için

::: code-group
```sh [npm]
$ npm install -D typescript @types/node
```

```sh [pnpm]
$ pnpm add -D typescript @types/node
```

```sh [yarn]
$ yarn add -D typescript @types/node
```
:::

## tsconfig.json
[`tsconfig.json`](https://www.typescriptlang.org/tsconfig/) TypeScript tarafından kullanılan yapılandırma dosyasıdır.

### Tavsiye

Tür kontrolünün kararlı bir şekilde çalışması için önerilen yapılandırma aşağıdadır.

```jsonc
{
	"compilerOptions": {

		// Dosyaları, import/export kullanmasa bile modül olarak değerlendir
		"moduleDetection": "force",

		// Modül yapısını yoksay
		"module": "Preserve",

		// JSON modüllerinin içe aktarılmasına izin ver
		"resolveJsonModule": true,

		// JS dosyalarının TS'den ve tersine içe aktarılmasına izin ver
		"allowJs": true,

		// Doğru ESM içe aktarma davranışını kullan
		"esModuleInterop": true,

		// Çapraz dosya farkındalığı gerektiren özellikleri yasakla
		"isolatedModules": true
	}
}
```

::: tip
Ayrıca, tür içe aktarmaları ve dışa aktarmaları yazarken açık sözdizimi kullanmanızı gerektiren [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) özelliğini etkinleştirmeniz önerilir. Yeniden yapılandırma yapılması gerekebilir.

[Daha fazla bilgi edinin](https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports)
:::

### JSX

_tsx_ `.jsx` ve `.tsx` dosyalarındaki JSX için aşağıdaki yapılandırmaları dikkate alır:

- [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig/#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig/#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig/#jsxImportSource)

## Özel `tsconfig.json` yolu
Varsayılan olarak, `tsconfig.json` mevcut çalışma dizininden algılanır.

Özel bir yoldan `tsconfig.json` dosyası geçmek için `--tsconfig` bayrağını kullanın:

```sh
tsx --tsconfig ./path/to/tsconfig.custom.json ./file.ts
```

## Tür kontrolü

Tür kontrolü için TypeScript kullanın:
```sh
tsc --noEmit
```

(`--noEmit` parametresini `tsconfig.json` dosyanızda zaten belirttiyseniz, bunu atlayabilirsiniz)

### `package.json` betiği
`tsc` bir derleyici olduğu için, bu yalnızca tür kontrolü için kullanıldığını belirtmek için `package.json`'unuza bir betik ekleyebilirsiniz:
```js
// package.json
{
    // ...

    "scripts": {
        "type-check": "tsc --noEmit" // [!code ++]
    },

    // ...
}
```

### Ön yükleme kancası
Ön yükleme sırasında tür kontrolü yapmak için [simple-git-hooks](https://www.npmjs.com/package/simple-git-hooks) kullanın:
```js
// package.json
{
    // ...

    "scripts": {
        // `npm install` sırasında Git kancalarını kaydet
        "prepare": "simple-git-hooks" // [!code ++]
    },
    "simple-git-hooks": {
        "pre-commit": "npm run type-check", // [!code ++]

        // Ya da birden fazla komutunuz varsa
        "pre-commit": [
            "npm run lint",
            "npm run type-check" // [!code ++]
        ]
    }
}
```

## Derleyici sınırları
_tsx_ TypeScript ve ESM'yi derlemek için [esbuild](https://esbuild.github.io) kullanır, bu nedenle bazı benzer sınırlamaları paylaşır:

- `eval()` ile uyumluluk korunmaz
- Yalnızca [bazı `tsconfig.json` özellikleri](https://esbuild.github.io/content-types/#tsconfig-json) desteklenir
	- [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata) desteklenmez

::: warning
Detaylı bilgi için esbuild'in [JavaScript tuzakları](https://esbuild.github.io/content-types/#javascript-caveats) ve [TypeScript tuzakları](https://esbuild.github.io/content-types/#typescript-caveats) belgelerine başvurun.
:::