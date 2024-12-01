---
title: DomSanitizer'ı Taklit Etme
description: Bu makale, Angular testlerinde DomSanitizer'ı nasıl düzgün bir şekilde taklit edeceğinizi açıklar ve testlerinizde dikkat edilmesi gereken önemli noktaları belirtir.
keywords: [Angular, DomSanitizer, ng-mocks, MockRender, test, güvenlik, yazılım testi]
sidebar_label: DomSanitizer
---

Bu makale, Angular testlerinde `DomSanitizer`'ı nasıl düzgün bir şekilde taklit edeceğinizi açıklar.

En büyük sorun, `DomSanitizer`'ın Angular tarafından dahili olarak kullanılmasıdır. Bu nedenle, bunları taklit etmek, aşağıdaki gibi tahmin edilemeyen hatalara neden olabilir:

- TypeError: view.root.sanitizer.sanitize is not a function
- TypeError: _co.domSanitizer.bypassSecurityTrustHtml is not a function

:::warning
Bu tür hataların önüne geçmek için, `ng-mocks` varsayılan olarak bu taklidi önler.
:::

Başka bir sorun ise sınıfın soyut olması ve JavaScript çalışma zamanında soyut yöntemlerini algılamanın bir yolu olmamasıdır; bu nedenle taklit işlevleri veya casuslar sağlanamaz.

Bununla birlikte, `ng-mocks`, render edilen nesneler için ek sağlayıcıları destekleyen `MockRender` içerir. Bu nedenle, `MockRender` ve `MockProvider` kullanırsak, istenen ortamı ve davranışı elde edebiliriz:

```ts
// TargetComponent bileşenini render etme
MockRender(TargetComponent, null, {
  // TargetComponent için özel geçersiz kılmaları sağlama
  providers: [
    // Yanlış bir yöntemle DomSanitizer'ı taklit etme
    MockProvider(DomSanitizer, {
      // geçersiz kılma açıkça sağlanmalıdır
      // çünkü sanitize yöntemi soyuttur
      sanitize: jasmine.createSpy('sanitize'),
    }),
  ],
});
```

Kazanç.

## Daima DomSanitizer'ı taklit et / casusla

Eğer global olarak `DomSanitizer`'ı casuslamak istiyorsanız,
`ngMocks.globalMock` ve `ngMocks.defaultMock` kullanabilirsiniz.

:::info
Bu durumda, `ng-mocks`, `DomSanitizer`'ın varsayılan olarak taklit edilmesi gerektiğini anlar.
:::

Tek endişe, Angular'ın `DomSanitizer`'ı dahili olarak kullanmasıdır. Bu nedenle, onun taklit yöntemleri en azından sağlanan değeri almalıdır. 

```ts
// ng-mocks'a taklit edilmesi gerektiğini bildirin
ngMocks.globalMock(DomSanitizer);

// ng-mocks'a taklidin nasıl tanımlanması gerektiğini bildirin
ngMocks.defaultMock(DomSanitizer, sanitizer => {
  // Jasmine örneği
  sanitizer.sanitize = jasmine.createSpy().and.callFake(v => v);
  // tüm diğer yöntemler

  // Jest örneği
  sanitizer.bypassSecurityTrustHtml = jest.fn(v => v);
  // tüm diğer yöntemler

  return sanitizer;
});
```

## Tam örnek

> Angular testlerinde **DomSanitizer'ı taklit etme** için tam bir örnek.
> — Bu bölümde, kodun nasıl çalıştığı gösterilmektedir.

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockSanitizer/test.spec.ts&initialpath=%3Fspec%3DMockSanitizer)
- [StackBlitz'da deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockSanitizer/test.spec.ts&initialpath=%3Fspec%3DMockSanitizer)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockSanitizer/test.spec.ts"
describe('MockSanitizer', () => {
  beforeEach(() => MockBuilder(TargetComponent));

  it('beklenen taklit değerlerini render eder', () => {
    MockRender(TargetComponent, null, {
      providers: [
        MockProvider(DomSanitizer, {
          sanitize: (context: SecurityContext, value: string) =>
            `sanitized:${context}:${value.length}`,
        }),
      ],
    });

    expect(ngMocks.formatHtml(ngMocks.find('div'))).toEqual(
      'sanitized:1:23',
    );
  });
});
``` 