---
description: This document provides guidelines on using Node.js with the tsx command, including handling custom tsconfig.json paths and environment variables for advanced usage scenarios.
keywords: [Node.js, tsx, command line, tsconfig, environment variables, CommonJS, ESM]
---

# Node.js CLI

`node` komutunu doğrudan _tsx_ ile kullanmak için, bunu bir bayrak olarak geçirin:

```sh
node --import tsx ./file.ts
```

::: details (Kaldırılmış) Node.js v20.5.1 ve altı

Eski Node.js sürümleri `--import` yerine kaldırılmış olan `--loader` API'sini kullanır.

```sh
node --loader tsx ./file.ts
```
:::

## Özel `tsconfig.json` yolu

**Özel bir `tsconfig.json` yolu belirtmek için, bir ortam değişkeni kullanın:**

```sh
TSX_TSCONFIG_PATH=./path/to/tsconfig.custom.json node --import tsx ./file.ts
```

## Binaries

Eğer `node` komutuna doğrudan erişiminiz yoksa, bayrağı geçmek için Node.js [`NODE_OPTIONS` ortam değişkenini](https://nodejs.org/api/cli.html#node_optionsoptions) kullanın:

```sh
NODE_OPTIONS='--import tsx' npx some-binary
```

:::tip
**Bu yöntemi kullanmak, bayrağı geçmek için alternatif bir çözüm sunar.** 
:::

## İleri düzey kullanım

### Sadece CommonJS modu

Sadece CommonJS dosyaları için _tsx_ kullanmak üzere:

```sh
node --require tsx/cjs ./file.ts
```

### Sadece Modül modu

Sadece Modül dosyaları için _tsx_ kullanmak üzere:

```sh
node --import tsx/esm ./file.ts
```

---

> Bu bilgiler, **Node.js** ile _tsx_ kullanımını optimize etmenize yardımcı olacaktır.  
> — Node.js CLI Documentation