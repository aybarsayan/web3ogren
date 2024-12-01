---
title: ngMocks.change
description: ng-mocks kütüphanesindeki `ngMocks.change` hakkında belge. Bu belge, form kontrolü değişikliklerinin nasıl simüle edileceğini ve bunun için gereken adımları kapsamaktadır.
keywords: [ngMocks, form kontrolü, Angular, değişim simülasyonu, ReactiveFormsModule, FormsModule]
---

`ngMocks.change`, **bir form kontrolünün dış değişimlerini simüle etmeye** yardımcı olur. Form kontrolünün bir **mock** örneği mi yoksa **gerçek** bir örnek mi olduğu önemli değildir.

:::info
Bir değişiklik simüle etmek için, form kontrolüne ait bir **debug elementi** ve değişiklik için istenen değere ihtiyacımız var.
:::

Aşağıdaki şablonun olduğunu varsayalım:

```html
<input data-testid="inputControl" [(ngModel)]="value" />
```

Ve, `value` değerini `123` olarak ayarlayacak bir **değişiklik simüle etmek** istiyoruz. O zaman çözüm şu şekilde görünebilir:

```ts
// input'un debug elemanını arıyoruz
const el = ngMocks.find(['data-testid', 'inputControl']);

// değişikliği simüle etme
ngMocks.change(el, 123);

// doğrulama
expect(component.value).toEqual(123);
```

:::tip
Alternatif olarak, `ngMocks.find` tarafından desteklenen seçimlerle basitçe şu şekilde de yapılabilir:
:::

```ts
ngMocks.change('input', 123);
```
```ts
ngMocks.change('[data-testid="inputControl"]', 123);
```
```ts
ngMocks.change(['data-testid'], 123);
```
```ts
ngMocks.change(['data-testid', 'inputControl'], 123);
```

Kazanç!

:::note
Hem `FormsModule` hem de `ReactiveFormsModule` desteklenmektedir.
:::