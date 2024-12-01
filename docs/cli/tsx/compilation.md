---
title: Derleme
description: Bu doküman, TypeScript dosyalarınızı JavaScript'e derlemek için gerekli adımları ve npm paketleri ile ilgili bilgileri içermektedir. Ayrıca, _tsx_ kullanarak nasıl paket oluşturulacağını da detaylandırmaktadır.
keywords: [TypeScript, JavaScript, npm, pkgroll, derleme, modüller, CLI]
---

# Derleme

TypeScript dosyalarınızı JavaScript'e derlemek _tsx_ tarafından yönetilmez, ancak çoğu kurulumda **gerekli** bir adımdır.

::: info TypeScript dosyalarını yayınlamalı mıyım?

Hayır. _tsx_ ihtiyacında TypeScript dosyalarını bağımlılıklar içinde çalıştırma yeteneğine sahip olsa da (örneğin, monorepo'lar), derlenmemiş TypeScript'i yayınlamak kesinlikle önerilmez. Kaynak dosyaları, okunmayabilecek belirli bir derleme yapılandırması gerektirir ve [TypeScript performansı düşecektir](https://x.com/atcb/status/1705675335814271157).
:::

## npm paketi derlemek

npm paketleri, `package.json` içinde **paket giriş noktalarını** tanımlayarak uygulamalardan ayrılır.

[pkgroll](https://github.com/privatenumber/pkgroll) _tsx_ kullanan projeler için önerilen paketleyicidir. Aynı yazar tarafından geliştirilmiştir ve _tsx_'yi derlemek için kullanılır.

Kaynak dosyalarınız `src` dizinindeyse, `package.json` içinde tanımlanan giriş noktalarına dayanarak paketinizi nasıl oluşturacağını otomatik olarak çıkarsar ve bunları `dist` dizinine çıktılar.

### Kurulum

::: details Temel kurulum

Giriş noktanızı [`exports`](https://nodejs.org/api/packages.html#exports) içinde ayarlayın:

```json5
// package.json
{
    "exports": "./dist/index.mjs"
}
```
:::

::: details Çift paket (CJS & ESM)

CommonJS ve Modül giriş noktalarınızı [`exports`](https://nodejs.org/api/packages.html#exports) içinde ayarlayın:

```json5
// package.json
{
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.cts",

    "exports": {
        "require": {
            "types": "./dist/index.d.cts",
            "default": "./dist/index.cjs"
        },
        "import": {
            "types": "./dist/index.d.mts",
            "default": "./dist/index.mjs"
        }
    }
}
```
:::

::: details Komut satırı paketi

CLI giriş noktanızı [`bin`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bin) içinde ayarlayın:

```json5
// package.json
{
    "bin": "./dist/cli.mjs"
}
```
:::

### Derle

Klasörünüzde, sadece `pkgroll` komutunu çalıştırın:

::: code-group
```sh [npm]
$ npx pkgroll
```

```sh [pnpm]
$ pnpm pkgroll
```

```sh [yarn]
$ yarn pkgroll
```
:::

Opsiyonel olarak, kolaylık için bir `build` script'i ekleyin:
```json
// package.json
{
    // Opsiyonel: build script
    "scripts": {// [!code ++]
        "build": "pkgroll"// [!code ++]
    }// [!code ++]
}
```