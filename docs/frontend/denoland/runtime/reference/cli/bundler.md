---
title: "Bundler (deprecated)"
oldUrl: /runtime/manual/cli/bundler/
description: "`deno bundle` komutu artık kullanımda değildir ve gelecekteki sürümlerde kaldırılacaktır. Bu makalede kalıntı modülün kullanımı ve alternatif öneriler ele alınmaktadır."
keywords: [deno, bundler, deprecated, javascript, package management]
---

:::caution
`deno bundle` kullanımdan kaldırılmıştır ve gelecekteki bir sürümde kaldırılacaktır. Bunun yerine [deno_emit](https://github.com/denoland/deno_emit), [esbuild](https://esbuild.github.io/) veya [rollup](https://rollupjs.org) kullanın.
:::

`deno bundle [URL]` belirtilen girdinin tüm bağımlılıklarını içeren tek bir JavaScript dosyası çıkışı verecektir. Örneğin:

```bash
$ deno bundle https://deno.land/std@0.190.0/examples/colors.tsts colors.bundle.js
Bundle https://deno.land/std@0.190.0/examples/colors.ts
Download https://deno.land/std@0.190.0/examples/colors.ts
Download https://deno.land/std@0.190.0/fmt/colors.ts
Emit "colors.bundle.js" (9.83KB)
```

:::info
Çıkış dosyasını atlarsanız, paket `stdout`'a gönderilecektir.
:::

Paket, Deno'da başka herhangi bir modül gibi çalıştırılabilir:

```bash
deno run colors.bundle.js
```

Çıktı, komut satırında sağlanan ana modülden herhangi bir ihracatın mevcut olacağı kendine yeterli bir ES Modülüdür. Örneğin, ana modül şöyle görünüyorsa:

```ts
export { foo } from "./foo.js";

export const bar = "bar";
```

Şöyle içe aktarılabilir:

```ts
import { bar, foo } from "./lib.bundle.js";
```

## Web için Paketleme

:::note
`deno bundle` çıktısı, Deno'da tüketim için tasarlanmıştır ve bir web tarayıcısında veya diğer çalışma zamanlarında kullanılmak üzere değildir. Söylemek gerekirse, girdiğe bağlı olarak diğer ortamlarla çalışabilir.
:::

Web için paketlemek isterseniz, [esbuild](https://esbuild.github.io/) gibi diğer çözümleri öneririz.