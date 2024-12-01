---
title: ngMocks.findTemplateRef
description: ng-mocks kütüphanesinden ngMocks.findTemplateRef ile ilgili belgeler. Bu içerik, kod kullanılarak nasıl `TemplateRef` bulunacağına dair yöntemleri açıklar ve örneklerle destekler.
keywords: [ngMocks, TemplateRef, directive, Angular, testing]
---

Mevcut öğeye veya onun herhangi bir alt öğesine ait olan ilk bulunan `TemplateRef`'yi döndürür. Eğer öğe belirtilmemişse, mevcut fixture kullanılır.

- `ngMocks.findTemplateRef( fixture?, directive, notFoundValue? )`
- `ngMocks.findTemplateRef( debugElement?, id, notFoundValue? )`
- `ngMocks.findTemplateRef( debugElement?, [attribute, value?], notFoundValue? )`

veya `ngMocks.find` tarafından desteklenen seçiciler ile basitçe.

- `ngMocks.findTemplateRef( cssSelector?, [attribute, value?], notFoundValue? )`

## Direktif

Bir şablonun aşağıdaki kodu içerdiğini varsayalım.

```html
<ng-template my-directive-1></ng-template>
<span *my-directive-2></span>
```

O zaman `ng-template`'yi şöyle bulabiliriz:

```ts
const tpl1 = ngMocks.findTemplateRef(MyDirective1);
const tpl2 = ngMocks.findTemplateRef(MyDirective2);
```

## Id

Bir şablonun aşağıdaki kodu içerdiğini varsayalım.

```html
<ng-template #header></ng-template>
<ng-template #footer></ng-template>
```

O zaman `ng-template`'yi şöyle bulabiliriz:

```ts
const tplHeader = ngMocks.findTemplateRef('header');
const tplFooter = ngMocks.findTemplateRef('footer');
```

## Attribute seçici

Bir şablonun aşağıdaki kodu içerdiğini varsayalım.

```html
<ng-template mat-row></ng-template>
<ng-template mat-cell></ng-template>
```

O zaman `ng-template`'yi şöyle bulabiliriz:

```ts
const tplRow = ngMocks.findTemplateRef(['mat-row']);
const tplCell = ngMocks.findTemplateRef(['mat-cell']);
```

:::info
Dikkat edin ki bir tuple kullanılıyor, aksi takdirde ID araması yapılır.
:::

## Değer ile Girdi

Bir şablonun aşağıdaki kodu içerdiğini varsayalım.

```html
<ng-template myTpl="header"></ng-template>
<ng-template [myTpl]="property"></ng-template>
```

O zaman `ng-template`'yi şöyle bulabiliriz:

```ts
const tplHeader = ngMocks.findTemplateRef(['myTpl', 'header']);
const tplInput = ngMocks.findTemplateRef(['myTpl', property]);
```

:::warning
Dikkat edin ki `property` bir değişkendir.
:::