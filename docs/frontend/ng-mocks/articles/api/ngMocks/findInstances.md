---
title: ngMocks.findInstances
description: ng-mocks kütüphanesinden ngMocks.findInstances hakkında belgeler. Bu belge, bileşenlerin, direktiflerin, pipe'ların ve hizmetlerin nasıl bulunduğunu detaylandırır.
keywords: [ngMocks, findInstances, Angular, bileşenler, direktifler, hizmetler, pipe'lar]
---

Eşleşen unsurlara ve tüm alt unsurlarına ait bulunan tüm bileşenlerin, direktiflerin, pipe'ların veya hizmetlerin bir dizisini döndürür. Eleman belirtilmemişse, mevcut fixture kullanılır.

- `ngMocks.findInstances( fixture?, directive )`
- `ngMocks.findInstances( debugElement?, directive )`

ya da basitçe `ngMocks.find` tarafından desteklenen seçicilerle.

- `ngMocks.findInstances( cssSelector?, directive )`

```ts
const directives1 = ngMocks.findInstances(Directive1);
const directives2 = ngMocks.findInstances(fixture, Directive2);
const directives3 = ngMocks.findInstances(fixture.debugElement, Directive3);
const pipes = ngMocks.findInstances(fixture.debugElement, MyPipe);
const services = ngMocks.findInstance(fixture, MyService);
```

```ts
const directives1 = ngMocks.findInstances('div.node', Directive1);
const directives2 = ngMocks.findInstances(['attr'], Directive2);
const directives3 = ngMocks.findInstances(['attr', 'value'], Directive3);
const pipes = ngMocks.findInstances('div span.text', MyPipe);
```

:::important
Bir css seçici, tüm eşleşen `DebugElements` içinde örneklerin bulunmasına yardımcı olur. Bu nedenle, aynı örnek, aynı seçici ile iç içe geçmiş `DebugElements` aracılığıyla birkaç kez bulunabilir. Bu durumda, örnek döndürülen diziye yalnızca bir kez eklenir.  
:::

:::tip
Eğer belirli bir direktifi bulmak istiyorsanız, ilgili `fixture` veya `debugElement` kullanarak arama yapmalısınız. Bu, arama sonuçlarınızı daraltmanıza ve daha hızlı bir şekilde sonuç almanıza yardımcı olur.
:::

:::note
`ngMocks.findInstances`, Angular uygulamanızdaki bileşenlerin ve bağımlılıkların yönetimini kolaylaştırır. Bu özellik, test yazımında önemli bir rol oynar.
:::