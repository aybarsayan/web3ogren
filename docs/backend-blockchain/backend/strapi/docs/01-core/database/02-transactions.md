---
title: İşlemler
description: Strapi'deki işlemler için kavramsal kılavuz. Bu kılavuz, işlemlerin nasıl çalıştığını, ne zaman kullanılacağını ve potansiyel sorunları ele alıyor. İşlemler, veritabanı bütünlüğünü korumak için önemlidir.
keywords: [işlemler, Strapi, veritabanı, API, knex, transaction, hata yönetimi]
---

:::caution
Bu deneysel bir özellik olup, gelecekteki sürümlerde değişiklik gösterebilir.
:::

Bir dizi işlemi kapsayan ve verilerin bütünlüğünü sağlayan bir API.

## İşlemler nedir

İşlemler, **tek bir birim olarak bir arada yürütülen bir dizi işlemdir**. Eğer işlemlerden herhangi biri başarısız olursa, tüm işlem başarısız olur ve veriler önceki durumuna geri alınır. Tüm işlemler başarılı olursa, işlem onaylanır ve veriler kalıcı olarak veritabanına kaydedilir.

## Kullanım

İşlemler, `strapi.db.transaction` içerisine bir işleyici fonksiyonu geçirerek yönetilir:

```js
await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
  // İşlemi dolaylı olarak kullanacak
  await strapi.db.create();
  await strapi.db.create();
});
```

İşlem işleyici fonksiyonu çalıştırıldıktan sonra, eğer tüm işlemler başarılı olursa işlem onaylanır. Eğer işlemlerden herhangi biri hata verirse, işlem geri alınır ve veriler önceki durumuna döndürülür.

:::note
Bir işlem bloğunda yapılan her `strapi.db.query` işlemi dolaylı olarak işlemi kullanacaktır.
:::

### İşlem işleyici özellikleri

İşleyici fonksiyonu, aşağıdaki özelliklere sahip bir nesne alır:

| Özellik      | Açıklama                                                                                 |
| ------------ | --------------------------------------------------------------------------------------- |
| `trx`        | İşlem nesnesi. İşlem içinde knex sorguları gerçekleştirmek için kullanılabilir.        |
| `commit`     | İşlemi onaylamak için kullanılan fonksiyon.                                             |
| `rollback`   | İşlemi geri almak için kullanılan fonksiyon.                                            |
| `onCommit`   | İşlem onaylandıktan sonra yürütülecek bir geri çağırma işlevi kaydetmek için kullanılan fonksiyon. |
| `onRollback` | İşlem geri alındıktan sonra yürütülecek bir geri çağırma işlevi kaydetmek için kullanılan fonksiyon. |

### İç içe işlemler

İşlemler iç içe yapılabilir. **Bir işlem iç içe olduğunda**, içteki işlem dıştaki işlem onaylandığında veya geri alındığında onaylanır veya geri alınır.

```js
await strapi.db.transaction(async () => {
  // İşlemi dolaylı olarak kullanacak
  await strapi.db.create();

  // İç içe işlemler dıştaki işlemi dolaylı olarak kullanacak
  await strapi.db.transaction(async ({}) => {
    await strapi.db.create();
  });
});
```

### onCommit ve onRollback

`onCommit` ve `onRollback` kancaları, işlem onaylandıktan veya geri alındıktan sonra kod çalıştırmak için kullanılabilir.

```js
await strapi.db.transaction(async ({ onCommit, onRollback }) => {
  // İşlemi dolaylı olarak kullanacak
  await strapi.db.create();
  await strapi.db.create();

  onCommit(() => {
    // Bu, işlem onaylandıktan sonra yürütülecek
  });

  onRollback(() => {
    // Bu, işlem geri alındıktan sonra yürütülecek
  });
});
```

### knex sorgularını kullanma

İşlemler, knex sorgularıyla da kullanılabilir, ancak bu durumlarda `.transacting(trx)` açıkça çağrılmalıdır.

```js
await strapi.db.transaction(async ({ trx, rollback, commit }) => {
  await knex('users').where('id', 1).update({ name: 'foo' }).transacting(trx);
});
```

## İşlemleri ne zaman kullanmalıyız

**İşlemler**, birden fazla işlemin bir arada gerçekleştirilmesi gereken ve bu işlemlerin birbirine bağımlı olduğu durumlarda kullanılmalıdır. Örneğin, yeni bir kullanıcı oluştururken, kullanıcı veritabanında oluşturulmalı ve kullanıcıya bir hoş geldin e-postası gönderilmelidir. Eğer e-posta gönderimi başarısız olursa, kullanıcı veritabanında oluşturulmamalıdır.

## İşlemleri ne zaman kullanmamalıyız

**İşlemler**, birbirine bağımlı olmayan işlemler için kullanılmamalıdır, çünkü bu performans düşüklüğüne neden olabilir.

## İşlemlerin potansiyel sorunları

Bir işlem içinde birden fazla işlem gerçekleştirmek, diğer süreçlerden gelen işlemlerin yürütülmesini engelleyebilecek kilitlenmelere yol açabilir.

Ayrıca, işlemler uygun bir şekilde onaylanmadığı veya geri alınmadığı takdirde duraksayabilir.

> Örneğin, bir işlem açılırsa ancak kodunuzda içinde kapatılmayan bir yol varsa, işlem sonsuza kadar açık kalacak ve sunucunuz yeniden başlatılana kadar dengesizlik yaratabilir. Bu tür sorunlar hata ayıklamayı zorlaştırabilir, bu nedenle işlemleri ihtiyaç olduğunda dikkatle kullanın.
— Potansiyel Sorunlar