---
title: ngMocks.click
description: ngMocks.click, Angular birim testlerinde öğelere tıklamak için kullanılan basit ve etkili bir araçtır. Bu araç, `disabled` durumunu dikkate alırken olayları özelleştirme imkanı da sunar.
keywords: [ngMocks, Angular, birim test, click, disabled, olay yönetimi]
---

Angular birim testlerinde bir öğeye tıklamanın birkaç yolu vardır. Ancak, `.triggerEventHandler` `disabled` durumunu dikkate almaz ve yerel bir `click` olayını çağırmaz. Ve `.click` bir `nativeElement` üzerinde olay özelliklerini özelleştirmeye izin vermez. 

:::tip
`ngMocks.click`, bu sınırlamaları aşan basit bir araçtır. `ngMocks.click` özelliklerinden bazıları şunlardır:
- `disabled` durumunu dikkate alır
- olayların özelleştirilmesine izin verir
- yerel olaylar oluşturur
:::

```ts
const el = ngMocks.find('a');

// Debug öğelerine tıklayabiliriz
ngMocks.click(el);

// Yerel öğelere tıklayabiliriz
// özel koordinatlarla
ngMocks.click(el.nativeElement, {
  x: 150,
  y: 150,
});
```

Ya da `ngMocks.find` tarafından desteklenen seçicilerle basitçe.

```ts
ngMocks.click('a');
```

```ts
ngMocks.click('[data-role="link"]');
```

```ts
ngMocks.click(['data-role']);
```

```ts
ngMocks.click(['data-role', 'link']);
```

:::info
Arka planda `ngMocks.click`, `ngMocks.trigger` kullanır. Bu nedenle, `ngMocks.trigger` tüm özellikleri kullanılabilir.
:::