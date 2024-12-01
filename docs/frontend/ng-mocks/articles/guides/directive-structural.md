---
title: Angular uygulamasında yapısal bir direktifi test etme
description: Bu makalede, Angular'da yapısal bir direktifin nasıl test edileceğini öğrenin. Örnekler ve açıklamalarla, `*ngIf` gibi direktiflerin davranışlarını doğru bir şekilde test etmenin adımlarını keşfedeceksiniz.
keywords: [Angular, yapısal direktifler, test etme, MockBuilder, MockRender, ng-mocks, TypeScript]
---

Yapısal direktifler, alt görünümün render edilmesini etkiler; kesinlikle `*ngIf` kullandığınızda bu durum geçerlidir. Test etme adımları, **özellik direktiflerini** test etme adımlarına oldukça yakındır: özel bir şablon render etmemiz ve ardından direktifin davranışını doğrulamamız gerekiyor.

:::info
`TestBed`'i yapılandırmak için [`MockBuilder`](https://www.npmjs.com/package/ng-mocks#mockbuilder) için ilk parametre direktifin kendisidir. Eğer bağımlılıkları varsa, ikinci parametre olarak modülünü geçmeliyiz.
:::

```ts
beforeEach(() => MockBuilder(TargetDirective));
```

Sonraki adım, özel bir şablonu render etmektir. Diyelim ki direktifin seçici ifadesi `[target]`. Şimdi bunu bir testte render edelim:

```ts
const fixture = MockRender(
  `<div *target="value">
    içerik
  </div>`,
  {
    value: false,
  }
);
```

İçeriğin render edilmediğini doğrulayalım.

```ts
expect(fixture.nativeElement.innerHTML).not.toContain('içerik');
```

:::tip
[`MockRender`](https://www.npmjs.com/package/ng-mocks#mockrender) yardımıyla, `fixture.point` aracılığıyla direktifin elemanına erişebiliriz ve olaylar oluşturabiliriz; ayrıca `fixture.componentInstance.value` üzerinden `value` değerini değiştirebiliriz.
:::

```ts
fixture.componentInstance.value = true;
```

Çünkü `value` artık `true`, içerik render edilmelidir.

```ts
fixture.detectChanges();
expect(fixture.nativeElement.innerHTML).toContain('içerik');
```

## Canlı örnek

- [CodeSandbox'ta dene](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestStructuralDirective/test.spec.ts&initialpath=%3Fspec%3DTestStructuralDirectiveWithoutContext)
- [StackBlitz'te dene](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestStructuralDirective/test.spec.ts&initialpath=%3Fspec%3DTestStructuralDirectiveWithoutContext)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestStructuralDirective/test.spec.ts"
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { MockBuilder, MockRender } from 'ng-mocks';

// Bu direktif `ngIf` ile aynıdır,
// yalnızca girişi gerçekten bir değere sahipse içeriğini render eder.
@Directive({
  selector: '[target]',
})
class TargetDirective {
  public constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainerRef: ViewContainerRef,
  ) {}

  @Input() public set target(value: any) {
    if (value) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}

describe('TestStructuralDirectiveWithoutContext', () => {
  // Direktifi test etmek istediğimiz için, MockBuilder'ın ilk
  // parametresi olarak onu geçiriyoruz. İkinci parametreyi atlayabiliriz,
  // çünkü bağımlılık yok.
  // MockBuilder'ın sözleşmesini unutmayın.
  beforeEach(() => MockBuilder(TargetDirective));

  it('içeriğini gizler ve render eder', () => {
    const fixture = MockRender(
      `
        <div *target="value">
          içerik
        </div>
    `,
      {
        value: false,
      },
    );

    // Değer false olduğu için "içerik" render edilmemelidir.
    expect(fixture.nativeElement.innerHTML).not.toContain('içerik');

    // Değeri true yapalım ve "içeriğin" render olup olmadığını doğrulayalım.
    fixture.componentInstance.value = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('içerik');

    // Değeri false yapalım ve "içeriğin" gizlendiğini doğrulayalım.
    fixture.componentInstance.value = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('içerik');
  });
});
```