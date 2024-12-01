---
title: ngMocks.hide
description: ngMocks.hide, ng-mocks kütüphanesi kullanılarak öğeleri gizleme işlevini sağlar. Bu belge, `declarationInst`, `templateRef`, ve `structuralDir` gibi parametrelerin nasıl kullanılacağını açıklar.
keywords: [ngMocks, hide, Angular, templateRef, structural directive]
---

`ngMocks.hide`, `ngMocks.render` tarafından render edilen dikkate alınan öğeleri gizler.

```ts
ngMocks.hide(declarationInst);
ngMocks.hide(declarationInst, templateRef);
ngMocks.hide(declarationInst, debugNode);
ngMocks.hide(declarationInst, structuralDir);
```

- `declarationInst`, bir bileşen veya özellik yönergesi örneği olmalıdır.
- `templateRef`, bir `TemplateRef` örneği olmalıdır.
- `structuralDir`, bir yapısal yönerge örneği olmalıdır.

## Parametre Yok

Eğer bir parametre verilmemişse, o zaman **tüm render edilen** şablonlar ve sorgular aracılığıyla ulaşılabilir olan yapısal yönergeler **gizlenecektir**.

```ts
ngMocks.hide(declarationInst);
```

## TemplateRef

Eğer ikinci parametre `TemplateRef` ise, o zaman **sadece şablon** **gizlenecektir**.

```ts
ngMocks.hide(componentInst, templateRef);
ngMocks.hide(directiveInst, templateRef);
```

## Yapısal yönerge

Eğer ikinci parametre bir **yapısal yönerge** örneği ise, o zaman sadece onun şablonu **gizlenecektir**.

```ts
ngMocks.hide(componentInst, structuralDir);
```

:::tip
Bir yapısal yönergeyi **kendisiyle** gizlemek için, onu ikinci parametre olarak geçiniz.
:::

```ts
ngMocks.hide(structuralDir, structuralDir);
```