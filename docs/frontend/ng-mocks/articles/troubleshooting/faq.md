---
title: Angular mocking troubleshooting FAQ
description: Angular mockları çözümleme ile ilgili Sıkça Sorulan Sorular. Bu rehber, Angular'da test yazarken karşılaşabileceğiniz yaygın hataları ve çözümlerini kapsamaktadır.
keywords: [Angular, mocking, troubleshooting, FAQ, test errors]
---

# Angular mocking troubleshooting FAQ

## TypeError: this.titleStrategy?.updateTitle is not a function

:::warning
Bu hata, Angular 14'te `DefaultTitleStrategy` kullanan soyut bir sınıf olan `TitleStrategy` için sağlanan kök sağlayıcıyla ilgili ortaya çıkmaktadır.
:::

Angular 14, `DefaultTitleStrategy` kullanan soyut bir sınıf olan `TitleStrategy` için bir kök sağlayıcı ekledi. Bu nedenle, `RouterModule`'u testlerinizde tutarsanız, `ng-mocks` `TitleStrategy`'yi taklit ettiğinden ve `DefaultTitleStrategy` hakkında herhangi bir bilgiye sahip olmadığından, `TypeError: this.titleStrategy?.updateTitle is not a function` hatası ile karşılaşabilirsiniz.

> **Önemli Not:** Bu hatayı düzeltmek için, `src/test.ts` veya jest durumunda `src/setup-jest.ts` / `src/test-setup.ts` içinde `TitleStrategy` için bir varsayılan taklit ayarlamanız gerekir.  
> — Angular Takımı

```ts title="src/test.ts"
import { DefaultTitleStrategy, TitleStrategy } from "@angular/router";
import { MockService, ngMocks } from 'ng-mocks';

// A14 düzeltme: DefaultTitleStrategy'nin TitleStrategy için varsayılan bir taklit yapılması
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));
```

## Hata: NG01052: formGroup expects a FormGroup instance. Please pass one in.

Genellikle, kodunuzda `FormBuilder` kullanıyorsanız ve testinizde `MockBuilder` ile `FormsModule` veya `ReactiveFormsModule`'u korumak ve geri kalanını taklit etmek istiyorsanız bu durum meydana gelir.

:::info
Angular `15.1.0`'dan itibaren, `FormBuilder` bir `root` sağlayıcıdır ve bu nedenle `FormsModule` veya `ReactiveFormsModule` ile birlikte açıkça korunmalıdır.
:::

```ts
beforeEach(() =>
  MockBuilder(FormComponent)
    .keep(FormsModule)
    .keep(FormBuilder) // <-- bunu ekleyin
);
```

Ya da, tüm kök sağlayıcıları `NG_MOCKS_ROOT_PROVIDERS` yardımıyla koruyabilirsiniz.

```ts
beforeEach(() =>
  MockBuilder(FormComponent)
    .keep(FormsModule)
    .keep(NG_MOCKS_ROOT_PROVIDERS) // <-- bunu ekleyin
);
```