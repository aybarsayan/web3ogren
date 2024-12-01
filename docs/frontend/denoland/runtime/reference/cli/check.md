---
title: "deno check"
description: Bu sayfa, Deno'da tür kontrolü için kullanılan `deno check` komutunu açıklar. Kullanım detayları ve örneklerle birlikte, tür denetimi yapmanın nasıl gerçekleştirileceği hakkında bilgi verilmektedir.
keywords: [Deno, tür kontrolü, deno check, TypeScript, hata ayıklama]
---

## Örnek

Çalıştırma olmadan tür kontrolü yapın.

:::tip
**Öneri:** `deno check`, TypeScript dosyalarındaki türleri hızlıca kontrol etmenin etkili bir yoludur.
:::

```ts title="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```

:::info
### Ek Bilgi
Tür kontrolü, kodunuza dair sorunları önceden tespit etmenizi sağlar ve geliştirme sürecini hızlandırır.
:::

---