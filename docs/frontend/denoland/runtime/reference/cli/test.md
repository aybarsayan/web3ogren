---
title: "deno test"
description: Deno test command allows for running tests in various configurations, including watch mode, parallel execution, and code coverage monitoring. This page provides examples for using the Deno test command effectively.
keywords: [Deno, test command, code coverage, watch mode, parallel execution]
---

## Ek bilgiler

Gözetim modunda (`--watch`) çalıştırılabilir, paralel yürütmeyi destekler
(`--parallel`), ve testlerin rastgele bir sırayla çalıştırılması için 
konfigüre edilebilir (`--shuffle`). Ayrıca, kod kapsamını 
gözlemleme (`--coverage`) ve sızıntı tespiti (`--trace-leaks`) için 
yerleşik destek bulunmaktadır.

:::tip
Testleri çalıştırmadan önce, bellek sızıntılarını önlemek için 
`sıfırdan başlatmayı` deneyin.
:::

## Örnekler

Testleri çalıştır

```bash
deno test
```

Belirli dosyalardaki testleri çalıştır

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

Glob deseninin eşleştiği testleri çalıştır

```bash
deno test src/*.test.ts
```

Testleri çalıştır ve tür kontrolünü atla

```bash
deno test --no-check
```

Testleri çalıştır, dosya değişikliğinde tekrar çalıştır

```bash
deno test --watch
```