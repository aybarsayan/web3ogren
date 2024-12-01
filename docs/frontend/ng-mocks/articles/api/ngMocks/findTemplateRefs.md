---
title: ngMocks.findTemplateRefs
description: ngMocks.findTemplateRefs, ng-mocks kütüphanesi kullanılarak mevcut elementin ve alt öğelerinin template referanslarını döndürür. Bu döküman, kullanım örnekleriyle birlikte fonksiyonun detaylarını sunmaktadır.
keywords: [ngMocks, TemplateRef, Angular, ng-mocks, template references]
---

Şu anki elemente ve tüm alt öğelerine ait bulunan tüm `TemplateRef` öğelerinin bir dizisini döner. Eğer element belirtilmemişse, mevcut fixture kullanılır.

:::info
`ngMocks.findTemplateRefs` fonksiyonu, Angular bileşenleri ve direktifleri ile birlikte çalışmak için yararlıdır.
:::

- `ngMocks.findTemplateRefs( fixture?, directive )`
- `ngMocks.findTemplateRefs( debugElement?, id )`
- `ngMocks.findTemplateRefs( debugElement?, [attribute, value?] )`
  
veya `ngMocks.find` tarafından desteklenen seçicilerle basitçe.

- `ngMocks.findTemplateRefs( cssSelector?, [attribute, value?] )`

Bir şablonun aşağıdaki koda sahip olduğunu varsayalım.

```html
<ng-template myTpl="header"></ng-template>
<ng-template myTpl="footer"></ng-template>
```

Sonra, `ng-template` öğelerini şu şekilde bulabiliriz:

```ts
// 2 öğe döner
const allByDirective = ngMocks.findTemplateRefs(MyTplDirective);

// 2 öğe döner
const allByAttribute = ngMocks.findTemplateRefs(['myTpl']);

// 1 öğe döner
const onlyHeaders = ngMocks.findTemplateRefs(['myTpl', 'header']);

// 1 öğe döner
const onlyFooters = ngMocks.findTemplateRefs(['myTpl', 'footer']);

// 0 öğe döner
const empty = ngMocks.findTemplateRefs(['myTpl', 'body']);
```

:::tip
`ngMocks.findTemplateRefs` ile çalışırken doğru direktif veya attributelerin kullanıldığından emin olun. Bu, istenilen sonuçları almak için kritiktir.
:::

Daha fazla bilgi `ngMocks.findTemplateRef` içerisinde bulunabilir.