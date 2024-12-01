---
title: ngMocks.reveal
description: ng-mocks kütüphanesinden `ngMocks.reveal` hakkında dokümantasyon. Bu sayfada, `ngMocks.reveal` fonksiyonunun kullanımına dair önemli bilgiler ve örnekler bulunmaktadır.
keywords: [ngMocks, Angular, reveal, test, documentation, helper functions]
---

Angular'da normal HTML elementlerinin yanı sıra `ng-container` ve `ng-template` bulunmaktadır.

Ancak, `ngMocks.find` ve `ngMocks.findAll` kullanarak `debugElement.query` ve `debugElement.queryAll` kullanıldığında `ng-container` veya `ng-template` bulunamıyor.

Yine de, bir `ng-container` içeriği üzerinde doğrulama yapmak istemek aklımızdan çıkmıyor. Aynı şekilde, bir `ng-template` almak ve özel bir bağlamla oluşturmak istemek de geçerlidir, sadece bir test olduğu için.

**İşte bu!** `ngMocks.reveal` bunun için geliştirilmiştir. `ngMocks.find`](find.md) ve `ngMocks.findAll` gibi, ancak **sorguları Angular bildirimlerine** dayanmaktadır, css ve html yerine.

Şimdi, böyle bir şablonumuz olsa:

```html
<div>
  <ng-container tpl="header">
    <div>header</div>
  </ng-container>
  <ng-container tpl="footer">
    <div>footer</div>
  </ng-container>
</div>
```

Tam olarak istediğimiz şeyi çıkarabiliriz:

```ts
const header = ngMocks.reveal(['tpl', 'header']);
const footer = ngMocks.reveal(['tpl', 'footer']);

ngMocks.formatHtml(header);
// geri döner
// <div>header</div>

ngMocks.formatHtml(footer);
// geri döner
// <div>footer</div>
```

## Bulunmayan değer

Varsayılan olarak, `ngMocks.reveal` istenen element bulunamadığında bir hata fırlatır, ancak istenen seçiciden sonra ek bir parametre sağlayarak bu davranış değiştirilebilir, eğer istenen element bulunamazsa, sağlanan değer döndürülür.

```ts
const el = ngMocks.reveal('never-possible', undefined);
// el === undefined;

ngMocks.reveal('never-possible');
// fırlatır
```

## Bağlamı daraltma

`ngMocks.reveal`, `ComponentFixture`, `DebugElements`, `DebugNodes` ve `ngMocks.find` ile desteklenen seçicileri destekler. Hiçbiri sağlanmadıysa, en son bilinen fixture kullanılır.

**Bir şablon gibi:**

```html
<input appInput>
<app-form>
  <input appInput>
</app-form>
<input appInput>
```

Elementleri şu şekilde sorgulayabiliriz:

```ts
// en son fixture'da arama yapar
const input1El = ngMocks.reveal(['appInput']);

// sağlanan fixture'da arama yapar
const formEl = ngMocks.reveal(fixture, 'app-form');

// formEl içinde arama yapar
const input2El = ngMocks.reveal(formEl, ['appInput']);

// app-form içinde arama yapar
const input3El = ngMocks.reveal('app-form', ['appInput']);
```

:::important
Eğer bağlamı daraltmak için css seçicileri kullanıyorsanız, ilk parametrenin bir css seçici, ikinci parametrenin ise bu yardımcı için özel bir seçici olduğunu lütfen dikkate alın. Görünüşte benzer olabilirler.
:::

## Bildirime göre sorgulama

Bir bileşene veya direktife ait olan bir elementi döndürür.

**Bir şablon gibi:**

```html
<app-form>
  <input appInput>
</app-form>
```

Form ve input'u şu şekilde alabiliriz:

```ts
const appFormEl = ngMocks.reveal(AppFormComponent);
const inputEl = ngMocks.reveal(AppInputDirective);
```

## nodeName'e göre sorgulama

İstenen değeri içeren bir bileşene veya direktife ait olan bir elementi döndürür.

**Bir şablon gibi:**

```html
<app-form>
  <input appInput>
</app-form>
```

Form ve input'u şu şekilde alabiliriz:

```ts
const appFormEl = ngMocks.reveal('app-form');
// yalnızca AppFormComponent'in seçicisi
// 'app-form' içeriyorsa çalışır

const inputEl = ngMocks.reveal('input');
// yalnızca AppInputDirective'in seçicisi
// 'input' içeriyorsa çalışır
```

## Özelliğe göre sorgulama

İstenen değeri içeren bir bileşene veya direktife ait olan bir elementi döndürür.

**Dizi yapısına dikkat edin.**

**Bir şablon gibi:**

```html
<app-form [value]="value">
  <input appInput>
</app-form>
```

Form ve input'u şu şekilde alabiliriz:

```ts
const appFormEl = ngMocks.reveal(['value']);
const inputEl = ngMocks.reveal(['appInput']);
```

## Özellik ve değeri ile sorgulama

Arada bir, sağlanan değer ile öğeleri ayırt etmek isteriz. Bu durumda, istenen değer ile birlikte bir dizi kullanılmalıdır.

**Bir şablon gibi:**

```html
<ng-template tpl="header">footer</ng-template>
<ng-template tpl="footer">footer</ng-template>
```

Her iki şablonu şu şekilde alabiliriz:

```ts
const header = ngMocks.reveal(['tpl', 'header']);
const footer = ngMocks.reveal(['tpl', 'footer']);
```

## İd ile sorgulama

Ayrıca, id'ler ile sorgulama yapabiliriz. İstenilen id'yi `#` ile öne almak yeterlidir.

**Bir şablon gibi:**

```html
<app-form #form>
  <input #input>
</app-form>
```

Form ve input'u şu şekilde alabiliriz:

```ts
const appFormEl = ngMocks.reveal('#form');
const inputEl = ngMocks.reveal('#input');
```  