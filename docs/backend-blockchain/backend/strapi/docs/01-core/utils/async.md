---
title: Async yardımcı fonksiyonlar
description: Async yardımcı fonksiyonlar, asenkron verilerle etkileşime giren fonksiyonları gruplar. Bu içerikte, async map, reduce ve pipe gibi işlevler ayrıntılı olarak açıklanmaktadır.
keywords: [async, helper functions, map, reduce, pipe, JavaScript]
---

# Async yardımcı fonksiyonlar

## Özeti

Async yardımcı fonksiyonlar, Promise gibi asenkron verilerle etkileşimde bulunan tüm fonksiyonları gruplar.

## Ayrıntılı tasarım

### harita

`map` fonksiyonu, `Array.prototype.map` yönteminin asenkron versiyonudur.

Örnek kullanım:

```js
import { async } from '@strapi/utils';

const input = [1, 2, 3];

const output = await async.map(input, async (item) => {
  return item * 2;
});

console.log(output); // [2, 4, 6]
```

### azalt

`reduce` fonksiyonu, `Array.prototype.reduce` yönteminin asenkron versiyonudur.

Örnek kullanım:

```js
import { async } from '@strapi/utils';
const input = [1, 2, 3];

const reducer = async.reduce(input);
const output = await reducer(async (accumulator, item) => {
  return accumulator + item;
}, 0);

console.log(output); // 6
```

### boru

`pipe` fonksiyonu, asenkron fonksiyonları birleştirmek için bir yardımcı fonksiyondur. Girdi olarak bir özellikler listesi alır ve her bir fonksiyonu sırayla girdiye uygulayan yeni bir fonksiyon döner.

Örnek kullanım:

```js
import { async } from '@strapi/utils';

async function addOne(input: number): Promise<number> {
  return input + 1;
}

async function double(input: number): Promise<number> {
  return input * 2;
}

const addOneAndDouble = async.pipe(addOne, double);

const output = await addOneAndDouble(3);

console.log(output); // 8
```

### Ne zaman kullanılmalı

:::info
Kod, promise'lerle etkileşime girmesi ve üzerinde yineleme yapması gerektiğinde, bir async yardımcı fonksiyonu kullanılmalıdır.
:::

### Fonksiyonumu buraya eklemeli miyim?

:::tip
Promise'leri işleyen herhangi bir yardımcı fonksiyon bu yardımcı fonksiyonlar bölümüne dahil edilebilir. Eğer async bölümünde çok fazla fonksiyon varsa, lütfen bir sonraki noktayı dikkate alın.
:::

## Potansiyel iyileştirmeler

Eklenebilecek fonksiyonlara dair bazı fikirler:

- Diğer `Array.prototype` yöntemleri: `filterAsync`, `someAsync`, `everyAsync`, `findAsync`, `findIndexAsync`, `flatMapAsync`.
- `retryAsync`: Asenkron bir işlemi belirli bir sayıda tekrar deneyen bir fonksiyondur. Asenkron bir işlemi ve tekrar sayısını girdi olarak alır ve belirtilen tekrar sayısı içinde başarılı olursa işlemin sonucunu döner; yoksa tüm denemelerden sonra başarısız olursa bir hata fırlatır.
- `timeoutAsync`: Asenkron bir işleme zaman aşımı ekleyen bir fonksiyondur. Asenkron bir işlemi ve bir zaman aşımı süresini girdi olarak alır ve işlemi belirtilen zaman aşımı süresi içinde tamamlanırsa sonucunu döner; yoksa zaman aşımından daha uzun sürerse bir hata fırlatır.

:::warning
Eğer birçok async yardımcı fonksiyonu kullanmaya başlarsak, [asyncjs](http://caolan.github.io/async/v3/) gibi özel bir kütüphaneye geçmeyi düşünebiliriz.
:::

## Kaynaklar

- [Strapi'de Asenkron dosya](https://github.com/strapi/strapi/blob/9b36c3b10adaa00fd3596853abc63122632c36fe/packages/core/utils/lib/async.js)
- http://caolan.github.io/async/v3/