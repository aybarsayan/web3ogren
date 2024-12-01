---
title: "İşlemler"
description: Deno KV API'si, anahtar alanında gerçekleştirilebilecek çeşitli işlemleri tanıtmaktadır. Okuma ve yazma işlemleri için sunulan destek, veri tutarlılığı ve performans açısından kritik öneme sahiptir.
keywords: [Deno, KV API, veri okuma, veri yazma, veri tutarlılığı, işlemler, Deno örnek kodları]
---



Deno KV API, anahtar alanında gerçekleştirilebilecek bir dizi işlemi sağlar. 

Depodan veri okumak için iki işlem ve depoya veri yazmak için beş işlem vardır.

:::info
Okuma işlemleri, güçlü veya nihai tutarlılık modunda gerçekleştirilebilir. Güçlü tutarlılık modu, okuma işleminin en son yazılmış değeri döndüreceğini garanti eder. Nihai tutarlılık modu, eski bir değeri döndürebilir, ancak daha hızlıdır.
:::

Yazma işlemleri her zaman güçlü tutarlılık modunda gerçekleştirilir.

## `get`

`get` işlemi, belirli bir anahtara ait değer ve versiyon damgasını döndürür. Bir değer mevcut değilse, `get` işlemi `null` değeri ve versiyon damgası döndürür.

```typescript
const res = await kv.get<string>(["config"]);
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }
```

`get` işlemi gerçekleştirmek için kullanılabilecek iki API vardır. [`Deno.Kv.prototype.get(key, options?)`][get] API'si, tek bir anahtarı okumak için kullanılabilir ve [`Deno.Kv.prototype.getMany(keys, options?)`][getMany] API'si, bir kerede birden fazla anahtarı okumak için kullanılabilir.

> Get işlemleri tüm tutarlılık modlarında bir "anlık görüntü okuması" olarak gerçekleştirilir. Bu, birden fazla anahtar bir kerede alındığında, döndürülen değerlerin birbirleriyle tutarlı olacağı anlamına gelir.
— Deno KV API Belgeleri

## `list`

`list` işlemi, belirli bir seçici ile eşleşen anahtarların bir listesini döndürür. 

:::tip
Eşleşen anahtarları filtrelemek için kullanılabilecek 2 farklı seçici vardır:
- `prefix`: Verilen ön ek anahtar parçalarıyla başlayan anahtarları eşleştirir.
- `range`: Verilen `start` ve `end` anahtarları arasında leksikografik olarak tüm anahtarları eşleştirir.
:::

Liste işlemi, döndürülen anahtarların sayısını sınırlamak için isteğe bağlı olarak bir `limit` alabilir. Liste işlemleri, [`Deno.Kv.prototype.list(selector, options?)`][list] yöntemi kullanılarak gerçekleştirilebilir.

```typescript
// Tüm kullanıcıları döndür
const iter = kv.list<string>({ prefix: ["users"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users);
```

## `set`

`set` işlemi, depodaki bir anahtarın değerini ayarlar. 

:::warning
Anahtar mevcut değilse oluşturulur. Anahtar zaten varsa, değeri üzerine yazılır.
:::

```typescript
const res = await kv.set(["users", "alex"], "alex");
console.log(res.versionstamp); // "00a44a3c3e53b9750000"
```

## `delete`

`delete` işlemi, bir anahtarı depodan siler. 

```typescript
await kv.delete(["users", "alex"]);
```

## `sum`

`sum` işlemi, depodaki bir anahtara atomik olarak bir değer ekler. 

```typescript
await kv.atomic()
  .mutate({
    type: "sum",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `watch`

`watch` işlemi, bir anahtar dizisi alır ve anahtarların herhangi biri versiyon damgasını değiştirdiğinde yeni bir değer yayan bir [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) döndürür. 

:::note
Dikkat edilmesi gereken bir nokta, döndürülen akışın izlenen anahtarların her bir ara durumunu döndürmemesidir; bunun yerine sizi anahtarların en son durumu ile güncel tutar.
:::

```typescript
const db = await Deno.openKv();

const stream = db.watch([["foo"], ["bar"]]);
for await (const entries of stream) {
  console.log(entries);
}
```

[get]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get
[getMany]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.getMany
[list]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.list
[set]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.set
[delete]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.delete
[mutate]: https://docs.deno.com/api/deno/~/Deno.AtomicOperation.prototype.mutate