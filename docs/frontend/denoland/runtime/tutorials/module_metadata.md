---
title: "Modül meta verisi"
description: Bu belge, Deno modüllerinin meta verilerini anlamanızı sağlamaktadır. Özelikle `import.meta` özellikleri ile ana modül giriş noktası gibi bilgileri nasıl alabileceğinizi açıklar.
keywords: [Deno, import.meta, modül, meta verisi, program giriş noktası, URL]
oldUrl:
  - /runtime/manual/examples/module_metadata/
---

## Kavramlar

- **[import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)** modülün bağlamı hakkında bilgi sağlayabilir.
- **Boolean [import.meta.main](https://docs.deno.com/api/web/~/ImportMeta#property_main)** mevcut modülün program giriş noktası olup olmadığını bilmenizi sağlar.
- **String [import.meta.url](https://docs.deno.com/api/web/~/ImportMeta#property_url)** mevcut modülün URL'sini verir.
- **String [import.meta.filename](https://docs.deno.com/api/web/~/ImportMeta#property_filename)** mevcut modül için tam olarak çözülmüş yolu verir. _Sadece yerel modüller için_.
- **String [import.meta.dirname](https://docs.deno.com/api/web/~/ImportMeta#property_dirname)** mevcut modülü içeren dizinin tam olarak çözülmüş yolunu verir. _Sadece yerel modüller için_.
- **[import.meta.resolve](https://docs.deno.com/api/web/~/ImportMeta#property_resolve)** mevcut modüle göre spesifikasyonu çözmenizi sağlar. Bu fonksiyon başlangıçta sağlanan bir import haritasını (varsa) dikkate alır.
- **String [Deno.mainModule](https://docs.deno.com/api/deno/~/Deno.mainModule)** ana modül giriş noktasının URL'sini verir, yani deno çalışma zamanı tarafından çağrılan modül.

---

## Örnek

:::info
Aşağıdaki örnek, `import.meta.url`, `import.meta.main` ve `Deno.mainModule` arasındaki farkı göstermek için iki modül kullanır. Bu örnekte, `module_a.ts` ana modül giriş noktasıdır.
:::

```ts title="module_b.ts"
export function outputB() {
  console.log("Modül B'nin import.meta.url", import.meta.url);
  console.log("Modül B'nin mainModule url'si", Deno.mainModule);
  console.log(
    "Modül B ana modül mü import.meta.main üzerinden?",
    import.meta.main,
  );
}
```

```ts title="module_a.ts"
import { outputB } from "./module_b.ts";

function outputA() {
  console.log("Modül A'nın import.meta.url", import.meta.url);
  console.log("Modül A'nın mainModule url'si", Deno.mainModule);
  console.log(
    "Modül A ana modül mü import.meta.main üzerinden?",
    import.meta.main,
  );
  console.log(
    "Çözülmüş spesifikasyon ./module_b.ts için",
    import.meta.resolve("./module_b.ts"),
  );
}

outputA();
console.log("");
outputB();
```

:::tip
Eğer `module_a.ts` `/home/alice/deno` dizininde bulunuyorsa, `deno run --allow-read module_a.ts` çıktısı aşağıdaki gibi olacaktır:
:::

```console
Modül A'nın import.meta.url file:///home/alice/deno/module_a.ts
Modül A'nın mainModule url'si file:///home/alice/deno/module_a.ts
Modül A ana modül mü import.meta.main üzerinden? true
Çözülmüş spesifikasyon ./module_b.ts file:///home/alice/deno/module_b.ts

Modül B'nin import.meta.url file:///home/alice/deno/module_b.ts
Modül B'nin mainModule url'si file:///home/alice/deno/module_a.ts
Modül B ana modül mü import.meta.main üzerinden? false
```