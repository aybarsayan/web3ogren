---
title: Yapı Yönergesini Let ve Of ile Nasıl Taklit Edersiniz
description: Kısa sözdizimi ile Angular yapı yönergesini taklit etme. Bu içerik, Angular'da yapı yönergelerini taklit etmek için kullanılan yöntemleri ve pratik örnekleri kapsamaktadır. Başarılı bir test için gereken teknik detaylar da açıklanmaktadır.
keywords: [Angular, yapı yönergesi, let, of, test, MockBuilder]
---

Angular, bir yapı yönergesini tanımlamak için kısa sözdizimini destekler.

Örneğin:

```html
<div *dxTemplate="let cellTemplate of 'actionsCellTemplate'">
  {{ cellTemplate.data }}
</div>
```

bu, `cellTemplate` değişkeninin yönergenin `$implicit` bağlamına işaret edeceği anlamına gelir ve `'actionsCellTemplate'` dizesi, yönergenin `dxTemplateOf` girişi için atanacaktır.

## Statik bağlam

En basit yol, `DxTemplateDirective` için sahte bir `$implicit` bağlamı sağlamaktır. Bu, `render` bayrağı yardımıyla yapılabilir; bu bayrak, `MockBuilder` parçasıdır.

```ts
beforeEach(() =>
  MockBuilder().mock(DxTemplateDirective, {
    render: {
      $implicit: {
        data: 'MOCK_DATA',
      },
    },
  }),
);
```

> **Not:** Bu durumda, `cellTemplate.data` render sırasında `MOCK_DATA`'ya işaret edecektir ve şunu doğrulayabiliriz:

```ts
const html = ngMocks.formatHtml(fixture);
expect(html).toEqual('<div> MOCK_DATA </div>');
```

Ayrıca, yönergenin `dxTemplateOf` değerinin `'actionsCellTemplate'` olduğunu da doğrulayabiliriz.

```ts
const instance = ngMocks.findInstance(DxTemplateDirective);
expect(instance.dxTemplateOf).toEqual('actionsCellTemplate');
```

## Dinamik bağlam

Eğer statik bağlam bir seçenek değilse, o zaman yapı yönergesini diğer öğelerle render etmek yerine, testin ortasında daha sonra render edilebilir. 

:::tip
Bunu yapmak için, yönergeyi render etmek için `ngMocks.render` ve yönergeyi gizlemek için `ngMocks.hide` kullanmalıyız.
:::

```ts
// Yönergenin örneğini bulmalıyız.
const instance = ngMocks.findInstance(DxTemplateDirective);
// Örneği render etmek için, onu birinci ve ikinci parametre olarak geçmemiz gerekir.
// $implicit bağlam üçüncü parametredir.
ngMocks.render(instance, instance, {
  data: 'MOCK_DATA',
});
```

## Statik bağlamın canlı örneği

- [CodeSandbox'ta dene](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestDirectiveLetOf/static.spec.ts&initialpath=%3Fspec%3DTestDirectiveLetOf%3Astatic)
- [StackBlitz'te dene](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestDirectiveLetOf/static.spec.ts&initialpath=%3Fspec%3DTestDirectiveLetOf%3Astatic)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestDirectiveLetOf/static.spec.ts"
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Directive({
  selector: '[dxTemplate]',
})
class DxTemplateDirective {
  @Input() public readonly dxTemplateOf: string | null = null;

  public constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainerRef: ViewContainerRef,
  ) {}
}

describe('TestDirectiveLetOf:static', () => {
  beforeEach(() =>
    MockBuilder().mock(DxTemplateDirective, {
      // Sadece yapı yönergesini render etmekle kalmayacak,
      // aynı zamanda bağlam değişkenlerini de sağlamalıyız.
      render: {
        $implicit: {
          data: 'MOCK_DATA',
        },
      },
    }),
  );

  it('yapı yönergelerinin taklidini render eder', () => {
    const fixture = MockRender(`
      <div *dxTemplate="let cellTemplate of 'actionsCellTemplate'">
        {{ cellTemplate.data }}
      </div>
    `);

    // önce, 'actionsCellTemplate' değerini girdi olarak geçtiğimizi kontrol edelim.
    expect(
      ngMocks.findInstance(DxTemplateDirective).dxTemplateOf,
    ).toEqual('actionsCellTemplate');

    // ikinci olarak, MOCK_DATA'nın render edildiğini kontrol edelim.
    expect(ngMocks.formatHtml(fixture)).toEqual(
      '<div> MOCK_DATA </div>',
    );
  });
});
```

## Dinamik bağlamın canlı örneği

- [CodeSandbox'ta dene](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestDirectiveLetOf/dynamic.spec.ts&initialpath=%3Fspec%3DTestDirectiveLetOf%3Adynamic)
- [StackBlitz'te dene](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestDirectiveLetOf/dynamic.spec.ts&initialpath=%3Fspec%3DTestDirectiveLetOf%3Adynamic)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestDirectiveLetOf/dynamic.spec.ts"
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Directive({
  selector: '[dxTemplate]',
})
class DxTemplateDirective {
  @Input() public readonly dxTemplateOf: string | null = null;

  public constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainerRef: ViewContainerRef,
  ) {}
}

describe('TestDirectiveLetOf:dynamic', () => {
  beforeEach(() => MockBuilder().mock(DxTemplateDirective));

  it('yapı yönergelerinin taklidini render eder', () => {
    const fixture = MockRender(`
      <div *dxTemplate="let cellTemplate of 'actionsCellTemplate'">
        {{ cellTemplate.data }}
      </div>
    `);

    // önce, 'actionsCellTemplate' değerini girdi olarak geçtiğimizi kontrol edelim.
    const instance = ngMocks.findInstance(DxTemplateDirective);
    expect(instance.dxTemplateOf).toEqual('actionsCellTemplate');

    // ikinci olarak, yapı yönergesini render edelim
    // ve MOCK_DATA'nın mevcut olduğunu doğrulayalım.
    ngMocks.render(instance, instance, {
      data: 'MOCK_DATA',
    });
    expect(ngMocks.formatHtml(fixture)).toEqual(
      '<div> MOCK_DATA </div>',
    );
  });
});
```