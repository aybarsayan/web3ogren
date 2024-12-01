---
title: ngMocks.findInstance
description: ng-mocks kütüphanesindeki ngMocks.findInstance hakkında belgeler. Bu kütüphane, mevcut öğe ve alt öğeleri arasında bileşen, direktif, boru veya hizmet bulmak için kullanılır. Kullanımı oldukça basit ve etkilidir.
keywords: [ngMocks, findInstance, Angular, bileşen, direktif, hizmet, kütüphane]
---

Mevcut öğeye veya onun herhangi bir alt öğesine ait bulunan ilk bileşeni, direktifi, boruyu veya hizmeti döndürür. Öğenin belirtilmemesi durumunda, mevcut fixture kullanılır.

:::tip
**Kullanım Önerisi:** `ngMocks.findInstance` fonksiyonu, Angular uygulamalarındaki bileşenleri ve direktifleri hızlıca bulmak için etkili bir yöntemdir.
:::

- `ngMocks.findInstance( fixture?, directive, notFoundValue? )`
- `ngMocks.findInstance( debugElement?, directive, notFoundValue? )`

ya da `ngMocks.find` tarafından desteklenen seçicilerle basitçe.

- `ngMocks.findInstance( cssSelector?, directive, notFoundValue? )`

```ts
const directive1 = ngMocks.findInstance(Directive1);
const directive2 = ngMocks.findInstance(fixture, Directive2);
const directive3 = ngMocks.findInstance(fixture.debugElement, Directive3);
const pipe = ngMocks.findInstance(fixture.debugElement, MyPipe);
const service = ngMocks.findInstance(fixture, MyService);
```

:::info
**Not:** Yukarıdaki yöntemler, bileşen ve direktiflerin bulunmasında alternatif yollar sunar. Geliştiricilerin ihtiyaçlarına göre uygun olanı seçmesi önemlidir.
:::

```ts
const directive1 = ngMocks.findInstance('div.node', Directive1);
const directive2 = ngMocks.findInstance(['attr'], Directive2);
const directive3 = ngMocks.findInstance(['attr', 'value'], Directive3);
const pipe = ngMocks.findInstance('div span.text', MyPipe);
```