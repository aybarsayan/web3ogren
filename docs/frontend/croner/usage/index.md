---
title: "Kullanım"
description: Croner kullanımı ile ilgili temel bilgiler ve örnekler. Günlük zamanlama ve sonraki yürütme zamanını nasıl alabileceğinizi öğrenin.
keywords: [Croner, zamanlama, JavaScript, örnekler, programlama, görev zamanlayıcı]
---

# Kullanım

---

Croner'ın zamanlama için en temel kullanımı şudur:

```ts
new Cron("0 12 * * *, () => {
    console.log("Bu her gün saat 12:00'de çalışacak");
});
```

:::tip
**İpucu:** Bu kod, **her gün** saat **12:00'de** belirtilen işlevi çalıştıracaktır. Zamanlama ifadeleri ile farklı sıklıklarda görevler ayarlayabilirsiniz.
:::

Ve bir desenin sonraki yürütme zamanını almak için Croner'ın en temel kullanımı şudur:

```ts
console.log(new Cron("0 12 * * *).next());
// 2023-07-08T12:00:00
```

:::info
Bu kod parçası, belirtilen zamanlamanın bir sonraki yürütme zamanını döndürür. Tarih ve saat formatını kontrol etmeyi unutmayın.
:::

---