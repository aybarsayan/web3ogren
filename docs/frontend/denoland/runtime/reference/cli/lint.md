---
title: "`deno lint`, linter"
description: Deno Lint, Deno uygulamaları için bir linter'dir ve kod kalitesini artırmak için kurallar belirler. Burada, mevcut kurallar ve yok sayma direktifleri hakkında bilgi verilmektedir.
keywords: [Deno, linter, linting, kod kalitesi, programlama]
oldUrl:
 - /runtime/tools/linter/
 - /runtime/fundamentals/linting_and_formatting/lint-cli-ref
 - /runtime/manual/tools/linter/
 - /runtime/reference/cli/linter/
command: lint
---

## Mevcut kurallar

Desteklenen kuralların tam listesi için
[deno_lint kural belgelerini](https://lint.deno.land) ziyaret edin.

---

## Yok sayma direktifleri

### Dosyalar

:::tip
Tüm dosyayı yok saymak için, dosyanın en üstüne `// deno-lint-ignore-file` direktifi eklenmelidir.
:::

Aşağıdaki örnek, dosyanın en üstüne eklenen yok sayma direktifini göstermektedir:

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

veya

```ts
// deno-lint-ignore-file -- yok sayma nedeni

function foo(): any {
  // ...
}
```

Yok sayma direktifi, **ilk ifade veya bildirimin** önüne yerleştirilmelidir:

```ts
// Copyright 2020 the Deno authors. Tüm hakları saklıdır. MIT lisansı.

/**
 * Bazı JS belgeleri
 */

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

Ayrıca, tüm dosya içinde belirli tanıları yok sayabilirsiniz:

```ts
// deno-lint-ignore-file no-explicit-any no-empty

function foo(): any {
  // ...
}
```

### Tanılar

Belirli tanıları yok saymak için, `// deno-lint-ignore ` direktifi hedeflenen satırdan önce yerleştirilmelidir. Yok sayılan kural adını belirtmek zorunludur:

```ts
// deno-lint-ignore no-explicit-any
function foo(): any {
  // ...
}

// deno-lint-ignore no-explicit-any explicit-function-return-type
function bar(a: any) {
  // ...
}
```

:::info
Ayrıca, tanıyı yok sayma nedenini de belirtebilirsiniz:
:::

```ts
// deno-lint-ignore no-explicit-any -- yok sayma nedeni
function foo(): any {
  // ...
}