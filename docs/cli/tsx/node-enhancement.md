---
title: Node.js geliştirmesi
description: Bu belge, Node.js yerine nasıl TSX kullanılacağını, bayrak ve argüman konumlandırmasını, TypeScript REPL'ini ve test koşucusunu kapsamlı bir şekilde açıklar. TSX'in kullanımında dikkat edilmesi gereken önemli noktaları ele alır.
keywords: [Node.js, TSX, TypeScript, eğitim, REPL, test koşucusu, komut satırı]
---

# Node.js geliştirmesi

## `node` yerine `tsx` kullanma

`tsx`, `node` için bir drop-in (yer değiştirme) alternatifi olup, onu tam olarak aynı şekilde kullanabileceğiniz anlamına gelir (tüm [komut satırı bayraklarını](https://nodejs.org/api/cli.html) destekler).

Eğer mevcut bir `node` komutunuz varsa, onu sadece `tsx` ile değiştirebilirsiniz.

```sh
node --no-warnings --env-file=.env ./file.js
```
↓

```sh
tsx --no-warnings --env-file=.env ./file.js
```

::: warning Node.js sürümünün önemi
Arka planda, `tsx` `node`'u çağırır. Bu durum, `tsx`'de desteklenen Node.js özelliklerinin, yüklü olan Node.js sürümüne bağlı olduğu anlamına gelir.
:::

## Bayrak ve argüman konumlandırması

`tac` ile olduğu gibi, `tsx` kullanırken bayrakları ve argümanları doğru bir biçimde konumlandırmak önemlidir.

_tsx_ bayraklarını hemen `tsx`'den sonra yerleştirin ve betiğiniz için bayrak ve argümanları betik yolundan sonra koyun.

```sh
tsx [tsx bayrakları] ./file.ts [file.ts için bayraklar & argümanlar]
```

## TypeScript REPL

_tsx_ Node.js REPL'sini TypeScript destekle genişleterek, etkileşimli kodlama oturumlarına doğrudan TypeScript'te olanak tanır.

```sh
tsx
```

::: info Node.js REPL nedir?
[Node.js REPL](https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl), girdi kodunu hemen yürüten etkileşimli bir istemcidir; öğrenme ve deney yapma için idealdir. _tsx_ bu aracı TypeScript desteği eklentisi ile geliştirmektedir.
:::

## Test koşucusu

_tsx_, Node.js'in yerleşik [test koşucusunu](https://nodejs.org/api/test.html) TypeScript desteği ile geliştirmektedir. Onu aynı şekilde kullanabilirsiniz:

```sh
tsx --test
```

TypeScript uzantılarına sahip test dosyalarını otomatik olarak tanıyacaktır:
- `**/*.test.?[cm][jt]s`
- `**/*-test.?[cm][jt]s`
- `**/*_test.?[cm][jt]s`
- `**/test-*.?[cm][jt]s`
- `**/test.?[cm][jt]s`
- `**/test/**/*.?[cm][jt]s`