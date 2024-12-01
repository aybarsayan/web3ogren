---
title: ngMocks.event
description: ngMocks.event hakkında belgelendirme, birim testlerinde özel olaylar oluşturmak için basit bir arayüz. Bu belgelendirme, IE11'deki olay oluşturma sorunlarını nasıl çözüleceğini ve olayları nasıl özelleştirebileceğinizi anlatmaktadır.
keywords: [ngMocks, event, CustomEvent, createEvent, unit testing]
---

`ngMocks.event`, bir olay nesnesinin `new CustomEvent` ile oluşturulamadığı, ancak `document.createEvent` ile oluşturulabildiği IE11'in mirasını çözer. 

:::info
IE11, modern JavaScript olaylarıyla uyumlu değildir; bu nedenle `ngMocks.event`, geliştirme sürecinizi kolaylaştırmak için tasarlanmıştır.
:::

Buna ek olarak, `ngMocks.event` olay özelliklerini özelleştirmek için basit bir arayüz sağlar.

```ts
const event = ngMocks.event('click', {
  x: 1,
  y: 2,
});
```

Oluşturulan olay, `ngMocks.trigger` aracılığıyla tetiklenebilir.

:::tip
Bir olay oluştururken, olayın x ve y koordinatlarını özelleştirmek, testlerinizin gerçekçi olmasını sağlayabilir. 
:::